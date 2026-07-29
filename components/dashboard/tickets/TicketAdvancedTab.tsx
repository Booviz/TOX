"use client"

import {
  Archive,
  BellRing,
  Clock3,
  FileText,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketAdvancedSettings,
  TicketAdvancedTabProps,
} from "./types"

export default function TicketAdvancedTab({
  value,
  channels,
  onChange,
}: TicketAdvancedTabProps) {
  function update(
    patch: Partial<TicketAdvancedSettings>
  ) {
    onChange({
      ...value,
      ...patch,
    })
  }

  function updateAutomation(
    patch: Partial<
      TicketAdvancedSettings["automation"]
    >
  ) {
    update({
      automation: {
        ...value.automation,
        ...patch,
      },
    })
  }

  function updateTranscript(
    patch: Partial<
      TicketAdvancedSettings["transcript"]
    >
  ) {
    update({
      transcript: {
        ...value.transcript,
        ...patch,
      },
    })
  }

  const textChannels = channels.filter(
    (channel) =>
      channel.type !== "category"
  )

  return (
    <div className="space-y-5">
      <Section
        icon={<ShieldCheck className="size-4" />}
        title="Ticket workflow"
        description="Control how tickets are created, claimed and closed."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <OptionCard
            label="Require close reason"
            description="Staff must provide a reason before closing a ticket."
            enabled={value.requireCloseReason}
            onClick={() =>
              update({
                requireCloseReason:
                  !value.requireCloseReason,
              })
            }
          />

          <OptionCard
            label="Require claim before close"
            description="Only a claimed ticket can be closed."
            enabled={
              value.requireClaimBeforeClose
            }
            onClick={() =>
              update({
                requireClaimBeforeClose:
                  !value.requireClaimBeforeClose,
              })
            }
          />

          <OptionCard
            label="One ticket per category"
            description="Limit each member to one open ticket per department."
            enabled={
              value.oneTicketPerCategory
            }
            onClick={() =>
              update({
                oneTicketPerCategory:
                  !value.oneTicketPerCategory,
              })
            }
          />

          <OptionCard
            label="Prevent duplicates"
            description="Block duplicate tickets with the same category and owner."
            enabled={
              value.preventDuplicateTickets
            }
            onClick={() =>
              update({
                preventDuplicateTickets:
                  !value.preventDuplicateTickets,
              })
            }
          />

          <OptionCard
            label="Ping staff on open"
            description="Mention configured staff roles when a ticket is created."
            enabled={value.pingStaffOnOpen}
            onClick={() =>
              update({
                pingStaffOnOpen:
                  !value.pingStaffOnOpen,
              })
            }
          />

          <OptionCard
            label="Ping user on open"
            description="Mention the ticket creator inside the new channel."
            enabled={value.pingUserOnOpen}
            onClick={() =>
              update({
                pingUserOnOpen:
                  !value.pingUserOnOpen,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={<Sparkles className="size-4" />}
        title="Ticket features"
        description="Enable optional controls available to staff and members."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <OptionCard
            label="Claim system"
            description="Allow staff members to claim responsibility for tickets."
            enabled={value.enableClaiming}
            onClick={() =>
              update({
                enableClaiming:
                  !value.enableClaiming,
              })
            }
          />

          <OptionCard
            label="Priority"
            description="Allow staff to assign a priority level to tickets."
            enabled={value.enablePriority}
            onClick={() =>
              update({
                enablePriority:
                  !value.enablePriority,
              })
            }
          />

          <OptionCard
            label="Rating system"
            description="Ask members to rate the support experience after closing."
            enabled={value.enableRating}
            onClick={() =>
              update({
                enableRating:
                  !value.enableRating,
              })
            }
          />

          <OptionCard
            label="DM reminder"
            description="Allow staff to send a private reminder to the ticket owner."
            enabled={value.enableDmReminder}
            onClick={() =>
              update({
                enableDmReminder:
                  !value.enableDmReminder,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={<FileText className="size-4" />}
        title="Transcripts"
        description="Configure transcript generation and delivery."
      >
        <div className="space-y-4">
          <OptionCard
            label="Enable transcripts"
            description="Create a transcript when a ticket is closed."
            enabled={value.transcript.enabled}
            onClick={() =>
              updateTranscript({
                enabled:
                  !value.transcript.enabled,
              })
            }
          />

          {value.transcript.enabled && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Transcript format"
                  description="Choose the exported transcript file type."
                >
                  <select
                    value={
                      value.transcript.format
                    }
                    onChange={(event) =>
                      updateTranscript({
                        format:
                          event.target
                            .value as
                            | "html"
                            | "text"
                            | "both",
                      })
                    }
                    className="ticket-input"
                  >
                    <option value="html">
                      HTML
                    </option>
                    <option value="text">
                      Text
                    </option>
                    <option value="both">
                      HTML + Text
                    </option>
                  </select>
                </Field>

                <Field
                  label="Transcript log channel"
                  description="The channel where generated transcripts are sent."
                >
                  <select
                    value={
                      value.transcript
                        .logChannelId
                    }
                    onChange={(event) =>
                      updateTranscript({
                        logChannelId:
                          event.target.value,
                      })
                    }
                    className="ticket-input"
                  >
                    <option value="">
                      Select log channel
                    </option>

                    {textChannels.map(
                      (channel) => (
                        <option
                          key={channel.id}
                          value={channel.id}
                        >
                          {channel.parentName
                            ? `${channel.parentName} / ${channel.name}`
                            : channel.name}
                        </option>
                      )
                    )}
                  </select>
                </Field>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <OptionCard
                  label="Send to user"
                  description="DM the transcript to the ticket creator."
                  enabled={
                    value.transcript
                      .sendToUser
                  }
                  onClick={() =>
                    updateTranscript({
                      sendToUser:
                        !value.transcript
                          .sendToUser,
                    })
                  }
                />

                <OptionCard
                  label="Send to staff"
                  description="Send the transcript to configured staff recipients."
                  enabled={
                    value.transcript
                      .sendToStaff
                  }
                  onClick={() =>
                    updateTranscript({
                      sendToStaff:
                        !value.transcript
                          .sendToStaff,
                    })
                  }
                />

                <OptionCard
                  label="Include attachments"
                  description="Include files and image links in the transcript."
                  enabled={
                    value.transcript
                      .includeAttachments
                  }
                  onClick={() =>
                    updateTranscript({
                      includeAttachments:
                        !value.transcript
                          .includeAttachments,
                    })
                  }
                />

                <OptionCard
                  label="Include embeds"
                  description="Include Discord embeds in the transcript."
                  enabled={
                    value.transcript
                      .includeEmbeds
                  }
                  onClick={() =>
                    updateTranscript({
                      includeEmbeds:
                        !value.transcript
                          .includeEmbeds,
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </Section>

      <Section
        icon={<Clock3 className="size-4" />}
        title="Automation"
        description="Automatically remind, close or delete inactive tickets."
      >
        <div className="space-y-4">
          <AutomationRow
            icon={<Archive className="size-4" />}
            title="Auto close"
            description="Automatically close tickets after a period of inactivity."
            enabled={
              value.automation
                .autoCloseEnabled
            }
            hours={
              value.automation
                .autoCloseAfterHours
            }
            onToggle={() =>
              updateAutomation({
                autoCloseEnabled:
                  !value.automation
                    .autoCloseEnabled,
              })
            }
            onHoursChange={(
              autoCloseAfterHours
            ) =>
              updateAutomation({
                autoCloseAfterHours,
              })
            }
          />

          <AutomationRow
            icon={<BellRing className="size-4" />}
            title="Auto close warning"
            description="Warn members before an inactive ticket is closed."
            enabled={
              value.automation
                .autoCloseWarningEnabled
            }
            hours={
              value.automation
                .autoCloseWarningHours
            }
            onToggle={() =>
              updateAutomation({
                autoCloseWarningEnabled:
                  !value.automation
                    .autoCloseWarningEnabled,
              })
            }
            onHoursChange={(
              autoCloseWarningHours
            ) =>
              updateAutomation({
                autoCloseWarningHours,
              })
            }
          />

          <AutomationRow
            icon={<BellRing className="size-4" />}
            title="Inactivity reminder"
            description="Remind the ticket owner after a period of inactivity."
            enabled={
              value.automation
                .inactivityReminderEnabled
            }
            hours={
              value.automation
                .inactivityReminderHours
            }
            onToggle={() =>
              updateAutomation({
                inactivityReminderEnabled:
                  !value.automation
                    .inactivityReminderEnabled,
              })
            }
            onHoursChange={(
              inactivityReminderHours
            ) =>
              updateAutomation({
                inactivityReminderHours,
              })
            }
          />

          <AutomationRow
            icon={<Trash2 className="size-4" />}
            title="Auto delete"
            description="Delete closed ticket channels automatically."
            enabled={
              value.automation
                .autoDeleteEnabled
            }
            hours={
              value.automation
                .autoDeleteAfterHours
            }
            onToggle={() =>
              updateAutomation({
                autoDeleteEnabled:
                  !value.automation
                    .autoDeleteEnabled,
              })
            }
            onHoursChange={(
              autoDeleteAfterHours
            ) =>
              updateAutomation({
                autoDeleteAfterHours,
              })
            }
          />
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
          <h2 className="font-semibold">
            {title}
          </h2>

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

function Field({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">
        {label}
      </span>

      {description && (
        <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
          {description}
        </span>
      )}

      <div className="mt-2">
        {children}
      </div>
    </label>
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
        "rounded-xl border p-4 text-left transition",
        enabled
          ? "border-primary bg-primary/[0.08]"
          : "border-border bg-background/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">
          {label}
        </span>

        <span
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
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

function AutomationRow({
  icon,
  title,
  description,
  enabled,
  hours,
  onToggle,
  onHoursChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  hours: number
  onToggle: () => void
  onHoursChange: (
    value: number
  ) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-background/30 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-start gap-3 text-left"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>

          <span>
            <span className="block text-sm font-semibold">
              {title}
            </span>

            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          </span>
        </button>

        <span
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
        </span>
      </div>

      {enabled && (
        <div className="mt-4 border-t border-border pt-4">
          <Field
            label="Hours"
            description="How many hours before this automation runs."
          >
            <input
              type="number"
              min={1}
              max={8760}
              value={hours}
              onChange={(event) =>
                onHoursChange(
                  Math.max(
                    1,
                    Number(
                      event.target.value
                    ) || 1
                  )
                )
              }
              className="ticket-input"
            />
          </Field>
        </div>
      )}
    </div>
  )
}