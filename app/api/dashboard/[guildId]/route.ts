import { NextResponse } from "next/server"
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
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

type DiscordGuild = {
  id: string
  name: string
  icon: string | null
  banner: string | null
  description: string | null
  owner_id: string
  approximate_member_count?: number
  approximate_presence_count?: number
  premium_subscription_count?: number
  premium_tier: number
  verification_level: number
  preferred_locale: string
  features: string[]
}

type DiscordChannel = {
  id: string
  type: number
}

type DiscordRole = {
  id: string
}

type DailyMetricRow = {
  messages_count: number | null
  joins_count: number | null
  leaves_count: number | null
  warnings_count: number | null
  tickets_opened: number | null
  tickets_closed: number | null
}

type GuildDatabaseRow = {
  id: string
  name: string
  icon: string | null
  owner_id: string | null
  member_count: number | null
  online_count: number | null
  channel_count: number | null
  role_count: number | null
  bot_online: boolean | null
  updated_at: string | null
}

function canManageGuild(guild: UserGuild) {
  if (guild.owner) {
    return true
  }

  const permissions = BigInt(guild.permissions)

  return (
    (permissions & ADMINISTRATOR) === ADMINISTRATOR ||
    (permissions & MANAGE_GUILD) === MANAGE_GUILD
  )
}

function guildIconUrl(
  guildId: string,
  icon: string | null
) {
  if (!icon) {
    return null
  }

  const extension = icon.startsWith("a_")
    ? "gif"
    : "png"

  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${extension}?size=256`
}

function guildBannerUrl(
  guildId: string,
  banner: string | null
) {
  if (!banner) {
    return null
  }

  const extension = banner.startsWith("a_")
    ? "gif"
    : "png"

  return `https://cdn.discordapp.com/banners/${guildId}/${banner}.${extension}?size=1024`
}

function getUtcDate() {
  return new Date().toISOString().slice(0, 10)
}

export async function GET(
  request: Request,
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
     * نتأكد أولًا أن المستخدم يملك السيرفر أو يمتلك
     * Administrator / Manage Server.
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
          error:
            "Server not found in your Discord account",
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
            "You do not have permission to manage this Discord server",
        },
        {
          status: 403,
        }
      )
    }

    const botToken = process.env.DISCORD_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        {
          error: "DISCORD_BOT_TOKEN is missing",
        },
        {
          status: 500,
        }
      )
    }

    const botHeaders = {
      Authorization: `Bot ${botToken}`,
    }

    /*
     * نجلب معلومات السيرفر والقنوات والرتب من Discord.
     */
    let guild: DiscordGuild

    try {
      guild = await fetchDiscordJson<DiscordGuild>({
        cacheKey: `bot-guild:${guildId}`,
        url: `${DISCORD_API}/guilds/${guildId}?with_counts=true`,
        authorization: botHeaders.Authorization,
        ttlMs: 30_000,
        staleMs: 10 * 60_000,
      })
    } catch (error) {
      if (
        error instanceof DiscordApiError &&
        error.status === 404
      ) {
        return NextResponse.json(
          {
            error: "TOX is not installed in this server",
            botInstalled: false,
          },
          {
            status: 404,
          }
        )
      }

      throw error
    }

    const today = getUtcDate()

    /*
     * نجلب معلومات Discord وإحصائيات Supabase في نفس الوقت
     * حتى تكون الصفحة أسرع.
     */
    const [
      channelsResponse,
      rolesResponse,
      guildDatabaseResult,
      dailyMetricResult,
      openTicketsResult,
      recentEventsResult,
    ] = await Promise.all([
      fetchDiscordJson<DiscordChannel[]>({
        cacheKey: `bot-guild-channels:${guildId}`,
        url: `${DISCORD_API}/guilds/${guildId}/channels`,
        authorization: botHeaders.Authorization,
        ttlMs: 30_000,
        staleMs: 10 * 60_000,
      }).catch((error) => {
        console.error("Failed to fetch Discord channels:", error)
        return [] as DiscordChannel[]
      }),

      fetchDiscordJson<DiscordRole[]>({
        cacheKey: `bot-guild-roles:${guildId}`,
        url: `${DISCORD_API}/guilds/${guildId}/roles`,
        authorization: botHeaders.Authorization,
        ttlMs: 30_000,
        staleMs: 10 * 60_000,
      }).catch((error) => {
        console.error("Failed to fetch Discord roles:", error)
        return [] as DiscordRole[]
      }),

      supabase
        .from("guilds")
        .select(
          `
            id,
            name,
            icon,
            owner_id,
            member_count,
            online_count,
            channel_count,
            role_count,
            bot_online,
            updated_at
          `
        )
        .eq("id", guildId)
        .maybeSingle(),

      supabase
        .from("daily_metrics")
        .select(
          `
            messages_count,
            joins_count,
            leaves_count,
            warnings_count,
            tickets_opened,
            tickets_closed
          `
        )
        .eq("guild_id", guildId)
        .eq("metric_date", today)
        .maybeSingle(),

      supabase
        .from("tickets")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("guild_id", guildId)
        .neq("status", "closed"),

      supabase
        .from("guild_events")
        .select(
          `
            id,
            event_type,
            user_id,
            channel_id,
            target_id,
            metadata,
            created_at
          `
        )
        .eq("guild_id", guildId)
        .order("created_at", {
          ascending: false,
        })
        .limit(10),
    ])

    const channels = channelsResponse
    const roles = rolesResponse

    const databaseGuild =
      guildDatabaseResult.data as GuildDatabaseRow | null

    const dailyMetric =
      dailyMetricResult.data as DailyMetricRow | null

    if (guildDatabaseResult.error) {
      console.error(
        "Failed to load guild from Supabase:",
        guildDatabaseResult.error.message
      )
    }

    if (dailyMetricResult.error) {
      console.error(
        "Failed to load daily metrics:",
        dailyMetricResult.error.message
      )
    }

    if (openTicketsResult.error) {
      console.error(
        "Failed to count open tickets:",
        openTicketsResult.error.message
      )
    }

    if (recentEventsResult.error) {
      console.error(
        "Failed to load recent activity:",
        recentEventsResult.error.message
      )
    }

    const textChannelCount = channels.filter(
      (channel) =>
        [0, 5, 10, 11, 12, 15, 16].includes(
          channel.type
        )
    ).length

    const voiceChannelCount = channels.filter(
      (channel) =>
        [2, 13].includes(channel.type)
    ).length

    /*
     * Discord هو المصدر الأساسي للمعلومات المباشرة.
     * Supabase يعمل كاحتياط ويحتوي على البيانات المسجلة
     * بواسطة TOX Bot.
     */
    const memberCount =
      guild.approximate_member_count ??
      databaseGuild?.member_count ??
      0

    const onlineCount =
      guild.approximate_presence_count ??
      databaseGuild?.online_count ??
      0

    const channelCount =
      channels.length > 0
        ? channels.length
        : databaseGuild?.channel_count ?? 0

    const roleCount =
      roles.length > 0
        ? roles.length
        : databaseGuild?.role_count ?? 0

    return NextResponse.json({
      guild: {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,

        iconUrl: guildIconUrl(
          guild.id,
          guild.icon
        ),

        banner: guild.banner,

        bannerUrl: guildBannerUrl(
          guild.id,
          guild.banner
        ),

        description: guild.description,
        ownerId: guild.owner_id,

        memberCount,
        onlineCount,

        boostCount:
          guild.premium_subscription_count ?? 0,

        boostLevel: guild.premium_tier,

        verificationLevel:
          guild.verification_level,

        preferredLocale:
          guild.preferred_locale,

        features: guild.features ?? [],

        channelCount,
        textChannelCount,
        voiceChannelCount,
        roleCount,

        botInstalled: true,

        botOnline:
          databaseGuild?.bot_online ?? true,

        lastSyncedAt:
          databaseGuild?.updated_at ?? null,

        userAccess: {
          owner: userGuild.owner,
          permissions: userGuild.permissions,
        },
      },

      metrics: {
        messagesToday:
          dailyMetric?.messages_count ?? 0,

        openTickets:
          openTicketsResult.count ?? 0,

        warningsToday:
          dailyMetric?.warnings_count ?? 0,

        joinsToday:
          dailyMetric?.joins_count ?? 0,

        leavesToday:
          dailyMetric?.leaves_count ?? 0,

        ticketsOpenedToday:
          dailyMetric?.tickets_opened ?? 0,

        ticketsClosedToday:
          dailyMetric?.tickets_closed ?? 0,
      },

      recentActivity:
        recentEventsResult.data ?? [],
    }, {
      headers: {
        "Cache-Control": "private, max-age=15, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    console.error(
      "Dashboard guild API error:",
      error
    )

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