import { NextResponse } from "next/server"
import { auth } from "@/auth"
import {
  DiscordApiError,
  fetchDiscordJson,
  getDiscordRetryAfterMs,
} from "@/lib/discord-api"

const DISCORD_API = "https://discord.com/api/v10"

const ADMINISTRATOR = BigInt("8")
const MANAGE_GUILD = BigInt("32")

type DiscordGuild = {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  approximate_member_count?: number
  approximate_presence_count?: number
}

type BotGuild = {
  id: string
}

function canManageGuild(guild: DiscordGuild) {
  if (guild.owner) return true

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

export async function GET() {
  try {
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
     * This request is shared and cached across the dashboard.
     * Concurrent requests use the same in-flight Promise, so React
     * development re-renders do not hit Discord repeatedly.
     */
    const userGuilds = await fetchDiscordJson<DiscordGuild[]>({
      cacheKey: `user-guilds:${session.accessToken}`,
      url: `${DISCORD_API}/users/@me/guilds?with_counts=true`,
      authorization: `Bearer ${session.accessToken}`,
      ttlMs: 60_000,
      staleMs: 15 * 60_000,
    })

    let installedGuildIds = new Set<string>()

    if (process.env.DISCORD_BOT_TOKEN) {
      try {
        const botGuilds = await fetchDiscordJson<BotGuild[]>({
          cacheKey: "bot-guilds",
          url: `${DISCORD_API}/users/@me/guilds`,
          authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          ttlMs: 5 * 60_000,
          staleMs: 30 * 60_000,
        })

        installedGuildIds = new Set(
          botGuilds.map((guild) => guild.id)
        )
      } catch (error) {
        console.error("Failed to fetch bot guilds:", error)
      }
    }

    const manageableGuilds = userGuilds
      .filter(canManageGuild)
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
        permissions: guild.permissions,
        memberCount: guild.approximate_member_count ?? null,
        onlineCount: guild.approximate_presence_count ?? null,
        botInstalled: installedGuildIds.has(guild.id),
      }))
      .sort((a, b) => {
        if (a.botInstalled !== b.botInstalled) {
          return a.botInstalled ? -1 : 1
        }

        if (a.owner !== b.owner) {
          return a.owner ? -1 : 1
        }

        return a.name.localeCompare(b.name)
      })

    return NextResponse.json(
      {
        guilds: manageableGuilds,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=300",
        },
      }
    )
  } catch (error) {
    console.error("Discord guilds API error:", error)

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
          status: error.status === 429 ? 503 : error.status,
          headers:
            retryAfterMs !== null
              ? {
                  "Retry-After": String(
                    Math.max(1, Math.ceil(retryAfterMs / 1000))
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