import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import supabase from "@/lib/supabase"
import {
  DiscordApiError,
  fetchDiscordJson,
  getDiscordRetryAfterMs,
} from "@/lib/discord-api"

const DISCORD_API = "https://discord.com/api/v10"

const ADMINISTRATOR = BigInt("8")
const MANAGE_GUILD = BigInt("32")

type UserGuild = {
  id: string
  owner: boolean
  permissions: string
}

function canManageGuild(guild: UserGuild) {
  if (guild.owner) {
    return true
  }

  try {
    const permissions = BigInt(guild.permissions)

    return (
      (permissions & ADMINISTRATOR) === ADMINISTRATOR ||
      (permissions & MANAGE_GUILD) === MANAGE_GUILD
    )
  } catch {
    return false
  }
}

function getPositiveInteger(
  value: string | null,
  fallback: number
) {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  return parsed
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      guildId: string
    }>
  }
) {
  try {
    const { guildId } = await context.params
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          requiresLogin: true,
        },
        {
          status: 401,
        }
      )
    }

    /*
     * نستخدم نفس الكاش المشترك المستخدم في بقية APIs.
     * هذا يمنع تكرار طلب users/@me/guilds عند فتح
     * الهيدر وصفحة Overview وصفحة Logs في نفس الوقت.
     *
     * إذا Discord أعطى 429، سيستخدم آخر نسخة محفوظة
     * بدل تعطيل صفحة السجلات.
     */
    const userGuilds = await fetchDiscordJson<UserGuild[]>({
      cacheKey: `user-guilds:${session.accessToken}`,
      url: `${DISCORD_API}/users/@me/guilds?with_counts=true`,
      authorization: `Bearer ${session.accessToken}`,
      ttlMs: 60_000,
      staleMs: 15 * 60_000,
    })

    const userGuild = userGuilds.find(
      (guild) => guild.id === guildId
    )

    if (!userGuild) {
      return NextResponse.json(
        {
          error: "Server not found in your Discord account",
        },
        {
          status: 404,
        }
      )
    }

    if (!canManageGuild(userGuild)) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to manage this server",
        },
        {
          status: 403,
        }
      )
    }

    const searchParams = request.nextUrl.searchParams

    const page = getPositiveInteger(
      searchParams.get("page"),
      1
    )

    const requestedLimit = getPositiveInteger(
      searchParams.get("limit"),
      20
    )

    const limit = Math.min(requestedLimit, 100)

    const eventType =
      searchParams.get("eventType")?.trim() ?? ""

    const search =
      searchParams.get("search")?.trim() ?? ""

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from("discord_logs")
      .select(
        `
          id,
          guild_id,
          event_type,
          actor_id,
          actor_name,
          target_id,
          target_name,
          channel_id,
          channel_name,
          description,
          metadata,
          created_at
        `,
        {
          count: "exact",
        }
      )
      .eq("guild_id", guildId)
      .order("created_at", {
        ascending: false,
      })
      .range(from, to)

    if (eventType && eventType !== "ALL") {
      query = query.eq("event_type", eventType)
    }

    if (search) {
      const safeSearch = search
        .replaceAll("%", "")
        .replaceAll(",", " ")
        .trim()

      if (safeSearch) {
        query = query.or(
          [
            `actor_name.ilike.%${safeSearch}%`,
            `target_name.ilike.%${safeSearch}%`,
            `channel_name.ilike.%${safeSearch}%`,
            `description.ilike.%${safeSearch}%`,
            `event_type.ilike.%${safeSearch}%`,
          ].join(",")
        )
      }
    }

    const { data, error, count } = await query

    if (error) {
      console.error(
        "Failed to load Discord logs:",
        error
      )

      return NextResponse.json(
        {
          error: "Failed to load logs",
        },
        {
          status: 500,
        }
      )
    }

    const total = count ?? 0
    const totalPages = Math.max(
      1,
      Math.ceil(total / limit)
    )

    return NextResponse.json(
      {
        logs: data ?? [],

        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },

        filters: {
          eventType: eventType || "ALL",
          search,
        },
      },
      {
        headers: {
          /*
           * المتصفح يقدر يعيد استخدام النتيجة لفترة قصيرة،
           * وهذا يقلل طلبات التحديث المتكررة أثناء التنقل.
           */
          "Cache-Control":
            "private, max-age=10, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    console.error(
      "Dashboard logs API error:",
      error
    )

    if (error instanceof DiscordApiError) {
      const retryAfterMs = getDiscordRetryAfterMs(error)

      return NextResponse.json(
        {
          error:
            error.status === 429
              ? "Discord is temporarily busy. Please try again shortly."
              : error.message,

          requiresLogin: error.status === 401,
          retryAfterMs,
        },
        {
          /*
           * نرجع 503 بدل 429 لأن المشكلة مؤقتة من Discord،
           * وليست Rate Limit من API الخاص بالموقع للمستخدم.
           */
          status: error.status === 429 ? 503 : error.status,

          headers:
            retryAfterMs !== null
              ? {
                  "Retry-After": String(
                    Math.max(
                      1,
                      Math.ceil(retryAfterMs / 1000)
                    )
                  ),
                }
              : undefined,
        }
      )
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}