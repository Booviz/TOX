"use client"

import {
  Folder,
  Hash,
  MessageSquareText,
  Radio,
  Volume2,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  ChannelKind,
  ServerChannel,
} from "./types"

export type GeneralTabProps = {
  name: string
  setName: (value: string) => void

  kind: ChannelKind
  setKind: (value: ChannelKind) => void

  parentId: string
  setParentId: (value: string) => void

  position: number
  setPosition: (value: number) => void

  topic: string
  setTopic: (value: string) => void

  nsfw: boolean
  setNsfw: (value: boolean) => void

  slowmode: number
  setSlowmode: (value: number) => void

  userLimit: number
  setUserLimit: (value: number) => void

  bitrate: number
  setBitrate: (value: number) => void

  categories: ServerChannel[]
  disabled?: boolean
}

const CHANNEL_TYPES: {
  value: ChannelKind
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    value: "text",
    label: "Text",
    description:
      "Send messages, images, files and links.",
    icon: <Hash className="size-4" />,
  },
  {
    value: "announcement",
    label: "Announcement",
    description:
      "Publish important server announcements.",
    icon: (
      <MessageSquareText className="size-4" />
    ),
  },
  {
    value: "voice",
    label: "Voice",
    description:
      "Talk with members using voice and video.",
    icon: <Volume2 className="size-4" />,
  },
  {
    value: "stage",
    label: "Stage",
    description:
      "Host moderated audio events.",
    icon: <Radio className="size-4" />,
  },
  {
    value: "forum",
    label: "Forum",
    description:
      "Organize conversations into posts.",
    icon: (
      <MessageSquareText className="size-4" />
    ),
  },
  {
    value: "media",
    label: "Media",
    description:
      "Share media-focused posts.",
    icon: (
      <MessageSquareText className="size-4" />
    ),
  },
  {
    value: "category",
    label: "Category",
    description:
      "Group related channels together.",
    icon: <Folder className="size-4" />,
  },
]

export function GeneralTab({
  name,
  setName,
  kind,
  setKind,
  parentId,
  setParentId,
  position,
  setPosition,
  topic,
  setTopic,
  nsfw,
  setNsfw,
  slowmode,
  setSlowmode,
  userLimit,
  setUserLimit,
  bitrate,
  setBitrate,
  categories,
  disabled = false,
}: GeneralTabProps) {
  const isCategory =
    kind === "category"

  const isVoice =
    kind === "voice" ||
    kind === "stage"

  const supportsTopic =
    !isCategory &&
    !isVoice

  const supportsSlowmode =
    !isCategory &&
    !isVoice

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background/35 p-5">
        <div>
          <h3 className="font-semibold">
            Basic information
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure the channel name,
            category and position.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium">
                Channel name
              </span>

              <span className="text-[10px] text-muted-foreground">
                {name.length}/100
              </span>
            </div>

            <input
              value={name}
              disabled={disabled}
              maxLength={100}
              onChange={(event) =>
                setName(
                  event.target.value.slice(
                    0,
                    100
                  )
                )
              }
              placeholder="general"
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <div>
            <span className="text-xs font-medium">
              Channel type
            </span>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {CHANNEL_TYPES.map(
                (type) => {
                  const active =
                    kind === type.value

                  return (
                    <button
                      key={type.value}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        setKind(
                          type.value
                        )
                      }
                      className={cn(
                        "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                        active
                          ? "border-primary/50 bg-primary/[0.08]"
                          : "border-border bg-card hover:bg-muted/40",
                        disabled &&
                          "cursor-not-allowed opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {type.icon}
                      </span>

                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">
                          {type.label}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {
                            type.description
                          }
                        </span>
                      </span>
                    </button>
                  )
                }
              )}
            </div>
          </div>

          {!isCategory && (
            <label className="block">
              <span className="text-xs font-medium">
                Category
              </span>

              <select
                value={parentId}
                disabled={disabled}
                onChange={(event) =>
                  setParentId(
                    event.target.value
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  No category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </label>
          )}

          <label className="block">
            <span className="text-xs font-medium">
              Position
            </span>

            <input
              type="number"
              min={0}
              value={position}
              disabled={disabled}
              onChange={(event) =>
                setPosition(
                  Math.max(
                    0,
                    Number(
                      event.target.value
                    ) || 0
                  )
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-1 text-[11px] text-muted-foreground">
              Lower values place the
              channel closer to the top.
            </p>
          </label>
        </div>
      </section>

      {supportsTopic && (
        <section className="rounded-2xl border border-border bg-background/35 p-5">
          <div>
            <h3 className="font-semibold">
              Channel topic
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add a short description
              visible at the top of the
              channel.
            </p>
          </div>

          <label className="mt-4 block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium">
                Topic
              </span>

              <span className="text-[10px] text-muted-foreground">
                {topic.length}/1024
              </span>
            </div>

            <textarea
              value={topic}
              disabled={disabled}
              rows={4}
              maxLength={1024}
              onChange={(event) =>
                setTopic(
                  event.target.value.slice(
                    0,
                    1024
                  )
                )
              }
              placeholder="Describe the purpose of this channel..."
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </section>
      )}

      {supportsSlowmode && (
        <section className="rounded-2xl border border-border bg-background/35 p-5">
          <div>
            <h3 className="font-semibold">
              Message settings
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Control message speed and
              age restrictions.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-medium">
                Slowmode
              </span>

              <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_120px]">
                <input
                  type="range"
                  min={0}
                  max={21600}
                  step={5}
                  value={slowmode}
                  disabled={disabled}
                  onChange={(event) =>
                    setSlowmode(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="w-full"
                />

                <div className="flex h-11 items-center rounded-xl border border-border bg-background px-3 text-sm">
                  {formatSlowmode(
                    slowmode
                  )}
                </div>
              </div>
            </label>

            <ToggleRow
              label="NSFW channel"
              description="Require age confirmation before members can view the channel."
              value={nsfw}
              disabled={disabled}
              onChange={() =>
                setNsfw(!nsfw)
              }
            />
          </div>
        </section>
      )}

      {isVoice && (
        <section className="rounded-2xl border border-border bg-background/35 p-5">
          <div>
            <h3 className="font-semibold">
              Voice settings
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Configure the member limit
              and audio quality.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium">
                User limit
              </span>

              <input
                type="number"
                min={0}
                max={99}
                value={userLimit}
                disabled={disabled}
                onChange={(event) =>
                  setUserLimit(
                    clamp(
                      Number(
                        event.target.value
                      ),
                      0,
                      99
                    )
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-1 text-[11px] text-muted-foreground">
                Set to 0 for no limit.
              </p>
            </label>

            <label className="block">
              <span className="text-xs font-medium">
                Bitrate
              </span>

              <input
                type="number"
                min={8000}
                max={384000}
                step={1000}
                value={bitrate}
                disabled={disabled}
                onChange={(event) =>
                  setBitrate(
                    clamp(
                      Number(
                        event.target.value
                      ),
                      8000,
                      384000
                    )
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-1 text-[11px] text-muted-foreground">
                Value is measured in bits
                per second.
              </p>
            </label>
          </div>
        </section>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  value,
  disabled,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  disabled: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:bg-muted/40",
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

function formatSlowmode(
  seconds: number
) {
  if (seconds <= 0) {
    return "Off"
  }

  if (seconds < 60) {
    return `${seconds}s`
  }

  if (seconds < 3600) {
    return `${Math.floor(
      seconds / 60
    )}m`
  }

  return `${Math.floor(
    seconds / 3600
  )}h`
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