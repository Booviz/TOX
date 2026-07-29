"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  AlertTriangle,
  Check,
  Loader2,
  Save,
  Settings,
  Shield,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AdvancedTab } from "./AdvancedTab"
import { GeneralTab } from "./GeneralTab"
import {
  PermissionsTab,
  type PermissionTargetOption,
} from "./PermissionsTab"

import type {
  ChannelKind,
  ChannelPermissionOverwrite,
  EditChannelDialogProps,
  ServerChannel,
} from "./types"

type DialogTab =
  | "general"
  | "permissions"
  | "advanced"

type ChannelActionResponse = {
  success: boolean
  error?: string
  message?: string
  channel?: ServerChannel
}

type RolesResponse = {
  success?: boolean
  roles?: Array<{
    id: string
    name: string
    color?: string | null
    managed?: boolean
  }>
}

type MembersResponse = {
  success?: boolean
  members?: Array<{
    id: string
    username?: string
    displayName?: string
    avatar?: string | null
  }>
}

const DEFAULT_BITRATE = 64000

export function EditChannelDialog({
  guildId,
  open,
  onClose,
  channel,
  categories,
  onUpdated,
}: EditChannelDialogProps) {
  const [tab, setTab] =
    useState<DialogTab>("general")

  const [name, setName] =
    useState("")
  const [kind, setKind] =
    useState<ChannelKind>("text")
  const [parentId, setParentId] =
    useState("")
  const [position, setPosition] =
    useState(0)
  const [topic, setTopic] =
    useState("")
  const [nsfw, setNsfw] =
    useState(false)
  const [slowmode, setSlowmode] =
    useState(0)
  const [userLimit, setUserLimit] =
    useState(0)
  const [bitrate, setBitrate] =
    useState(DEFAULT_BITRATE)

  const [
    permissionOverwrites,
    setPermissionOverwrites,
  ] = useState<
    ChannelPermissionOverwrite[]
  >([])

  const [
    availableTargets,
    setAvailableTargets,
  ] = useState<
    PermissionTargetOption[]
  >([])

  const [submitting, setSubmitting] =
    useState(false)
  const [
    loadingTargets,
    setLoadingTargets,
  ] = useState(false)
  const [syncing, setSyncing] =
    useState(false)
  const [error, setError] =
    useState<string | null>(null)
  const [success, setSuccess] =
    useState<string | null>(null)

  useEffect(() => {
    if (!open || !channel) {
      return
    }

    setTab("general")
    setName(channel.name)
    setKind(channel.kind)
    setParentId(
      channel.parentId ?? ""
    )
    setPosition(
      channel.position ?? 0
    )
    setTopic(channel.topic ?? "")
    setNsfw(
      channel.nsfw ?? false
    )
    setSlowmode(
      channel.rateLimitPerUser ?? 0
    )
    setUserLimit(
      channel.userLimit ?? 0
    )
    setBitrate(
      channel.bitrate ??
        DEFAULT_BITRATE
    )
    setPermissionOverwrites(
      channel.permissionOverwrites ??
        []
    )
    setSubmitting(false)
    setSyncing(false)
    setError(null)
    setSuccess(null)

    document.body.style.overflow =
      "hidden"

    return () => {
      document.body.style.overflow =
        ""
    }
  }, [open, channel])

  useEffect(() => {
    if (!open || !channel) {
      return
    }

    const activeChannel = channel
    let cancelled = false

    async function loadTargets() {
      try {
        setLoadingTargets(true)

        const [
          rolesResponse,
          membersResponse,
        ] = await Promise.all([
          fetch(
            `/api/dashboard/${guildId}/roles`,
            {
              cache: "no-store",
              headers: {
                Accept:
                  "application/json",
              },
            }
          ),
          fetch(
            `/api/dashboard/${guildId}/members`,
            {
              cache: "no-store",
              headers: {
                Accept:
                  "application/json",
              },
            }
          ),
        ])

        const rolesText =
          await rolesResponse.text()
        const membersText =
          await membersResponse.text()

        let rolesData: RolesResponse = {}
        let membersData: MembersResponse =
          {}

        try {
          rolesData = rolesText
            ? (JSON.parse(
                rolesText
              ) as RolesResponse)
            : {}
        } catch {
          rolesData = {}
        }

        try {
          membersData = membersText
            ? (JSON.parse(
                membersText
              ) as MembersResponse)
            : {}
        } catch {
          membersData = {}
        }

        if (cancelled) {
          return
        }

        const roleTargets:
          PermissionTargetOption[] =
          (rolesData.roles ?? []).map(
            (role) => ({
              id: role.id,
              name: role.name,
              type: "role",
              color:
                role.color ?? null,
              managed:
                role.managed ?? false,
            })
          )

        const memberTargets:
          PermissionTargetOption[] =
          (membersData.members ??
            []).map((member) => ({
            id: member.id,
            name:
              member.displayName ??
              member.username ??
              member.id,
            type: "member",
            avatar:
              member.avatar ?? null,
          }))

        const fallbackTargets:
          PermissionTargetOption[] =
          (
            activeChannel.permissionOverwrites ??
            []
          ).map((overwrite) => ({
            id: overwrite.id,
            name:
              overwrite.name ??
              overwrite.id,
            type: overwrite.type,
          }))

        const merged = [
          ...roleTargets,
          ...memberTargets,
          ...fallbackTargets,
        ]

        const unique = Array.from(
          new Map(
            merged.map(
              (target) => [
                `${target.type}:${target.id}`,
                target,
              ]
            )
          ).values()
        )

        setAvailableTargets(unique)
      } catch (targetError) {
        console.error(
          "Failed to load permission targets:",
          targetError
        )

        const fallbackTargets =
          (
            activeChannel.permissionOverwrites ??
            []
          ).map((overwrite) => ({
            id: overwrite.id,
            name:
              overwrite.name ??
              overwrite.id,
            type: overwrite.type,
          }))

        if (!cancelled) {
          setAvailableTargets(
            fallbackTargets
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingTargets(false)
        }
      }
    }

    void loadTargets()

    return () => {
      cancelled = true
    }
  }, [open, channel, guildId])

  const hasChanges = useMemo(() => {
    if (!channel) {
      return false
    }

    return (
      name.trim() !== channel.name ||
      kind !== channel.kind ||
      parentId !==
        (channel.parentId ?? "") ||
      position !==
        (channel.position ?? 0) ||
      topic !==
        (channel.topic ?? "") ||
      nsfw !==
        (channel.nsfw ?? false) ||
      slowmode !==
        (channel.rateLimitPerUser ??
          0) ||
      userLimit !==
        (channel.userLimit ?? 0) ||
      bitrate !==
        (channel.bitrate ??
          DEFAULT_BITRATE) ||
      JSON.stringify(
        permissionOverwrites
      ) !==
        JSON.stringify(
          channel.permissionOverwrites ??
            []
        )
    )
  }, [
    channel,
    name,
    kind,
    parentId,
    position,
    topic,
    nsfw,
    slowmode,
    userLimit,
    bitrate,
    permissionOverwrites,
  ])

  async function submit() {
    if (!channel) {
      return
    }

    const cleanName = name.trim()

    if (!cleanName) {
      setError(
        "Channel name is required."
      )
      setTab("general")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/channels`,
        {
          method: "PATCH",
          cache: "no-store",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            channelId: channel.id,
            action: "update",
            name: cleanName,
            kind,
            parentId:
              parentId || null,
            position,
            topic,
            nsfw,
            rateLimitPerUser:
              slowmode,
            userLimit,
            bitrate,
            permissionOverwrites,
            reason:
              "Channel updated from TOX dashboard",
          }),
        }
      )

      const responseText =
        await response.text()

      let data:
        ChannelActionResponse

      try {
        data = responseText
          ? (JSON.parse(
              responseText
            ) as ChannelActionResponse)
          : {
              success: response.ok,
            }
      } catch {
        throw new Error(
          "The server returned invalid JSON."
        )
      }

      if (
        !response.ok ||
        !data.success ||
        !data.channel
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to update channel."
        )
      }

      setSuccess(
        data.message ??
          "Channel updated successfully."
      )

      onUpdated(data.channel)

      window.setTimeout(() => {
        onClose()
      }, 700)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update channel."
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function cloneChannel() {
    if (!channel) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/channels`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            channelId: channel.id,
            action: "clone",
            name: `${channel.name}-copy`,
            parentId:
              channel.parentId,
            topic: channel.topic,
            nsfw: channel.nsfw,
            rateLimitPerUser:
              channel.rateLimitPerUser,
            userLimit:
              channel.userLimit,
            bitrate:
              channel.bitrate,
            position:
              channel.position + 1,
            reason:
              "Channel cloned from TOX dashboard",
          }),
        }
      )

      const data =
        (await response.json()) as
          ChannelActionResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to clone channel."
        )
      }

      setSuccess(
        "Channel cloned successfully."
      )
    } catch (cloneError) {
      setError(
        cloneError instanceof Error
          ? cloneError.message
          : "Failed to clone channel."
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function syncPermissions() {
    if (!channel) {
      return
    }

    try {
      setSyncing(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/channels`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            channelId: channel.id,
            action:
              "sync-permissions",
            reason:
              "Permissions synced from TOX dashboard",
          }),
        }
      )

      const data =
        (await response.json()) as
          ChannelActionResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to sync permissions."
        )
      }

      if (data.channel) {
        setPermissionOverwrites(
          data.channel
            .permissionOverwrites ??
            []
        )
        onUpdated(data.channel)
      }

      setSuccess(
        "Permissions synced successfully."
      )
    } catch (syncError) {
      setError(
        syncError instanceof Error
          ? syncError.message
          : "Failed to sync permissions."
      )
    } finally {
      setSyncing(false)
    }
  }

  async function lockChannel() {
    if (!channel) {
      return
    }

    const everyoneOverwrite =
      permissionOverwrites.find(
        (overwrite) =>
          overwrite.id === guildId &&
          overwrite.type ===
            "role"
      )

    const nextOverwrites =
      permissionOverwrites.filter(
        (overwrite) =>
          overwrite.id !== guildId
      )

    nextOverwrites.push({
      id: guildId,
      type: "role",
      name:
        everyoneOverwrite?.name ??
        "@everyone",
      allow:
        everyoneOverwrite?.allow.filter(
          (permission) =>
            permission !==
            "SendMessages"
        ) ?? [],
      deny: [
        ...new Set([
          ...(everyoneOverwrite?.deny ??
            []),
          "SendMessages",
        ]),
      ],
    })

    setPermissionOverwrites(
      nextOverwrites
    )
    setTab("permissions")
    setSuccess(
      "Channel lock prepared. Press Save changes to apply it."
    )
  }

  function deleteChannel() {
    onClose()

    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(
          "tox:delete-channel",
          {
            detail: {
              channelId:
                channel?.id,
            },
          }
        )
      )
    }, 0)
  }

  if (!open || !channel) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => {
          if (
            !submitting &&
            !syncing
          ) {
            onClose()
          }
        }}
        aria-label="Close edit channel dialog"
      />

      <section className="relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Settings className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Edit Channel
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage {channel.name},
                permissions and advanced
                settings.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={
              submitting || syncing
            }
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-border bg-background/25 p-4 md:border-b-0 md:border-r">
            <nav className="space-y-2">
              <TabButton
                active={
                  tab === "general"
                }
                icon={
                  <Settings className="size-4" />
                }
                label="General"
                onClick={() =>
                  setTab("general")
                }
              />

              <TabButton
                active={
                  tab ===
                  "permissions"
                }
                icon={
                  <Shield className="size-4" />
                }
                label="Permissions"
                badge={
                  permissionOverwrites.length
                }
                loading={
                  loadingTargets
                }
                onClick={() =>
                  setTab(
                    "permissions"
                  )
                }
              />

              <TabButton
                active={
                  tab === "advanced"
                }
                icon={
                  <SlidersHorizontal className="size-4" />
                }
                label="Advanced"
                onClick={() =>
                  setTab("advanced")
                }
              />
            </nav>

            <div className="mt-6 rounded-xl border border-border bg-card p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Channel
              </p>

              <p className="mt-2 truncate text-sm font-semibold">
                {channel.name}
              </p>

              <p className="mt-1 truncate text-[10px] text-muted-foreground">
                {channel.id}
              </p>
            </div>
          </aside>

          <main className="min-h-0 overflow-y-auto p-5 md:p-6">
            {tab === "general" && (
              <GeneralTab
                name={name}
                setName={setName}
                kind={kind}
                setKind={setKind}
                parentId={parentId}
                setParentId={
                  setParentId
                }
                position={position}
                setPosition={
                  setPosition
                }
                topic={topic}
                setTopic={setTopic}
                nsfw={nsfw}
                setNsfw={setNsfw}
                slowmode={slowmode}
                setSlowmode={
                  setSlowmode
                }
                userLimit={userLimit}
                setUserLimit={
                  setUserLimit
                }
                bitrate={bitrate}
                setBitrate={
                  setBitrate
                }
                categories={categories}
                disabled={submitting}
              />
            )}

            {tab ===
              "permissions" && (
              <PermissionsTab
                overwrites={
                  permissionOverwrites
                }
                availableTargets={
                  availableTargets
                }
                disabled={
                  submitting ||
                  loadingTargets
                }
                onChange={
                  setPermissionOverwrites
                }
              />
            )}

            {tab === "advanced" && (
              <AdvancedTab
                disabled={submitting}
                syncing={syncing}
                onClone={() =>
                  void cloneChannel()
                }
                onSyncPermissions={() =>
                  void syncPermissions()
                }
                onLockChannel={
                  lockChannel
                }
                onDelete={
                  deleteChannel
                }
              />
            )}

            {error && (
              <div className="mt-5 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-5 flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </main>
        </div>

        <footer className="flex flex-col gap-3 border-t border-border bg-card/95 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {hasChanges
              ? "You have unsaved changes."
              : "No unsaved changes."}
          </p>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={
                submitting || syncing
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="gap-2"
              onClick={() =>
                void submit()
              }
              disabled={
                submitting ||
                syncing ||
                !name.trim()
              }
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              Save changes
            </Button>
          </div>
        </footer>
      </section>
    </div>
  )
}

function TabButton({
  active,
  icon,
  label,
  badge,
  loading = false,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  badge?: number
  loading?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      )}
    >
      {icon}

      <span className="min-w-0 flex-1">
        {label}
      </span>

      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : typeof badge ===
        "number" ? (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          {badge}
        </span>
      ) : null}
    </button>
  )
}