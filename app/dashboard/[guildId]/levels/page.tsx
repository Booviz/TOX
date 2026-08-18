"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import type { ElementType } from "react"
import {
  Award,
  BellRing,
  Bot,
  Check,
  ChevronRight,
  Crown,
  Hash,
  MessageSquare,
  Plus,
  RefreshCcw,
  Save,
  Settings2,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Trash2,
  UserRound,
  Users,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type LevelTab =
  | "overview"
  | "leaderboard"
  | "settings"
  | "rewards"
  | "message"

type Reward = {
  id: number
  level: number
  role: string
  roleId: string
  enabled: boolean
}

type DiscordRole = {
  id: string
  name: string
  color?: number
  position?: number
  managed?: boolean
}

type DiscordChannel = {
  id: string
  name: string
  type?: number
  kind?: string
  position?: number
  parentId?: string | null
  parentName?: string | null
}

const tabs: Array<{ id: LevelTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "settings", label: "Level Settings" },
  { id: "rewards", label: "Rewards" },
  { id: "message", label: "Level Up Message" },
]

type LeaderboardMember = {
  rank: number
  userId: string
  name: string
  username: string
  level: number
  xp: number
  progress: number
  messageCount: number
}

type LevelStats = {
  totalMembers: number
  highestLevel: number
  totalXp: number
  totalMessages: number
}

const initialRewards: Reward[] = [
  { id: 1, level: 5, role: "Member", roleId: "member", enabled: true },
  { id: 2, level: 10, role: "Active", roleId: "active", enabled: true },
  { id: 3, level: 20, role: "Elite", roleId: "elite", enabled: true },
  { id: 4, level: 30, role: "Veteran", roleId: "veteran", enabled: true },
  { id: 5, level: 50, role: "Legend", roleId: "legend", enabled: false },
]

export default function LevelsPage() {
  const params = useParams<{ guildId: string }>()
  const guildId = params.guildId

  const [activeTab, setActiveTab] = useState<LevelTab>("overview")
  const [enabled, setEnabled] = useState(true)
  const [minXp, setMinXp] = useState(15)
  const [maxXp, setMaxXp] = useState(25)
  const [cooldown, setCooldown] = useState(60)
  const [ignoreBots, setIgnoreBots] = useState(true)
  const [ignoreCommands, setIgnoreCommands] = useState(true)
  const [voiceXp, setVoiceXp] = useState(false)
  const [antiFarming, setAntiFarming] = useState(true)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [messageEnabled, setMessageEnabled] = useState(true)
  const [mentionUser, setMentionUser] = useState(true)
  const [showRank, setShowRank] = useState(true)
  const [showXp, setShowXp] = useState(true)
  const [dmInstead, setDmInstead] = useState(false)
  const [levelChannel, setLevelChannel] = useState("")
  const [messageText, setMessageText] = useState(
    "🎉 Congratulations {user}! You reached Level {level}."
  )
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([])
  const [stats, setStats] = useState<LevelStats>({
    totalMembers: 0,
    highestLevel: 0,
    totalXp: 0,
    totalMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [showAddReward, setShowAddReward] = useState(false)
  const [newRewardLevel, setNewRewardLevel] = useState(1)
  const [newRewardRoleId, setNewRewardRoleId] = useState("")
  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[]>([])
  const [channelsLoading, setChannelsLoading] = useState(false)
  const [ignoredChannelIds, setIgnoredChannelIds] = useState<string[]>([])
  const [ignoredRoleIds, setIgnoredRoleIds] = useState<string[]>([])
  const [showManageChannels, setShowManageChannels] = useState(false)
  const [showManageRoles, setShowManageRoles] = useState(false)
  const [draftIgnoredChannelIds, setDraftIgnoredChannelIds] = useState<string[]>([])
  const [draftIgnoredRoleIds, setDraftIgnoredRoleIds] = useState<string[]>([])

  const activeRewards = useMemo(
    () => rewards.filter((reward) => reward.enabled).length,
    [rewards]
  )

  function getRewardRoleName(reward: Reward) {
    const discordRole = discordRoles.find(
      (role) => String(role.id) === String(reward.roleId)
    )

    return discordRole?.name || reward.role || reward.roleId
  }

  async function loadLevels() {
    if (!guildId) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/dashboard/${guildId}/levels`, {
        cache: "no-store",
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load level system.")
      }

      const settings = data.settings ?? {}

      setEnabled(settings.enabled ?? true)
      setMinXp(settings.minXp ?? 15)
      setMaxXp(settings.maxXp ?? 25)
      setCooldown(settings.cooldownSeconds ?? 60)
      setIgnoreBots(settings.ignoreBots ?? true)
      setIgnoreCommands(settings.ignoreCommands ?? true)
      setVoiceXp(settings.voiceXpEnabled ?? false)
      setAntiFarming(settings.antiFarmingEnabled ?? true)
      setIgnoredChannelIds(
        Array.isArray(settings.ignoredChannelIds)
          ? settings.ignoredChannelIds.map(String)
          : []
      )
      setIgnoredRoleIds(
        Array.isArray(settings.ignoredRoleIds)
          ? settings.ignoredRoleIds.map(String)
          : []
      )
      setMessageEnabled(settings.levelUpMessageEnabled ?? true)
      setMentionUser(settings.mentionUser ?? true)
      setShowRank(settings.showRank ?? true)
      setShowXp(settings.showXp ?? true)
      setDmInstead(settings.sendAsDm ?? false)
      setLevelChannel(settings.levelUpChannelId ?? "")
      setMessageText(
        settings.levelUpMessage ??
          "🎉 Congratulations {user}! You reached Level {level}."
      )

      setRewards(
        (data.rewards ?? []).map((reward: any) => ({
          id: Number(reward.id),
          level: Number(reward.level),
          role: reward.roleName || reward.roleId,
          roleId: reward.roleId,
          enabled: Boolean(reward.enabled),
        }))
      )

      setLeaderboard(
        (data.leaderboard ?? []).map((member: any) => ({
          rank: Number(member.rank),
          userId: String(member.userId),
          name: member.name || member.displayName || member.username || member.userId,
          username: member.username
            ? `@${String(member.username).replace(/^@/, "")}`
            : member.userId,
          level: Number(member.level ?? 0),
          xp: Number(member.xp ?? 0),
          progress: Number(member.progress ?? 0),
          messageCount: Number(member.messageCount ?? 0),
        }))
      )

      setStats({
        totalMembers: Number(data.stats?.totalMembers ?? 0),
        highestLevel: Number(data.stats?.highestLevel ?? 0),
        totalXp: Number(data.stats?.totalXp ?? 0),
        totalMessages: Number(data.stats?.totalMessages ?? 0),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load level system.")
    } finally {
      setLoading(false)
    }
  }

  async function loadRoles() {
    if (!guildId) return

    setRolesLoading(true)

    try {
      const response = await fetch(`/api/dashboard/${guildId}/roles`, {
        cache: "no-store",
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load Discord roles.")
      }

      const loadedRoles = (data.roles ?? [])
        .map((role: any) => ({
          id: String(role.id),
          name: String(role.name ?? role.id),
          color: Number(role.color ?? 0),
          position: Number(role.position ?? 0),
          managed: Boolean(role.managed),
        }))
        .filter((role: DiscordRole) => role.name !== "@everyone" && !role.managed)
        .sort((a: DiscordRole, b: DiscordRole) => (b.position ?? 0) - (a.position ?? 0))

      setDiscordRoles(loadedRoles)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Discord roles.")
    } finally {
      setRolesLoading(false)
    }
  }

  async function loadChannels() {
    if (!guildId) return

    setChannelsLoading(true)

    try {
      const response = await fetch(`/api/dashboard/${guildId}/channels`, {
        cache: "no-store",
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load Discord channels.")
      }

      const loadedChannels = (data.channels ?? [])
        .map((channel: any) => ({
          id: String(channel.id),
          name: String(channel.name ?? channel.id),
          type:
            typeof channel.type === "number"
              ? channel.type
              : undefined,
          kind:
            typeof channel.kind === "string"
              ? channel.kind
              : undefined,
          position: Number(channel.position ?? channel.rawPosition ?? 0),
          parentId:
            typeof channel.parentId === "string"
              ? channel.parentId
              : null,
          parentName:
            typeof channel.parentName === "string"
              ? channel.parentName
              : null,
        }))
        .filter((channel: DiscordChannel) => {
          if (channel.kind) {
            return ["text", "announcement", "forum", "media"].includes(channel.kind)
          }

          return [0, 5, 15, 16].includes(Number(channel.type))
        })
        .sort(
          (a: DiscordChannel, b: DiscordChannel) =>
            (a.position ?? 0) - (b.position ?? 0)
        )

      setDiscordChannels(loadedChannels)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Discord channels.")
    } finally {
      setChannelsLoading(false)
    }
  }

  useEffect(() => {
    void loadLevels()
    void loadRoles()
    void loadChannels()
  }, [guildId])

  async function saveChanges() {
    if (!guildId || saving) return

    setSaving(true)
    setSaved(false)
    setError("")

    try {
      const response = await fetch(`/api/dashboard/${guildId}/levels`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled,
          minXp,
          maxXp,
          cooldownSeconds: cooldown,
          ignoreBots,
          ignoreCommands,
          voiceXpEnabled: voiceXp,
          antiFarmingEnabled: antiFarming,
          ignoredChannelIds,
          ignoredRoleIds,
          levelUpMessageEnabled: messageEnabled,
          levelUpChannelId: levelChannel || null,
          levelUpMessage: messageText,
          mentionUser,
          showRank,
          showXp,
          sendAsDm: dmInstead,
          rewards: rewards.map((reward) => ({
            level: reward.level,
            roleId: reward.roleId,
            enabled: reward.enabled,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save level settings.")
      }

      setSaved(true)
      window.setTimeout(() => setSaved(false), 1800)
      await loadLevels()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save level settings.")
    } finally {
      setSaving(false)
    }
  }

  async function resetSettings() {
    if (loading || saving) return

    setError("")
    setSaved(false)

    // Restore the last saved settings from the API/database.
    // This does NOT delete rewards or replace them with hard-coded defaults.
    await loadLevels()
  }

  function toggleReward(id: number, checked: boolean) {
    setRewards((current) =>
      current.map((reward) =>
        reward.id === id ? { ...reward, enabled: checked } : reward
      )
    )
  }

  function openAddReward() {
    setNewRewardLevel(1)
    setNewRewardRoleId(discordRoles[0]?.id ?? "")
    setShowAddReward(true)
  }

  function addReward() {
    const role = discordRoles.find((item) => item.id === newRewardRoleId)

    if (!role) {
      setError("Select a Discord role first.")
      return
    }

    if (newRewardLevel < 1) {
      setError("Required level must be 1 or higher.")
      return
    }

    if (rewards.some((reward) => reward.level === newRewardLevel)) {
      setError(`A reward for Level ${newRewardLevel} already exists.`)
      return
    }

    const tempId =
      rewards.length > 0
        ? Math.max(...rewards.map((reward) => reward.id)) + 1
        : 1

    setRewards((current) => [
      ...current,
      {
        id: tempId,
        level: newRewardLevel,
        role: role.name,
        roleId: role.id,
        enabled: true,
      },
    ].sort((a, b) => a.level - b.level))

    setError("")
    setShowAddReward(false)
  }

  function removeReward(id: number) {
    setRewards((current) => current.filter((reward) => reward.id !== id))
  }

  function openManageChannels() {
    setDraftIgnoredChannelIds([...ignoredChannelIds])
    setShowManageChannels(true)
  }

  function openManageRoles() {
    setDraftIgnoredRoleIds([...ignoredRoleIds])
    setShowManageRoles(true)
  }

  function toggleDraftChannel(channelId: string) {
    setDraftIgnoredChannelIds((current) =>
      current.includes(channelId)
        ? current.filter((id) => id !== channelId)
        : [...current, channelId]
    )
  }

  function toggleDraftRole(roleId: string) {
    setDraftIgnoredRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId]
    )
  }

  function applyIgnoredChannels() {
    setIgnoredChannelIds([...draftIgnoredChannelIds])
    setShowManageChannels(false)
  }

  function applyIgnoredRoles() {
    setIgnoredRoleIds([...draftIgnoredRoleIds])
    setShowManageRoles(false)
  }

  function getChannelName(channelId: string) {
    const channel = discordChannels.find(
      (item) => String(item.id) === String(channelId)
    )

    return channel ? `#${channel.name}` : channelId
  }

  function getRoleName(roleId: string) {
    const role = discordRoles.find(
      (item) => String(item.id) === String(roleId)
    )

    return role?.name ?? roleId
  }

  return (
    <div className="space-y-6 pb-14">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.25),transparent_42%)]" />

        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="me-1 size-3.5" />
                TOX Level System
              </Badge>

              <Badge
                variant="outline"
                className={cn(
                  enabled
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                )}
              >
                {enabled ? "System Enabled" : "System Disabled"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Levels & XP
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground lg:text-base">
              Reward activity, build member progression and create a competitive leaderboard for your Discord community.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => void resetSettings()}
              disabled={loading || saving}
            >
              <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
              Reset
            </Button>

            <Button onClick={saveChanges} disabled={saving || loading}>
              {saving ? (
                <>
                  <RefreshCcw className="size-4 animate-spin" />
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
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Members in Levels" value={stats.totalMembers.toLocaleString()} badge="Live" />
        <MetricCard icon={Crown} label="Highest Level" value={stats.highestLevel.toLocaleString()} badge="Live" />
        <MetricCard icon={Zap} label="Total XP" value={stats.totalXp.toLocaleString()} badge="Live" />
        <MetricCard icon={MessageSquare} label="Messages Counted" value={stats.totalMessages.toLocaleString()} badge="Live" />
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

      {activeTab === "overview" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <Card className="border-border bg-card p-5">
              <SectionTitle icon={Trophy} title="Top Members" description="Current leaderboard based on total XP." />

              <div className="mt-5 space-y-3">
                {leaderboard.map((member) => (
                  <LeaderboardRow key={member.rank} member={member} />
                ))}
              </div>

              <Button variant="outline" className="mt-4 w-full" onClick={() => setActiveTab("leaderboard")}>
                View full leaderboard
                <ChevronRight className="size-4" />
              </Button>
            </Card>

            <Card className="border-border bg-card p-5">
              <SectionTitle icon={Settings2} title="Quick Level Settings" description="Control XP gain and system behavior." />

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <Field label="Minimum XP">
                  <Input type="number" min={1} value={minXp} onChange={(event) => setMinXp(Math.max(1, Number(event.target.value) || 1))} />
                </Field>

                <Field label="Maximum XP">
                  <Input type="number" min={1} value={maxXp} onChange={(event) => setMaxXp(Math.max(1, Number(event.target.value) || 1))} />
                </Field>

                <Field label="Cooldown">
                  <div className="relative">
                    <Input
                      type="number"
                      min={5}
                      value={cooldown}
                      onChange={(event) => setCooldown(Math.max(5, Number(event.target.value) || 5))}
                      className="pe-16"
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      seconds
                    </span>
                  </div>
                </Field>
              </div>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card className="border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Level System</p>
                  <p className="mt-1 text-sm text-muted-foreground">Enable XP tracking.</p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </div>
            </Card>

            <Card className="border-border bg-card p-5">
              <SectionTitle icon={Award} title="Rewards" description="Automatic role rewards." />
              <div className="mt-4 divide-y divide-border rounded-xl border border-border">
                <QuickRow label="Active Rewards" value={String(activeRewards)} />
                <QuickRow label="Highest Reward" value={rewards.length ? `Level ${Math.max(...rewards.map((r) => r.level))}` : "None"} />
                <QuickRow label="Configured Rewards" value={String(rewards.length)} />
              </div>
            </Card>

            <Card className="border-border bg-card p-5">
              <SectionTitle icon={BellRing} title="Level Up Message" description="Member progression notification." />
              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
                <div>
                  <p className="text-sm font-medium">Message enabled</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Notify users on level up.</p>
                </div>
                <Switch checked={messageEnabled} onCheckedChange={setMessageEnabled} />
              </div>
            </Card>
          </aside>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <Card className="border-border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionTitle icon={Trophy} title="Leaderboard" description="Ranked members based on XP and level." />
            <div className="flex flex-wrap gap-2">
              <Input placeholder="Search member..." className="w-full sm:w-64" />
              <Button variant="outline" onClick={() => void loadLevels()} disabled={loading}>
                <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Member</th>
                  <th className="pb-3">Level</th>
                  <th className="pb-3">XP</th>
                  <th className="pb-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((member) => (
                  <tr key={member.rank} className="border-b border-border/60">
                    <td className="py-4 font-semibold">#{member.rank}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.username}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary">Level {member.level}</Badge>
                    </td>
                    <td className="py-4">{member.xp.toLocaleString()} XP</td>
                    <td className="py-4">
                      <div className="w-48">
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${member.progress}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{member.progress}%</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "settings" && (
        <div className="space-y-5">
          <Card className="border-border bg-card p-5">
            <SectionTitle icon={Settings2} title="Level Settings" description="Configure how members earn XP." />

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Minimum XP per message">
                <Input type="number" min={1} value={minXp} onChange={(event) => setMinXp(Math.max(1, Number(event.target.value) || 1))} />
              </Field>

              <Field label="Maximum XP per message">
                <Input type="number" min={1} value={maxXp} onChange={(event) => setMaxXp(Math.max(1, Number(event.target.value) || 1))} />
              </Field>

              <Field label="XP Cooldown">
                <Input type="number" min={5} value={cooldown} onChange={(event) => setCooldown(Math.max(5, Number(event.target.value) || 5))} />
              </Field>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <SectionTitle icon={Shield} title="Activity Rules" description="Choose what should and should not count toward XP." />

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ToggleSetting icon={Bot} title="Ignore Bots" description="Bot messages never generate XP." checked={ignoreBots} onChange={setIgnoreBots} />
              <ToggleSetting icon={MessageSquare} title="Ignore Commands" description="Slash commands and bot commands do not generate XP." checked={ignoreCommands} onChange={setIgnoreCommands} />
              <ToggleSetting icon={Zap} title="Voice XP" description="Allow members to earn XP while active in voice channels." checked={voiceXp} onChange={setVoiceXp} />
              <ToggleSetting icon={Target} title="Anti Farming" description="Block repeated or low-effort XP farming." checked={antiFarming} onChange={setAntiFarming} />
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <SectionTitle icon={Hash} title="Ignored Channels & Roles" description="Exclude selected channels and roles from the leveling system." />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Ignored Channels</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ignoredChannelIds.length} {ignoredChannelIds.length === 1 ? "channel" : "channels"} configured
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openManageChannels}
                    disabled={channelsLoading}
                  >
                    {channelsLoading && <RefreshCcw className="size-3.5 animate-spin" />}
                    Manage
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {ignoredChannelIds.length > 0 ? (
                    ignoredChannelIds.map((channelId) => (
                      <Badge key={channelId} variant="secondary">
                        {getChannelName(channelId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No ignored channels.</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Ignored Roles</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ignoredRoleIds.length} {ignoredRoleIds.length === 1 ? "role" : "roles"} configured
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openManageRoles}
                    disabled={rolesLoading}
                  >
                    {rolesLoading && <RefreshCcw className="size-3.5 animate-spin" />}
                    Manage
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {ignoredRoleIds.length > 0 ? (
                    ignoredRoleIds.map((roleId) => (
                      <Badge key={roleId} variant="secondary">
                        {getRoleName(roleId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No ignored roles.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showManageChannels && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowManageChannels(false)
          }}
        >
          <Card className="w-full max-w-2xl border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle
                icon={Hash}
                title="Manage Ignored Channels"
                description="Messages in selected channels will not count toward the level system."
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowManageChannels(false)}
              >
                Close
              </Button>
            </div>

            <div className="mt-6 max-h-[420px] space-y-2 overflow-y-auto pe-1">
              {discordChannels.length === 0 && !channelsLoading ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No compatible text channels were returned for this server.
                </div>
              ) : (
                discordChannels.map((channel) => {
                  const checked = draftIgnoredChannelIds.includes(channel.id)

                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => toggleDraftChannel(channel.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left transition-colors",
                        checked
                          ? "border-primary/40 bg-primary/[0.06]"
                          : "border-border bg-muted/10 hover:bg-muted/20"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">#{channel.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {channel.parentName ?? "No category"}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        )}
                      >
                        {checked && <Check className="size-3.5" />}
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDraftIgnoredChannelIds([])}
              >
                Clear All
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManageChannels(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={applyIgnoredChannels}>
                  <Check className="size-4" />
                  Apply Selection
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showManageRoles && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowManageRoles(false)
          }}
        >
          <Card className="w-full max-w-2xl border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle
                icon={Shield}
                title="Manage Ignored Roles"
                description="Members with selected roles will not earn XP from messages."
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowManageRoles(false)}
              >
                Close
              </Button>
            </div>

            <div className="mt-6 max-h-[420px] space-y-2 overflow-y-auto pe-1">
              {discordRoles.length === 0 && !rolesLoading ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No assignable Discord roles were returned for this server.
                </div>
              ) : (
                discordRoles.map((role) => {
                  const checked = draftIgnoredRoleIds.includes(role.id)

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleDraftRole(role.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left transition-colors",
                        checked
                          ? "border-primary/40 bg-primary/[0.06]"
                          : "border-border bg-muted/10 hover:bg-muted/20"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{role.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Discord Role
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        )}
                      >
                        {checked && <Check className="size-3.5" />}
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDraftIgnoredRoleIds([])}
              >
                Clear All
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManageRoles(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={applyIgnoredRoles}>
                  <Check className="size-4" />
                  Apply Selection
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "rewards" && (
        <Card className="border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle icon={Award} title="Level Rewards" description="Assign roles automatically when members reach specific levels." />
            <Button onClick={openAddReward} disabled={rolesLoading}>
              {rolesLoading ? (
                <RefreshCcw className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add Reward
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={cn(
                  "grid gap-4 rounded-2xl border p-4 md:grid-cols-[120px_minmax(0,1fr)_auto_auto] md:items-center",
                  reward.enabled ? "border-primary/30 bg-primary/[0.04]" : "border-border bg-muted/10"
                )}
              >
                <div>
                  <p className="text-xs text-muted-foreground">Required Level</p>
                  <p className="mt-1 text-lg font-bold">Level {reward.level}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reward Role</p>
                  <Badge className="mt-2" variant="secondary">{getRewardRoleName(reward)}</Badge>
                </div>
                <Switch checked={reward.enabled} onCheckedChange={(checked) => toggleReward(reward.id, checked)} />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-red-400"
                  onClick={() => removeReward(reward.id)}
                  title="Delete reward"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}

            {rewards.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
                <Award className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No level rewards configured</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a reward and select a real Discord role from this server.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {showAddReward && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAddReward(false)
          }}
        >
          <Card className="w-full max-w-lg border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle
                icon={Award}
                title="Add Level Reward"
                description="Assign a Discord role when a member reaches a specific level."
              />
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddReward(false)}>
                Close
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <Field label="Required Level">
                <Input
                  type="number"
                  min={1}
                  value={newRewardLevel}
                  onChange={(event) =>
                    setNewRewardLevel(Math.max(1, Number(event.target.value) || 1))
                  }
                />
              </Field>

              <Field label="Discord Role">
                <select
                  value={newRewardRoleId}
                  onChange={(event) => setNewRewardRoleId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                >
                  <option value="">Select role</option>
                  {discordRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </Field>

              {discordRoles.length === 0 && !rolesLoading && (
                <p className="text-sm text-amber-400">
                  No assignable Discord roles were returned for this server.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddReward(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={addReward} disabled={!newRewardRoleId}>
                <Plus className="size-4" />
                Add Reward
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "message" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card className="border-border bg-card p-5">
              <SectionTitle icon={BellRing} title="Level Up Message" description="Customize the message members receive when they level up." />

              <div className="mt-5 space-y-4">
                <Field label="Message Channel">
                  <select
                    value={levelChannel}
                    onChange={(event) => setLevelChannel(event.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  >
                    <option value="">Select channel</option>
                    <option value="general">#general</option>
                    <option value="levels">#levels</option>
                    <option value="announcements">#announcements</option>
                  </select>
                </Field>

                <Field label="Message">
                  <textarea
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    rows={5}
                    className="w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </Field>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-sm font-medium">Available Variables</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["{user}", "{level}", "{xp}", "{rank}", "{server}"].map((variable) => (
                      <Badge key={variable} variant="secondary">{variable}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-5">
              <SectionTitle icon={Star} title="Message Options" description="Choose which details appear in the level-up notification." />

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <ToggleSetting icon={BellRing} title="Enable Level Up Message" description="Send a notification when members level up." checked={messageEnabled} onChange={setMessageEnabled} />
                <ToggleSetting icon={UserRound} title="Mention User" description="Mention the member in the notification." checked={mentionUser} onChange={setMentionUser} />
                <ToggleSetting icon={Trophy} title="Show Rank" description="Display the member's server rank." checked={showRank} onChange={setShowRank} />
                <ToggleSetting icon={Zap} title="Show XP" description="Display the member's total XP." checked={showXp} onChange={setShowXp} />
                <ToggleSetting icon={MessageSquare} title="Send as DM" description="Send the level-up message privately instead." checked={dmInstead} onChange={setDmInstead} />
              </div>
            </Card>
          </div>

          <Card className="h-fit border-border bg-card p-5 xl:sticky xl:top-24">
            <SectionTitle icon={Sparkles} title="Live Preview" description="Preview the member notification." />

            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Al-Mansoori</p>
                  <p className="text-xs text-muted-foreground">Level Up</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6">
                {messageText
                  .replace("{user}", "@Al-Mansoori")
                  .replace("{level}", "28")
                  .replace("{xp}", "19,250")
                  .replace("{rank}", "#1")
                  .replace("{server}", "TOX COMMUNITY")}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {showXp && (
                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Total XP</p>
                    <p className="mt-1 font-semibold">19,250</p>
                  </div>
                )}
                {showRank && (
                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Rank</p>
                    <p className="mt-1 font-semibold">#1</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
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
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
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
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function ToggleSetting({
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
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border p-4",
        checked ? "border-primary/30 bg-primary/[0.04]" : "border-border bg-muted/10"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs leading-4 text-muted-foreground">{description}</p>
        </div>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function LeaderboardRow({
  member,
}: {
  member: LeaderboardMember
}) {
  return (
    <div className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[50px_minmax(0,1fr)_100px_160px] sm:items-center">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-xl font-bold",
          member.rank === 1
            ? "bg-amber-500/10 text-amber-400"
            : member.rank === 2
              ? "bg-slate-400/10 text-slate-300"
              : member.rank === 3
                ? "bg-orange-500/10 text-orange-400"
                : "bg-muted text-muted-foreground"
        )}
      >
        #{member.rank}
      </div>

      <div>
        <p className="font-medium">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.username}</p>
      </div>

      <Badge variant="secondary" className="w-fit">
        Level {member.level}
      </Badge>

      <div>
        <div className="flex items-center justify-between text-xs">
          <span>{member.xp.toLocaleString()} XP</span>
          <span className="text-muted-foreground">{member.progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${member.progress}%` }} />
        </div>
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