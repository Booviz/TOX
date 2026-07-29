"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  Check,
  ChevronDown,
  CreditCard,
  LifeBuoy,
  Loader2,
  LogOut,
  Menu,
  Search,
  Sparkles,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ToxLogo } from "@/components/tox/logo"
import { LanguageToggle } from "@/components/tox/language-toggle"
import { CommandPalette } from "@/components/dashboard/command-palette"
import { buildNav } from "@/lib/nav"
import { useLocale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type ManageableGuild = {
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
  guilds?: ManageableGuild[]
  error?: string
  requiresLogin?: boolean
}

type DashboardGuild = {
  id: string
  name: string
  icon: string | null
  iconUrl: string | null
  botInstalled: boolean
  botOnline: boolean
}

type DashboardResponse = {
  guild?: DashboardGuild
  error?: string
}

function getGuildIconUrl(guild: ManageableGuild) {
  if (!guild.icon) return null

  const extension = guild.icon.startsWith("a_") ? "gif" : "png"

  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}?size=128`
}

function getGuildInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}

function GuildIcon({
  guild,
  size = 28,
}: {
  guild: ManageableGuild
  size?: number
}) {
  const iconUrl = getGuildIconUrl(guild)

  if (iconUrl) {
    return (
      <span
        className="relative shrink-0 overflow-hidden rounded-full border border-white/10 bg-secondary"
        style={{ width: size, height: size }}
      >
        <Image
          src={iconUrl}
          alt={`${guild.name} icon`}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </span>
    )
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-[10px] font-bold text-white"
      style={{ width: size, height: size }}
    >
      {getGuildInitials(guild.name)}
    </span>
  )
}

export function DashboardHeader({ guildId }: { guildId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLocale()
  const { data: session, status } = useSession()

  const [cmdOpen, setCmdOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [guilds, setGuilds] = useState<ManageableGuild[]>([])
  const [activeGuild, setActiveGuild] = useState<DashboardGuild | null>(null)
  const [loadingGuilds, setLoadingGuilds] = useState(true)
  const [loadingActiveGuild, setLoadingActiveGuild] = useState(true)

  const groups = useMemo(() => buildNav(guildId), [guildId])

  async function loadGuilds() {
    try {
      setLoadingGuilds(true)

      const response = await fetch("/api/discord/guilds", {
        cache: "no-store",
      })

      const data = (await response.json()) as GuildsResponse

      if (response.status === 401 || data.requiresLogin) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load servers")
      }

      setGuilds((data.guilds ?? []).filter((guild) => guild.botInstalled))
    } catch (error) {
      console.error("Dashboard header guild list error:", error)
      setGuilds([])
    } finally {
      setLoadingGuilds(false)
    }
  }

  async function loadActiveGuild() {
    try {
      setLoadingActiveGuild(true)

      const response = await fetch(`/api/dashboard/${guildId}`, {
        cache: "no-store",
      })

      const data = (await response.json()) as DashboardResponse

      if (!response.ok || !data.guild) {
        throw new Error(data.error ?? "Failed to load active server")
      }

      setActiveGuild(data.guild)
    } catch (error) {
      console.error("Dashboard header active guild error:", error)
      setActiveGuild(null)
    } finally {
      setLoadingActiveGuild(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      void Promise.all([loadGuilds(), loadActiveGuild()])
    }
  }, [status, guildId])

  function switchGuild(nextGuildId: string) {
    const currentPrefix = `/dashboard/${guildId}`
    const nextPrefix = `/dashboard/${nextGuildId}`

    if (pathname.startsWith(currentPrefix)) {
      router.push(pathname.replace(currentPrefix, nextPrefix))
      return
    }

    router.push(nextPrefix)
  }

  const unread = 0

  const fallbackGuild: ManageableGuild = {
    id: guildId,
    name:
      activeGuild?.name ??
      (loadingActiveGuild
        ? t("header.loadingServer")
        : t("header.defaultServer")),
    icon: activeGuild?.icon ?? null,
    owner: false,
    permissions: "0",
    memberCount: null,
    onlineCount: null,
    botInstalled: activeGuild?.botInstalled ?? true,
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={t("header.openNavigation")}
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">
            {t("header.openNavigation")}
          </SheetTitle>

          <div className="flex h-16 items-center border-b border-border px-4">
            <ToxLogo />
          </div>

          <ScrollArea className="h-[calc(100dvh-4rem)] px-3 py-4">
            <nav className="flex flex-col gap-5">
              {groups.map((group) => (
                <div key={group.labelKey} className="flex flex-col gap-1">
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(group.labelKey)}
                  </p>

                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="size-[18px]" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Server switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="gap-2 px-2" />
          }
        >
          {loadingActiveGuild ? (
            <span className="flex size-7 items-center justify-center rounded-full bg-secondary">
              <Loader2 className="size-4 animate-spin text-primary" />
            </span>
          ) : (
            <GuildIcon guild={fallbackGuild} size={28} />
          )}

          <span className="hidden max-w-[180px] truncate font-semibold sm:inline">
            {fallbackGuild.name}
          </span>

          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-72">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {t("header.switchServer")}
          </div>

          <DropdownMenuSeparator />

          {loadingGuilds ? (
            <div className="flex items-center justify-center gap-2 px-3 py-5 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {t("header.loadingServers")}
            </div>
          ) : guilds.length === 0 ? (
            <div className="px-3 py-5 text-center text-sm text-muted-foreground">
              {t("header.noServers")}
            </div>
          ) : (
            guilds.map((guild) => (
              <DropdownMenuItem
                key={guild.id}
                onClick={() => switchGuild(guild.id)}
                className="gap-2"
              >
                <GuildIcon guild={guild} size={24} />

                <span className="flex-1 truncate">{guild.name}</span>

                <span className="size-2 rounded-full bg-success" />

                {guild.id === guildId && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push("/servers")}>
            {t("header.viewAllServers")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      <Button
        variant="outline"
        onClick={() => setCmdOpen(true)}
        className="hidden h-9 w-56 justify-between gap-2 text-muted-foreground lg:flex"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          {t("action.search")}
        </span>

        <kbd className="rounded border border-border bg-muted px-1.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCmdOpen(true)}
        className="lg:hidden"
        aria-label={t("action.search")}
      >
        <Search className="size-5" />
      </Button>

      <LanguageToggle />

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={t("header.notifications")}
            />
          }
        >
          <Bell className="size-5" />

          {unread > 0 && (
            <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              {t("header.notifications")}
            </p>

            <Badge variant="secondary">
              {unread} {t("header.newNotifications")}
            </Badge>
          </div>

          <DropdownMenuSeparator />

          <div className="px-4 py-8 text-center">
            <Bell className="mx-auto size-7 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              {t("header.noNotifications")}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t("header.notificationsDescription")}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => router.push("/notifications")}
            className="justify-center text-sm"
          >
            {t("header.viewAllNotifications")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        asChild
        aria-label={t("header.help")}
      >
        <Link href="/support">
          <LifeBuoy className="size-5" />
        </Link>
      </Button>

      {/* Discord profile */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t("header.openProfile")}
            />
          }
        >
          {status === "loading" ? (
            <span className="flex size-[34px] items-center justify-center rounded-full bg-secondary">
              <Loader2 className="size-4 animate-spin text-primary" />
            </span>
          ) : session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? t("header.discordUser")}
              width={34}
              height={34}
              className="size-[34px] rounded-full border border-white/10 object-cover"
            />
          ) : (
            <span className="flex size-[34px] items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white">
              {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <div className="px-2 py-2">
            <div className="flex min-w-0 items-center gap-3">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? t("header.discordUser")}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 font-bold text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <span className="block truncate font-semibold">
                  {session?.user?.name ?? t("header.discordUser")}
                </span>

                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {session?.user?.email ?? t("header.signedInWithDiscord")}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="size-4" />
            {t("header.profile")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/billing")}>
            <CreditCard className="size-4" />
            {t("header.billing")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/${guildId}/ai`)}
          >
            <Sparkles className="size-4" />
            {t("header.aiBuilder")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              void signOut({
                callbackUrl: "/",
              })
            }
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            {t("header.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandPalette
        guildId={guildId}
        open={cmdOpen}
        onOpenChange={setCmdOpen}
      />
    </header>
  )
}