"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Copy,
  Shield,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { RoleTab, ServerRole } from "./types"

type RoleSidebarProps = {
  role: ServerRole
  onClose: () => void
  onEdit: (role: ServerRole) => void
  onClone: (role: ServerRole) => void
  onDelete: (role: ServerRole) => void
}

function normalizeRoleColor(color: string | null) {
  if (!color || color === "#000000" || color === "#00000000") {
    return "#8b8d98"
  }

  return color
}

export function RoleSidebar({
  role,
  onClose,
  onEdit,
  onClone,
  onDelete,
}: RoleSidebarProps) {
  const [tab, setTab] = useState<RoleTab>("overview")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTab("overview")

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [role.id, onClose])

  async function copyId() {
    await navigator.clipboard.writeText(role.id)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1200)
  }

  const color = normalizeRoleColor(role.color)

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close role details"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[470px] overflow-y-auto border-l border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="font-semibold">Role details</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              View role information, permissions and members.
            </p>
          </div>

          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex items-start gap-4">
              <div
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/10"
                style={{
                  backgroundColor: `${color}1f`,
                  color,
                }}
              >
                <Shield className="size-7" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">{role.name}</h3>

                  {role.managed && (
                    <span className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                      Managed
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {role.color ?? "#000000"}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">ID: {role.id}</span>

                  <button
                    type="button"
                    onClick={() => void copyId()}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-5 gap-1 rounded-xl border border-border bg-background/30 p-1">
            {(
              [
                ["overview", "Overview"],
                ["members", "Members"],
                ["permissions", "Permissions"],
                ["analytics", "Analytics"],
                ["logs", "Logs"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-lg px-2 py-2 text-[11px] font-medium transition",
                  tab === value
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Position" value={String(role.position)} />
              <InfoCard label="Members" value={String(role.memberCount)} />
              <InfoCard label="Hoisted" value={role.hoist ? "Yes" : "No"} />
              <InfoCard
                label="Mentionable"
                value={role.mentionable ? "Yes" : "No"}
              />
            </div>
          )}

          {tab === "members" && (
            <EmptyState
              icon={<Users className="size-9" />}
              title={`${role.memberCount} members`}
              description="Role member management will be connected from the Members API."
            />
          )}

          {tab === "permissions" && (
            <div className="space-y-2">
              {role.permissions.length === 0 ? (
                <EmptyState
                  icon={<Shield className="size-9" />}
                  title="No permissions"
                  description="This role does not have enabled permissions."
                />
              ) : (
                role.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3"
                  >
                    <span className="text-sm">{permission}</span>
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <Check className="size-3.5" />
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "analytics" && (
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Members" value={String(role.memberCount)} />
              <InfoCard
                label="Permissions"
                value={String(role.permissions.length)}
              />
            </div>
          )}

          {tab === "logs" && (
            <EmptyState
              icon={<SlidersHorizontal className="size-9" />}
              title="No role logs yet"
              description="Role changes will appear here after audit logging is connected."
            />
          )}

          <div className="grid grid-cols-3 gap-2 border-t border-border pt-5">
            <Button
              type="button"
              disabled={role.managed}
              onClick={() => onEdit(role)}
            >
              Edit
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={role.managed}
              onClick={() => onClone(role)}
            >
              Clone
            </Button>

            <Button
              type="button"
              variant="outline"
              className="text-red-400 hover:text-red-300"
              disabled={role.managed}
              onClick={() => onDelete(role)}
            >
              Delete
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center text-muted-foreground">
      <div className="mx-auto w-fit opacity-40">{icon}</div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  )
}