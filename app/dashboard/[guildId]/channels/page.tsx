"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams } from "next/navigation"
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { ChannelSidebar } from "@/components/dashboard/channels/ChannelSidebar"
import { ChannelsTable } from "@/components/dashboard/channels/ChannelsTable"
import { ChannelsToolbar } from "@/components/dashboard/channels/ChannelsToolbar"
import { CloneChannelDialog } from "@/components/dashboard/channels/CloneChannelDialog"
import { CreateChannelDialog } from "@/components/dashboard/channels/CreateChannelDialog"
import { DeleteChannelDialog } from "@/components/dashboard/channels/DeleteChannelDialog"
import { EditChannelDialog } from "@/components/dashboard/channels/EditChannelDialog"

import type {
  ChannelKind,
  ChannelSort,
  ChannelsApiResponse,
  ServerChannel,
} from "@/components/dashboard/channels/types"

export default function ChannelsPage() {
  const params = useParams<{
    guildId: string
  }>()

  const guildId = params.guildId

  const [channels, setChannels] =
    useState<ServerChannel[]>([])

  const [guildName, setGuildName] =
    useState("Discord server")

  const [
    selectedChannel,
    setSelectedChannel,
  ] = useState<ServerChannel | null>(
    null
  )

  const [createOpen, setCreateOpen] =
    useState(false)

  const [editChannel, setEditChannel] =
    useState<ServerChannel | null>(
      null
    )

  const [
    cloneChannel,
    setCloneChannel,
  ] = useState<ServerChannel | null>(
    null
  )

  const [
    deleteChannel,
    setDeleteChannel,
  ] = useState<ServerChannel | null>(
    null
  )

  const [search, setSearch] =
    useState("")

  const [typeFilter, setTypeFilter] =
    useState<ChannelKind | "all">(
      "all"
    )

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all")

  const [sort, setSort] =
    useState<ChannelSort>(
      "position-asc"
    )

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const loadChannels = useCallback(
    async (silent = false) => {
      try {
        if (silent) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/channels`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept:
                "application/json",
            },
          }
        )

        const text =
          await response.text()

        let data: ChannelsApiResponse

        try {
          data = text
            ? (JSON.parse(
                text
              ) as ChannelsApiResponse)
            : {
                success: response.ok,
              }
        } catch {
          throw new Error(
            "The channels API returned invalid JSON"
          )
        }

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ??
              data.message ??
              "Failed to load channels"
          )
        }

        setChannels(
          data.channels ?? []
        )

        if (data.guild?.name) {
          setGuildName(
            data.guild.name
          )
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load channels"
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [guildId]
  )

  useEffect(() => {
    void loadChannels()
  }, [loadChannels])

  const categories = useMemo(
    () =>
      channels.filter(
        (channel) =>
          channel.kind ===
          "category"
      ),
    [channels]
  )

  const filteredChannels =
    useMemo(() => {
      const query =
        search.trim().toLowerCase()

      const result =
        channels.filter(
          (channel) => {
            const matchesSearch =
              !query ||
              channel.name
                .toLowerCase()
                .includes(query) ||
              channel.id.includes(query)

            const matchesType =
              typeFilter === "all" ||
              channel.kind ===
                typeFilter

            const matchesCategory =
              categoryFilter === "all" ||
              (categoryFilter ===
                "none"
                ? !channel.parentId
                : channel.parentId ===
                  categoryFilter ||
                  channel.id ===
                    categoryFilter)

            return (
              matchesSearch &&
              matchesType &&
              matchesCategory
            )
          }
        )

      return [...result].sort(
        (first, second) => {
          switch (sort) {
            case "position-desc":
              return (
                second.position -
                first.position
              )

            case "name-asc":
              return first.name.localeCompare(
                second.name
              )

            case "name-desc":
              return second.name.localeCompare(
                first.name
              )

            case "members-desc":
              return (
                (second.connectedMembers ??
                  second.memberCount ??
                  0) -
                (first.connectedMembers ??
                  first.memberCount ??
                  0)
              )

            case "members-asc":
              return (
                (first.connectedMembers ??
                  first.memberCount ??
                  0) -
                (second.connectedMembers ??
                  second.memberCount ??
                  0)
              )

            case "position-asc":
            default:
              return (
                first.position -
                second.position
              )
          }
        }
      )
    }, [
      channels,
      search,
      typeFilter,
      categoryFilter,
      sort,
    ])

  const counts = useMemo(() => {
    return {
      all: channels.filter(
        (channel) =>
          channel.kind !==
          "category"
      ).length,

      text: channels.filter(
        (channel) =>
          [
            "text",
            "announcement",
            "forum",
            "media",
          ].includes(channel.kind)
      ).length,

      voice: channels.filter(
        (channel) =>
          [
            "voice",
            "stage",
          ].includes(channel.kind)
      ).length,

      categories:
        categories.length,

      private: channels.filter(
        (channel) =>
          channel.viewable === false
      ).length,
    }
  }, [channels, categories])

  function upsertChannel(
    updatedChannel: ServerChannel
  ) {
    setChannels((current) => {
      const exists = current.some(
        (channel) =>
          channel.id ===
          updatedChannel.id
      )

      if (!exists) {
        return [
          updatedChannel,
          ...current,
        ]
      }

      return current.map(
        (channel) =>
          channel.id ===
          updatedChannel.id
            ? updatedChannel
            : channel
      )
    })

    setSelectedChannel(
      updatedChannel
    )
  }

  function removeChannel(
    channelId: string
  ) {
    setChannels((current) =>
      current.filter(
        (channel) =>
          channel.id !==
          channelId
      )
    )

    setSelectedChannel(
      (current) =>
        current?.id ===
        channelId
          ? null
          : current
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading server channels...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 text-center">
          <AlertTriangle className="mx-auto size-10 text-red-400" />

          <h2 className="mt-4 text-lg font-semibold">
            Failed to load channels
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error}
          </p>

          <Button
            type="button"
            className="mt-5 gap-2"
            onClick={() =>
              void loadChannels()
            }
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <ChannelsToolbar
          guildName={guildName}
          totalChannels={
            counts.all
          }
          textChannels={
            counts.text
          }
          voiceChannels={
            counts.voice
          }
          categoriesCount={
            counts.categories
          }
          privateChannels={
            counts.private
          }
          search={search}
          typeFilter={typeFilter}
          categoryFilter={
            categoryFilter
          }
          sort={sort}
          categories={categories}
          refreshing={refreshing}
          onSearchChange={setSearch}
          onTypeFilterChange={
            setTypeFilter
          }
          onCategoryFilterChange={
            setCategoryFilter
          }
          onSortChange={setSort}
          onRefresh={() =>
            void loadChannels(true)
          }
          onCreateChannel={() =>
            setCreateOpen(true)
          }
        />

        <ChannelsTable
          channels={
            filteredChannels
          }
          categories={
            categories.filter(
              (category) =>
                filteredChannels.some(
                  (channel) =>
                    channel.id ===
                      category.id ||
                    channel.parentId ===
                      category.id
                )
            )
          }
          onSelectChannel={
            setSelectedChannel
          }
        />
      </div>

      <CreateChannelDialog
        guildId={guildId}
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        categories={categories}
        onCreated={(channel) => {
          upsertChannel(channel)
          setCreateOpen(false)
        }}
      />

      <EditChannelDialog
        guildId={guildId}
        open={Boolean(
          editChannel
        )}
        onClose={() =>
          setEditChannel(null)
        }
        channel={editChannel}
        categories={categories}
        onUpdated={(channel) => {
          upsertChannel(channel)
          setEditChannel(null)
        }}
      />

      <CloneChannelDialog
        guildId={guildId}
        open={Boolean(
          cloneChannel
        )}
        onClose={() =>
          setCloneChannel(null)
        }
        channel={cloneChannel}
        onCloned={(channel) => {
          upsertChannel(channel)
          setCloneChannel(null)
        }}
      />

      <DeleteChannelDialog
        guildId={guildId}
        open={Boolean(
          deleteChannel
        )}
        onClose={() =>
          setDeleteChannel(null)
        }
        channel={deleteChannel}
        onDeleted={(channelId) => {
          removeChannel(channelId)
          setDeleteChannel(null)
        }}
      />

      {selectedChannel && (
        <ChannelSidebar
          channel={selectedChannel}
          onClose={() =>
            setSelectedChannel(null)
          }
          onEdit={(channel) => {
            setSelectedChannel(null)
            setEditChannel(channel)
          }}
          onClone={(channel) => {
            setSelectedChannel(null)
            setCloneChannel(channel)
          }}
          onDelete={(channel) => {
            setSelectedChannel(null)
            setDeleteChannel(channel)
          }}
        />
      )}
    </div>
  )
}