"use client"

import { Search, Shield, User } from "lucide-react"

export type PermissionSearchProps = {
  value: string
  placeholder?: string
  resultCount?: number
  onChange: (value: string) => void
}

export function PermissionSearch({
  value,
  placeholder = "Search permissions...",
  resultCount,
  onChange,
}: PermissionSearchProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Shield className="size-3.5"/>
            Roles
          </span>
          <span className="flex items-center gap-1">
            <User className="size-3.5"/>
            Members
          </span>
        </div>

        {typeof resultCount==="number" && (
          <span>{resultCount} results</span>
        )}
      </div>
    </div>
  )
}