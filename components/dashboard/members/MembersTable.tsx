"use client"

import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  Shield,
  UserRound,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/i18n"
import { formatLocalizedDate } from "@/lib/i18n/date"
import { cn } from "@/lib/utils"

import type {
  Member,
  MembersResponse,
} from "./types"

type MembersTableProps = {
  members: Member[]

  pagination: MembersResponse["pagination"]

  selectedMemberId: string | null
  onSelectMember: (member: Member) => void

  onPageChange: (page: number) => void
}

function getStatusClass(status: Member["status"]) {
  switch (status) {
    case "online":
      return "bg-emerald-500"

    case "idle":
      return "bg-amber-500"

    case "dnd":
      return "bg-red-500"

    default:
      return "bg-zinc-500"
  }
}

function MemberAvatar({
  member,
}: {
  member: Member
}) {
  return (
    <div className="relative shrink-0">
      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.avatarUrl}
          alt={member.displayName}
          className="size-10 rounded-full border border-white/10 object-cover"
        />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
          {member.displayName
            .charAt(0)
            .toUpperCase()}
        </div>
      )}

      <span
        className={cn(
          "absolute bottom-0 right-0 size-3 rounded-full border-2 border-card",
          getStatusClass(member.status)
        )}
      />
    </div>
  )
}

function MemberRoles({
  member,
}: {
  member: Member
}) {
  const visibleRoles = member.roles.slice(0, 3)
  const hiddenRoles =
    member.roles.length - visibleRoles.length

  if (member.roles.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        —
      </span>
    )
  }

  return (
    <div className="flex max-w-[300px] flex-wrap gap-1.5">
      {visibleRoles.map((role) => (
        <span
          key={role.id}
          className="inline-flex max-w-[130px] items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px]"
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{
              backgroundColor:
                role.color ?? "#8b8d98",
            }}
          />

          <span className="truncate">
            {role.name}
          </span>
        </span>
      ))}

      {hiddenRoles > 0 && (
        <span className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
          +{hiddenRoles}
        </span>
      )}
    </div>
  )
}

export function MembersTable({
  members,
  pagination,
  selectedMemberId,
  onSelectMember,
  onPageChange,
}: MembersTableProps) {
  const { t, locale } = useLocale()

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold">
            {t("members.listTitle")}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            {pagination.total}{" "}
            {t("members.membersFound")}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-4" />

          {pagination.from} - {pagination.to}{" "}
          {t("logs.of")} {pagination.total}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">
                {t("members.member")}
              </th>

              <th className="px-5 py-3 font-medium">
                {t("members.roles")}
              </th>

              <th className="px-5 py-3 font-medium">
                {t("members.joined")}
              </th>

              <th className="px-5 py-3 font-medium">
                {t("members.status")}
              </th>

              <th className="w-16 px-5 py-3" />
            </tr>
          </thead>

          <tbody>
            {members.map((member) => {
              const selected =
                selectedMemberId === member.id

              return (
                <tr
                  key={member.id}
                  onClick={() =>
                    onSelectMember(member)
                  }
                  className={cn(
                    "cursor-pointer border-b border-border/70 transition-colors last:border-b-0 hover:bg-muted/30",
                    selected &&
                      "bg-primary/[0.07]"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <MemberAvatar
                        member={member}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">
                            {member.displayName}
                          </p>

                          {member.bot ? (
                            <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                              <Bot className="size-3" />

                              {t(
                                "members.badge.bot"
                              )}
                            </span>
                          ) : (
                            <UserRound className="size-3.5 text-muted-foreground" />
                          )}

                          {member.isTimedOut && (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-400">
                              <Clock3 className="size-3" />

                              {t(
                                "members.badge.timedOut"
                              )}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          @{member.username}
                        </p>

                        {member.nickname &&
                          member.nickname !==
                            member.displayName && (
                            <p className="mt-1 truncate text-[11px] text-muted-foreground/70">
                              {t(
                                "members.nickname"
                              )}
                              : {member.nickname}
                            </p>
                          )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <MemberRoles
                      member={member}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm">
                      {member.joinedAt
                        ? formatLocalizedDate(
                            member.joinedAt,
                            locale
                          )
                        : t(
                            "common.unavailable"
                          )}
                    </div>

                    {member.boostingSince && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-fuchsia-400">
                        <Shield className="size-3" />

                        {t(
                          "members.boosting"
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <span
                        className={cn(
                          "size-2.5 rounded-full",
                          getStatusClass(
                            member.status
                          )
                        )}
                      />

                      {t(
                        `members.status.${member.status}`
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation()

                        onSelectMember(member)
                      }}
                      aria-label={t(
                        "members.openDetails"
                      )}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {members.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <Users className="size-10 text-muted-foreground/40" />

          <h3 className="mt-4 font-semibold">
            {t("members.emptyTitle")}
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {t("members.emptyDescription")}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <p className="text-xs text-muted-foreground">
          {t("logs.page")}{" "}
          {pagination.page}{" "}
          {t("logs.of")}{" "}
          {pagination.totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={
              !pagination.hasPreviousPage
            }
            onClick={() =>
              onPageChange(
                pagination.page - 1
              )
            }
            aria-label={t(
              "action.previous"
            )}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 text-sm font-medium text-primary">
            {pagination.page}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={
              !pagination.hasNextPage
            }
            onClick={() =>
              onPageChange(
                pagination.page + 1
              )
            }
            aria-label={t("action.next")}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}