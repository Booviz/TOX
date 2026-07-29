"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Check,
  Loader2,
  Palette,
  Plus,
  Search,
  Shield,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type {
  CreateRoleDialogProps,
  PermissionItem,
  RolePermissionGroup,
  ServerRole,
} from "./types"

const DEFAULT_COLOR = "#8b5cf6"

const PERMISSIONS: PermissionItem[] = [
  { id: "ViewChannel", label: "View Channels" },
  { id: "ManageChannels", label: "Manage Channels" },
  { id: "ManageRoles", label: "Manage Roles" },
  { id: "ManageGuild", label: "Manage Server" },
  { id: "ViewAuditLog", label: "View Audit Log" },
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
  { id: "MentionEveryone", label: "Mention Everyone" },
  { id: "ManageMessages", label: "Manage Messages" },
  { id: "ReadMessageHistory", label: "Read Message History" },
  { id: "UseApplicationCommands", label: "Use Application Commands" },
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
    label: "General",
    permissions: [
      "ViewChannel",
      "ManageChannels",
      "ManageRoles",
      "ManageGuild",
      "ViewAuditLog",
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
      "MentionEveryone",
      "ManageMessages",
      "ReadMessageHistory",
      "UseApplicationCommands",
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

type CreateRoleResponse = {
  success: boolean
  error?: string
  message?: string
  role?: ServerRole
}

export function CreateRoleDialog({
  guildId,
  open,
  onClose,
  onCreated,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [hoist, setHoist] = useState(false)
  const [mentionable, setMentionable] = useState(false)
  const [selectedPermissions, setSelectedPermissions] =
    useState<string[]>([])
  const [search, setSearch] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setName("")
    setColor(DEFAULT_COLOR)
    setHoist(false)
    setMentionable(false)
    setSelectedPermissions([])
    setSearch("")
    setSubmitting(false)
    setError(null)
    setSuccess(null)

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const permissionMap = useMemo(
    () =>
      new Map(
        PERMISSIONS.map((permission) => [
          permission.id,
          permission,
        ])
      ),
    []
  )

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return GROUPS

    return GROUPS.map((group) => ({
      ...group,
      permissions: group.permissions.filter((id) => {
        const permission = permissionMap.get(id)

        return (
          permission?.label.toLowerCase().includes(query) ||
          id.toLowerCase().includes(query)
        )
      }),
    })).filter((group) => group.permissions.length > 0)
  }, [search, permissionMap])

  function togglePermission(permissionId: string) {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((item) => item !== permissionId)
        : [...current, permissionId]
    )
  }

  async function submit() {
    const cleanName = name.trim()

    if (!cleanName) {
      setError("Role name is required.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/roles`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            color,
            hoist,
            mentionable,
            permissions: selectedPermissions,
            reason: "Role created from TOX dashboard",
          }),
        }
      )

      const raw = await response.text()

      let data: CreateRoleResponse

      try {
        data = raw
          ? (JSON.parse(raw) as CreateRoleResponse)
          : { success: response.ok }
      } catch {
        throw new Error("The server returned invalid JSON.")
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? data.message ?? "Failed to create role."
        )
      }

      if (!data.role) {
        throw new Error("The created role was not returned.")
      }

      setSuccess(data.message ?? "Role created successfully.")
      onCreated(data.role)

      window.setTimeout(() => {
        onClose()
      }, 700)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create role."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => {
          if (!submitting) onClose()
        }}
        aria-label="Close create role dialog"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Create Role</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure appearance, display and permissions.
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
                    placeholder="Example: Moderator"
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

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <div
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{
                    color,
                    backgroundColor: `${color}1f`,
                  }}
                >
                  <Shield className="size-5" />
                </div>

                <div>
                  <p className="font-semibold" style={{ color }}>
                    {name.trim() || "New Role"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Role preview
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background/35 p-5">
              <h3 className="font-semibold">Display settings</h3>

              <div className="mt-4 space-y-3">
                {[
                  {
                    label: "Display separately",
                    description:
                      "Show members with this role separately.",
                    value: hoist,
                    onClick: () => setHoist((current) => !current),
                  },
                  {
                    label: "Allow mentions",
                    description:
                      "Allow members to mention this role.",
                    value: mentionable,
                    onClick: () =>
                      setMentionable((current) => !current),
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "relative h-6 w-11 rounded-full transition",
                        item.value ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-4 rounded-full bg-white transition",
                          item.value ? "left-6" : "left-1"
                        )}
                      />
                    </span>
                  </button>
                ))}
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
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search permissions..."
                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {filteredGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </p>

                    <div className="grid gap-2 md:grid-cols-2">
                      {group.permissions.map((permissionId) => {
                        const permission = permissionMap.get(permissionId)
                        const selected =
                          selectedPermissions.includes(permissionId)

                        return (
                          <button
                            key={permissionId}
                            type="button"
                            onClick={() =>
                              togglePermission(permissionId)
                            }
                            className={cn(
                              "flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                              selected
                                ? "border-primary/40 bg-primary/[0.08]"
                                : "border-border bg-card hover:bg-muted/40"
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-5 items-center justify-center rounded-md border",
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border"
                              )}
                            >
                              {selected && <Check className="size-3.5" />}
                            </span>

                            <span className="text-sm font-medium">
                              {permission?.label ?? permissionId}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
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

        <footer className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
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
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Create Role
          </Button>
        </footer>
      </section>
    </div>
  )
}