"use client"

import {
  Folder,
  Hash,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Volume2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type {
  ChannelKind,
  ChannelSort,
  ServerChannel,
} from "./types"

type ChannelsToolbarProps = {
  guildName: string
  totalChannels: number
  textChannels: number
  voiceChannels: number
  categoriesCount: number
  privateChannels: number
  search: string
  typeFilter: ChannelKind | "all"
  categoryFilter: string
  sort: ChannelSort
  categories: ServerChannel[]
  refreshing: boolean
  onSearchChange: (value: string) => void
  onTypeFilterChange: (
    value: ChannelKind | "all"
  ) => void
  onCategoryFilterChange: (
    value: string
  ) => void
  onSortChange: (
    value: ChannelSort
  ) => void
  onRefresh: () => void
  onCreateChannel: () => void
}

export function ChannelsToolbar({
  guildName,
  totalChannels,
  textChannels,
  voiceChannels,
  categoriesCount,
  privateChannels,
  search,
  typeFilter,
  categoryFilter,
  sort,
  categories,
  refreshing,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onSortChange,
  onRefresh,
  onCreateChannel,
}: ChannelsToolbarProps) {
  return (
    <>
      <header className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Hash className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                Channels
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage channels, categories and
                settings in {guildName}.
              </p>
            </div>
          </div>

          <Button
            type="button"
            className="gap-2"
            onClick={onCreateChannel}
          >
            <Plus className="size-4" />
            Create channel
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={<Hash className="size-5" />}
            label="Total channels"
            value={totalChannels}
          />

          <StatCard
            icon={<Hash className="size-5" />}
            label="Text channels"
            value={textChannels}
          />

          <StatCard
            icon={<Volume2 className="size-5" />}
            label="Voice channels"
            value={voiceChannels}
          />

          <StatCard
            icon={<Folder className="size-5" />}
            label="Categories"
            value={categoriesCount}
          />

          <StatCard
            icon={<Lock className="size-5" />}
            label="Private channels"
            value={privateChannels}
          />
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search channels..."
            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(event) =>
            onTypeFilterChange(
              event.target.value as
                | ChannelKind
                | "all"
            )
          }
          className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
        >
          <option value="all">
            All types
          </option>
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
            Categories
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            onCategoryFilterChange(
              event.target.value
            )
          }
          className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
        >
          <option value="all">
            All categories
          </option>
          <option value="none">
            No category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target
                .value as ChannelSort
            )
          }
          className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
        >
          <option value="position-asc">
            Position: First
          </option>
          <option value="position-desc">
            Position: Last
          </option>
          <option value="name-asc">
            Name: A-Z
          </option>
          <option value="name-desc">
            Name: Z-A
          </option>
          <option value="members-desc">
            Members: Most
          </option>
          <option value="members-asc">
            Members: Least
          </option>
        </select>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={refreshing}
          onClick={onRefresh}
        >
          <RefreshCw
            className={cn(
              "size-4",
              refreshing &&
                "animate-spin"
            )}
          />
          Refresh
        </Button>
      </div>
    </>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}