"use client"

import {
  Check,
  Search,
  Shield,
  User,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type PermissionTargetType =
  | "role"
  | "member"

export type PermissionTarget = {
  id: string
  name: string
  type: PermissionTargetType
  color?: string | null
  avatar?: string | null
  managed?: boolean
}

export type PermissionSelectorProps = {
  targets: PermissionTarget[]
  selectedId: string | null
  search: string
  disabled?: boolean
  onSearchChange: (value: string) => void
  onSelect: (
    target: PermissionTarget
  ) => void
  onRemove?: (
    target: PermissionTarget
  ) => void
}

export function PermissionSelector({
  targets,
  selectedId,
  search,
  disabled = false,
  onSearchChange,
  onSelect,
  onRemove,
}: PermissionSelectorProps) {
  const query =
    search.trim().toLowerCase()

  const filteredTargets =
    targets.filter((target) => {
      if (!query) {
        return true
      }

      return (
        target.name
          .toLowerCase()
          .includes(query) ||
        target.id.includes(query)
      )
    })

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            disabled={disabled}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search roles or members..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto p-2">
        {filteredTargets.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Search className="mx-auto size-8 text-muted-foreground/30" />

            <p className="mt-3 text-sm font-medium">
              No permission targets found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try a different name or ID.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTargets.map(
              (target) => {
                const active =
                  selectedId === target.id

                return (
                  <div
                    key={`${target.type}:${target.id}`}
                    className={cn(
                      "group flex items-center gap-2 rounded-xl border transition",
                      active
                        ? "border-primary/40 bg-primary/[0.08]"
                        : "border-transparent hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        onSelect(target)
                      }
                      className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <TargetAvatar
                        target={target}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {target.name}
                          </p>

                          <span className="rounded-md bg-muted px-2 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
                            {target.type}
                          </span>

                          {target.managed && (
                            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[9px] text-primary">
                              Managed
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-[10px] text-muted-foreground">
                          {target.id}
                        </p>
                      </div>

                      {active && (
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>

                    {onRemove && (
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          onRemove(target)
                        }
                        className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Remove ${target.name}`}
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                )
              }
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TargetAvatar({
  target,
}: {
  target: PermissionTarget
}) {
  if (
    target.type === "member" &&
    target.avatar
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={target.avatar}
        alt={target.name}
        className="size-9 shrink-0 rounded-xl object-cover"
      />
    )
  }

  const color =
    target.color &&
    target.color !== "#000000"
      ? target.color
      : "#8b8d98"

  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
      style={{
        color,
        backgroundColor: `${color}1f`,
      }}
    >
      {target.type === "role" ? (
        <Shield className="size-4" />
      ) : (
        <User className="size-4" />
      )}
    </div>
  )
}