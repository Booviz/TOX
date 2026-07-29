"use client"

import {
  FlaskConical,
  Loader2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type {
  TestWelcomeDialogProps,
} from "./types"

export function TestWelcomeDialog({
  open,
  testing,
  users = [],
  channels,
  onClose,
  onSubmit,
}: TestWelcomeDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={() => {
          if (!testing) {
            onClose()
          }
        }}
        aria-label="Close test welcome dialog"
      />

      <section className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FlaskConical className="size-5" />
            </span>

            <div>
              <h2 className="font-semibold">
                Test Welcome
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Send a test message without changing your saved settings.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={testing}
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </header>

        <TestWelcomeForm
          testing={testing}
          users={users}
          channels={channels}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </section>
    </div>
  )
}

function TestWelcomeForm({
  testing,
  users,
  channels,
  onClose,
  onSubmit,
}: Omit<
  TestWelcomeDialogProps,
  "open"
>) {
  const React =
    require("react") as typeof import("react")

  const [target, setTarget] =
    React.useState<
      "welcome" | "goodbye" | "dm"
    >("welcome")

  const [userId, setUserId] =
    React.useState("")

  const [channelId, setChannelId] =
    React.useState("")

  return (
    <>
      <div className="space-y-4 p-6">
        <label className="block">
          <span className="text-xs font-medium">
            Test type
          </span>

          <select
            value={target}
            disabled={testing}
            onChange={(event) =>
              setTarget(
                event.target.value as
                  | "welcome"
                  | "goodbye"
                  | "dm"
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="welcome">
              Welcome message
            </option>
            <option value="goodbye">
              Goodbye message
            </option>
            <option value="dm">
              Direct message
            </option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium">
            Test member
          </span>

          {(users ?? []).length> 0 ? (
            <select
              value={userId}
              disabled={testing}
              onChange={(event) =>
                setUserId(
                  event.target.value
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">
                Use current user
              </option>

              {(users ?? []).map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.displayName}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={userId}
              disabled={testing}
              onChange={(event) =>
                setUserId(
                  event.target.value.trim()
                )
              }
              placeholder="Discord user ID"
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          )}
        </label>

        {target !== "dm" && (
          <label className="block">
            <span className="text-xs font-medium">
              Test channel
            </span>

            <select
              value={channelId}
              disabled={testing}
              onChange={(event) =>
                setChannelId(
                  event.target.value
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">
                Use configured channel
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
        )}
      </div>

      <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button
          type="button"
          variant="outline"
          disabled={testing}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="button"
          className="gap-2"
          disabled={testing}
          onClick={() =>
            onSubmit({
              action: "test",
              target,
              userId:
                userId || undefined,
              channelId:
                channelId || undefined,
            })
          }
        >
          {testing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FlaskConical className="size-4" />
          )}
          Send test
        </Button>
      </footer>
    </>
  )
}
