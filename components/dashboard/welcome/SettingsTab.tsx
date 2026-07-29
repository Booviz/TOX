"use client"

import {
  Bot,
  FlaskConical,
  ListChecks,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  SettingsTabProps,
  WelcomeGeneralSettings,
} from "./types"

export function SettingsTab({
  value,
  channels,
  onChange,
}: SettingsTabProps) {
  function update(
    patch: Partial<WelcomeGeneralSettings>
  ) {
    onChange({
      ...value,
      ...patch,
    })
  }

  return (
    <div className="space-y-6">
      <Section
        icon={<Bot className="size-4" />}
        title="Member filters"
        description="Control which members trigger the welcome system."
      >
        <div className="space-y-3">
          <Toggle
            label="Ignore bots"
            description="Do not send welcome messages for bot accounts."
            value={value.ignoreBots}
            onChange={() =>
              update({
                ignoreBots:
                  !value.ignoreBots,
              })
            }
          />

          <Toggle
            label="Ignore rejoins"
            description="Do not welcome members who previously left and rejoined."
            value={value.ignoreRejoins}
            onChange={() =>
              update({
                ignoreRejoins:
                  !value.ignoreRejoins,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={<ListChecks className="size-4" />}
        title="Logging"
        description="Choose where welcome system activity should be logged."
      >
        <label className="block">
          <span className="text-xs font-medium">
            Log channel
          </span>

          <select
            value={value.logChannelId}
            onChange={(event) =>
              update({
                logChannelId:
                  event.target.value,
              })
            }
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">
              Disable logging
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
        icon={<FlaskConical className="size-4" />}
        title="Testing"
        description="Optionally select a default user for test messages."
      >
        <label className="block">
          <span className="text-xs font-medium">
            Default test user ID
          </span>

          <input
            value={value.testUserId}
            onChange={(event) =>
              update({
                testUserId:
                  event.target.value.trim(),
              })
            }
            placeholder="Discord user ID"
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
        </label>
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
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3 text-left"
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
