"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type {
  DeleteChannelDialogProps,
} from "./types"

type ChannelActionResponse = {
  success: boolean
  error?: string
  message?: string
}

export function DeleteChannelDialog({
  guildId,
  open,
  onClose,
  channel,
  onDeleted,
}: DeleteChannelDialogProps) {
  const [
    confirmation,
    setConfirmation,
  ] = useState("")

  const [submitting, setSubmitting] =
    useState(false)
  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setConfirmation("")
    setSubmitting(false)
    setError(null)
  }, [open, channel?.id])

  async function submit() {
    if (!channel) {
      return
    }

    if (
      confirmation.trim() !==
      channel.name
    ) {
      setError(
        "Type the exact channel name."
      )
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/channels`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            channelId: channel.id,
            reason:
              "Channel deleted from TOX dashboard",
          }),
        }
      )

      const data =
        (await response.json()) as ChannelActionResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to delete channel."
        )
      }

      onDeleted(channel.id)
      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to delete channel."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !channel) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-3xl border border-red-500/20 bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Delete Channel
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                This action cannot be undone.
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

        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm">
            Type{" "}
            <strong>
              {channel.name}
            </strong>{" "}
            to confirm.
          </div>

          <input
            value={confirmation}
            onChange={(event) =>
              setConfirmation(
                event.target.value
              )
            }
            placeholder={channel.name}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-red-500"
          />

          {error && (
            <div className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
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
            className="gap-2 bg-red-600 text-white hover:bg-red-500"
            onClick={() =>
              void submit()
            }
            disabled={
              submitting ||
              confirmation.trim() !==
                channel.name
            }
          >
            {submitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Delete channel
          </Button>
        </footer>
      </section>
    </div>
  )
}