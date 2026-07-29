"use client"

import { useEffect, useState } from "react"
import { Copy } from "lucide-react"

import {
  ChannelForm,
  DialogShell,
} from "./CreateChannelDialog"

import type {
  ChannelKind,
  CloneChannelDialogProps,
  ServerChannel,
} from "./types"

type ChannelActionResponse = {
  success: boolean
  error?: string
  message?: string
  channel?: ServerChannel
}

export function CloneChannelDialog({
  guildId,
  open,
  onClose,
  channel,
  onCloned,
}: CloneChannelDialogProps) {
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
    if (!open || !channel) {
      return
    }

    setName(`${channel.name}-copy`)
    setKind(channel.kind)
    setParentId(
      channel.parentId ?? ""
    )
    setTopic(channel.topic ?? "")
    setNsfw(channel.nsfw ?? false)
    setSlowmode(
      channel.rateLimitPerUser ?? 0
    )
    setUserLimit(
      channel.userLimit ?? 0
    )
    setSubmitting(false)
    setError(null)
    setSuccess(null)
  }, [open, channel])

  async function submit() {
    if (!channel) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/channels`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            channelId: channel.id,
            action: "clone",
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
            "Failed to clone channel."
        )
      }

      setSuccess(
        data.message ??
          "Channel cloned successfully."
      )

      onCloned(data.channel)

      window.setTimeout(
        onClose,
        700
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to clone channel."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !channel) {
    return null
  }

  return (
    <DialogShell
      title="Clone Channel"
      description="Create a copy with the same settings."
      submitting={submitting}
      error={error}
      success={success}
      onClose={onClose}
      onSubmit={() =>
        void submit()
      }
      submitLabel="Clone channel"
      submitIcon={
        <Copy className="size-4" />
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
        categories={[]}
      />
    </DialogShell>
  )
}