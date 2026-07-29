"use client"

import {
  Clock3,
  Image as ImageIcon,
  LogOut,
  MessageSquareText,
  Palette,
  Shield,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  GoodbyeMessageSettings,
  GoodbyeMessageTabProps,
  WelcomeMessageType,
} from "./types"

const MESSAGE_TYPES: Array<{
  value: WelcomeMessageType
  label: string
  icon: React.ReactNode
}> = [
  {
    value: "embed",
    label: "Embed",
    icon: <Sparkles className="size-4" />,
  },
  {
    value: "text",
    label: "Text",
    icon: <MessageSquareText className="size-4" />,
  },
  {
    value: "image",
    label: "Image",
    icon: <ImageIcon className="size-4" />,
  },
]

export function GoodbyeMessageTab({
  value,
  channels,
  roles,
  onChange,
}: GoodbyeMessageTabProps) {
  function update(
    patch: Partial<GoodbyeMessageSettings>
  ) {
    onChange({
      ...value,
      ...patch,
    })
  }

  function updateEmbed(
    patch: Partial<GoodbyeMessageSettings["embed"]>
  ) {
    update({
      embed: {
        ...value.embed,
        ...patch,
      },
    })
  }

  function toggleRole(roleId: string) {
    const selected =
      value.allowedRoleIds.includes(roleId)

    update({
      allowedRoleIds: selected
        ? value.allowedRoleIds.filter(
            (id) => id !== roleId
          )
        : [...value.allowedRoleIds, roleId],
    })
  }

  return (
    <div className="space-y-6">
      <Section
        icon={<LogOut className="size-4" />}
        title="Goodbye system"
        description="Send a message when a member leaves the server."
      >
        <Toggle
          label="Enable goodbye message"
          description="Send a message whenever a member leaves."
          value={value.enabled}
          onChange={() =>
            update({
              enabled: !value.enabled,
            })
          }
        />

        <label className="mt-4 block">
          <span className="text-xs font-medium">
            Goodbye channel
          </span>

          <select
            value={value.channelId}
            disabled={!value.enabled}
            onChange={(event) =>
              update({
                channelId: event.target.value,
              })
            }
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
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
      </Section>

      <Section
        icon={<MessageSquareText className="size-4" />}
        title="Message type"
        description="Choose how the goodbye message should appear."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {MESSAGE_TYPES.map((item) => {
            const active =
              value.type === item.value

            return (
              <button
                key={item.value}
                type="button"
                disabled={!value.enabled}
                onClick={() =>
                  update({
                    type: item.value,
                  })
                }
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                  active
                    ? "border-primary/50 bg-primary/[0.08]"
                    : "border-border bg-card hover:bg-muted/40",
                  !value.enabled &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.icon}
                </span>

                <span className="text-sm font-semibold">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      {value.type === "embed" && (
        <>
          <Section
            icon={<Palette className="size-4" />}
            title="Embed content"
            description="Configure the goodbye embed."
          >
            <div className="space-y-4">
              <Input
                label="Title"
                value={value.embed.title}
                disabled={!value.enabled}
                onChange={(title) =>
                  updateEmbed({ title })
                }
              />

              <label className="block">
                <span className="text-xs font-medium">
                  Description
                </span>

                <textarea
                  rows={7}
                  value={value.embed.description}
                  disabled={!value.enabled}
                  onChange={(event) =>
                    updateEmbed({
                      description:
                        event.target.value,
                    })
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium">
                  Embed color
                </span>

                <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3">
                  <input
                    type="color"
                    value={value.embed.color}
                    disabled={!value.enabled}
                    onChange={(event) =>
                      updateEmbed({
                        color: event.target.value,
                      })
                    }
                    className="size-7 border-0 bg-transparent p-0"
                  />

                  <span className="text-sm uppercase">
                    {value.embed.color}
                  </span>
                </div>
              </label>

              <Input
                label="Thumbnail URL"
                value={value.embed.thumbnailUrl}
                disabled={!value.enabled}
                onChange={(thumbnailUrl) =>
                  updateEmbed({
                    thumbnailUrl,
                  })
                }
              />

              <Input
                label="Main image URL"
                value={value.embed.imageUrl}
                disabled={!value.enabled}
                onChange={(imageUrl) =>
                  updateEmbed({ imageUrl })
                }
              />

              <Input
                label="Footer text"
                value={value.embed.footerText}
                disabled={!value.enabled}
                onChange={(footerText) =>
                  updateEmbed({ footerText })
                }
              />

              <Toggle
                label="Show timestamp"
                description="Display the current time in the embed footer."
                value={value.embed.timestamp}
                disabled={!value.enabled}
                onChange={() =>
                  updateEmbed({
                    timestamp:
                      !value.embed.timestamp,
                  })
                }
              />
            </div>
          </Section>
        </>
      )}

      {value.type === "text" && (
        <Section
          icon={<MessageSquareText className="size-4" />}
          title="Text message"
          description="Write the goodbye message."
        >
          <textarea
            rows={7}
            value={value.text.content}
            disabled={!value.enabled}
            onChange={(event) =>
              update({
                text: {
                  ...value.text,
                  content: event.target.value,
                },
              })
            }
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Section>
      )}

      {value.type === "image" && (
        <Section
          icon={<ImageIcon className="size-4" />}
          title="Image message"
          description="Send an image with optional text."
        >
          <div className="space-y-4">
            <Input
              label="Image URL"
              value={value.image.imageUrl}
              disabled={!value.enabled}
              onChange={(imageUrl) =>
                update({
                  image: {
                    ...value.image,
                    imageUrl,
                  },
                })
              }
            />

            <textarea
              rows={4}
              value={value.image.content ?? ""}
              disabled={!value.enabled}
              onChange={(event) =>
                update({
                  image: {
                    ...value.image,
                    content: event.target.value,
                  },
                })
              }
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </Section>
      )}

      <Section
        icon={<Clock3 className="size-4" />}
        title="Automatic deletion"
        description="Delete goodbye messages after a configured period."
      >
        <Toggle
          label="Delete automatically"
          description="Automatically remove the goodbye message."
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
          <label className="mt-4 block">
            <span className="text-xs font-medium">
              Delete after seconds
            </span>

            <input
              type="number"
              min={5}
              max={86400}
              value={value.delete.afterSeconds}
              disabled={!value.enabled}
              onChange={(event) =>
                update({
                  delete: {
                    ...value.delete,
                    afterSeconds: Math.max(
                      5,
                      Number(event.target.value) ||
                        5
                    ),
                  },
                })
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        )}
      </Section>

      <Section
        icon={<Shield className="size-4" />}
        title="Role filter"
        description="Leave all roles unselected to apply this message to everyone."
      >
        <div className="grid gap-2 md:grid-cols-2">
          {roles.map((role) => {
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
                  "flex items-center gap-3 rounded-xl border px-3 py-3 text-left",
                  selected
                    ? "border-primary/40 bg-primary/[0.08]"
                    : "border-border bg-card",
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
                      role.color !== "#000000"
                        ? role.color
                        : "#8b8d98",
                  }}
                />

                <span className="truncate text-sm font-medium">
                  {role.name}
                </span>
              </button>
            )
          })}
        </div>
      </Section>
    </div>
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

          <p className="mt-1 text-xs text-muted-foreground">
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

function Input({
  label,
  value,
  disabled = false,
  onChange,
}: {
  label: string
  value: string
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
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  )
}

function Toggle({
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
        "flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3 text-left",
        disabled &&
          "cursor-not-allowed opacity-50"
      )}
    >
      <div>
        <p className="text-sm font-medium">
          {label}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full",
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
