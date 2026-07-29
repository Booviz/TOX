'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  LayoutGrid,
  List,
  Crown,
  Shield,
  ArrowUpRight,
  Bot,
  Circle,
  Loader2,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToxLogo } from '@/components/tox/logo'
import { LanguageToggle } from '@/components/tox/language-toggle'
import { cn } from '@/lib/utils'

type DiscordGuild = {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  memberCount: number | null
  onlineCount: number | null
  botInstalled: boolean
}

type GuildsResponse = {
  guilds?: DiscordGuild[]
  error?: string
  requiresLogin?: boolean
}

function formatNumber(value: number | null) {
  if (value === null) return '—'

  return new Intl.NumberFormat('en', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

function getGuildIcon(guild: DiscordGuild) {
  if (!guild.icon) return null

  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
}

function getGuildInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}

function createInviteUrl(guildId: string) {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const permissions =
    process.env.NEXT_PUBLIC_DISCORD_BOT_PERMISSIONS ?? '8'

  if (!clientId) return '#'

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'bot applications.commands',
    permissions,
    guild_id: guildId,
    disable_guild_select: 'true',
    response_type: 'code',
  })

  return `https://discord.com/oauth2/authorize?${params.toString()}`
}

function GuildAvatar({ guild }: { guild: DiscordGuild }) {
  const iconUrl = getGuildIcon(guild)

  if (iconUrl) {
    return (
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-secondary">
        <Image
          src={iconUrl}
          alt={`${guild.name} icon`}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white">
      {getGuildInitials(guild.name)}
    </div>
  )
}

function ServerActions({ guild }: { guild: DiscordGuild }) {
  if (!guild.botInstalled) {
    return (
      <Button asChild size="sm" className="gap-2">
        <a
          href={createInviteUrl(guild.id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Bot className="size-4" />
          Add TOX
        </a>
      </Button>
    )
  }

  return (
    <Button asChild size="sm" className="gap-2">
      <Link href={`/dashboard/${guild.id}`}>
        Open
        <ArrowUpRight className="size-4" />
      </Link>
    </Button>
  )
}

export default function ServersPage() {
  const { data: session, status } = useSession()

  const [guilds, setGuilds] = useState<DiscordGuild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  async function loadGuilds() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/discord/guilds', {
        cache: 'no-store',
      })

      const data = (await response.json()) as GuildsResponse

      if (response.status === 401 || data.requiresLogin) {
        await signIn('discord', {
          callbackUrl: '/servers',
        })
        return
      }

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to load servers')
      }

      setGuilds(data.guilds ?? [])
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load your Discord servers'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('discord', {
        callbackUrl: '/servers',
      })

      return
    }

    if (status === 'authenticated') {
      void loadGuilds()
    }
  }, [status])

  const filteredGuilds = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return guilds.filter((guild) => {
      const matchesQuery =
        !normalizedQuery ||
        guild.name.toLowerCase().includes(normalizedQuery)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'installed' && guild.botInstalled) ||
        (filter === 'not-installed' && !guild.botInstalled) ||
        (filter === 'owned' && guild.owner)

      return matchesQuery && matchesFilter
    })
  }, [guilds, query, filter])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <ToxLogo />
          </Link>

          <div className="flex items-center gap-2">
            <LanguageToggle />

            {session?.user && (
              <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 sm:flex">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'Discord user'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {session.user.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}

                <span className="max-w-36 truncate text-sm font-medium">
                  {session.user.name}
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Sign out"
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            Your servers
          </h1>

          <p className="text-sm text-muted-foreground">
            Select a server to manage it or add TOX if the bot is not installed.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search servers"
              className="ps-9"
            />
          </div>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All manageable servers</SelectItem>
              <SelectItem value="owned">Owned by me</SelectItem>
              <SelectItem value="installed">TOX installed</SelectItem>
              <SelectItem value="not-installed">TOX not installed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => void loadGuilds()}
            disabled={loading}
            aria-label="Refresh servers"
          >
            <RefreshCw
              className={cn(
                'size-4',
                loading && 'animate-spin'
              )}
            />
          </Button>

          <div className="flex rounded-xl border border-border p-0.5">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                view === 'grid'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                view === 'list'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        {error && (
          <Card className="mt-6 flex items-start gap-3 border-destructive/30 bg-destructive/5 p-5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div className="flex-1">
              <p className="font-semibold">
                Could not load your servers
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => void loadGuilds()}
              >
                Try again
              </Button>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="h-56 animate-pulse border-border bg-card"
              />
            ))}
          </div>
        ) : !error && filteredGuilds.length === 0 ? (
          <Card className="mt-8 flex flex-col items-center justify-center border-dashed border-border bg-card p-12 text-center">
            <Search className="size-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No manageable servers found
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              You need to own the server or have Administrator or Manage Server permission.
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
            >
              Clear filters
            </Button>
          </Card>
        ) : view === 'grid' ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuilds.map((guild) => (
              <Card
                key={guild.id}
                className="flex min-h-64 flex-col border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  <GuildAvatar guild={guild} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {guild.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {guild.owner ? (
                        <Crown className="size-3.5 text-warning" />
                      ) : (
                        <Shield className="size-3.5 text-info" />
                      )}

                      {guild.owner
                        ? 'Owner'
                        : 'Manage Server'}
                    </div>
                  </div>

                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-medium',
                      guild.botInstalled
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    )}
                  >
                    {guild.botInstalled
                      ? 'TOX installed'
                      : 'Not installed'}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-background/40 p-3">
                    <p className="text-xs text-muted-foreground">
                      Members
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatNumber(guild.memberCount)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background/40 p-3">
                    <p className="text-xs text-muted-foreground">
                      Online
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatNumber(guild.onlineCount)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <Circle
                    className={cn(
                      'size-2.5 fill-current',
                      guild.botInstalled
                        ? 'text-success'
                        : 'text-muted-foreground'
                    )}
                  />

                  <span className="text-muted-foreground">
                    {guild.botInstalled
                      ? 'TOX is connected to this server'
                      : 'Add TOX to start managing this server'}
                  </span>
                </div>

                <div className="mt-auto flex justify-end border-t border-border pt-4">
                  <ServerActions guild={guild} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-6 divide-y divide-border border-border bg-card">
            {filteredGuilds.map((guild) => (
              <div
                key={guild.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <GuildAvatar guild={guild} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {guild.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatNumber(guild.memberCount)} members ·{' '}
                    {guild.owner ? 'Owner' : 'Manage Server'}
                  </p>
                </div>

                <span
                  className={cn(
                    'w-fit rounded-full px-2.5 py-1 text-[11px] font-medium',
                    guild.botInstalled
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  )}
                >
                  {guild.botInstalled
                    ? 'TOX installed'
                    : 'Not installed'}
                </span>

                <ServerActions guild={guild} />
              </div>
            ))}
          </Card>
        )}
      </main>
    </div>
  )
}