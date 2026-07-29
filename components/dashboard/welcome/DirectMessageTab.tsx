"use client"

import {
  Clock3,
  Image as ImageIcon,
  Mail,
  MessageSquareText,
  Palette,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  DirectMessageSettings,
  DirectMessageTabProps,
  WelcomeMessageType,
} from "./types"

const TYPES: Array<{
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

export function DirectMessageTab({
  value,
  onChange,
}: DirectMessageTabProps) {
  function update(
    patch: Partial<DirectMessageSettings>
  ) {
    onChange({
      ...value,
      ...patch,
    })
  }

  function updateEmbed(
    patch: Partial<DirectMessageSettings["embed"]>
  ) {
    update({
      embed: {
        ...value.embed,
        ...patch,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Section
        icon={<Mail className="size-4" />}
        title="Direct welcome message"
        description="Send a private message to every new member."
      >
        <Toggle
          label="Enable direct message"
          description="Send the configured message in the member's DMs."
          value={value.enabled}
          onChange={() =>
            update({
              enabled: !value.enabled,
            })
          }
        />
      </Section>

      <Section
        icon={<MessageSquareText className="size-4" />}
        title="Message type"
        description="Choose the private message format."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {TYPES.map((item) => {
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
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left",
                  active
                    ? "border-primary/50 bg-primary/[0.08]"
                    : "border-border bg-card",
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
        <Section
          icon={<Palette className="size-4" />}
          title="Embed editor"
          description="Configure the private welcome embed."
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
                Color
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
          </div>
        </Section>
      )}

      {value.type === "text" && (
        <Section
          icon={<MessageSquareText className="size-4" />}
          title="Text message"
          description="Write the private welcome message."
        >
          <textarea
            rows={8}
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
          description="Send an image inside the member's DMs."
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
        title="Delay"
        description="Wait before sending the private message."
      >
        <Toggle
          label="Delay direct message"
          description="Delay the message after the member joins."
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
          <label className="mt-4 block">
            <span className="text-xs font-medium">
              Delay in seconds
            </span>

            <input
              type="number"
              min={0}
              max={3600}
              value={value.delay.delaySeconds}
              disabled={!value.enabled}
              onChange={(event) =>
                update({
                  delay: {
                    ...value.delay,
                    delaySeconds: Math.max(
                      0,
                      Number(event.target.value) ||
                        0
                    ),
                  },
                })
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        )}
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
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
