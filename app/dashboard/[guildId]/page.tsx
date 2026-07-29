"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  Activity,
  Hash,
  ShieldCheck,
  Sparkles,
  Zap,
  Plus,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Server,
  Volume2,
  ArrowRight,
  Ticket,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/format"
import { useLocale } from "@/lib/i18n"

type GuildData = {
  id: string
  name: string
  icon: string | null
  iconUrl: string | null
  banner: string | null
  bannerUrl: string | null
  description: string | null
  ownerId: string

  memberCount: number
  onlineCount: number

  boostCount: number
  boostLevel: number
  verificationLevel: number
  preferredLocale: string
  features: string[]

  channelCount: number
  textChannelCount: number
  voiceChannelCount: number
  roleCount: number

  botInstalled: boolean
  botOnline: boolean

  userAccess: {
    owner: boolean
    permissions: string
  }
}

type GuildMetrics = {
  messagesToday: number | null
  openTickets: number | null
  warningsToday: number | null
  joinsToday: number | null
}

type DashboardResponse = {
  guild?: GuildData
  metrics?: GuildMetrics
  error?: string
  requiresLogin?: boolean
  botInstalled?: boolean
}

function nullableMetric(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—"
  }

  return formatNumber(value)
}

type Translate = (key: string) => string

function getVerificationLabel(level: number, t: Translate) {
  const levels: Record<number, string> = {
    0: t("overview.verification.none"),
    1: t("overview.verification.low"),
    2: t("overview.verification.medium"),
    3: t("overview.verification.high"),
    4: t("overview.verification.veryHigh"),
  }

  return levels[level] ?? t("common.unknown")
}

function getBoostLevelLabel(level: number, t: Translate) {
  if (level <= 0) return t("overview.noBoostLevel")

  return `${t("overview.level")} ${level}`
}

export default function OverviewPage({
  params,
}: {
  params: Promise<{
    guildId: string
  }>
}) {
  const { guildId } = use(params)
  const { t } = useLocale()

  const [guild, setGuild] = useState<GuildData | null>(null)
  const [metrics, setMetrics] = useState<GuildMetrics>({
    messagesToday: null,
    openTickets: null,
    warningsToday: null,
    joinsToday: null,
  })

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadDashboard(showRefreshLoader = false) {
    try {
      if (showRefreshLoader) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      const response = await fetch(`/api/dashboard/${guildId}`, {
        method: "GET",
        cache: "no-store",
      })

      const data = (await response.json()) as DashboardResponse

      if (!response.ok) {
        throw new Error(
          data.error ?? t("overview.error.loadServer")
        )
      }

      if (!data.guild) {
        throw new Error(t("overview.error.noServerData"))
      }

      setGuild(data.guild)

      setMetrics(
        data.metrics ?? {
          messagesToday: null,
          openTickets: null,
          warningsToday: null,
          joinsToday: null,
        }
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t("overview.error.loadServer")
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [guildId])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>

          <div className="text-center">
            <p className="font-semibold">
              {t("overview.loadingTitle")}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("overview.loadingDescription")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !guild) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <Card className="w-full border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            {t("overview.errorTitle")}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {error ??
              t("overview.errorUnavailable")}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => void loadDashboard()}
              className="gap-2"
            >
              <RefreshCw className="size-4" />
              {t("action.retry")}
            </Button>

            <Button asChild variant="outline">
              <Link href="/servers">
                {t("overview.backToServers")}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const onlinePercentage =
    guild.memberCount > 0
      ? Math.min(
          100,
          Math.round(
            (guild.onlineCount / guild.memberCount) * 100
          )
        )
      : 0

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={guild.name}
        description={
          guild.description ??
          t("overview.subtitle")
        }
      >
        <Badge
          variant="outline"
          className="gap-1.5"
        >
          <span
            className={cn(
              "size-2 rounded-full",
              guild.botOnline
                ? "bg-success"
                : "bg-destructive"
            )}
          />

          {guild.botOnline
            ? t("overview.botOnline")
            : t("overview.botOffline")}
        </Badge>

        <Button
          variant="outline"
          onClick={() => void loadDashboard(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={cn(
              "size-4",
              refreshing && "animate-spin"
            )}
          />

          {t("action.refresh")}
        </Button>

        <Button asChild>
          <Link href={`/dashboard/${guildId}/ai`}>
            <Sparkles className="size-4" />
            {t("overview.aiBuilder")}
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label={t("overview.totalMembers")}
              value={formatNumber(guild.memberCount)}
              icon={Users}
            />

            <StatCard
              label={t("overview.onlineMembers")}
              value={formatNumber(guild.onlineCount)}
              icon={Activity}
              accent="text-success"
            />

            <StatCard
              label={t("overview.channels")}
              value={formatNumber(guild.channelCount)}
              icon={Hash}
              accent="text-info"
            />

            <StatCard
              label={t("overview.roles")}
              value={formatNumber(guild.roleCount)}
              icon={ShieldCheck}
              accent="text-warning"
            />
          </div>
                    <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("overview.serverInformation")}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {t("overview.serverInformationDescription")}
                  </p>
                </div>

                {guild.iconUrl ? (
                  <img
                    src={guild.iconUrl}
                    alt={guild.name}
                    className="size-16 rounded-2xl border"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-2xl border bg-muted">
                    <Server className="size-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.serverName")}
                  </p>

                  <p className="mt-1 font-medium">
                    {guild.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.serverId")}
                  </p>

                  <p className="mt-1 break-all font-mono text-sm">
                    {guild.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.preferredLanguage")}
                  </p>

                  <p className="mt-1">
                    {guild.preferredLocale}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.verification")}
                  </p>

                  <p className="mt-1">
                    {getVerificationLabel(
                      guild.verificationLevel,
                      t
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.boostLevel")}
                  </p>

                  <p className="mt-1">
                    {getBoostLevelLabel(
                      guild.boostLevel,
                      t
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.boostCount")}
                  </p>

                  <p className="mt-1">
                    {guild.boostCount}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.textChannels")}
                  </p>

                  <p className="mt-1">
                    {guild.textChannelCount}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("overview.voiceChannels")}
                  </p>

                  <p className="mt-1 flex items-center gap-2">
                    <Volume2 className="size-4 text-primary" />
                    {guild.voiceChannelCount}
                  </p>
                </div>
              </div>

              {guild.features.length > 0 && (
                <>
                  <div className="my-6 h-px bg-border" />

                  <h4 className="mb-4 font-semibold">
                    {t("overview.serverFeatures")}
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {guild.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold">
                {t("overview.liveMetrics")}
              </h3>

              <p className="mb-6 text-sm text-muted-foreground">
                {t("overview.liveMetricsDescription")}
              </p>

              <div className="space-y-5">
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm">
                      {t("overview.onlineMembers")}
                    </span>

                    <span className="font-semibold">
                      {onlinePercentage}%
                    </span>
                  </div>

                  <Progress value={onlinePercentage} />
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm text-muted-foreground">
                    {t("overview.messagesToday")}
                  </div>

                  <div className="mt-1 text-2xl font-bold">
                    {nullableMetric(
                      metrics.messagesToday
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm text-muted-foreground">
                    {t("overview.openTickets")}
                  </div>

                  <div className="mt-1 text-2xl font-bold">
                    {nullableMetric(
                      metrics.openTickets
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm text-muted-foreground">
                    {t("overview.newJoins")}
                  </div>

                  <div className="mt-1 text-2xl font-bold">
                    {nullableMetric(
                      metrics.joinsToday
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm text-muted-foreground">
                    {t("overview.warningsToday")}
                  </div>

                  <div className="mt-1 text-2xl font-bold">
                    {nullableMetric(
                      metrics.warningsToday
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
                    <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {t("overview.serverAccess")}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {t("overview.serverAccessDescription")}
                </p>
              </div>

              <Badge
                variant="outline"
                className={
                  guild.userAccess.owner
                    ? "border-warning/40 text-warning"
                    : "border-info/40 text-info"
                }
              >
                {guild.userAccess.owner
                  ? t("overview.serverOwner")
                  : t("overview.manageServer")}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("overview.botStatus")}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      guild.botOnline
                        ? "bg-success"
                        : "bg-destructive"
                    )}
                  />

                  <span className="font-medium">
                    {guild.botOnline
                      ? t("common.online")
                      : t("common.offline")}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("overview.totalChannels")}
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatNumber(guild.channelCount)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("overview.totalRoles")}
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatNumber(guild.roleCount)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("overview.discordLocale")}
                </p>

                <p className="mt-2 text-xl font-bold uppercase">
                  {guild.preferredLocale}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {t("overview.analytics")}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {t("overview.analyticsDescription")}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={`/dashboard/${guildId}/analytics`}>
                  {t("overview.viewAnalytics")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 px-6 text-center">
              <Activity className="size-8 text-muted-foreground" />

              <p className="mt-4 font-semibold">
                {t("overview.noHistoricalActivity")}
              </p>

              <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("overview.noHistoricalActivityDescription")}
              </p>
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 font-semibold">
              {t("overview.quickActions")}
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: t("overview.newTicketPanel"),
                  href: `/dashboard/${guildId}/tickets/panels/new`,
                  icon: Ticket,
                },
                {
                  label: t("overview.addCommand"),
                  href: `/dashboard/${guildId}/commands`,
                  icon: Plus,
                },
                {
                  label: t("overview.backupNow"),
                  href: `/dashboard/${guildId}/backup`,
                  icon: Zap,
                },
                {
                  label: t("overview.aiBuilder"),
                  href: `/dashboard/${guildId}/ai`,
                  icon: Sparkles,
                },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  asChild
                  className="h-auto flex-col gap-1.5 py-3"
                >
                  <Link href={action.href}>
                    <action.icon className="size-4" />

                    <span className="text-xs">
                      {action.label}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="size-4" />
              </span>

              <h2 className="font-semibold">
                {t("overview.aiAssistant")}
              </h2>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {t("overview.aiAssistantDescription")}
            </p>

            <Button
              className="w-full"
              asChild
            >
              <Link href={`/dashboard/${guildId}/ai`}>
                {t("overview.openAiBuilder")}
              </Link>
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 font-semibold">
              {t("overview.serverSummary")}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("overview.members")}
                </span>

                <span className="font-medium">
                  {formatNumber(guild.memberCount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("common.online")}
                </span>

                <span className="font-medium">
                  {formatNumber(guild.onlineCount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("overview.textChannels")}
                </span>

                <span className="font-medium">
                  {formatNumber(guild.textChannelCount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("overview.voiceChannels")}
                </span>

                <span className="font-medium">
                  {formatNumber(guild.voiceChannelCount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("overview.roles")}
                </span>

                <span className="font-medium">
                  {formatNumber(guild.roleCount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("overview.boosts")}
                </span>

                <span className="font-medium">
                  {formatNumber(guild.boostCount)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 font-semibold">
              {t("overview.recentActivity")}
            </h2>

            <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border px-4 text-center">
              <Activity className="size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                {t("overview.noActivityRecorded")}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {t("overview.recentActivityDescription")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}