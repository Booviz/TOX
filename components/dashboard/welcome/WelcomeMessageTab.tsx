"use client"

import { useRef, useState } from "react"

import {
  Bell,
  Clock3,
  Eye,
  Image as ImageIcon,
  MessageSquareText,
  Palette,
  Shield,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react"

import { cn } from "@/lib/utils"

import WelcomeImageBuilder from "./WelcomeImageBuilder"

import type {
  WelcomeMessageSettings,
  WelcomeMessageTabProps,
  WelcomeMessageType,
} from "./types"

const MESSAGE_TYPES: Array<{
  value: WelcomeMessageType
  label: string
  description: string
  icon: React.ReactNode
}> = [
  {
    value: "embed",
    label: "Embed",
    description:
      "Create a rich Discord embed with title, color, images and footer.",
    icon: <Sparkles className="size-4" />,
  },
  {
    value: "text",
    label: "Text",
    description:
      "Send a simple Discord text message.",
    icon: (
      <MessageSquareText className="size-4" />
    ),
  },
  {
    value: "image",
    label: "Image",
    description:
      "Send an image with optional text.",
    icon: <ImageIcon className="size-4" />,
  },
]

export function WelcomeMessageTab({
  value,
  channels,
  roles,
  preview,
  onChange,
}: WelcomeMessageTabProps) {
  const imagePreview = preview ?? {
    member: {
      id: "preview-member",
      username: "NewMember",
      displayName: "New Member",
      mention: "@NewMember",
      avatarUrl:
        "https://cdn.discordapp.com/embed/avatars/0.png",
      joinedAt:
        new Date().toISOString(),
    },
    server: {
      id: "preview-server",
      name: "TOX Community",
      iconUrl: "",
      memberCount: 1234,
    },
    channelName: "#welcome",
  }

  function update(
    patch: Partial<WelcomeMessageSettings>
  ) {
    onChange({
      ...value,
      ...patch,
    })
  }

  function updateEmbed(
    patch: Partial<
      WelcomeMessageSettings["embed"]
    >
  ) {
    update({
      embed: {
        ...value.embed,
        ...patch,
      },
    })
  }

  function updateText(content: string) {
    update({
      text: {
        ...value.text,
        content,
      },
    })
  }

  function updateImage(
    patch: Partial<
      WelcomeMessageSettings["image"]
    >
  ) {
    update({
      image: {
        ...value.image,
        ...patch,
      },
    })
  }

  function toggleRole(roleId: string) {
    const exists =
      value.allowedRoleIds.includes(roleId)

    update({
      allowedRoleIds: exists
        ? value.allowedRoleIds.filter(
            (id) => id !== roleId
          )
        : [
            ...value.allowedRoleIds,
            roleId,
          ],
    })
  }

  return (
    <div className="space-y-6">
      <Section
        icon={
          <Bell className="size-4" />
        }
        title="Welcome system"
        description="Enable or disable the welcome message and choose where it will be sent."
      >
        <ToggleRow
          label="Enable welcome message"
          description="Send a message when a new member joins the server."
          value={value.enabled}
          onChange={() =>
            update({
              enabled: !value.enabled,
            })
          }
        />

        <label className="mt-4 block">
          <span className="text-xs font-medium">
            Welcome channel
          </span>

          <select
            value={value.channelId}
            disabled={!value.enabled}
            onChange={(event) =>
              update({
                channelId:
                  event.target.value,
              })
            }
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              Select a channel
            </option>

            {channels.map((channel) => (
              <option
                key={channel.id}
                value={channel.id}
              >
                {channel.parentName
                  ? `${channel.parentName} / ${channel.name}`
                  : channel.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4">
          <ToggleRow
            label="Mention new member"
            description="Mention the member before sending the welcome message."
            value={value.mentionMember}
            disabled={!value.enabled}
            onChange={() =>
              update({
                mentionMember:
                  !value.mentionMember,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={
          <MessageSquareText className="size-4" />
        }
        title="Message type"
        description="Choose how the welcome message should appear in Discord."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {MESSAGE_TYPES.map((type) => {
            const active =
              value.type === type.value

            return (
              <button
                key={type.value}
                type="button"
                disabled={!value.enabled}
                onClick={() =>
                  update({
                    type: type.value,
                  })
                }
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  active
                    ? "border-primary/50 bg-primary/[0.08]"
                    : "border-border bg-card hover:bg-muted/40",
                  !value.enabled &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {type.icon}
                </span>

                <p className="mt-3 text-sm font-semibold">
                  {type.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {type.description}
                </p>
              </button>
            )
          })}
        </div>
      </Section>

      {value.type === "embed" && (
        <EmbedEditor
          value={value}
          onChange={updateEmbed}
        />
      )}

      {value.type === "text" && (
        <Section
          icon={
            <MessageSquareText className="size-4" />
          }
          title="Text message"
          description="Write the message that will be sent to the welcome channel."
        >
          <label className="block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium">
                Message
              </span>

              <span className="text-[10px] text-muted-foreground">
                {
                  value.text.content
                    .length
                }
                /2000
              </span>
            </div>

            <textarea
              rows={8}
              maxLength={2000}
              value={value.text.content}
              disabled={!value.enabled}
              onChange={(event) =>
                updateText(
                  event.target.value
                )
              }
              placeholder="Welcome {mention} to {server}!"
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </Section>
      )}

      {value.type === "image" && (
        <Section
          icon={
            <ImageIcon className="size-4" />
          }
          title="Image message"
          description="Send an image with optional text."
        >
          <div className="space-y-4">
            <TextInput
              label="Image URL"
              value={value.image.imageUrl}
              disabled={!value.enabled}
              placeholder="https://example.com/welcome.png"
              onChange={(imageUrl) =>
                updateImage({
                  imageUrl,
                })
              }
            />

            <label className="block">
              <span className="text-xs font-medium">
                Message content
              </span>

              <textarea
                rows={4}
                maxLength={2000}
                value={
                  value.image.content ??
                  ""
                }
                disabled={!value.enabled}
                onChange={(event) =>
                  updateImage({
                    content:
                      event.target.value,
                  })
                }
                placeholder="Welcome {mention} to {server}!"
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            {value.image.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-border bg-background/30 p-3">
                <p className="mb-3 text-xs font-medium">
                  Image preview
                </p>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    value.image.imageUrl
                  }
                  alt="Welcome preview"
                  className="max-h-80 w-full rounded-xl object-cover"
                />
              </div>
            )}
          </div>
        </Section>
      )}

      <WelcomeImageBuilder
        value={value.canvas}
        preview={imagePreview}
        disabled={!value.enabled}
        onChange={(canvas) =>
          update({ canvas })
        }
      />

      <Section
        icon={
          <Clock3 className="size-4" />
        }
        title="Timing and automation"
        description="Control delays, automatic deletion and reactions."
      >
        <div className="space-y-4">
          <ToggleRow
            label="Delay message"
            description="Wait before sending the welcome message."
            value={value.delay.enabled}
            disabled={!value.enabled}
            onChange={() =>
              update({
                delay: {
                  ...value.delay,
                  enabled:
                    !value.delay.enabled,
                },
              })
            }
          />

          {value.delay.enabled && (
            <NumberInput
              label="Delay in seconds"
              value={
                value.delay
                  .delaySeconds
              }
              min={0}
              max={3600}
              disabled={!value.enabled}
              onChange={(delaySeconds) =>
                update({
                  delay: {
                    ...value.delay,
                    delaySeconds,
                  },
                })
              }
            />
          )}

          <ToggleRow
            label="Delete automatically"
            description="Delete the welcome message after a set amount of time."
            value={value.delete.enabled}
            disabled={!value.enabled}
            onChange={() =>
              update({
                delete: {
                  ...value.delete,
                  enabled:
                    !value.delete.enabled,
                },
              })
            }
          />

          {value.delete.enabled && (
            <NumberInput
              label="Delete after seconds"
              value={
                value.delete
                  .afterSeconds
              }
              min={5}
              max={86400}
              disabled={!value.enabled}
              onChange={(afterSeconds) =>
                update({
                  delete: {
                    ...value.delete,
                    afterSeconds,
                  },
                })
              }
            />
          )}

          <ToggleRow
            label="Add reaction"
            description="Automatically react to the welcome message."
            value={
              value.reaction.enabled
            }
            disabled={!value.enabled}
            onChange={() =>
              update({
                reaction: {
                  ...value.reaction,
                  enabled:
                    !value.reaction
                      .enabled,
                },
              })
            }
          />

          {value.reaction.enabled && (
            <TextInput
              label="Reaction emoji"
              value={
                value.reaction.emoji
              }
              disabled={!value.enabled}
              placeholder="👋"
              onChange={(emoji) =>
                update({
                  reaction: {
                    ...value.reaction,
                    emoji,
                  },
                })
              }
            />
          )}
        </div>
      </Section>

      <Section
        icon={
          <Shield className="size-4" />
        }
        title="Role filter"
        description="Optionally limit this welcome message to members who receive one of the selected roles."
      >
        <div className="grid gap-2 md:grid-cols-2">
          {roles.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              No server roles were found.
            </div>
          ) : (
            roles.map((role) => {
              const selected =
                value.allowedRoleIds.includes(
                  role.id
                )

              return (
                <button
                  key={role.id}
                  type="button"
                  disabled={
                    !value.enabled ||
                    role.managed
                  }
                  onClick={() =>
                    toggleRole(role.id)
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                    selected
                      ? "border-primary/40 bg-primary/[0.08]"
                      : "border-border bg-card hover:bg-muted/40",
                    (!value.enabled ||
                      role.managed) &&
                      "cursor-not-allowed opacity-50"
                  )}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor:
                        role.color &&
                        role.color !==
                          "#000000"
                          ? role.color
                          : "#8b8d98",
                    }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {role.name}
                    </span>

                    {role.managed && (
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        Managed role
                      </span>
                    )}
                  </span>

                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-md border",
                      selected
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}
                  >
                    {selected && (
                      <Eye className="size-3 text-primary-foreground" />
                    )}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Leave all roles unselected to
          welcome every new member.
        </p>
      </Section>
    </div>
  )
}

function EmbedEditor({
  value,
  onChange,
}: {
  value: WelcomeMessageSettings
  onChange: (
    patch: Partial<
      WelcomeMessageSettings["embed"]
    >
  ) => void
}) {
  const embed = value.embed

  const [embedImagesEnabled, setEmbedImagesEnabled] =
    useState(
      Boolean(
        embed.thumbnailUrl ||
          embed.imageUrl ||
          embed.authorName ||
          embed.authorIconUrl
      )
    )

  const [footerEnabled, setFooterEnabled] =
    useState(
      Boolean(
        embed.footerText ||
          embed.footerIconUrl ||
          embed.timestamp
      )
    )

  const imageBackup = useRef({
    thumbnailUrl:
      embed.thumbnailUrl ||
      "{userAvatar}",
    imageUrl:
      embed.imageUrl || "",
    authorName:
      embed.authorName || "",
    authorIconUrl:
      embed.authorIconUrl ||
      "{serverIcon}",
  })

  const footerBackup = useRef({
    footerText:
      embed.footerText ||
      "Welcome to {server}",
    footerIconUrl:
      embed.footerIconUrl ||
      "{serverIcon}",
    timestamp:
      embed.timestamp,
  })

  function toggleEmbedImages() {
    if (embedImagesEnabled) {
      imageBackup.current = {
        thumbnailUrl:
          embed.thumbnailUrl,
        imageUrl:
          embed.imageUrl,
        authorName:
          embed.authorName,
        authorIconUrl:
          embed.authorIconUrl,
      }

      onChange({
        thumbnailUrl: "",
        imageUrl: "",
        authorName: "",
        authorIconUrl: "",
      })

      setEmbedImagesEnabled(false)
      return
    }

    onChange({
      ...imageBackup.current,
    })

    setEmbedImagesEnabled(true)
  }

  function toggleFooter() {
    if (footerEnabled) {
      footerBackup.current = {
        footerText:
          embed.footerText,
        footerIconUrl:
          embed.footerIconUrl,
        timestamp:
          embed.timestamp,
      }

      onChange({
        footerText: "",
        footerIconUrl: "",
        timestamp: false,
      })

      setFooterEnabled(false)
      return
    }

    onChange({
      ...footerBackup.current,
    })

    setFooterEnabled(true)
  }

  return (
    <>
      <Section
        icon={
          <Palette className="size-4" />
        }
        title="Embed content"
        description="Build the main welcome embed."
      >
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={embed.title}
            disabled={!value.enabled}
            maxLength={256}
            placeholder="👋 Welcome to {server}!"
            onChange={(title) =>
              onChange({ title })
            }
          />

          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                Description
              </span>

              <span className="text-[10px] text-muted-foreground">
                {
                  embed.description
                    .length
                }
                /4096
              </span>
            </div>

            <textarea
              rows={8}
              maxLength={4096}
              value={embed.description}
              disabled={!value.enabled}
              onChange={(event) =>
                onChange({
                  description:
                    event.target.value,
                })
              }
              placeholder="Hey {mention}, welcome to {server}!"
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium">
              Embed color
            </span>

            <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3">
              <input
                type="color"
                value={embed.color}
                disabled={!value.enabled}
                onChange={(event) =>
                  onChange({
                    color:
                      event.target.value,
                  })
                }
                className="size-7 cursor-pointer border-0 bg-transparent p-0"
              />

              <input
                value={embed.color}
                disabled={!value.enabled}
                onChange={(event) =>
                  onChange({
                    color:
                      event.target.value,
                  })
                }
                maxLength={7}
                className="min-w-0 flex-1 bg-transparent text-sm uppercase outline-none"
              />
            </div>
          </label>
        </div>
      </Section>

      <CollapsibleSection
        icon={
          <ImageIcon className="size-4" />
        }
        title="Embed images"
        description="Add thumbnail, main image and author details."
        enabled={embedImagesEnabled}
        disabled={!value.enabled}
        onToggle={toggleEmbedImages}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Thumbnail URL"
            value={
              embed.thumbnailUrl
            }
            disabled={
              !value.enabled ||
              !embedImagesEnabled
            }
            placeholder="{userAvatar}"
            onChange={(thumbnailUrl) =>
              onChange({
                thumbnailUrl,
              })
            }
          />

          <TextInput
            label="Main image URL"
            value={embed.imageUrl}
            disabled={
              !value.enabled ||
              !embedImagesEnabled
            }
            placeholder="https://example.com/banner.png"
            onChange={(imageUrl) =>
              onChange({ imageUrl })
            }
          />

          <TextInput
            label="Author name"
            value={embed.authorName}
            disabled={
              !value.enabled ||
              !embedImagesEnabled
            }
            placeholder="TOX Welcome"
            onChange={(authorName) =>
              onChange({ authorName })
            }
          />

          <TextInput
            label="Author icon URL"
            value={
              embed.authorIconUrl
            }
            disabled={
              !value.enabled ||
              !embedImagesEnabled
            }
            placeholder="{serverIcon}"
            onChange={(
              authorIconUrl
            ) =>
              onChange({
                authorIconUrl,
              })
            }
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        icon={
          <UserRound className="size-4" />
        }
        title="Footer"
        description="Configure footer text, icon and timestamp."
        enabled={footerEnabled}
        disabled={!value.enabled}
        onToggle={toggleFooter}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Footer text"
            value={embed.footerText}
            disabled={
              !value.enabled ||
              !footerEnabled
            }
            placeholder="Welcome to {server}"
            onChange={(footerText) =>
              onChange({ footerText })
            }
          />

          <TextInput
            label="Footer icon URL"
            value={
              embed.footerIconUrl
            }
            disabled={
              !value.enabled ||
              !footerEnabled
            }
            placeholder="{serverIcon}"
            onChange={(
              footerIconUrl
            ) =>
              onChange({
                footerIconUrl,
              })
            }
          />
        </div>

        <div className="mt-4">
          <ToggleRow
            label="Show timestamp"
            description="Display the current time at the bottom of the embed."
            value={embed.timestamp}
            disabled={
              !value.enabled ||
              !footerEnabled
            }
            onChange={() =>
              onChange({
                timestamp:
                  !embed.timestamp,
              })
            }
          />
        </div>
      </CollapsibleSection>
    </>
  )
}

function CollapsibleSection({
  icon,
  title,
  description,
  enabled,
  disabled = false,
  onToggle,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  disabled?: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>

          <div className="min-w-0">
            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            enabled
              ? "border-primary/35 bg-primary/15 text-primary"
              : "border-border bg-background/50 text-muted-foreground hover:bg-muted/40",
            disabled &&
              "cursor-not-allowed opacity-50"
          )}
        >
          <span
            className={cn(
              "relative h-5 w-9 rounded-full transition",
              enabled
                ? "bg-primary"
                : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-white transition",
                enabled
                  ? "left-[18px]"
                  : "left-[3px]"
              )}
            />
          </span>

          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {enabled && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </section>
  )
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  )
}

function TextInput({
  label,
  value,
  placeholder,
  maxLength,
  disabled = false,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">
        {label}
      </span>

      <input
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  )
}

function NumberInput({
  label,
  value,
  min,
  max,
  disabled = false,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  disabled?: boolean
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">
        {label}
      </span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            clamp(
              Number(
                event.target.value
              ),
              min,
              max
            )
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  )
}

function ToggleRow({
  label,
  description,
  value,
  disabled = false,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  disabled?: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3 text-left transition hover:bg-muted/40",
        disabled &&
          "cursor-not-allowed opacity-50"
      )}
    >
      <div>
        <p className="text-sm font-medium">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          value
            ? "bg-primary"
            : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-4 rounded-full bg-white transition",
            value
              ? "left-6"
              : "left-1"
          )}
        />
      </span>
    </button>
  )
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(
    max,
    Math.max(min, value)
  )
}