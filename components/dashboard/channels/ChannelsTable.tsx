"use client"

import {
  Folder,
  Hash,
  Megaphone,
  MessageSquareText,
  MoreHorizontal,
  Radio,
  Volume2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type {
  ChannelKind,
  ServerChannel,
} from "./types"

type ChannelsTableProps = {
  channels: ServerChannel[]
  categories: ServerChannel[]
  onSelectChannel: (
    channel: ServerChannel
  ) => void
}

export function ChannelsTable({
  channels,
  categories,
  onSelectChannel,
}: ChannelsTableProps) {
  const uncategorized =
    channels.filter(
      (channel) =>
        channel.kind !== "category" &&
        !channel.parentId
    )

  const grouped = categories.map(
    (category) => ({
      category,
      children: channels.filter(
        (channel) =>
          channel.parentId ===
          category.id
      ),
    })
  )

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">
          Channels
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {channels.length} channels found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4 font-medium">
                Channel
              </th>
              <th className="px-5 py-4 font-medium">
                Type
              </th>
              <th className="px-5 py-4 font-medium">
                Members
              </th>
              <th className="px-5 py-4 font-medium">
                Position
              </th>
              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {uncategorized.length > 0 && (
              <>
                <CategoryRow
                  name="No category"
                  count={
                    uncategorized.length
                  }
                />

                {uncategorized.map(
                  (channel) => (
                    <ChannelRow
                      key={channel.id}
                      channel={channel}
                      onSelectChannel={
                        onSelectChannel
                      }
                    />
                  )
                )}
              </>
            )}

            {grouped.map(
              ({ category, children }) => (
                <ChannelGroup
                  key={category.id}
                  category={category}
                  childrenChannels={
                    children
                  }
                  onSelectChannel={
                    onSelectChannel
                  }
                />
              )
            )}

            {channels.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center"
                >
                  <Hash className="mx-auto size-10 text-muted-foreground/30" />
                  <h3 className="mt-4 font-semibold">
                    No channels found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Change filters or create a
                    new channel.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ChannelGroup({
  category,
  childrenChannels,
  onSelectChannel,
}: {
  category: ServerChannel
  childrenChannels: ServerChannel[]
  onSelectChannel: (
    channel: ServerChannel
  ) => void
}) {
  return (
    <>
      <CategoryRow
        name={category.name}
        count={childrenChannels.length}
        onClick={() =>
          onSelectChannel(category)
        }
      />

      {childrenChannels.map(
        (channel) => (
          <ChannelRow
            key={channel.id}
            channel={channel}
            onSelectChannel={
              onSelectChannel
            }
          />
        )
      )}
    </>
  )
}

function CategoryRow({
  name,
  count,
  onClick,
}: {
  name: string
  count: number
  onClick?: () => void
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-border bg-muted/20"
    >
      <td
        colSpan={5}
        className="px-5 py-3"
      >
        <div className="flex items-center gap-2">
          <Folder className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {count}
          </span>
        </div>
      </td>
    </tr>
  )
}

function ChannelRow({
  channel,
  onSelectChannel,
}: {
  channel: ServerChannel
  onSelectChannel: (
    channel: ServerChannel
  ) => void
}) {
  return (
    <tr
      onClick={() =>
        onSelectChannel(channel)
      }
      className="cursor-pointer border-b border-border/70 transition last:border-b-0 hover:bg-muted/30"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ChannelIcon
              kind={channel.kind}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">
              {channel.name}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {channel.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-sm capitalize">
        {channel.kind}
      </td>

      <td className="px-5 py-4 text-sm">
        {channel.connectedMembers ??
          channel.memberCount ??
          "—"}
      </td>

      <td className="px-5 py-4 text-sm">
        {channel.position}
      </td>

      <td className="px-5 py-4 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(event) => {
            event.stopPropagation()
            onSelectChannel(channel)
          }}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}

function ChannelIcon({
  kind,
}: {
  kind: ChannelKind
}) {
  switch (kind) {
    case "voice":
      return <Volume2 className="size-4" />
    case "stage":
      return <Radio className="size-4" />
    case "announcement":
      return <Megaphone className="size-4" />
    case "forum":
    case "media":
      return (
        <MessageSquareText className="size-4" />
      )
    case "category":
      return <Folder className="size-4" />
    default:
      return <Hash className="size-4" />
  }
}