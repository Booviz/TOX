"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  Check,
  Loader2,
  Plus,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type {
  ChannelKind,
  CreateChannelDialogProps,
  ServerChannel,
} from "./types"

type ChannelActionResponse = {
  success: boolean
  error?: string
  message?: string
  channel?: ServerChannel
}

export function CreateChannelDialog({
  guildId,
  open,
  onClose,
  categories,
  onCreated,
}: CreateChannelDialogProps) {
  const [name, setName] = useState("")
  const [kind, setKind] =
    useState<ChannelKind>("text")
  const [parentId, setParentId] =
    useState("")
  const [topic, setTopic] =
    useState("")
  const [nsfw, setNsfw] =
    useState(false)
  const [slowmode, setSlowmode] =
    useState(0)
  const [userLimit, setUserLimit] =
    useState(0)

  const [submitting, setSubmitting] =
    useState(false)
  const [error, setError] =
    useState<string | null>(null)
  const [success, setSuccess] =
    useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setName("")
    setKind("text")
    setParentId("")
    setTopic("")
    setNsfw(false)
    setSlowmode(0)
    setUserLimit(0)
    setError(null)
    setSuccess(null)
    setSubmitting(false)
  }, [open])

  async function submit() {
    if (!name.trim()) {
      setError(
        "Channel name is required."
      )
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/channels`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            kind,
            parentId:
              parentId || null,
            topic,
            nsfw,
            rateLimitPerUser:
              slowmode,
            userLimit,
          }),
        }
      )

      const data =
        (await response.json()) as ChannelActionResponse

      if (
        !response.ok ||
        !data.success ||
        !data.channel
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to create channel."
        )
      }

      setSuccess(
        data.message ??
          "Channel created successfully."
      )

      onCreated(data.channel)

      window.setTimeout(
        onClose,
        700
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create channel."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <DialogShell
      title="Create Channel"
      description="Create a new server channel or category."
      submitting={submitting}
      error={error}
      success={success}
      onClose={onClose}
      onSubmit={() =>
        void submit()
      }
      submitLabel="Create channel"
      submitIcon={
        <Plus className="size-4" />
      }
    >
      <ChannelForm
        name={name}
        setName={setName}
        kind={kind}
        setKind={setKind}
        parentId={parentId}
        setParentId={setParentId}
        topic={topic}
        setTopic={setTopic}
        nsfw={nsfw}
        setNsfw={setNsfw}
        slowmode={slowmode}
        setSlowmode={setSlowmode}
        userLimit={userLimit}
        setUserLimit={setUserLimit}
        categories={categories}
      />
    </DialogShell>
  )
}

export function ChannelForm({
  name,
  setName,
  kind,
  setKind,
  parentId,
  setParentId,
  topic,
  setTopic,
  nsfw,
  setNsfw,
  slowmode,
  setSlowmode,
  userLimit,
  setUserLimit,
  categories,
}: {
  name: string
  setName: (value: string) => void
  kind: ChannelKind
  setKind: (value: ChannelKind) => void
  parentId: string
  setParentId: (value: string) => void
  topic: string
  setTopic: (value: string) => void
  nsfw: boolean
  setNsfw: (value: boolean) => void
  slowmode: number
  setSlowmode: (value: number) => void
  userLimit: number
  setUserLimit: (value: number) => void
  categories: ServerChannel[]
}) {
  const isVoice =
    kind === "voice" ||
    kind === "stage"

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-xs font-medium">
          Channel name
        </span>
        <input
          value={name}
          onChange={(event) =>
            setName(
              event.target.value.slice(
                0,
                100
              )
            )
          }
          placeholder="general"
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium">
          Channel type
        </span>
        <select
          value={kind}
          onChange={(event) =>
            setKind(
              event.target
                .value as ChannelKind
            )
          }
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="text">
            Text
          </option>
          <option value="announcement">
            Announcement
          </option>
          <option value="voice">
            Voice
          </option>
          <option value="stage">
            Stage
          </option>
          <option value="forum">
            Forum
          </option>
          <option value="media">
            Media
          </option>
          <option value="category">
            Category
          </option>
        </select>
      </label>

      {kind !== "category" && (
        <label className="block">
          <span className="text-xs font-medium">
            Category
          </span>
          <select
            value={parentId}
            onChange={(event) =>
              setParentId(
                event.target.value
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
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

      {!isVoice &&
        kind !== "category" && (
          <label className="block">
            <span className="text-xs font-medium">
              Topic
            </span>
            <textarea
              value={topic}
              onChange={(event) =>
                setTopic(
                  event.target.value.slice(
                    0,
                    1024
                  )
                )
              }
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
        )}

      {!isVoice &&
        kind !== "category" && (
          <label className="block">
            <span className="text-xs font-medium">
              Slowmode (seconds)
            </span>
            <input
              type="number"
              min={0}
              max={21600}
              value={slowmode}
              onChange={(event) =>
                setSlowmode(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        )}

      {isVoice && (
        <label className="block">
          <span className="text-xs font-medium">
            User limit
          </span>
          <input
            type="number"
            min={0}
            max={99}
            value={userLimit}
            onChange={(event) =>
              setUserLimit(
                Number(
                  event.target.value
                )
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
        </label>
      )}

      {!isVoice &&
        kind !== "category" && (
          <button
            type="button"
            onClick={() =>
              setNsfw(!nsfw)
            }
            className="flex w-full items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3"
          >
            <div className="text-left">
              <p className="text-sm font-medium">
                NSFW channel
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Require age confirmation
                before viewing.
              </p>
            </div>

            <span
              className={`relative h-6 w-11 rounded-full transition ${
                nsfw
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition ${
                  nsfw
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </span>
          </button>
        )}
    </div>
  )
}

export function DialogShell({
  title,
  description,
  submitting,
  error,
  success,
  onClose,
  onSubmit,
  submitLabel,
  submitIcon,
  children,
}: {
  title: string
  description: string
  submitting: boolean
  error: string | null
  success: string | null
  onClose: () => void
  onSubmit: () => void
  submitLabel: string
  submitIcon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <section className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-semibold">
              {title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
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

        <div className="overflow-y-auto p-6">
          {children}

          {error && (
            <div className="mt-4 flex gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3 text-sm text-emerald-300">
              <Check className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
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
            className="gap-2"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              submitIcon
            )}
            {submitLabel}
          </Button>
        </footer>
      </section>
    </div>
  )
}