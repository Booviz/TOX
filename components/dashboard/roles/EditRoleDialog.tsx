"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Check,
  Loader2,
  Palette,
  Search,
  Shield,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type {
  PermissionItem,
  RolePermissionGroup,
  ServerRole,
} from "./types"

type EditRoleDialogProps = {
  guildId: string
  role: ServerRole | null
  open: boolean
  onClose: () => void
  onUpdated: (role: ServerRole) => void
}

type RoleActionResponse = {
  success: boolean
  error?: string
  message?: string
  role?: ServerRole
}

const PERMISSIONS: PermissionItem[] = [
  { id: "ViewChannel", label: "View Channels" },
  { id: "ManageChannels", label: "Manage Channels" },
  { id: "ManageRoles", label: "Manage Roles" },
  { id: "ManageGuild", label: "Manage Server" },
  { id: "ManageWebhooks", label: "Manage Webhooks" },
  { id: "ManageEmojisAndStickers", label: "Manage Emojis and Stickers" },
  { id: "ViewAuditLog", label: "View Audit Log" },
  { id: "ViewGuildInsights", label: "View Server Insights" },
  { id: "Administrator", label: "Administrator" },
  { id: "CreateInstantInvite", label: "Create Invite" },
  { id: "ChangeNickname", label: "Change Nickname" },
  { id: "ManageNicknames", label: "Manage Nicknames" },
  { id: "KickMembers", label: "Kick Members" },
  { id: "BanMembers", label: "Ban Members" },
  { id: "ModerateMembers", label: "Timeout Members" },
  { id: "SendMessages", label: "Send Messages" },
  { id: "SendMessagesInThreads", label: "Send Messages in Threads" },
  { id: "CreatePublicThreads", label: "Create Public Threads" },
  { id: "CreatePrivateThreads", label: "Create Private Threads" },
  { id: "ManageThreads", label: "Manage Threads" },
  { id: "EmbedLinks", label: "Embed Links" },
  { id: "AttachFiles", label: "Attach Files" },
  { id: "AddReactions", label: "Add Reactions" },
  { id: "UseExternalEmojis", label: "Use External Emojis" },
  { id: "UseExternalStickers", label: "Use External Stickers" },
  { id: "MentionEveryone", label: "Mention Everyone" },
  { id: "ManageMessages", label: "Manage Messages" },
  { id: "ReadMessageHistory", label: "Read Message History" },
  { id: "UseApplicationCommands", label: "Use Application Commands" },
  { id: "SendTTSMessages", label: "Send TTS Messages" },
  { id: "Connect", label: "Connect" },
  { id: "Speak", label: "Speak" },
  { id: "Stream", label: "Video" },
  { id: "UseVAD", label: "Use Voice Activity" },
  { id: "PrioritySpeaker", label: "Priority Speaker" },
  { id: "MuteMembers", label: "Mute Members" },
  { id: "DeafenMembers", label: "Deafen Members" },
  { id: "MoveMembers", label: "Move Members" },
  { id: "RequestToSpeak", label: "Request to Speak" },
  { id: "CreateEvents", label: "Create Events" },
  { id: "ManageEvents", label: "Manage Events" },
]

const GROUPS: RolePermissionGroup[] = [
  {
    id: "general",
    label: "General Server",
    permissions: [
      "ViewChannel",
      "ManageChannels",
      "ManageRoles",
      "ManageGuild",
      "ManageWebhooks",
      "ManageEmojisAndStickers",
      "ViewAuditLog",
      "ViewGuildInsights",
      "Administrator",
    ],
  },
  {
    id: "membership",
    label: "Membership",
    permissions: [
      "CreateInstantInvite",
      "ChangeNickname",
      "ManageNicknames",
      "KickMembers",
      "BanMembers",
      "ModerateMembers",
    ],
  },
  {
    id: "text",
    label: "Text Channels",
    permissions: [
      "SendMessages",
      "SendMessagesInThreads",
      "CreatePublicThreads",
      "CreatePrivateThreads",
      "ManageThreads",
      "EmbedLinks",
      "AttachFiles",
      "AddReactions",
      "UseExternalEmojis",
      "UseExternalStickers",
      "MentionEveryone",
      "ManageMessages",
      "ReadMessageHistory",
      "UseApplicationCommands",
      "SendTTSMessages",
    ],
  },
  {
    id: "voice",
    label: "Voice Channels",
    permissions: [
      "Connect",
      "Speak",
      "Stream",
      "UseVAD",
      "PrioritySpeaker",
      "MuteMembers",
      "DeafenMembers",
      "MoveMembers",
      "RequestToSpeak",
    ],
  },
  {
    id: "events",
    label: "Events",
    permissions: ["CreateEvents", "ManageEvents"],
  },
]

export function EditRoleDialog({
  guildId,
  role,
  open,
  onClose,
  onUpdated,
}: EditRoleDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#8b5cf6")
  const [hoist, setHoist] = useState(false)
  const [mentionable, setMentionable] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [permissionSearch, setPermissionSearch] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !role) return

    setName(role.name)
    setColor(!role.color || role.color === "#000000" ? "#8b5cf6" : role.color)
    setHoist(role.hoist)
    setMentionable(role.mentionable)
    setSelectedPermissions(role.permissions ?? [])
    setPermissionSearch("")
    setSubmitting(false)
    setError(null)
    setSuccess(null)

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [open, role])

  const permissionMap = useMemo(
    () => new Map(PERMISSIONS.map((permission) => [permission.id, permission])),
    []
  )

  const filteredGroups = useMemo(() => {
    const query = permissionSearch.trim().toLowerCase()

    if (!query) return GROUPS

    return GROUPS.map((group) => ({
      ...group,
      permissions: group.permissions.filter((permissionId) => {
        const permission = permissionMap.get(permissionId)

        return (
          permission?.label.toLowerCase().includes(query) ||
          permissionId.toLowerCase().includes(query)
        )
      }),
    })).filter((group) => group.permissions.length > 0)
  }, [permissionSearch, permissionMap])

  function togglePermission(permissionId: string) {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((item) => item !== permissionId)
        : [...current, permissionId]
    )
  }

  function toggleGroup(group: RolePermissionGroup) {
    const allSelected = group.permissions.every((permission) =>
      selectedPermissions.includes(permission)
    )

    if (allSelected) {
      setSelectedPermissions((current) =>
        current.filter((permission) => !group.permissions.includes(permission))
      )
      return
    }

    setSelectedPermissions((current) => [
      ...new Set([...current, ...group.permissions]),
    ])
  }

  async function submit() {
    if (!role) return

    const cleanName = name.trim()

    if (!cleanName) {
      setError("Role name is required.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/dashboard/${guildId}/roles`, {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          roleId: role.id,
          action: "update",
          name: cleanName,
          color,
          hoist,
          mentionable,
          permissions: selectedPermissions,
          reason: "Role updated from TOX dashboard",
        }),
      })

      const responseText = await response.text()
      let data: RoleActionResponse

      try {
        data = responseText
          ? (JSON.parse(responseText) as RoleActionResponse)
          : { success: response.ok }
      } catch {
        throw new Error("The server returned invalid JSON.")
      }

      if (!response.ok || !data.success || !data.role) {
        throw new Error(data.error ?? data.message ?? "Failed to update role.")
      }

      setSuccess(data.message ?? "Role updated successfully.")
      onUpdated(data.role)
      window.setTimeout(onClose, 700)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update role."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !role) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => {
          if (!submitting) onClose()
        }}
        aria-label="Close edit role dialog"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Edit Role</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Update role appearance, settings and permissions.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={submitting}
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="overflow-y-auto">
          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-border bg-background/35 p-5">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <h3 className="font-semibold">Role appearance</h3>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[1fr_220px]">
                <label>
                  <span className="text-xs font-medium">Role name</span>
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value.slice(0, 100))
                    }
                    maxLength={100}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label>
                  <span className="text-xs font-medium">Role color</span>
                  <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="size-7 cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm uppercase">{color}</span>
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background/35 p-5">
              <h3 className="font-semibold">Display settings</h3>

              <div className="mt-4 space-y-3">
                <Toggle
                  label="Display separately"
                  description="Show members with this role separately in the member list."
                  value={hoist}
                  onChange={() => setHoist((current) => !current)}
                />

                <Toggle
                  label="Allow mentions"
                  description="Allow members to mention this role."
                  value={mentionable}
                  onChange={() => setMentionable((current) => !current)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background/35 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Permissions</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedPermissions.length} permissions selected
                  </p>
                </div>

                <div className="relative w-full md:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={permissionSearch}
                    onChange={(event) => setPermissionSearch(event.target.value)}
                    placeholder="Search permissions..."
                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {filteredGroups.map((group) => {
                  const selectedCount = group.permissions.filter((permission) =>
                    selectedPermissions.includes(permission)
                  ).length

                  return (
                    <div key={group.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {group.label}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {selectedCount}/{group.permissions.length} selected
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleGroup(group)}
                          className="text-xs font-medium text-primary"
                        >
                          {selectedCount === group.permissions.length
                            ? "Clear"
                            : "Select all"}
                        </button>
                      </div>

                      <div className="grid gap-2 md:grid-cols-2">
                        {group.permissions.map((permissionId) => {
                          const permission = permissionMap.get(permissionId)
                          const selected =
                            selectedPermissions.includes(permissionId)
                          const dangerous = permissionId === "Administrator"

                          return (
                            <button
                              key={permissionId}
                              type="button"
                              onClick={() => togglePermission(permissionId)}
                              className={cn(
                                "flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                                selected
                                  ? dangerous
                                    ? "border-red-500/40 bg-red-500/[0.08]"
                                    : "border-primary/40 bg-primary/[0.08]"
                                  : "border-border bg-card hover:bg-muted/40"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-5 shrink-0 items-center justify-center rounded-md border",
                                  selected
                                    ? dangerous
                                      ? "border-red-500 bg-red-500 text-white"
                                      : "border-primary bg-primary text-primary-foreground"
                                    : "border-border"
                                )}
                              >
                                {selected && <Check className="size-3.5" />}
                              </span>

                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  dangerous && selected && "text-red-300"
                                )}
                              >
                                {permission?.label ?? permissionId}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {filteredGroups.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
                    <Search className="mx-auto size-8 text-muted-foreground/30" />
                    <p className="mt-3 text-sm font-medium">
                      No permissions found
                    </p>
                  </div>
                )}
              </div>
            </section>

            {error && (
              <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {selectedPermissions.length} permissions enabled
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="gap-2"
              onClick={() => void submit()}
              disabled={submitting || !name.trim()}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </footer>
      </section>
    </div>
  )
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          value ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-4 rounded-full bg-white transition",
            value ? "left-6" : "left-1"
          )}
        />
      </span>
    </button>
  )
}