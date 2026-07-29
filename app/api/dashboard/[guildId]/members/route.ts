import { NextResponse } from "next/server"
import { auth } from "@/auth"
import {
  fetchDiscordJson,
} from "@/lib/discord-api"

const DISCORD_API = "https://discord.com/api/v10"
const BOT_API_URL =
  process.env.TOX_BOT_API_URL ?? "http://127.0.0.1:3002"

const ADMINISTRATOR = BigInt("8")
const MANAGE_GUILD = BigInt("32")

type UserGuild = {
  id: string
  owner: boolean
  permissions: string
}

type BotMembersResponse = {
  success: boolean
  error?: string
  guild?: {
    id: string
    name: string
    memberCount: number
  }
  counts?: {
    all: number
    humans: number
    bots: number
    online: number
    offline: number
    timedOut: number
  }
  members?: unknown[]
}

type CacheEntry = {
  data: BotMembersResponse
  expiresAt: number
  staleUntil: number
}

declare global {
  // eslint-disable-next-line no-var
  var __toxMembersProxyCache:
    | Map<string, CacheEntry>
    | undefined

  // eslint-disable-next-line no-var
  var __toxMembersProxyInFlight:
    | Map<string, Promise<BotMembersResponse>>
    | undefined
}

const responseCache =
  globalThis.__toxMembersProxyCache ??
  (globalThis.__toxMembersProxyCache = new Map())

const inFlight =
  globalThis.__toxMembersProxyInFlight ??
  (globalThis.__toxMembersProxyInFlight = new Map())

function canManageGuild(guild: UserGuild) {
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

function getCached(
  guildId: string,
  allowStale = false
) {
  const entry = responseCache.get(guildId)

  if (!entry) return null

  const now = Date.now()
  const validUntil = allowStale
    ? entry.staleUntil
    : entry.expiresAt

  if (validUntil <= now) {
    if (entry.staleUntil <= now) {
      responseCache.delete(guildId)
    }

    return null
  }

  return entry.data
}

async function fetchMembersFromBot(
  guildId: string
): Promise<BotMembersResponse> {
  const fresh = getCached(guildId)

  if (fresh) {
    return fresh
  }

  const existing = inFlight.get(guildId)

  if (existing) {
    return existing
  }

  const request = (async () => {
    try {
      const response = await fetch(
        `${BOT_API_URL}/members/${guildId}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      )

      const data =
        (await response.json()) as BotMembersResponse

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "Failed to load guild members"
        )
      }

      const now = Date.now()

      responseCache.set(guildId, {
        data,
        expiresAt: now + 15_000,
        staleUntil: now + 5 * 60_000,
      })

      return data
    } catch (error) {
      const stale = getCached(guildId, true)

      if (stale) {
        console.warn(
          `Members proxy failed for ${guildId}; serving stale cache.`,
          error
        )

        return stale
      }

      throw error
    } finally {
      inFlight.delete(guildId)
    }
  })()

  inFlight.set(guildId, request)

  return request
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
          success: false,
          error: "Unauthorized",
          requiresLogin: true,
        },
        {
          status: 401,
        }
      )
    }

    const userGuilds =
      await fetchDiscordJson<UserGuild[]>({
        cacheKey:
          `user-guilds:${session.accessToken}`,

        url:
          `${DISCORD_API}/users/@me/guilds?with_counts=true`,

        authorization:
          `Bearer ${session.accessToken}`,

        ttlMs: 60_000,
        staleMs: 15 * 60_000,
      })

    const userGuild = userGuilds.find(
      (guild) => guild.id === guildId
    )

    if (!userGuild) {
      return NextResponse.json(
        {
          success: false,
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
          success: false,
          error:
            "You do not have permission to manage this server",
        },
        {
          status: 403,
        }
      )
    }

    const data =
      await fetchMembersFromBot(guildId)

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "private, max-age=10, stale-while-revalidate=60",
      },
    })
  } catch (error) {
    console.error(
      "Members proxy API error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load guild members",
      },
      {
        status: 503,
      }
    )
  }
}