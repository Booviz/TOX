"use client"

import { use, useEffect, useMemo, useState } from "react"
import type { ElementType } from "react"
import {
  AlertTriangle,
  Ban,
  Bot,
  Check,
  ChevronRight,
  CircleGauge,
  Hash,
  KeyRound,
  LockKeyhole,
  MessageSquareWarning,
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  UserCheck,
  Users,
  Webhook,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Tab =
  | "overview"
  | "anti-nuke"
  | "anti-raid"
  | "anti-bot"
  | "anti-spam"
  | "whitelist"
  | "logs"

type Punishment = "remove_roles" | "timeout" | "kick" | "ban" | "quarantine"

type Rule = {
  id: string
  title: string
  description: string
  icon: ElementType
  enabled: boolean
  limit: number
  seconds: number
  punishment: Punishment
}

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "anti-nuke", label: "Anti Nuke" },
  { id: "anti-raid", label: "Anti Raid" },
  { id: "anti-bot", label: "Anti Bot" },
  { id: "anti-spam", label: "Anti Spam" },
  { id: "whitelist", label: "Whitelist" },
  { id: "logs", label: "Logs" },
]

const initialRules: Rule[] = [
  {
    id: "anti-ban",
    title: "Anti Ban",
    description: "Block mass bans and punish the responsible user.",
    icon: Ban,
    enabled: true,
    limit: 3,
    seconds: 10,
    punishment: "remove_roles",
  },
  {
    id: "anti-kick",
    title: "Anti Kick",
    description: "Prevent mass member kicks.",
    icon: Users,
    enabled: true,
    limit: 3,
    seconds: 10,
    punishment: "remove_roles",
  },
  {
    id: "channel-create",
    title: "Channel Creation",
    description: "Stop suspicious mass channel creation.",
    icon: Hash,
    enabled: true,
    limit: 5,
    seconds: 10,
    punishment: "kick",
  },
  {
    id: "channel-delete",
    title: "Channel Deletion",
    description: "Protect channels from mass deletion.",
    icon: Hash,
    enabled: true,
    limit: 2,
    seconds: 10,
    punishment: "ban",
  },
  {
    id: "role-create",
    title: "Role Creation",
    description: "Stop suspicious mass role creation.",
    icon: KeyRound,
    enabled: true,
    limit: 5,
    seconds: 10,
    punishment: "kick",
  },
  {
    id: "role-delete",
    title: "Role Deletion",
    description: "Protect roles from mass deletion.",
    icon: KeyRound,
    enabled: true,
    limit: 2,
    seconds: 10,
    punishment: "ban",
  },
  {
    id: "role-update",
    title: "Role Updates",
    description: "Detect dangerous role and permission changes.",
    icon: ShieldAlert,
    enabled: true,
    limit: 4,
    seconds: 10,
    punishment: "remove_roles",
  },
  {
    id: "webhook",
    title: "Webhook Changes",
    description: "Stop unauthorized webhook creation and deletion.",
    icon: Webhook,
    enabled: true,
    limit: 2,
    seconds: 10,
    punishment: "ban",
  },
]

const punishmentLabels: Record<Punishment, string> = {
  remove_roles: "Remove Roles",
  timeout: "Timeout",
  kick: "Kick",
  ban: "Ban",
  quarantine: "Quarantine",
}

const activities = [
  {
    event: "Mass Join Detected",
    target: "10 users",
    action: "Server locked for 5 minutes",
    time: "2m ago",
    status: "Blocked",
  },
  {
    event: "Unauthorized Bot Added",
    target: "BadBot#0001",
    action: "Bot removed, inviter punished",
    time: "5m ago",
    status: "Blocked",
  },
  {
    event: "Channel Deletion",
    target: "User#1234",
    action: "Roles removed",
    time: "12m ago",
    status: "Blocked",
  },
]

export default function SecurityPage({
  params,
}: {
  params: Promise<{ guildId: string }>
}) {
  const { guildId } = use(params)

  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [enabled, setEnabled] = useState(true)
  const [rules, setRules] = useState(initialRules)
  const [raidEnabled, setRaidEnabled] = useState(true)
  const [botEnabled, setBotEnabled] = useState(true)
  const [spamEnabled, setSpamEnabled] = useState(true)
  const [saved, setSaved] = useState(false)
  const [lockdown, setLockdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [saveError, setSaveError] = useState("")

  const [raidJoinLimit, setRaidJoinLimit] = useState(10)
  const [raidWindowSeconds, setRaidWindowSeconds] = useState(10)
  const [minimumAccountAgeDays, setMinimumAccountAgeDays] = useState(7)
  const [automaticLockdown, setAutomaticLockdown] = useState(true)
  const [lockdownDurationMinutes, setLockdownDurationMinutes] = useState(5)
  const [raiseVerificationLevel, setRaiseVerificationLevel] = useState(true)
  const [disableInvitesOnRaid, setDisableInvitesOnRaid] = useState(true)
  const [enableSlowmodeOnRaid, setEnableSlowmodeOnRaid] = useState(true)
  const [alertStaffOnRaid, setAlertStaffOnRaid] = useState(true)
  const [ignoreWhitelistedMembers, setIgnoreWhitelistedMembers] = useState(true)
  const [raidAlertChannel, setRaidAlertChannel] = useState("")
  const [raidPunishment, setRaidPunishment] =
    useState<Punishment>("quarantine" as Punishment)

  useEffect(() => {
    let cancelled = false

    async function loadSettings() {
      setIsLoading(true)
      setLoadError("")

      try {
        const response = await fetch(
          `/api/dashboard/${guildId}/security`,
          {
            method: "GET",
            cache: "no-store",
          }
        )

        const result = (await response.json()) as {
          success?: boolean
          error?: string
          settings?: {
            protectionEnabled?: boolean
            antiRaid?: Record<string, unknown>
            antiNuke?: Record<string, unknown>
            antiBot?: Record<string, unknown>
            antiSpam?: Record<string, unknown>
          }
        }

        if (!response.ok || !result.success || !result.settings) {
          throw new Error(
            result.error ?? "Failed to load security settings."
          )
        }

        if (cancelled) return

        const settings = result.settings
        const antiRaid = settings.antiRaid ?? {}
        const antiNuke = settings.antiNuke ?? {}
        const antiBot = settings.antiBot ?? {}
        const antiSpam = settings.antiSpam ?? {}

        setEnabled(settings.protectionEnabled ?? true)
        setRaidEnabled(
          typeof antiRaid.enabled === "boolean"
            ? antiRaid.enabled
            : true
        )
        setBotEnabled(
          typeof antiBot.enabled === "boolean"
            ? antiBot.enabled
            : true
        )
        setSpamEnabled(
          typeof antiSpam.enabled === "boolean"
            ? antiSpam.enabled
            : true
        )

        setRaidJoinLimit(
          typeof antiRaid.joinLimit === "number"
            ? antiRaid.joinLimit
            : 10
        )
        setRaidWindowSeconds(
          typeof antiRaid.windowSeconds === "number"
            ? antiRaid.windowSeconds
            : 10
        )
        setMinimumAccountAgeDays(
          typeof antiRaid.minimumAccountAgeDays === "number"
            ? antiRaid.minimumAccountAgeDays
            : 7
        )
        setAutomaticLockdown(
          typeof antiRaid.automaticLockdown === "boolean"
            ? antiRaid.automaticLockdown
            : true
        )
        setLockdownDurationMinutes(
          typeof antiRaid.lockdownDurationMinutes === "number"
            ? antiRaid.lockdownDurationMinutes
            : 5
        )
        setRaiseVerificationLevel(
          typeof antiRaid.raiseVerificationLevel === "boolean"
            ? antiRaid.raiseVerificationLevel
            : true
        )
        setDisableInvitesOnRaid(
          typeof antiRaid.disableInvitesOnRaid === "boolean"
            ? antiRaid.disableInvitesOnRaid
            : true
        )
        setEnableSlowmodeOnRaid(
          typeof antiRaid.enableSlowmodeOnRaid === "boolean"
            ? antiRaid.enableSlowmodeOnRaid
            : true
        )
        setAlertStaffOnRaid(
          typeof antiRaid.alertStaffOnRaid === "boolean"
            ? antiRaid.alertStaffOnRaid
            : true
        )
        setIgnoreWhitelistedMembers(
          typeof antiRaid.ignoreWhitelistedMembers === "boolean"
            ? antiRaid.ignoreWhitelistedMembers
            : true
        )
        setRaidAlertChannel(
          typeof antiRaid.alertChannelId === "string"
            ? antiRaid.alertChannelId
            : ""
        )

        const storedPunishment =
          typeof antiRaid.punishment === "string"
            ? antiRaid.punishment
            : "quarantine"

        if (
          ["remove_roles", "timeout", "kick", "ban", "quarantine"].includes(
            storedPunishment
          )
        ) {
          setRaidPunishment(storedPunishment as Punishment)
        }

        if (Array.isArray(antiNuke.rules)) {
          const storedRules = antiNuke.rules as Array<
            Partial<Rule> & { id?: string }
          >

          setRules((current) =>
            current.map((rule) => {
              const storedRule = storedRules.find(
                (item) => item.id === rule.id
              )

              return storedRule
                ? {
                    ...rule,
                    enabled:
                      typeof storedRule.enabled === "boolean"
                        ? storedRule.enabled
                        : rule.enabled,
                    limit:
                      typeof storedRule.limit === "number"
                        ? storedRule.limit
                        : rule.limit,
                    seconds:
                      typeof storedRule.seconds === "number"
                        ? storedRule.seconds
                        : rule.seconds,
                    punishment:
                      typeof storedRule.punishment === "string"
                        ? (storedRule.punishment as Punishment)
                        : rule.punishment,
                  }
                : rule
            })
          )
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load security settings."
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadSettings()

    return () => {
      cancelled = true
    }
  }, [guildId])

  const activeRules = rules.filter((rule) => rule.enabled).length

  const score = useMemo(() => {
    if (!enabled) return 0

    return Math.min(
      100,
      55 +
        activeRules * 4 +
        Number(raidEnabled) * 5 +
        Number(botEnabled) * 4 +
        Number(spamEnabled) * 4
    )
  }, [activeRules, botEnabled, enabled, raidEnabled, spamEnabled])

  function updateRule(id: string, patch: Partial<Rule>) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, ...patch } : rule
      )
    )
    setSaved(false)
  }

  async function saveChanges() {
    setIsSaving(true)
    setSaved(false)
    setSaveError("")

    try {
      const response = await fetch(
        `/api/dashboard/${guildId}/security`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            protectionEnabled: enabled,
            protectionLevel: "high",
            antiRaid: {
              enabled: raidEnabled,
              joinLimit: raidJoinLimit,
              windowSeconds: raidWindowSeconds,
              minimumAccountAgeDays,
              automaticLockdown,
              lockdownDurationMinutes,
              raiseVerificationLevel,
              disableInvitesOnRaid,
              enableSlowmodeOnRaid,
              alertStaffOnRaid,
              ignoreWhitelistedMembers,
              alertChannelId: raidAlertChannel,
              punishment: raidPunishment,
            },
            antiNuke: {
              rules: rules.map((rule) => ({
                id: rule.id,
                enabled: rule.enabled,
                limit: rule.limit,
                seconds: rule.seconds,
                punishment: rule.punishment,
              })),
            },
            antiBot: {
              enabled: botEnabled,
            },
            antiSpam: {
              enabled: spamEnabled,
            },
            whitelist: {
              users: [],
              roles: [],
              bots: [],
              channels: [],
            },
          }),
        }
      )

      const result = (await response.json()) as {
        success?: boolean
        error?: string
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ?? "Failed to save security settings."
        )
      }

      setSaved(true)

      window.setTimeout(() => {
        setSaved(false)
      }, 2200)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save security settings."
      )
    } finally {
      setIsSaving(false)
    }
  }

  function resetAll() {
    setEnabled(true)
    setRules(initialRules)
    setRaidEnabled(true)
    setBotEnabled(true)
    setSpamEnabled(true)

    setRaidJoinLimit(10)
    setRaidWindowSeconds(10)
    setMinimumAccountAgeDays(7)
    setAutomaticLockdown(true)
    setLockdownDurationMinutes(5)
    setRaiseVerificationLevel(true)
    setDisableInvitesOnRaid(true)
    setEnableSlowmodeOnRaid(true)
    setAlertStaffOnRaid(true)
    setIgnoreWhitelistedMembers(true)
    setRaidAlertChannel("")
    setRaidPunishment("quarantine")

    setSaved(false)
  }

  return (
    <div className="space-y-6 pb-14">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.25),transparent_42%)]" />

        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary"
              >
                <ShieldCheck className="me-1 size-3.5" />
                TOX Security Center
              </Badge>

              <Badge
                variant="outline"
                className={cn(
                  enabled
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                )}
              >
                Protection {enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Security & Protection
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground lg:text-base">
              Protect your server from raids, nukes, unauthorized bots,
              spam and dangerous administrative actions.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Server ID: {guildId}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={resetAll}
                disabled={isLoading || isSaving}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>

              <Button
                onClick={() => void saveChanges()}
                disabled={isLoading || isSaving}
              >
                {isSaving ? (
                  <>
                    <Save className="size-4 animate-pulse" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="size-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            {isLoading && (
              <p className="text-xs text-muted-foreground">
                Loading saved security settings...
              </p>
            )}

            {loadError && (
              <p className="max-w-sm text-xs text-red-400">
                Load failed: {loadError}
              </p>
            )}

            {saveError && (
              <p className="max-w-sm text-xs text-red-400">
                Save failed: {saveError}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={ShieldCheck}
          label="Protection Status"
          value={enabled ? "Enabled" : "Disabled"}
          badge="Live"
        />
        <MetricCard
          icon={CircleGauge}
          label="Protection Score"
          value={`${score}%`}
          badge={score >= 80 ? "Very Good" : "Review"}
        />
        <MetricCard
          icon={Siren}
          label="Blocked Attacks"
          value="12"
          badge="+3 this week"
        />
        <MetricCard
          icon={Shield}
          label="Active Rules"
          value={String(activeRules)}
          badge="Monitoring"
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="shrink-0"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          {activeTab === "overview" && (
            <>
              <Card className="border-border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck className="size-5" />
                    </div>

                    <div>
                      <p className="font-semibold">Protection Status</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Enable or disable all server protection modules.
                      </p>
                    </div>
                  </div>

                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                </div>
              </Card>

              <SecurityBlock
                icon={ShieldAlert}
                title="Anti Nuke"
                description="Protect against destructive administrative actions."
                onOpen={() => setActiveTab("anti-nuke")}
              >
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {rules.slice(0, 6).map((rule) => (
                    <MiniToggle
                      key={rule.id}
                      icon={rule.icon}
                      title={rule.title}
                      description={`${rule.limit} actions / ${rule.seconds}s`}
                      checked={rule.enabled}
                      onChange={(checked) =>
                        updateRule(rule.id, { enabled: checked })
                      }
                    />
                  ))}
                </div>
              </SecurityBlock>

              <SecurityBlock
                icon={Siren}
                title="Anti Raid"
                description="Detect mass joins and automatically lock the server."
                onOpen={() => setActiveTab("anti-raid")}
              >
                <MiniToggle
                  icon={Siren}
                  title="Mass Join Detection"
                  description="Detect suspicious member joins."
                  checked={raidEnabled}
                  onChange={setRaidEnabled}
                />
              </SecurityBlock>

              <SecurityBlock
                icon={Bot}
                title="Anti Bot"
                description="Block unauthorized bots and punish their inviters."
                onOpen={() => setActiveTab("anti-bot")}
              >
                <MiniToggle
                  icon={Bot}
                  title="Unauthorized Bot Protection"
                  description="Remove bots that are not whitelisted."
                  checked={botEnabled}
                  onChange={setBotEnabled}
                />
              </SecurityBlock>

              <SecurityBlock
                icon={MessageSquareWarning}
                title="Anti Spam"
                description="Protect channels from spam, mentions and links."
                onOpen={() => setActiveTab("anti-spam")}
              >
                <MiniToggle
                  icon={MessageSquareWarning}
                  title="Message Spam Protection"
                  description="Detect repeated messages."
                  checked={spamEnabled}
                  onChange={setSpamEnabled}
                />
              </SecurityBlock>
            </>
          )}

          {activeTab === "anti-nuke" && (
            <Card className="border-border bg-card p-5">
              <SectionTitle
                icon={ShieldAlert}
                title="Anti Nuke Rules"
                description="Configure limits, time windows and punishments."
              />

              <div className="mt-5 space-y-3">
                {rules.map((rule) => {
                  const Icon = rule.icon

                  return (
                    <div
                      key={rule.id}
                      className={cn(
                        "rounded-2xl border p-4",
                        rule.enabled
                          ? "border-primary/30 bg-primary/[0.04]"
                          : "border-border bg-muted/10"
                      )}
                    >
                      <div className="grid gap-4 xl:grid-cols-[minmax(220px,1fr)_110px_140px_180px_auto] xl:items-center">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="size-5" />
                          </div>

                          <div>
                            <p className="font-semibold">{rule.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {rule.description}
                            </p>
                          </div>
                        </div>

                        <Field label="Limit">
                          <Input
                            type="number"
                            min={1}
                            value={rule.limit}
                            onChange={(event) =>
                              updateRule(rule.id, {
                                limit: Math.max(
                                  1,
                                  Number(event.target.value) || 1
                                ),
                              })
                            }
                          />
                        </Field>

                        <Field label="Window">
                          <select
                            value={rule.seconds}
                            onChange={(event) =>
                              updateRule(rule.id, {
                                seconds: Number(event.target.value),
                              })
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                          >
                            <option value={5}>5 seconds</option>
                            <option value={10}>10 seconds</option>
                            <option value={30}>30 seconds</option>
                            <option value={60}>60 seconds</option>
                          </select>
                        </Field>

                        <Field label="Punishment">
                          <select
                            value={rule.punishment}
                            onChange={(event) =>
                              updateRule(rule.id, {
                                punishment:
                                  event.target.value as Punishment,
                              })
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                          >
                            {Object.entries(punishmentLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </select>
                        </Field>

                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) =>
                            updateRule(rule.id, { enabled: checked })
                          }
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {activeTab === "anti-raid" && (
            <div className="space-y-5">
              <Card className="border-border bg-card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <SectionTitle
                    icon={Siren}
                    title="Anti Raid"
                    description="Detect mass joins, suspicious accounts and coordinated attacks."
                  />

                  <Switch
                    checked={raidEnabled}
                    onCheckedChange={(checked) => {
                      setRaidEnabled(checked)
                      setSaved(false)
                    }}
                  />
                </div>
              </Card>

              <Card className="border-border bg-card p-5">
                <SectionTitle
                  icon={Users}
                  title="Raid Detection"
                  description="Configure when TOX should consider incoming joins a raid."
                />

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Maximum Joins">
                    <Input
                      type="number"
                      min={2}
                      value={raidJoinLimit}
                      onChange={(event) => {
                        setRaidJoinLimit(
                          Math.max(2, Number(event.target.value) || 2)
                        )
                        setSaved(false)
                      }}
                    />
                  </Field>

                  <Field label="Detection Window">
                    <select
                      value={raidWindowSeconds}
                      onChange={(event) => {
                        setRaidWindowSeconds(Number(event.target.value))
                        setSaved(false)
                      }}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                    >
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds</option>
                      <option value={15}>15 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>60 seconds</option>
                    </select>
                  </Field>

                  <Field label="Minimum Account Age">
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        value={minimumAccountAgeDays}
                        onChange={(event) => {
                          setMinimumAccountAgeDays(
                            Math.max(0, Number(event.target.value) || 0)
                          )
                          setSaved(false)
                        }}
                        className="pe-14"
                      />
                      <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        days
                      </span>
                    </div>
                  </Field>
                </div>

                <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="font-medium">
                      Current trigger
                    </p>
                    <p className="text-muted-foreground">
                      {raidJoinLimit} joins within {raidWindowSeconds} seconds.
                      Accounts younger than {minimumAccountAgeDays} days are treated as high risk.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-5">
                <SectionTitle
                  icon={LockKeyhole}
                  title="Automatic Response"
                  description="Choose what TOX should do immediately after detecting a raid."
                />

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <AntiRaidSetting
                    title="Automatic Lockdown"
                    description="Lock text channels automatically when a raid starts."
                    checked={automaticLockdown}
                    onChange={(checked) => {
                      setAutomaticLockdown(checked)
                      setSaved(false)
                    }}
                  />

                  <AntiRaidSetting
                    title="Raise Verification Level"
                    description="Temporarily increase the Discord verification requirement."
                    checked={raiseVerificationLevel}
                    onChange={(checked) => {
                      setRaiseVerificationLevel(checked)
                      setSaved(false)
                    }}
                  />

                  <AntiRaidSetting
                    title="Disable New Invites"
                    description="Pause invite creation and disable active invite links."
                    checked={disableInvitesOnRaid}
                    onChange={(checked) => {
                      setDisableInvitesOnRaid(checked)
                      setSaved(false)
                    }}
                  />

                  <AntiRaidSetting
                    title="Enable Channel Slowmode"
                    description="Apply emergency slowmode to protected text channels."
                    checked={enableSlowmodeOnRaid}
                    onChange={(checked) => {
                      setEnableSlowmodeOnRaid(checked)
                      setSaved(false)
                    }}
                  />

                  <AntiRaidSetting
                    title="Alert Security Staff"
                    description="Send an immediate warning to the configured alert channel."
                    checked={alertStaffOnRaid}
                    onChange={(checked) => {
                      setAlertStaffOnRaid(checked)
                      setSaved(false)
                    }}
                  />

                  <AntiRaidSetting
                    title="Ignore Whitelisted Members"
                    description="Do not include trusted users and roles in raid calculations."
                    checked={ignoreWhitelistedMembers}
                    onChange={(checked) => {
                      setIgnoreWhitelistedMembers(checked)
                      setSaved(false)
                    }}
                  />
                </div>
              </Card>

              <Card className="border-border bg-card p-5">
                <SectionTitle
                  icon={ShieldAlert}
                  title="Lockdown & Punishment"
                  description="Configure the lockdown duration, alert destination and action against suspicious accounts."
                />

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Lockdown Duration">
                    <select
                      value={lockdownDurationMinutes}
                      onChange={(event) => {
                        setLockdownDurationMinutes(Number(event.target.value))
                        setSaved(false)
                      }}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                    >
                      <option value={1}>1 minute</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </Field>

                  <Field label="Suspicious Account Action">
                    <select
                      value={raidPunishment}
                      onChange={(event) => {
                        setRaidPunishment(event.target.value as Punishment)
                        setSaved(false)
                      }}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                    >
                      {Object.entries(punishmentLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </Field>

                  <Field label="Alert Channel">
                    <select
                      value={raidAlertChannel}
                      onChange={(event) => {
                        setRaidAlertChannel(event.target.value)
                        setSaved(false)
                      }}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                    >
                      <option value="">Select alert channel</option>
                      <option value="security-alerts">#security-alerts</option>
                      <option value="raid-alerts">#raid-alerts</option>
                      <option value="mod-logs">#mod-logs</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <RaidSummaryCard
                    label="Join Trigger"
                    value={`${raidJoinLimit} / ${raidWindowSeconds}s`}
                  />
                  <RaidSummaryCard
                    label="Account Age"
                    value={`${minimumAccountAgeDays} days`}
                  />
                  <RaidSummaryCard
                    label="Lockdown"
                    value={
                      automaticLockdown
                        ? `${lockdownDurationMinutes} minutes`
                        : "Disabled"
                    }
                  />
                  <RaidSummaryCard
                    label="Punishment"
                    value={punishmentLabels[raidPunishment]}
                  />
                </div>
              </Card>
            </div>
          )}

          {activeTab === "anti-bot" && (
            <SimpleModule
              icon={Bot}
              title="Anti Bot"
              description="Remove unauthorized bots and punish their inviters."
              checked={botEnabled}
              onChange={setBotEnabled}
            />
          )}

          {activeTab === "anti-spam" && (
            <SimpleModule
              icon={MessageSquareWarning}
              title="Anti Spam"
              description="Message spam, mention spam, invite links and caps detection."
              checked={spamEnabled}
              onChange={setSpamEnabled}
            />
          )}

          {activeTab === "whitelist" && (
            <Card className="border-border bg-card p-5">
              <SectionTitle
                icon={UserCheck}
                title="Whitelist"
                description="Manage trusted users, roles, bots and ignored channels."
              />

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <WhitelistCard icon={Users} title="Trusted Users" count={12} />
                <WhitelistCard icon={KeyRound} title="Trusted Roles" count={6} />
                <WhitelistCard icon={Bot} title="Trusted Bots" count={5} />
                <WhitelistCard icon={Hash} title="Ignored Channels" count={4} />
              </div>
            </Card>
          )}

          {activeTab === "logs" && (
            <Card className="border-border bg-card p-5">
              <SectionTitle
                icon={ShieldAlert}
                title="Protection Activity"
                description="Review security events and automated actions."
              />

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="pb-3">Event</th>
                      <th className="pb-3">Target</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((row) => (
                      <tr
                        key={`${row.event}-${row.time}`}
                        className="border-b border-border/60"
                      >
                        <td className="py-4 font-medium">{row.event}</td>
                        <td className="py-4 text-muted-foreground">
                          {row.target}
                        </td>
                        <td className="py-4 text-muted-foreground">
                          {row.action}
                        </td>
                        <td className="py-4 text-muted-foreground">
                          {row.time}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className="border-red-500/30 bg-red-500/10 text-red-400"
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-5 2xl:sticky 2xl:top-24 2xl:h-fit">
          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Protection Score</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Overall server security.
                </p>
              </div>

              <Badge variant="secondary">
                {score >= 80 ? "Very Good" : "Review"}
              </Badge>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="relative flex size-40 items-center justify-center rounded-full border-[12px] border-primary/20">
                <div
                  className="absolute inset-[-12px] rounded-full border-[12px] border-primary"
                  style={{
                    clipPath: `inset(${100 - score}% 0 0 0)`,
                  }}
                />

                <div className="text-center">
                  <p className="text-4xl font-bold">{score}</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <SectionTitle
              icon={UserCheck}
              title="Whitelist"
              description="Trusted server entities."
            />

            <div className="mt-4 divide-y divide-border rounded-xl border border-border">
              <QuickRow label="Trusted Users" value="12" />
              <QuickRow label="Trusted Roles" value="6" />
              <QuickRow label="Trusted Bots" value="5" />
              <QuickRow label="Ignored Channels" value="4" />
            </div>
          </Card>

          <Card className="border-red-500/20 bg-red-500/[0.05] p-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="size-5" />
              </div>

              <div>
                <p className="font-semibold">Emergency Mode</p>
                <p className="text-xs text-red-300/70">
                  Immediately lock down the server.
                </p>
              </div>
            </div>

            <Button
              className="mt-4 w-full bg-red-600 text-white hover:bg-red-500"
              onClick={() => setLockdown((current) => !current)}
            >
              <LockKeyhole className="size-4" />
              {lockdown ? "Cancel Lockdown" : "Activate Lockdown"}
            </Button>

            {lockdown && (
              <div className="mt-4 space-y-2 rounded-xl border border-red-500/20 p-3 text-xs">
                <EmergencyRow text="Lock text channels" />
                <EmergencyRow text="Disable new invites" />
                <EmergencyRow text="Block unauthorized bots" />
                <EmergencyRow text="Notify security staff" />
              </div>
            )}
          </Card>
        </aside>
      </section>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: ElementType
  label: string
  value: string
  badge: string
}) {
  return (
    <Card className="border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <Badge variant="secondary">{badge}</Badge>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </Card>
  )
}

function SecurityBlock({
  icon: Icon,
  title,
  description,
  onOpen,
  children,
}: {
  icon: ElementType
  title: string
  description: string
  onOpen: () => void
  children: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle
          icon={Icon}
          title={title}
          description={description}
        />

        <Button variant="outline" onClick={onOpen}>
          Configure
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="mt-5">{children}</div>
    </Card>
  )
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

function MiniToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ElementType
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 p-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function AntiRaidSetting({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
        checked
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-border bg-muted/10"
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-4 text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function RaidSummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function SimpleModule({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ElementType
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Card className="border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle
          icon={Icon}
          title={title}
          description={description}
        />

        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </Card>
  )
}

function WhitelistCard({
  icon: Icon,
  title,
  count,
}: {
  icon: ElementType
  title: string
  count: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>

          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">
              {count} configured
            </p>
          </div>
        </div>

        <Button size="sm" variant="outline">
          Manage
        </Button>
      </div>
    </div>
  )
}

function QuickRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between p-3 text-left text-sm transition-colors hover:bg-muted/30"
    >
      <span>{label}</span>
      <span className="flex items-center gap-2 text-muted-foreground">
        {value}
        <ChevronRight className="size-3.5" />
      </span>
    </button>
  )
}

function EmergencyRow({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-center gap-2 text-red-200">
      <Check className="size-3.5 text-emerald-400" />
      {text}
    </div>
  )
}