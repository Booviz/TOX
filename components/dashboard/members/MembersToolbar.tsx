"use client"

import {
  Bot,
  Filter,
  RefreshCw,
  Search,
  UserRound,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/i18n"
import type { MemberRole } from "./types"

type MembersToolbarProps = {
  search: string
  onSearchChange: (value: string) => void

  memberType: string
  onMemberTypeChange: (value: string) => void

  roleId: string
  onRoleChange: (value: string) => void

  sort: string
  onSortChange: (value: string) => void

  roles: MemberRole[]

  refreshing: boolean
  onRefresh: () => void
}

export function MembersToolbar({
  search,
  onSearchChange,
  memberType,
  onMemberTypeChange,
  roleId,
  onRoleChange,
  sort,
  onSortChange,
  roles,
  refreshing,
  onRefresh,
}: MembersToolbarProps) {
  const { t } = useLocale()

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_180px_220px_190px_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder={t("members.searchPlaceholder")}
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <label className="relative">
          <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <select
            value={memberType}
            onChange={(event) =>
              onMemberTypeChange(event.target.value)
            }
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
          >
            <option value="ALL">
              {t("members.filter.all")}
            </option>

            <option value="HUMANS">
              {t("members.filter.humans")}
            </option>

            <option value="BOTS">
              {t("members.filter.bots")}
            </option>

            <option value="ONLINE">
              {t("members.filter.online")}
            </option>

            <option value="OFFLINE">
              {t("members.filter.offline")}
            </option>

            <option value="TIMED_OUT">
              {t("members.filter.timedOut")}
            </option>
          </select>
        </label>

        <label className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <select
            value={roleId}
            onChange={(event) =>
              onRoleChange(event.target.value)
            }
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
          >
            <option value="ALL">
              {t("members.filter.allRoles")}
            </option>

            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value)
            }
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          >
            <option value="JOINED_NEWEST">
              {t("members.sort.joinedNewest")}
            </option>

            <option value="JOINED_OLDEST">
              {t("members.sort.joinedOldest")}
            </option>

            <option value="NAME_AZ">
              {t("members.sort.nameAz")}
            </option>

            <option value="NAME_ZA">
              {t("members.sort.nameZa")}
            </option>
          </select>
        </label>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`size-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          {refreshing
            ? t("members.refreshing")
            : t("action.refresh")}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onMemberTypeChange("ALL")}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
            memberType === "ALL"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <Users className="size-3.5" />
          {t("members.filter.all")}
        </button>

        <button
          type="button"
          onClick={() =>
            onMemberTypeChange("HUMANS")
          }
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
            memberType === "HUMANS"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <UserRound className="size-3.5" />
          {t("members.filter.humans")}
        </button>

        <button
          type="button"
          onClick={() => onMemberTypeChange("BOTS")}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
            memberType === "BOTS"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <Bot className="size-3.5" />
          {t("members.filter.bots")}
        </button>
      </div>
    </div>
  )
}