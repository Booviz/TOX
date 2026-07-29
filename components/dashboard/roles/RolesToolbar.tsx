"use client"

import { Plus, RefreshCw, Search, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { RoleSort } from "./types"

type RolesToolbarProps = {
  guildName: string
  totalRoles: number
  managedRoles: number
  totalAssignments: number
  search: string
  sort: RoleSort
  refreshing: boolean
  onSearchChange: (value: string) => void
  onSortChange: (value: RoleSort) => void
  onRefresh: () => void
  onCreateRole: () => void
}

export function RolesToolbar({
  guildName,
  totalRoles,
  managedRoles,
  totalAssignments,
  search,
  sort,
  refreshing,
  onSearchChange,
  onSortChange,
  onRefresh,
  onCreateRole,
}: RolesToolbarProps) {
  return (
    <>
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">Roles</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage roles, permissions and members in {guildName}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatCard label="Total roles" value={totalRoles} />
          <StatCard label="Managed" value={managedRoles} />
          <StatCard label="Role assignments" value={totalAssignments} />

          <Button type="button" className="gap-2" onClick={onCreateRole}>
            <Plus className="size-4" />
            Create role
          </Button>
        </div>
      </header>

      <div className="mt-7 flex flex-col gap-3 rounded-t-2xl border border-b-0 border-border bg-card p-4 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search roles by name or ID..."
            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
          />
        </div>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as RoleSort)}
          className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
        >
          <option value="position-desc">Position: Highest</option>
          <option value="position-asc">Position: Lowest</option>
          <option value="members-desc">Members: Most</option>
          <option value="members-asc">Members: Least</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={refreshing}
          onClick={onRefresh}
        >
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}