"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  AlertTriangle,
  Plus,
  Shield,
  Trash2,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  PermissionCard,
  type PermissionState,
} from "./PermissionCard"

import {
  PermissionSearch,
} from "./PermissionSearch"

import {
  PermissionSelector,
  type PermissionTarget,
} from "./PermissionSelector"

import type {
  ChannelPermissionOverwrite,
} from "./types"

export type PermissionDefinition = {
  id: string
  label: string
  description: string
  group:
    | "general"
    | "membership"
    | "text"
    | "voice"
    | "events"
}

export type PermissionTargetOption = {
  id: string
  name: string
  type: "role" | "member"
  color?: string | null
  avatar?: string | null
  managed?: boolean
}

export type PermissionsTabProps = {
  overwrites: ChannelPermissionOverwrite[]
  availableTargets: PermissionTargetOption[]
  disabled?: boolean
  onChange: (
    overwrites: ChannelPermissionOverwrite[]
  ) => void
}

type EditableOverwrite = {
  id: string
  type: "role" | "member"
  name?: string
  allow: string[]
  deny: string[]
}

const PERMISSIONS: PermissionDefinition[] = [
  {
    id: "ViewChannel",
    label: "View Channel",
    description:
      "Allows members to view this channel.",
    group: "general",
  },
  {
    id: "ManageChannels",
    label: "Manage Channel",
    description:
      "Allows members to edit and delete this channel.",
    group: "general",
  },
  {
    id: "ManageRoles",
    label: "Manage Permissions",
    description:
      "Allows members to edit channel permission overrides.",
    group: "general",
  },
  {
    id: "ManageWebhooks",
    label: "Manage Webhooks",
    description:
      "Allows members to create and manage webhooks.",
    group: "general",
  },
  {
    id: "CreateInstantInvite",
    label: "Create Invite",
    description:
      "Allows members to create invite links for this channel.",
    group: "membership",
  },
  {
    id: "ChangeNickname",
    label: "Change Nickname",
    description:
      "Allows members to change their own nickname.",
    group: "membership",
  },
  {
    id: "ManageNicknames",
    label: "Manage Nicknames",
    description:
      "Allows members to change other members' nicknames.",
    group: "membership",
  },
  {
    id: "KickMembers",
    label: "Kick Members",
    description:
      "Allows members to remove users from the server.",
    group: "membership",
  },
  {
    id: "BanMembers",
    label: "Ban Members",
    description:
      "Allows members to ban users from the server.",
    group: "membership",
  },
  {
    id: "ModerateMembers",
    label: "Timeout Members",
    description:
      "Allows members to apply communication timeouts.",
    group: "membership",
  },
  {
    id: "SendMessages",
    label: "Send Messages",
    description:
      "Allows members to send messages in this channel.",
    group: "text",
  },
  {
    id: "SendMessagesInThreads",
    label: "Send Messages in Threads",
    description:
      "Allows members to send messages inside threads.",
    group: "text",
  },
  {
    id: "CreatePublicThreads",
    label: "Create Public Threads",
    description:
      "Allows members to create public threads.",
    group: "text",
  },
  {
    id: "CreatePrivateThreads",
    label: "Create Private Threads",
    description:
      "Allows members to create private threads.",
    group: "text",
  },
  {
    id: "ManageThreads",
    label: "Manage Threads",
    description:
      "Allows members to manage and delete threads.",
    group: "text",
  },
  {
    id: "EmbedLinks",
    label: "Embed Links",
    description:
      "Shows previews for links posted in messages.",
    group: "text",
  },
  {
    id: "AttachFiles",
    label: "Attach Files",
    description:
      "Allows members to upload files and images.",
    group: "text",
  },
  {
    id: "AddReactions",
    label: "Add Reactions",
    description:
      "Allows members to add reactions to messages.",
    group: "text",
  },
  {
    id: "UseExternalEmojis",
    label: "Use External Emojis",
    description:
      "Allows members to use emojis from other servers.",
    group: "text",
  },
  {
    id: "UseExternalStickers",
    label: "Use External Stickers",
    description:
      "Allows members to use stickers from other servers.",
    group: "text",
  },
  {
    id: "MentionEveryone",
    label: "Mention Everyone",
    description:
      "Allows members to mention everyone, here and all roles.",
    group: "text",
  },
  {
    id: "ManageMessages",
    label: "Manage Messages",
    description:
      "Allows members to delete and pin other messages.",
    group: "text",
  },
  {
    id: "ReadMessageHistory",
    label: "Read Message History",
    description:
      "Allows members to view previous messages.",
    group: "text",
  },
  {
    id: "SendTTSMessages",
    label: "Send TTS Messages",
    description:
      "Allows members to send text-to-speech messages.",
    group: "text",
  },
  {
    id: "UseApplicationCommands",
    label: "Use Application Commands",
    description:
      "Allows members to use slash and application commands.",
    group: "text",
  },
  {
    id: "Connect",
    label: "Connect",
    description:
      "Allows members to connect to this voice channel.",
    group: "voice",
  },
  {
    id: "Speak",
    label: "Speak",
    description:
      "Allows members to speak in this voice channel.",
    group: "voice",
  },
  {
    id: "Stream",
    label: "Video",
    description:
      "Allows members to share video and stream their screen.",
    group: "voice",
  },
  {
    id: "UseVAD",
    label: "Use Voice Activity",
    description:
      "Allows members to use voice activity detection.",
    group: "voice",
  },
  {
    id: "PrioritySpeaker",
    label: "Priority Speaker",
    description:
      "Reduces other users' volume while this member speaks.",
    group: "voice",
  },
  {
    id: "MuteMembers",
    label: "Mute Members",
    description:
      "Allows members to server mute other users.",
    group: "voice",
  },
  {
    id: "DeafenMembers",
    label: "Deafen Members",
    description:
      "Allows members to server deafen other users.",
    group: "voice",
  },
  {
    id: "MoveMembers",
    label: "Move Members",
    description:
      "Allows members to move users between voice channels.",
    group: "voice",
  },
  {
    id: "RequestToSpeak",
    label: "Request to Speak",
    description:
      "Allows members to request speaking access in stages.",
    group: "voice",
  },
  {
    id: "CreateEvents",
    label: "Create Events",
    description:
      "Allows members to create scheduled server events.",
    group: "events",
  },
  {
    id: "ManageEvents",
    label: "Manage Events",
    description:
      "Allows members to edit and cancel scheduled events.",
    group: "events",
  },
]

const GROUP_LABELS: Record<
  PermissionDefinition["group"],
  string
> = {
  general: "General Channel",
  membership: "Membership",
  text: "Text Permissions",
  voice: "Voice Permissions",
  events: "Events",
}

export function PermissionsTab({
  overwrites,
  availableTargets,
  disabled = false,
  onChange,
}: PermissionsTabProps) {
  const [
    editableOverwrites,
    setEditableOverwrites,
  ] = useState<EditableOverwrite[]>([])

  const [
    selectedTargetId,
    setSelectedTargetId,
  ] = useState<string | null>(null)

  const [
    targetSearch,
    setTargetSearch,
  ] = useState("")

  const [
    permissionSearch,
    setPermissionSearch,
  ] = useState("")

  const [
    showTargetPicker,
    setShowTargetPicker,
  ] = useState(false)

  useEffect(() => {
    const normalized =
      overwrites.map((overwrite) => ({
        id: overwrite.id,
        type: overwrite.type,
        name: overwrite.name,
        allow: [
          ...new Set(
            overwrite.allow ?? []
          ),
        ],
        deny: [
          ...new Set(
            overwrite.deny ?? []
          ),
        ],
      }))

    setEditableOverwrites(normalized)

    setSelectedTargetId(
      (current) => {
        if (
          current &&
          normalized.some(
            (overwrite) =>
              overwrite.id === current
          )
        ) {
          return current
        }

        return (
          normalized[0]?.id ?? null
        )
      }
    )
  }, [overwrites])

  const targetMap = useMemo(
    () =>
      new Map(
        availableTargets.map(
          (target) => [
            target.id,
            target,
          ]
        )
      ),
    [availableTargets]
  )

  const selectedOverwrite =
    useMemo(
      () =>
        editableOverwrites.find(
          (overwrite) =>
            overwrite.id ===
            selectedTargetId
        ) ?? null,
      [
        editableOverwrites,
        selectedTargetId,
      ]
    )

  const selectorTargets =
    useMemo<PermissionTarget[]>(
      () =>
        editableOverwrites.map(
          (overwrite) => {
            const target =
              targetMap.get(
                overwrite.id
              )

            return {
              id: overwrite.id,
              name:
                overwrite.name ??
                target?.name ??
                overwrite.id,
              type: overwrite.type,
              color:
                target?.color ?? null,
              avatar:
                target?.avatar ?? null,
              managed:
                target?.managed ??
                false,
            }
          }
        ),
      [
        editableOverwrites,
        targetMap,
      ]
    )

  const addableTargets =
    useMemo(
      () =>
        availableTargets.filter(
          (target) =>
            !editableOverwrites.some(
              (overwrite) =>
                overwrite.id ===
                target.id
            )
        ),
      [
        availableTargets,
        editableOverwrites,
      ]
    )

  const filteredPermissions =
    useMemo(() => {
      const query =
        permissionSearch
          .trim()
          .toLowerCase()

      if (!query) {
        return PERMISSIONS
      }

      return PERMISSIONS.filter(
        (permission) =>
          permission.label
            .toLowerCase()
            .includes(query) ||
          permission.id
            .toLowerCase()
            .includes(query) ||
          permission.description
            .toLowerCase()
            .includes(query)
      )
    }, [permissionSearch])
    function emitChange(
    nextOverwrites: EditableOverwrite[]
  ) {
    setEditableOverwrites(
      nextOverwrites
    )

    onChange(
      nextOverwrites.map(
        (overwrite) => ({
          id: overwrite.id,
          type: overwrite.type,
          name: overwrite.name,
          allow: overwrite.allow,
          deny: overwrite.deny,
        })
      )
    )
  }

  function addTarget(
    target: PermissionTargetOption
  ) {
    const nextOverwrite:
      EditableOverwrite = {
      id: target.id,
      type: target.type,
      name: target.name,
      allow: [],
      deny: [],
    }

    const nextOverwrites = [
      ...editableOverwrites,
      nextOverwrite,
    ]

    emitChange(nextOverwrites)
    setSelectedTargetId(
      target.id
    )
    setShowTargetPicker(false)
    setTargetSearch("")
  }

  function removeTarget(
    targetId: string
  ) {
    const nextOverwrites =
      editableOverwrites.filter(
        (overwrite) =>
          overwrite.id !== targetId
      )

    emitChange(nextOverwrites)

    if (
      selectedTargetId ===
      targetId
    ) {
      setSelectedTargetId(
        nextOverwrites[0]?.id ??
          null
      )
    }
  }

  function getPermissionState(
    permissionId: string
  ): PermissionState {
    if (!selectedOverwrite) {
      return "neutral"
    }

    if (
      selectedOverwrite.allow.includes(
        permissionId
      )
    ) {
      return "allow"
    }

    if (
      selectedOverwrite.deny.includes(
        permissionId
      )
    ) {
      return "deny"
    }

    return "neutral"
  }

  function setPermissionState(
    permissionId: string,
    state: PermissionState
  ) {
    if (!selectedOverwrite) {
      return
    }

    const nextOverwrites =
      editableOverwrites.map(
        (overwrite) => {
          if (
            overwrite.id !==
            selectedOverwrite.id
          ) {
            return overwrite
          }

          const allow =
            overwrite.allow.filter(
              (permission) =>
                permission !==
                permissionId
            )

          const deny =
            overwrite.deny.filter(
              (permission) =>
                permission !==
                permissionId
            )

          if (state === "allow") {
            allow.push(permissionId)
          }

          if (state === "deny") {
            deny.push(permissionId)
          }

          return {
            ...overwrite,
            allow: [
              ...new Set(allow),
            ],
            deny: [
              ...new Set(deny),
            ],
          }
        }
      )

    emitChange(nextOverwrites)
  }

  function clearSelectedPermissions() {
    if (!selectedOverwrite) {
      return
    }

    const nextOverwrites =
      editableOverwrites.map(
        (overwrite) =>
          overwrite.id ===
          selectedOverwrite.id
            ? {
                ...overwrite,
                allow: [],
                deny: [],
              }
            : overwrite
      )

    emitChange(nextOverwrites)
  }

  function setGroupState(
    group:
      PermissionDefinition["group"],
    state: PermissionState
  ) {
    if (!selectedOverwrite) {
      return
    }

    const groupPermissions =
      PERMISSIONS.filter(
        (permission) =>
          permission.group ===
          group
      ).map(
        (permission) =>
          permission.id
      )

    const nextOverwrites =
      editableOverwrites.map(
        (overwrite) => {
          if (
            overwrite.id !==
            selectedOverwrite.id
          ) {
            return overwrite
          }

          let allow =
            overwrite.allow.filter(
              (permission) =>
                !groupPermissions.includes(
                  permission
                )
            )

          let deny =
            overwrite.deny.filter(
              (permission) =>
                !groupPermissions.includes(
                  permission
                )
            )

          if (state === "allow") {
            allow = [
              ...allow,
              ...groupPermissions,
            ]
          }

          if (state === "deny") {
            deny = [
              ...deny,
              ...groupPermissions,
            ]
          }

          return {
            ...overwrite,
            allow: [
              ...new Set(allow),
            ],
            deny: [
              ...new Set(deny),
            ],
          }
        }
      )

    emitChange(nextOverwrites)
  }

  const selectedTarget =
    selectedOverwrite
      ? targetMap.get(
          selectedOverwrite.id
        ) ?? {
          id: selectedOverwrite.id,
          name:
            selectedOverwrite.name ??
            selectedOverwrite.id,
          type:
            selectedOverwrite.type,
        }
      : null

  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">
                Permission targets
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Manage role and member
                overrides for this
                channel.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              className="gap-2"
              disabled={
                disabled ||
                addableTargets.length ===
                  0
              }
              onClick={() =>
                setShowTargetPicker(
                  true
                )
              }
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>

        <PermissionSelector
          targets={
            selectorTargets
          }
          selectedId={
            selectedTargetId
          }
          search={targetSearch}
          disabled={disabled}
          onSearchChange={
            setTargetSearch
          }
          onSelect={(target) =>
            setSelectedTargetId(
              target.id
            )
          }
          onRemove={(target) =>
            removeTarget(
              target.id
            )
          }
        />

        {showTargetPicker && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">
                  Add role or member
                </h4>

                <p className="mt-1 text-xs text-muted-foreground">
                  Choose a target to
                  create a new override.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTargetPicker(
                    false
                  )
                }
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {addableTargets.length ===
              0 ? (
                <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Every available target
                  already has an
                  override.
                </p>
              ) : (
                addableTargets.map(
                  (target) => (
                    <button
                      key={`${target.type}:${target.id}`}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        addTarget(target)
                      }
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-3 text-left transition hover:bg-muted/40"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {target.type ===
                        "role" ? (
                          <Shield className="size-4" />
                        ) : (
                          <User className="size-4" />
                        )}
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {target.name}
                        </span>

                        <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                          {target.id}
                        </span>
                      </span>
                    </button>
                  )
                )
              )}
            </div>
          </div>
        )}
      </aside>
      <main className="space-y-5">
        {!selectedOverwrite ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <AlertTriangle className="mx-auto size-10 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold">
              Select a role or member
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a permission target from the left to edit its overrides.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {selectedTarget?.type === "role" ? (
                      <Shield className="size-5" />
                    ) : (
                      <User className="size-5" />
                    )}
                  </span>

                  <div>
                    <h3 className="font-semibold">
                      {selectedTarget?.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedTarget?.type === "role"
                        ? "Role permission override"
                        : "Member permission override"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={disabled}
                    onClick={clearSelectedPermissions}
                  >
                    Reset
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={disabled}
                    onClick={() =>
                      removeTarget(selectedOverwrite.id)
                    }
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <PermissionSearch
              value={permissionSearch}
              resultCount={filteredPermissions.length}
              onChange={setPermissionSearch}
            />

            {Object.entries(GROUP_LABELS).map(
              ([group, label]) => {
                const items = filteredPermissions.filter(
                  (permission) =>
                    permission.group === group
                )

                if (!items.length) return null

                return (
                  <section
                    key={group}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {label}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Configure permissions in this group.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={disabled}
                          onClick={() =>
                            setGroupState(
                              group as any,
                              "allow"
                            )
                          }
                        >
                          Allow All
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={disabled}
                          onClick={() =>
                            setGroupState(
                              group as any,
                              "deny"
                            )
                          }
                        >
                          Deny All
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={disabled}
                          onClick={() =>
                            setGroupState(
                              group as any,
                              "neutral"
                            )
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {items.map((permission) => (
                        <PermissionCard
                          key={permission.id}
                          title={permission.label}
                          description={permission.description}
                          value={getPermissionState(permission.id)}
                          disabled={disabled}
                          onChange={(state) =>
                            setPermissionState(
                              permission.id,
                              state
                            )
                          }
                        />
                      ))}
                    </div>
                  </section>
                )
              }
            )}
          </>
        )}
      </main>
    </div>
  )
}