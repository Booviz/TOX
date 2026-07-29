"use client"

import {
  Copy,
  Folder,
  Hash,
  Lock,
  Pencil,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type { ServerChannel } from "./types"

type ChannelSidebarProps = {
  channel: ServerChannel
  onClose: () => void
  onEdit: (
    channel: ServerChannel
  ) => void
  onClone: (
    channel: ServerChannel
  ) => void
  onDelete: (
    channel: ServerChannel
  ) => void
}

export function ChannelSidebar({
  channel,
  onClose,
  onEdit,
  onClone,
  onDelete,
}: ChannelSidebarProps) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close channel details"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[470px] overflow-y-auto border-l border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="font-semibold">
              Channel details
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              View settings and permissions.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Hash className="size-7" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">
                    {channel.name}
                  </h3>

                  <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] text-primary">
                    {channel.kind}
                  </span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  ID: {channel.id}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label="Category"
              value={
                channel.parentName ??
                "No category"
              }
              icon={
                <Folder className="size-4" />
              }
            />

            <InfoCard
              label="Position"
              value={String(
                channel.position
              )}
              icon={
                <Hash className="size-4" />
              }
            />

            <InfoCard
              label="Members"
              value={String(
                channel.connectedMembers ??
                  channel.memberCount ??
                  0
              )}
              icon={
                <Users className="size-4" />
              }
            />

            <InfoCard
              label="Private"
              value={
                channel.viewable === false
                  ? "Yes"
                  : "No"
              }
              icon={
                <Lock className="size-4" />
              }
            />
          </div>

          <section className="rounded-2xl border border-border bg-background/40 p-4">
            <h3 className="font-semibold">
              Channel settings
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <DetailRow
                label="Topic"
                value={
                  channel.topic ||
                  "No topic"
                }
              />

              <DetailRow
                label="Slowmode"
                value={`${channel.rateLimitPerUser ?? 0}s`}
              />

              <DetailRow
                label="NSFW"
                value={
                  channel.nsfw
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <DetailRow
                label="User limit"
                value={String(
                  channel.userLimit ?? 0
                )}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <h3 className="font-semibold">
                Permission overwrites
              </h3>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {
                channel
                  .permissionOverwrites
                  ?.length ?? 0
              }{" "}
              custom permission entries
            </p>
          </section>

          <div className="grid grid-cols-3 gap-2 border-t border-border pt-5">
            <Button
              type="button"
              className="gap-2"
              onClick={() =>
                onEdit(channel)
              }
            >
              <Pencil className="size-4" />
              Edit
            </Button>

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() =>
                onClone(channel)
              }
            >
              <Copy className="size-4" />
              Clone
            </Button>

            <Button
              type="button"
              variant="outline"
              className="gap-2 text-red-400 hover:text-red-300"
              onClick={() =>
                onDelete(channel)
              }
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-[11px] uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span className="max-w-[230px] text-right font-medium">
        {value}
      </span>
    </div>
  )
}