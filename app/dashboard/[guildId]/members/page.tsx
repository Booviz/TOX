"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams } from "next/navigation"
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MemberSidebar } from "@/components/dashboard/members/MemberSidebar"
import { MembersTable } from "@/components/dashboard/members/MembersTable"
import { MembersToolbar } from "@/components/dashboard/members/MembersToolbar"
import type {
  Member,
  MemberRole,
  MembersResponse,
} from "@/components/dashboard/members/types"
import { useLocale } from "@/lib/i18n"

type BotActivity = {
  name: string
  type: number
  details: string | null
  state: string | null
  url: string | null
}

type BotMember = {
  id: string
  username: string
  globalName: string | null
  displayName: string
  nickname: string | null
  avatarUrl: string | null
  bot: boolean
  roles: MemberRole[]
  joinedAt: string | null
  boostingSince: string | null
  pending: boolean
  timedOutUntil: string | null
  isTimedOut: boolean
  status: "online" | "idle" | "dnd" | "offline"
  activity: BotActivity | null
}

type BotMembersResponse = {
  success: boolean
  error?: string
  counts?: {
    all: number
    humans: number
    bots: number
    online: number
    offline: number
    timedOut: number
  }
  members?: BotMember[]
}

const DEFAULT_COUNTS = {
  all: 0,
  humans: 0,
  bots: 0,
  online: 0,
  offline: 0,
  timedOut: 0,
}

/*
 * الكاش موجود خارج React، لذلك يبقى حتى لو Next.js
 * أعاد تركيب الصفحة في وضع التطوير.
 */
const clientDataCache =
  new Map<string, BotMembersResponse>()

const clientRequestCache =
  new Map<string, Promise<BotMembersResponse>>()

function getActivityText(
  activity: BotActivity | null
) {
  if (!activity) return null

  return [
    activity.name,
    activity.details,
    activity.state,
  ]
    .filter(Boolean)
    .join(" — ")
}

function normalizeMember(
  member: BotMember
): Member {
  return {
    id: member.id,
    username: member.username,
    rawUsername: member.username,
    displayName: member.displayName,
    globalName: member.globalName,
    nickname: member.nickname,
    avatarUrl: member.avatarUrl,
    bot: member.bot,
    roles: member.roles ?? [],
    joinedAt: member.joinedAt,
    boostingSince: member.boostingSince,
    pending: member.pending,
    timedOutUntil: member.timedOutUntil,
    isTimedOut: member.isTimedOut,
    status: member.status ?? "offline",
    activity: getActivityText(member.activity),
  }
}

async function fetchMembers(
  guildId: string,
  force = false
) {
  if (!force) {
    const cached = clientDataCache.get(guildId)

    if (cached) {
      return cached
    }

    const currentRequest =
      clientRequestCache.get(guildId)

    if (currentRequest) {
      return currentRequest
    }
  }

  const request = (async () => {
    const response = await fetch(
      `/api/dashboard/${guildId}/members`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    )

    const data =
      (await response.json()) as BotMembersResponse

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ?? "Failed to load guild members"
      )
    }

    clientDataCache.set(guildId, data)

    return data
  })()

  clientRequestCache.set(guildId, request)

  try {
    return await request
  } finally {
    clientRequestCache.delete(guildId)
  }
}

function sortMembers(
  members: Member[],
  sort: string
) {
  return [...members].sort((a, b) => {
    if (sort === "JOINED_OLDEST") {
      return (
        new Date(a.joinedAt ?? 0).getTime() -
        new Date(b.joinedAt ?? 0).getTime()
      )
    }

    if (sort === "NAME_AZ") {
      return a.displayName.localeCompare(
        b.displayName
      )
    }

    if (sort === "NAME_ZA") {
      return b.displayName.localeCompare(
        a.displayName
      )
    }

    return (
      new Date(b.joinedAt ?? 0).getTime() -
      new Date(a.joinedAt ?? 0).getTime()
    )
  })
}

export default function MembersPage() {
  const params = useParams<{
    guildId: string
  }>()

  const guildId = params.guildId
  const { t } = useLocale()

  const [allMembers, setAllMembers] =
    useState<Member[]>([])

  const [counts, setCounts] =
    useState(DEFAULT_COUNTS)

  const [search, setSearch] = useState("")
  const [memberType, setMemberType] =
    useState("ALL")
  const [roleId, setRoleId] =
    useState("ALL")
  const [sort, setSort] =
    useState("JOINED_NEWEST")

  const [page, setPage] = useState(1)
  const limit = 10

  const [
    selectedMember,
    setSelectedMember,
  ] = useState<Member | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function loadMembers(
    force = false
  ) {
    if (!guildId) return

    try {
      if (force) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const data =
        await fetchMembers(
          guildId,
          force
        )

      const normalizedMembers = (
        data.members ?? []
      ).map(normalizeMember)

      setAllMembers(normalizedMembers)
      setCounts(
        data.counts ?? DEFAULT_COUNTS
      )
      setError(null)

      setSelectedMember((current) => {
        if (!current) return null

        return (
          normalizedMembers.find(
            (member) =>
              member.id === current.id
          ) ?? null
        )
      })
    } catch (loadError) {
      console.error(
        "Failed to load members:",
        loadError
      )

      /*
       * إذا عندنا نسخة سابقة، لا نمسح الصفحة بسبب
       * فشل تحديث مؤقت.
       */
      if (allMembers.length === 0) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load guild members"
        )
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let active = true

    async function run() {
      try {
        const data =
          await fetchMembers(guildId)

        if (!active) return

        const normalizedMembers = (
          data.members ?? []
        ).map(normalizeMember)

        setAllMembers(normalizedMembers)
        setCounts(
          data.counts ?? DEFAULT_COUNTS
        )
        setError(null)
      } catch (loadError) {
        if (!active) return

        console.error(
          "Failed to load members:",
          loadError
        )

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load guild members"
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [guildId])

  useEffect(() => {
    setPage(1)
  }, [
    search,
    memberType,
    roleId,
    sort,
  ])

  const roles = useMemo(() => {
    const roleMap =
      new Map<string, MemberRole>()

    for (const member of allMembers) {
      for (const role of member.roles) {
        if (!roleMap.has(role.id)) {
          roleMap.set(role.id, role)
        }
      }
    }

    return Array.from(
      roleMap.values()
    ).sort(
      (a, b) =>
        b.position - a.position
    )
  }, [allMembers])

  const filteredMembers =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase()

      const result =
        allMembers.filter((member) => {
          if (normalizedSearch) {
            const matchesSearch =
              member.id.includes(
                normalizedSearch
              ) ||
              member.username
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              member.rawUsername
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              member.displayName
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              member.nickname
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              member.globalName
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                )

            if (!matchesSearch) {
              return false
            }
          }

          if (
            roleId !== "ALL" &&
            !member.roles.some(
              (role) =>
                role.id === roleId
            )
          ) {
            return false
          }

          if (
            memberType ===
              "HUMANS" &&
            member.bot
          ) {
            return false
          }

          if (
            memberType === "BOTS" &&
            !member.bot
          ) {
            return false
          }

          if (
            memberType ===
              "ONLINE" &&
            member.status ===
              "offline"
          ) {
            return false
          }

          if (
            memberType ===
              "OFFLINE" &&
            member.status !==
              "offline"
          ) {
            return false
          }

          if (
            memberType ===
              "TIMED_OUT" &&
            !member.isTimedOut
          ) {
            return false
          }

          return true
        })

      return sortMembers(
        result,
        sort
      )
    }, [
      allMembers,
      memberType,
      roleId,
      search,
      sort,
    ])

  const pagination =
    useMemo<
      MembersResponse["pagination"]
    >(() => {
      const total =
        filteredMembers.length

      const totalPages = Math.max(
        1,
        Math.ceil(total / limit)
      )

      const safePage = Math.min(
        page,
        totalPages
      )

      const from =
        total === 0
          ? 0
          : (safePage - 1) *
              limit +
            1

      const to = Math.min(
        safePage * limit,
        total
      )

      return {
        page: safePage,
        limit,
        total,
        totalPages,
        hasPreviousPage:
          safePage > 1,
        hasNextPage:
          safePage < totalPages,
        from,
        to,
      }
    }, [
      filteredMembers.length,
      page,
    ])

  const paginatedMembers =
    useMemo(() => {
      const start =
        (pagination.page - 1) *
        pagination.limit

      return filteredMembers.slice(
        start,
        start +
          pagination.limit
      )
    }, [
      filteredMembers,
      pagination,
    ])

  function handlePageChange(
    nextPage: number
  ) {
    setPage(
      Math.min(
        Math.max(nextPage, 1),
        pagination.totalPages
      )
    )
  }

  if (
    loading &&
    allMembers.length === 0
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-9 animate-spin text-primary" />

          <h1 className="mt-4 font-semibold">
            {t("members.loading")}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "members.loadingDescription"
            )}
          </p>
        </div>
      </div>
    )
  }

  if (
    error &&
    allMembers.length === 0
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-destructive/20 bg-destructive/[0.05] p-8 text-center">
          <AlertTriangle className="mx-auto size-10 text-destructive" />

          <h1 className="mt-4 text-lg font-semibold">
            {t(
              "members.errorTitle"
            )}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error}
          </p>

          <Button
            type="button"
            onClick={() =>
              void loadMembers(true)
            }
            className="mt-6 gap-2"
            disabled={refreshing}
          >
            <RefreshCw
              className={
                refreshing
                  ? "size-4 animate-spin"
                  : "size-4"
              }
            />

            {t("action.retry")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Users className="size-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                {t("members.title")}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {t(
                  "members.subtitle"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-lg border border-border bg-card px-3 py-2">
              {t("members.total")}:{" "}
              <strong className="text-foreground">
                {counts.all}
              </strong>
            </span>

            <span className="rounded-lg border border-border bg-card px-3 py-2">
              {t("common.online")}:{" "}
              <strong className="text-emerald-400">
                {counts.online}
              </strong>
            </span>

            <span className="rounded-lg border border-border bg-card px-3 py-2">
              {t("common.offline")}:{" "}
              <strong className="text-foreground">
                {counts.offline}
              </strong>
            </span>
          </div>
        </div>

        <MembersToolbar
          search={search}
          onSearchChange={setSearch}
          memberType={memberType}
          onMemberTypeChange={
            setMemberType
          }
          roleId={roleId}
          onRoleChange={setRoleId}
          sort={sort}
          onSortChange={setSort}
          roles={roles}
          refreshing={refreshing}
          onRefresh={() =>
            void loadMembers(true)
          }
        />

        <MembersTable
          members={
            paginatedMembers
          }
          pagination={pagination}
          selectedMemberId={
            selectedMember?.id ??
            null
          }
          onSelectMember={
            setSelectedMember
          }
          onPageChange={
            handlePageChange
          }
        />
      </div>

      <MemberSidebar
        member={selectedMember}
        onClose={() =>
          setSelectedMember(null)
        }
      />
    </>
  )
}