"use client"

import { use, useEffect, useMemo, useState } from "react"
import type { ElementType } from "react"
import {
  Activity,
  BellRing,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Database,
  FileClock,
  Filter,
  Hash,
  ImageIcon,
  MessageSquare,
  Paperclip,
  Plus,
  Radio,
  Save,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  Sparkles,
  UserMinus,
  UserPlus,
  Users,
  Volume2,
  WandSparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type LogCategory =
  | "all"
  | "members"
  | "messages"
  | "moderation"
  | "channels"
  | "roles"
  | "voice"
  | "server"

type LogEvent = {
  id: string
  title: string
  description: string
  category: Exclude<LogCategory, "all">
  channel: string
  enabled: boolean
  icon: ElementType
}

type EventSettings = {
  channel: string
  color: string
  mentionRole: string
  ignoreBots: boolean
  ignoreWebhooks: boolean
  saveAttachments: boolean
  saveImages: boolean
  aiSummary: boolean
  compactMode: boolean
}

type DiscordChannelOption = {
  id: string
  name: string
  type?: string | number
  parentId?: string | null
  parentName?: string | null
}

type SavedLogSetting = {
  eventKey: string
  enabled: boolean
  channelId: string
  embedColor: string
  mentionRoleId: string | null
  ignoreBots: boolean
  ignoreWebhooks: boolean
  saveAttachments: boolean
  saveImages: boolean
  aiSummary: boolean
  compactMode: boolean
}

type CustomLogsApiResponse = {
  success?: boolean
  message?: string
  error?: string
  settings?: SavedLogSetting[]
  setting?: SavedLogSetting
}

const categoryLabels: Record<Exclude<LogCategory, "all">, string> = {
  members: "Members",
  messages: "Messages",
  moderation: "Moderation",
  channels: "Channels",
  roles: "Roles",
  voice: "Voice",
  server: "Server",
}

const categoryOrder: Exclude<LogCategory, "all">[] = [
  "members",
  "moderation",
  "messages",
  "channels",
  "roles",
  "voice",
  "server",
]

const LOG_EVENT_REGISTRY: Array<
  Omit<LogEvent, "channel" | "enabled">
> = [
  {
    id: "member-joined",
    title: "Member Joined",
    description: "Send a detailed log whenever a new member joins the server.",
    category: "members",
    icon: UserPlus,
  },
  {
    id: "member-left",
    title: "Member Left",
    description: "Record member departures with account and server information.",
    category: "members",
    icon: UserMinus,
  },
  {
    id: "member_nickname_update",
    title: "Nickname Updated",
    description: "Record the old and new nickname whenever a member is renamed.",
    category: "members",
    icon: Users,
  },
  {
    id: "member_roles_update",
    title: "Member Roles Updated",
    description: "Track roles added to or removed from a server member.",
    category: "members",
    icon: Users,
  },
  {
    id: "member_ban",
    title: "Member Banned",
    description: "Record bans with moderator, target and audit-log information.",
    category: "moderation",
    icon: ShieldAlert,
  },
  {
    id: "member_unban",
    title: "Member Unbanned",
    description: "Record when a server ban is removed from a user.",
    category: "moderation",
    icon: ShieldAlert,
  },
  {
    id: "member_kick",
    title: "Member Kicked",
    description: "Record kicks with moderator, member and reason details.",
    category: "moderation",
    icon: UserMinus,
  },
  {
    id: "member_timeout_add",
    title: "Member Timed Out",
    description: "Track timeout actions and their expiration time.",
    category: "moderation",
    icon: FileClock,
  },
  {
    id: "member_timeout_remove",
    title: "Timeout Removed",
    description: "Record when a member timeout is removed.",
    category: "moderation",
    icon: Check,
  },
  {
    id: "message-deleted",
    title: "Message Deleted",
    description: "Track deleted messages, attachments and the responsible user.",
    category: "messages",
    icon: MessageSquare,
  },
  {
    id: "message-edited",
    title: "Message Edited",
    description: "Display the original and updated message content.",
    category: "messages",
    icon: FileClock,
  },
  {
    id: "reaction_add",
    title: "Reaction Added",
    description: "Record reactions added to messages with user and channel details.",
    category: "messages",
    icon: CircleDot,
  },
  {
    id: "reaction_remove",
    title: "Reaction Removed",
    description: "Record reactions removed from messages.",
    category: "messages",
    icon: CircleDot,
  },
  {
    id: "channel_create",
    title: "Channel Created",
    description: "Track newly created text, voice and category channels.",
    category: "channels",
    icon: Hash,
  },
  {
    id: "channel_update",
    title: "Channel Updated",
    description: "Track channel names, topics, categories, permissions and voice settings.",
    category: "channels",
    icon: Settings2,
  },
  {
    id: "channel_delete",
    title: "Channel Deleted",
    description: "Record deleted channels with category and executor information.",
    category: "channels",
    icon: UserMinus,
  },
  {
    id: "thread_create",
    title: "Thread Created",
    description: "Track new public, private and announcement threads.",
    category: "channels",
    icon: MessageSquare,
  },
  {
    id: "thread_update",
    title: "Thread Updated",
    description: "Track thread names, archive status, locks, slowmode and settings.",
    category: "channels",
    icon: Settings2,
  },
  {
    id: "thread_delete",
    title: "Thread Deleted",
    description: "Record deleted threads with parent channel and executor details.",
    category: "channels",
    icon: UserMinus,
  },
  {
    id: "role_create",
    title: "Role Created",
    description: "Record newly created roles and their initial settings.",
    category: "roles",
    icon: Plus,
  },
  {
    id: "role_update",
    title: "Role Updated",
    description: "Track changes to role names, colors and permissions.",
    category: "roles",
    icon: Users,
  },
  {
    id: "role_delete",
    title: "Role Deleted",
    description: "Record deleted roles with their previous settings.",
    category: "roles",
    icon: UserMinus,
  },
  {
    id: "voice_join",
    title: "Voice Joined",
    description: "Track members joining voice channels.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "voice_leave",
    title: "Voice Left",
    description: "Track members leaving voice channels.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "voice_move",
    title: "Voice Moved",
    description: "Track members moving between voice channels.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "voice_disconnect",
    title: "Voice Disconnected",
    description: "Track members disconnected by a moderator.",
    category: "voice",
    icon: UserMinus,
  },
  {
    id: "voice_server_mute",
    title: "Server Mute",
    description: "Record when a moderator server-mutes a member.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "voice_server_unmute",
    title: "Server Unmute",
    description: "Record when a moderator removes a server mute.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "voice_server_deafen",
    title: "Server Deafen",
    description: "Record when a moderator server-deafens a member.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "voice_server_undeafen",
    title: "Server Undeafen",
    description: "Record when a moderator removes server deafen.",
    category: "voice",
    icon: Volume2,
  },
  {
    id: "invite_create",
    title: "Invite Created",
    description: "Track new server invites, their creator and expiration settings.",
    category: "server",
    icon: Plus,
  },
  {
    id: "invite_delete",
    title: "Invite Deleted",
    description: "Track deleted server invites and the responsible user.",
    category: "server",
    icon: UserMinus,
  },
  {
    id: "bot-added",
    title: "Bot Added",
    description: "Track bots added to the server and who authorized them.",
    category: "server",
    icon: Bot,
  },
]

const initialEvents: LogEvent[] = LOG_EVENT_REGISTRY.map((event) => ({
  ...event,
  channel: "No channel selected",
  enabled: false,
}))

const defaultSettings: EventSettings = {
  channel: "",
  color: "#7C3AED",
  mentionRole: "",
  ignoreBots: true,
  ignoreWebhooks: true,
  saveAttachments: true,
  saveImages: true,
  aiSummary: false,
  compactMode: false,
}

export default function CustomLogsPage({
  params,
}: {
  params: Promise<{ guildId: string }>
}) {
  const { guildId } = use(params)

  const [events, setEvents] = useState(initialEvents)
  const [activeCategory, setActiveCategory] = useState<LogCategory>("all")
  const [search, setSearch] = useState("")
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0].id)
  const [settings, setSettings] = useState<EventSettings>(defaultSettings)
  const [channels, setChannels] = useState<DiscordChannelOption[]>([])
  const [channelsLoading, setChannelsLoading] = useState(true)
  const [channelsError, setChannelsError] = useState<string | null>(null)
  const [savedSettings, setSavedSettings] = useState<
    Record<string, SavedLogSetting>
  >({})
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? events[0]

  const selectedChannel =
    channels.find((channel) => channel.id === settings.channel) ?? null

  const enabledCount = events.filter((event) => event.enabled).length

  const categoryTabs = useMemo(() => {
    const tabs: Array<{
      id: LogCategory
      label: string
      count: number
    }> = [
      {
        id: "all",
        label: "All Events",
        count: events.length,
      },
    ]

    for (const category of categoryOrder) {
      const count = events.filter(
        (event) => event.category === category
      ).length

      if (count > 0) {
        tabs.push({
          id: category,
          label: categoryLabels[category],
          count,
        })
      }
    }

    return tabs
  }, [events])

  useEffect(() => {
    let cancelled = false

    async function loadChannels() {
      try {
        setChannelsLoading(true)
        setChannelsError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/channels`,
          {
            method: "GET",
            cache: "no-store",
          }
        )

        const text = await response.text()
        let payload: DiscordChannelOption[] | { channels?: DiscordChannelOption[]; error?: string } = []

        if (text) {
          payload = JSON.parse(text) as
            | DiscordChannelOption[]
            | { channels?: DiscordChannelOption[]; error?: string }
        }

        if (!response.ok) {
          const message =
            !Array.isArray(payload) && payload.error
              ? payload.error
              : "Failed to load Discord channels."

          throw new Error(message)
        }

        const loadedChannels = Array.isArray(payload)
          ? payload
          : payload.channels ?? []

        const textChannels = loadedChannels.filter((channel) => {
          if (channel.type === undefined || channel.type === null) {
            return true
          }

          if (typeof channel.type === "number") {
            return channel.type === 0 || channel.type === 5
          }

          const normalizedType = channel.type.toLowerCase()

          return (
            normalizedType === "text" ||
            normalizedType === "guild_text" ||
            normalizedType === "announcement" ||
            normalizedType === "guild_announcement"
          )
        })

        if (!cancelled) {
          setChannels(textChannels)
        }
      } catch (error) {
        if (!cancelled) {
          setChannelsError(
            error instanceof Error
              ? error.message
              : "Failed to load Discord channels."
          )
        }
      } finally {
        if (!cancelled) {
          setChannelsLoading(false)
        }
      }
    }

    void loadChannels()

    return () => {
      cancelled = true
    }
  }, [guildId])

  useEffect(() => {
    let cancelled = false

    async function loadCustomLogSettings() {
      try {
        setSettingsLoading(true)
        setError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/custom-logs`,
          {
            method: "GET",
            cache: "no-store",
          }
        )

        const payload =
          (await response.json()) as CustomLogsApiResponse

        if (!response.ok) {
          throw new Error(
            payload.error ??
              "Failed to load custom log settings."
          )
        }

        const loadedSettings = payload.settings ?? []
        const settingsMap = Object.fromEntries(
          loadedSettings.map((setting) => [
            setting.eventKey,
            setting,
          ])
        )

        if (cancelled) {
          return
        }

        setSavedSettings(settingsMap)

        setEvents((current) =>
          current.map((event) => {
            const savedSetting = settingsMap[event.id]

            if (!savedSetting) {
              return event
            }

            return {
              ...event,
              enabled: savedSetting.enabled,
            }
          })
        )

        const firstSetting =
          settingsMap[selectedEventId]

        if (firstSetting) {
          setSettings({
            channel: firstSetting.channelId,
            color: firstSetting.embedColor,
            mentionRole:
              firstSetting.mentionRoleId ?? "",
            ignoreBots: firstSetting.ignoreBots,
            ignoreWebhooks:
              firstSetting.ignoreWebhooks,
            saveAttachments:
              firstSetting.saveAttachments,
            saveImages: firstSetting.saveImages,
            aiSummary: firstSetting.aiSummary,
            compactMode: firstSetting.compactMode,
          })
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load custom log settings."
          )
        }
      } finally {
        if (!cancelled) {
          setSettingsLoading(false)
        }
      }
    }

    void loadCustomLogSettings()

    return () => {
      cancelled = true
    }
  }, [guildId])

  useEffect(() => {
    if (channels.length === 0) {
      return
    }

    setEvents((current) =>
      current.map((event) => {
        const savedSetting = savedSettings[event.id]

        if (!savedSetting?.channelId) {
          return event
        }

        const channel = channels.find(
          (item) => item.id === savedSetting.channelId
        )

        return {
          ...event,
          channel: channel
            ? `#${channel.name}`
            : "Channel unavailable",
        }
      })
    )
  }, [channels, savedSettings])

  const filteredEvents = useMemo(() => {
    const value = search.trim().toLowerCase()

    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "all" || event.category === activeCategory

      const matchesSearch =
        !value ||
        event.title.toLowerCase().includes(value) ||
        event.description.toLowerCase().includes(value) ||
        event.channel.toLowerCase().includes(value)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, events, search])

  function selectEvent(event: LogEvent) {
    setSelectedEventId(event.id)

    const savedSetting = savedSettings[event.id]

    if (savedSetting) {
      setSettings({
        channel: savedSetting.channelId,
        color: savedSetting.embedColor,
        mentionRole:
          savedSetting.mentionRoleId ?? "",
        ignoreBots: savedSetting.ignoreBots,
        ignoreWebhooks:
          savedSetting.ignoreWebhooks,
        saveAttachments:
          savedSetting.saveAttachments,
        saveImages: savedSetting.saveImages,
        aiSummary: savedSetting.aiSummary,
        compactMode: savedSetting.compactMode,
      })
    } else {
      setSettings({
        ...defaultSettings,
      })
    }

    setSaved(false)
    setMessage(null)
    setError(null)
  }

  function toggleEvent(eventId: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? { ...event, enabled: !event.enabled }
          : event
      )
    )
    setSaved(false)
    setMessage(null)
    setError(null)
  }

  function enableAll() {
    setEvents((current) =>
      current.map((event) => ({ ...event, enabled: true }))
    )
    setSaved(false)
  }

  async function saveChanges() {
    try {
      setSaving(true)
      setMessage(null)
      setError(null)
      setSaved(false)

      const response = await fetch(
        `/api/dashboard/${guildId}/custom-logs`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventKey: selectedEvent.id,
            enabled: selectedEvent.enabled,
            channelId: settings.channel,
            embedColor: settings.color,
            mentionRoleId:
              settings.mentionRole || null,
            ignoreBots: settings.ignoreBots,
            ignoreWebhooks:
              settings.ignoreWebhooks,
            saveAttachments:
              settings.saveAttachments,
            saveImages: settings.saveImages,
            aiSummary: settings.aiSummary,
            compactMode: settings.compactMode,
          }),
        }
      )

      const payload =
        (await response.json()) as CustomLogsApiResponse

      if (!response.ok || !payload.setting) {
        throw new Error(
          payload.error ??
            "Failed to save custom log settings."
        )
      }

      const savedSetting = payload.setting

      setSavedSettings((current) => ({
        ...current,
        [selectedEvent.id]: savedSetting,
      }))

      const channelLabel = selectedChannel
        ? `#${selectedChannel.name}`
        : "No channel selected"

      setEvents((current) =>
        current.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                enabled: savedSetting.enabled,
                channel: channelLabel,
              }
            : event
        )
      )

      setSaved(true)
      setMessage(
        payload.message ??
          "Custom log settings saved successfully."
      )

      window.setTimeout(() => {
        setSaved(false)
      }, 2200)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save custom log settings."
      )
    } finally {
      setSaving(false)
    }
  }

  async function testLog() {
    try {
      setTesting(true)
      setMessage(null)
      setError(null)

      if (!settings.channel) {
        throw new Error(
          "Select a Log Channel before sending a test."
        )
      }

      const response = await fetch(
        `/api/dashboard/${guildId}/custom-logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "test",
            eventKey: selectedEvent.id,
            settings: {
              eventKey: selectedEvent.id,
              enabled: selectedEvent.enabled,
              channelId: settings.channel,
              embedColor: settings.color,
              mentionRoleId:
                settings.mentionRole || null,
              ignoreBots: settings.ignoreBots,
              ignoreWebhooks:
                settings.ignoreWebhooks,
              saveAttachments:
                settings.saveAttachments,
              saveImages: settings.saveImages,
              aiSummary: settings.aiSummary,
              compactMode: settings.compactMode,
            },
          }),
        }
      )

      const payload =
        (await response.json()) as CustomLogsApiResponse

      if (!response.ok) {
        throw new Error(
          payload.error ??
            "Failed to send the test log."
        )
      }

      setMessage(
        payload.message ??
          "Test log sent successfully."
      )
    } catch (testError) {
      setError(
        testError instanceof Error
          ? testError.message
          : "Failed to send the test log."
      )
    } finally {
      setTesting(false)
    }
  }

  const SelectedIcon = selectedEvent.icon

  return (
    <div className="space-y-6 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),transparent_40%)]" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary"
              >
                <Sparkles className="me-1 size-3.5" />
                TOX Event Builder
              </Badge>

              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              >
                <span className="me-2 size-1.5 rounded-full bg-emerald-400" />
                Real-time monitoring active
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Custom Logs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground lg:text-base">
              Build, configure and preview every supported Discord event from one
              registry-driven TOX workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <WandSparkles className="size-4" />
              Templates
            </Button>

            <Button variant="outline" onClick={enableAll}>
              <Check className="size-4" />
              Enable All
            </Button>

            <Button>
              <Plus className="size-4" />
              New Custom Log
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Active Log Systems"
          value={`${enabledCount}/${events.length}`}
          badge="Live"
        />
        <MetricCard
          icon={BellRing}
          label="Events Today"
          value="1,248"
          badge="+18%"
        />
        <MetricCard
          icon={Hash}
          label="Connected Channels"
          value="6"
          badge="Healthy"
        />
        <MetricCard
          icon={Database}
          label="Database Status"
          value="Online"
          badge="12 ms"
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search log events..."
              className="ps-10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
            <Filter className="size-4 shrink-0 text-muted-foreground" />

            {categoryTabs.map((category) => (
              <Button
                key={category.id}
                type="button"
                size="sm"
                variant={activeCategory === category.id ? "default" : "ghost"}
                className="shrink-0"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
                <span
                  className={cn(
                    "ms-1 rounded-full px-1.5 py-0.5 text-[10px]",
                    activeCategory === category.id
                      ? "bg-primary-foreground/15"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Event Library</h2>
              <p className="text-sm text-muted-foreground">
                Select an event to configure its output and behavior.
              </p>
            </div>

            <Badge variant="secondary">
              {filteredEvents.length} events
            </Badge>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {filteredEvents.map((event) => {
              const Icon = event.icon
              const isSelected = selectedEvent.id === event.id

              return (
                <Card
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectEvent(event)}
                  onKeyDown={(keyboardEvent) => {
                    if (
                      keyboardEvent.key === "Enter" ||
                      keyboardEvent.key === " "
                    ) {
                      selectEvent(event)
                    }
                  }}
                  className={cn(
                    "group cursor-pointer border-border bg-card p-4 transition-all",
                    "hover:border-primary/40 hover:bg-muted/20",
                    isSelected &&
                      "border-primary/60 bg-primary/[0.06] shadow-[0_0_0_1px_rgba(124,58,237,0.15)]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-2xl border",
                        event.enabled
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-semibold">
                              {event.title}
                            </h3>

                            <Badge
                              variant="outline"
                              className={cn(
                                "h-5 px-1.5 text-[10px]",
                                event.enabled
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                  : "text-muted-foreground"
                              )}
                            >
                              {event.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>

                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {event.description}
                          </p>
                        </div>

                        <Switch
                          checked={event.enabled}
                          onClick={(clickEvent) => clickEvent.stopPropagation()}
                          onCheckedChange={() => toggleEvent(event.id)}
                          aria-label={`Toggle ${event.title}`}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                          <Hash className="size-3.5 shrink-0" />
                          <span className="truncate">{event.channel}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-primary">
                          Configure
                          <ChevronRight className="size-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <Card className="flex min-h-56 flex-col items-center justify-center border-dashed p-8 text-center">
              <Search className="size-6 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No events found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Change the search text or select another category.
              </p>
            </Card>
          )}
        </div>

        <aside className="h-fit 2xl:sticky 2xl:top-24">
          <Card className="overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-muted/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <SelectedIcon className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <Badge
                      variant="outline"
                      className="mb-2 border-primary/30 bg-primary/10 text-primary"
                    >
                      Event Configuration
                    </Badge>
                    <h2 className="truncate text-lg font-semibold">
                      {selectedEvent.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Server ID: {guildId}
                    </p>
                  </div>
                </div>

                <Switch
                  checked={selectedEvent.enabled}
                  onCheckedChange={() => toggleEvent(selectedEvent.id)}
                />
              </div>
            </div>

            <div className="space-y-5 p-5">
              <Field label="Log Channel" icon={Hash}>
                <select
                  value={settings.channel}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      channel: event.target.value,
                    }))
                  }
                  disabled={channelsLoading}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {channelsLoading
                      ? "Loading server channels..."
                      : "Select log channel"}
                  </option>

                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.parentName
                        ? `${channel.parentName} / ${channel.name}`
                        : channel.name}
                    </option>
                  ))}
                </select>

                {channelsError && (
                  <p className="mt-2 text-xs text-red-400">
                    {channelsError}
                  </p>
                )}

                {!channelsLoading &&
                  !channelsError &&
                  channels.length === 0 && (
                    <p className="mt-2 text-xs text-amber-400">
                      No text channels were returned for this server.
                    </p>
                  )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Embed Color" icon={CircleDot}>
                  <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3">
                    <input
                      type="color"
                      value={settings.color}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          color: event.target.value,
                        }))
                      }
                      className="size-5 cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-xs text-muted-foreground">
                      {settings.color}
                    </span>
                  </div>
                </Field>

                <Field label="Mention Role" icon={Users}>
                  <select
                    value={settings.mentionRole}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        mentionRole: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  >
                    <option value="">No role</option>
                  </select>
                </Field>
              </div>

              <div className="space-y-2">
                <SettingRow
                  icon={Bot}
                  title="Ignore Bots"
                  description="Do not record actions performed by bots."
                  checked={settings.ignoreBots}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      ignoreBots: checked,
                    }))
                  }
                />

                <SettingRow
                  icon={Settings2}
                  title="Ignore Webhooks"
                  description="Ignore webhook-generated events."
                  checked={settings.ignoreWebhooks}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      ignoreWebhooks: checked,
                    }))
                  }
                />

                <SettingRow
                  icon={Paperclip}
                  title="Save Attachments"
                  description="Keep attachment names and links."
                  checked={settings.saveAttachments}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      saveAttachments: checked,
                    }))
                  }
                />

                <SettingRow
                  icon={ImageIcon}
                  title="Save Images"
                  description="Include image previews inside the log."
                  checked={settings.saveImages}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      saveImages: checked,
                    }))
                  }
                />

                <SettingRow
                  icon={Sparkles}
                  title="AI Summary"
                  description="Generate a short explanation for complex events."
                  checked={settings.aiSummary}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      aiSummary: checked,
                    }))
                  }
                />

                <SettingRow
                  icon={Radio}
                  title="Compact Mode"
                  description="Use a smaller embed with essential data only."
                  checked={settings.compactMode}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      compactMode: checked,
                    }))
                  }
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Discord Preview</p>
                  <Badge variant="secondary">Live</Badge>
                </div>

                <div className="rounded-xl border border-border bg-[#313338] p-4 text-white">
                  <div
                    className="border-s-4 ps-3"
                    style={{ borderColor: settings.color }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold">
                        T
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          TOX
                          <span className="ms-1 rounded bg-[#5865F2] px-1 py-0.5 text-[9px]">
                            APP
                          </span>
                        </p>
                        <p className="text-[10px] text-zinc-400">Today at 7:42 PM</p>
                      </div>
                    </div>

                    <h4 className="mt-3 text-sm font-semibold">
                      {selectedEvent.title}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-zinc-300">
                      {selectedEvent.description}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-semibold">Channel</p>
                        <p className="text-zinc-400">{selectedChannel ? `#${selectedChannel.name}` : "Not selected"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Event ID</p>
                        <p className="truncate text-zinc-400">
                          {selectedEvent.id}
                        </p>
                      </div>
                    </div>

                    {settings.aiSummary && (
                      <div className="mt-3 rounded-lg bg-white/5 p-2 text-xs text-zinc-300">
                        AI Summary: This event was processed normally and no
                        suspicious activity was detected.
                      </div>
                    )}

                    <p className="mt-3 text-[10px] text-zinc-500">
                      TOX Event System
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3 text-xs text-emerald-300">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => void testLog()}
                  disabled={
                    testing ||
                    saving ||
                    settingsLoading ||
                    !settings.channel
                  }
                >
                  <Send
                    className={cn(
                      "size-4",
                      testing && "animate-pulse"
                    )}
                  />
                  {testing ? "Sending..." : "Test Log"}
                </Button>

                <Button
                  onClick={() => void saveChanges()}
                  disabled={
                    saving ||
                    testing ||
                    settingsLoading
                  }
                >
                  {saved ? (
                    <>
                      <Check className="size-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save
                        className={cn(
                          "size-4",
                          saving && "animate-pulse"
                        )}
                      />
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </div>
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
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </Card>
  )
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: ElementType
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </span>
      {children}
    </label>
  )
}

function SettingRow({
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
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}