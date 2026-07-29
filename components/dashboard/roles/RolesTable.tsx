"use client"

import {
  ChevronLeft,
  ChevronRight,
  Crown,
  MoreHorizontal,
  Shield,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type { ServerRole } from "./types"

type RolesTableProps = {
  roles: ServerRole[]
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onSelectRole: (role: ServerRole) => void
}

function normalizeRoleColor(color: string | null) {
  if (!color || color === "#000000" || color === "#00000000") {
    return "#8b8d98"
  }

  return color
}

function roleInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export function RolesTable({
  roles,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onSelectRole,
}: RolesTableProps) {
  const firstItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalCount)
  const highestPosition = roles.reduce(
    (highest, role) => Math.max(highest, role.position),
    0
  )

  return (
    <section className="overflow-hidden rounded-b-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4 font-medium">Role</th>
              <th className="px-5 py-4 font-medium">Members</th>
              <th className="px-5 py-4 font-medium">Position</th>
              <th className="px-5 py-4 font-medium">Permissions</th>
              <th className="px-5 py-4 font-medium">Color</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <Shield className="mx-auto size-9 text-muted-foreground/30" />
                  <h3 className="mt-4 font-semibold">No roles found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try changing your search or sorting.
                  </p>
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                const color = normalizeRoleColor(role.color)

                return (
                  <tr
                    key={role.id}
                    onClick={() => onSelectRole(role)}
                    className="cursor-pointer border-b border-border/70 transition last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xs font-bold"
                          style={{
                            backgroundColor: `${color}1f`,
                            color,
                          }}
                        >
                          {role.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={role.icon}
                              alt={role.name}
                              className="size-6 object-contain"
                            />
                          ) : (
                            roleInitials(role.name)
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold">
                              {role.name}
                            </p>

                            {role.position === highestPosition && (
                              <Crown className="size-3.5 text-amber-400" />
                            )}

                            {role.managed && (
                              <span className="rounded-md bg-muted px-2 py-1 text-[9px] text-muted-foreground">
                                Managed
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-[11px] text-muted-foreground">
                            {role.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-muted-foreground" />
                        {role.memberCount}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">{role.position}</td>

                    <td className="px-5 py-4 text-sm">
                      {role.permissions.length}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {role.color ?? "#000000"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation()
                          onSelectRole(role)
                        }}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {firstItem} to {lastItem} of {totalCount} roles
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 text-sm font-semibold text-primary">
            {page}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}