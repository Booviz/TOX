"use client"

import {
  BellRing,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquareText,
  UserPlus,
  UserRoundMinus,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketEmbedMessageTemplate,
  TicketMessageSettings,
  TicketMessageTemplate,
  TicketMessagesTabProps,
} from "./types"

type EmbedMessageKey =
  | "opening"
  | "closeConfirmation"
  | "closed"
  | "dmReminder"

type SimpleMessageKey =
  | "claimed"
  | "memberAdded"
  | "memberRemoved"

export default function TicketMessagesTab({
  value,
  onChange,
}: TicketMessagesTabProps) {
  function updateEmbedMessage(
    key: EmbedMessageKey,
    patch: Partial<TicketEmbedMessageTemplate>
  ) {
    onChange({
      ...value,
      [key]: {
        ...value[key],
        ...patch,
      },
    })
  }

  function updateSimpleMessage(
    key: SimpleMessageKey,
    patch: Partial<TicketMessageTemplate>
  ) {
    onChange({
      ...value,
      [key]: {
        ...value[key],
        ...patch,
      },
    })
  }

  return (
    <div className="space-y-5">
      <EmbedMessageEditor
        icon={<MessageSquareText className="size-4" />}
        title="Opening Message"
        description="Sent automatically when a new ticket is created."
        value={value.opening}
        onChange={(patch) =>
          updateEmbedMessage("opening", patch)
        }
      />

      <EmbedMessageEditor
        icon={<BellRing className="size-4" />}
        title="Close Confirmation"
        description="Shown before a member or staff member closes a ticket."
        value={value.closeConfirmation}
        onChange={(patch) =>
          updateEmbedMessage("closeConfirmation", patch)
        }
      />

      <EmbedMessageEditor
        icon={<CheckCircle2 className="size-4" />}
        title="Closed Message"
        description="Sent after the ticket has been closed."
        value={value.closed}
        onChange={(patch) =>
          updateEmbedMessage("closed", patch)
        }
      />

      <EmbedMessageEditor
        icon={<BellRing className="size-4" />}
        title="DM Reminder"
        description="Sent privately to remind a member about an open ticket."
        value={value.dmReminder}
        onChange={(patch) =>
          updateEmbedMessage("dmReminder", patch)
        }
      />

      <SimpleMessageEditor
        icon={<CheckCircle2 className="size-4" />}
        title="Claimed Message"
        description="Sent when a staff member claims a ticket."
        value={value.claimed}
        onChange={(patch) =>
          updateSimpleMessage("claimed", patch)
        }
      />

      <SimpleMessageEditor
        icon={<UserPlus className="size-4" />}
        title="Member Added Message"
        description="Sent when another member is added to a ticket."
        value={value.memberAdded}
        onChange={(patch) =>
          updateSimpleMessage("memberAdded", patch)
        }
      />

      <SimpleMessageEditor
        icon={<UserRoundMinus className="size-4" />}
        title="Member Removed Message"
        description="Sent when a member is removed from a ticket."
        value={value.memberRemoved}
        onChange={(patch) =>
          updateSimpleMessage("memberRemoved", patch)
        }
      />
    </div>
  )
}

function EmbedMessageEditor({
  icon,
  title,
  description,
  value,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  value: TicketEmbedMessageTemplate
  onChange: (
    patch: Partial<TicketEmbedMessageTemplate>
  ) => void
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>

          <div>
            <h2 className="font-semibold">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <Toggle
          enabled={value.enabled}
          onClick={() =>
            onChange({
              enabled: !value.enabled,
            })
          }
        />
      </div>

      {value.enabled && (
        <div className="space-y-5 border-t border-border p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input
                value={value.title}
                maxLength={256}
                onChange={(event) =>
                  onChange({
                    title: event.target.value,
                  })
                }
                className="ticket-input"
                placeholder="Ticket {ticketNumber}"
              />
            </Field>

            <Field label="Embed color">
              <div className="flex gap-3">
                <input
                  value={value.color}
                  maxLength={7}
                  onChange={(event) =>
                    onChange({
                      color: event.target.value,
                    })
                  }
                  className="ticket-input flex-1 uppercase"
                  placeholder="#9B4DFF"
                />

                <input
                  type="color"
                  value={
                    /^#[0-9a-fA-F]{6}$/.test(value.color)
                      ? value.color
                      : "#9B4DFF"
                  }
                  onChange={(event) =>
                    onChange({
                      color:
                        event.target.value.toUpperCase(),
                    })
                  }
                  className="h-11 w-14 rounded-xl border border-border bg-background p-1"
                />
              </div>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={value.description}
              maxLength={4096}
              rows={6}
              onChange={(event) =>
                onChange({
                  description:
                    event.target.value,
                })
              }
              className="ticket-input min-h-36 resize-y py-3"
              placeholder="Use variables such as {mention}, {ticketNumber} and {server}."
            />

            <div className="mt-2 text-right text-[11px] text-muted-foreground">
              {value.description.length}/4096
            </div>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Thumbnail URL">
              <input
                value={value.thumbnailUrl}
                onChange={(event) =>
                  onChange({
                    thumbnailUrl:
                      event.target.value,
                  })
                }
                className="ticket-input"
                placeholder="{serverIcon}"
              />
            </Field>

            <Field label="Main image URL">
              <input
                value={value.imageUrl}
                onChange={(event) =>
                  onChange({
                    imageUrl:
                      event.target.value,
                  })
                }
                className="ticket-input"
                placeholder="https://..."
              />
            </Field>

            <Field label="Footer text">
              <input
                value={value.footerText}
                maxLength={2048}
                onChange={(event) =>
                  onChange({
                    footerText:
                      event.target.value,
                  })
                }
                className="ticket-input"
                placeholder="{server} • Ticket System"
              />
            </Field>

            <Field label="Footer icon URL">
              <input
                value={value.footerIconUrl}
                onChange={(event) =>
                  onChange({
                    footerIconUrl:
                      event.target.value,
                  })
                }
                className="ticket-input"
                placeholder="{serverIcon}"
              />
            </Field>
          </div>

          <OptionCard
            label="Show timestamp"
            description="Display the current time at the bottom of the embed."
            enabled={value.timestamp}
            onClick={() =>
              onChange({
                timestamp: !value.timestamp,
              })
            }
          />
        </div>
      )}
    </section>
  )
}

function SimpleMessageEditor({
  icon,
  title,
  description,
  value,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  value: TicketMessageTemplate
  onChange: (
    patch: Partial<TicketMessageTemplate>
  ) => void
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>

          <div>
            <h2 className="font-semibold">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <Toggle
          enabled={value.enabled}
          onClick={() =>
            onChange({
              enabled: !value.enabled,
            })
          }
        />
      </div>

      {value.enabled && (
        <div className="border-t border-border p-5">
          <Field label="Message content">
            <textarea
              value={value.content}
              maxLength={2000}
              rows={4}
              onChange={(event) =>
                onChange({
                  content:
                    event.target.value,
                })
              }
              className="ticket-input min-h-28 resize-y py-3"
            />

            <div className="mt-2 text-right text-[11px] text-muted-foreground">
              {value.content.length}/2000
            </div>
          </Field>
        </div>
      )}
    </section>
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
    <label className="block">
      <span className="text-xs font-semibold">
        {label}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </label>
  )
}

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition",
        enabled
          ? "bg-primary"
          : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition",
          enabled
            ? "left-6"
            : "left-1"
        )}
      />
    </button>
  )
}

function OptionCard({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string
  description: string
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition",
        enabled
          ? "border-primary bg-primary/[0.08]"
          : "border-border bg-background/30"
      )}
    >
      <span>
        <span className="block text-sm font-semibold">
          {label}
        </span>

        <span className="mt-1 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        className={cn(
          "size-3 rounded-full",
          enabled
            ? "bg-emerald-400"
            : "bg-muted"
        )}
      />
    </button>
  )
}