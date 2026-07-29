"use client"

import {
  AlertTriangle,
  Copy,
  Lock,
  RefreshCcw,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export type AdvancedTabProps = {
  disabled?: boolean
  syncing?: boolean
  onClone: () => void
  onSyncPermissions: () => void
  onLockChannel: () => void
  onDelete: () => void
}

export function AdvancedTab({
  disabled=false,
  syncing=false,
  onClone,
  onSyncPermissions,
  onLockChannel,
  onDelete,
}:AdvancedTabProps){
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Channel tools</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Advanced maintenance actions for this channel.
        </p>

        <div className="mt-5 grid gap-3">
          <ActionRow
            icon={<Copy className="size-4"/>}
            title="Clone channel"
            description="Create a copy with the same settings."
          >
            <Button disabled={disabled} onClick={onClone}>
              Clone
            </Button>
          </ActionRow>

          <ActionRow
            icon={<RefreshCcw className="size-4"/>}
            title="Sync permissions"
            description="Replace overrides with the parent category permissions."
          >
            <Button
              variant="outline"
              disabled={disabled||syncing}
              onClick={onSyncPermissions}
            >
              {syncing?"Syncing...":"Sync"}
            </Button>
          </ActionRow>

          <ActionRow
            icon={<Lock className="size-4"/>}
            title="Lock channel"
            description="Prevent members from sending messages."
          >
            <Button
              variant="outline"
              disabled={disabled}
              onClick={onLockChannel}
            >
              Lock
            </Button>
          </ActionRow>
        </div>
      </section>

      <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 text-red-400"/>
          <div>
            <h3 className="font-semibold text-red-300">
              Danger Zone
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleting a channel permanently removes its messages and settings.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Button
            variant="destructive"
            className="gap-2"
            disabled={disabled}
            onClick={onDelete}
          >
            <Trash2 className="size-4"/>
            Delete Channel
          </Button>
        </div>
      </section>
    </div>
  )
}

function ActionRow({
  icon,
  title,
  description,
  children,
}:{
  icon:React.ReactNode
  title:string
  description:string
  children:React.ReactNode
}){
  return(
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}