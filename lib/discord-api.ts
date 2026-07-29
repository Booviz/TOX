type CacheEntry<T> = {
  value: T
  expiresAt: number
  staleUntil: number
}

type DiscordErrorBody = {
  message?: string
  retry_after?: number
  global?: boolean
}

export class DiscordApiError extends Error {
  status: number
  retryAfterMs: number | null

  constructor(
    message: string,
    status: number,
    retryAfterMs: number | null = null
  ) {
    super(message)
    this.name = "DiscordApiError"
    this.status = status
    this.retryAfterMs = retryAfterMs
  }
}

type GlobalDiscordCache = {
  values: Map<string, CacheEntry<unknown>>
  inFlight: Map<string, Promise<unknown>>
}

declare global {
  // eslint-disable-next-line no-var
  var __toxDiscordCache: GlobalDiscordCache | undefined
}

const cache =
  globalThis.__toxDiscordCache ??
  (globalThis.__toxDiscordCache = {
    values: new Map<string, CacheEntry<unknown>>(),
    inFlight: new Map<string, Promise<unknown>>(),
  })

function readCached<T>(key: string, allowStale = false) {
  const entry = cache.values.get(key) as CacheEntry<T> | undefined

  if (!entry) return null

  const now = Date.now()
  const validUntil = allowStale ? entry.staleUntil : entry.expiresAt

  if (validUntil <= now) {
    if (entry.staleUntil <= now) {
      cache.values.delete(key)
    }

    return null
  }

  return entry.value
}

function writeCached<T>(
  key: string,
  value: T,
  ttlMs: number,
  staleMs: number
) {
  const now = Date.now()

  cache.values.set(key, {
    value,
    expiresAt: now + ttlMs,
    staleUntil: now + Math.max(ttlMs, staleMs),
  })
}

function getRetryAfterMs(
  response: Response,
  body: DiscordErrorBody | null
) {
  if (typeof body?.retry_after === "number") {
    return Math.max(0, Math.ceil(body.retry_after * 1000))
  }

  const header = response.headers.get("retry-after")
  const parsed = header ? Number(header) : Number.NaN

  return Number.isFinite(parsed)
    ? Math.max(0, Math.ceil(parsed * 1000))
    : null
}

export async function fetchDiscordJson<T>({
  cacheKey,
  url,
  authorization,
  ttlMs = 60_000,
  staleMs = 10 * 60_000,
}: {
  cacheKey: string
  url: string
  authorization: string
  ttlMs?: number
  staleMs?: number
}): Promise<T> {
  const fresh = readCached<T>(cacheKey)

  if (fresh) {
    return fresh
  }

  const existingRequest = cache.inFlight.get(cacheKey) as
    | Promise<T>
    | undefined

  if (existingRequest) {
    return existingRequest
  }

  const request = (async () => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: authorization,
        },
        cache: "no-store",
      })

      if (response.ok) {
        const value = (await response.json()) as T

        writeCached(cacheKey, value, ttlMs, staleMs)

        return value
      }

      let body: DiscordErrorBody | null = null

      try {
        body = (await response.json()) as DiscordErrorBody
      } catch {
        body = null
      }

      if (response.status === 429) {
        const stale = readCached<T>(cacheKey, true)

        if (stale) {
          console.warn(
            `Discord rate limit for ${cacheKey}; serving stale cache.`
          )

          return stale
        }

        throw new DiscordApiError(
          body?.message ?? "Discord is temporarily rate limiting requests.",
          429,
          getRetryAfterMs(response, body)
        )
      }

      throw new DiscordApiError(
        body?.message ?? `Discord request failed with ${response.status}`,
        response.status
      )
    } catch (error) {
      const stale = readCached<T>(cacheKey, true)

      if (stale) {
        console.warn(
          `Discord request failed for ${cacheKey}; serving stale cache.`,
          error
        )

        return stale
      }

      throw error
    } finally {
      cache.inFlight.delete(cacheKey)
    }
  })()

  cache.inFlight.set(cacheKey, request)

  return request
}

export function getDiscordErrorStatus(error: unknown) {
  return error instanceof DiscordApiError ? error.status : 500
}

export function getDiscordRetryAfterMs(error: unknown) {
  return error instanceof DiscordApiError
    ? error.retryAfterMs
    : null
}