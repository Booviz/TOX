"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams } from "next/navigation"
import {
  AlertTriangle,
  Ban,
  Bot,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Edit3,
  Hash,
  Loader2,
  Search,
  Shield,
  ShieldMinus,
  ShieldPlus,
  Sparkles,
  UserRound,
  UserRoundX,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/i18n"
import { formatLocalizedDate } from "@/lib/i18n/date"
import { cn } from "@/lib/utils"

import type { Member } from "./types"

type MemberSidebarProps = {
  member: Member | null
  onClose: () => void
  onMemberUpdated?: (member: Member) => void
  onMemberRemoved?: (memberId: string) => void
}

type Tab = "overview" | "roles" | "activity"

type ActionModal =
  | "nickname"
  | "addRole"
  | "removeRole"
  | "timeout"
  | "removeTimeout"
  | "kick"
  | "ban"
  | null

type MemberActionResponse = {
  success: boolean
  error?: string
  message?: string
  member?: Member
}


type ServerRole = {
  id: string
  name: string
  color: string | null
  position: number
  managed: boolean
  mentionable: boolean
  hoist: boolean
  icon: string | null
  memberCount: number
  permissions: string[]
  createdAt: number
}

type RolesResponse = {
  success: boolean
  error?: string
  message?: string
  roles?: ServerRole[]
}

function statusClass(status: Member["status"]) {
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

function CopyField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to copy member field:", error)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 break-all text-sm font-medium">
          {value}
        </p>

        <button
          type="button"
          onClick={copy}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label={t("action.copy")}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}

function ModalShell({
  title,
  description,
  danger = false,
  submitting,
  error,
  success,
  onClose,
  onSubmit,
  submitLabel,
  children,
}: {
  title: string
  description: string
  danger?: boolean
  submitting: boolean
  error: string | null
  success: string | null
  onClose: () => void
  onSubmit: () => void
  submitLabel: string
  children: React.ReactNode
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={submitting}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 p-5">
          {children}

          {error && (
            <div className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3 text-sm text-emerald-300">
              <Check className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className={cn(
              "gap-2",
              danger &&
                "bg-red-600 text-white hover:bg-red-500"
            )}
          >
            {submitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function MemberSidebar({
  member,
  onClose,
  onMemberUpdated,
  onMemberRemoved,
}: MemberSidebarProps) {
  const params = useParams<{ guildId: string }>()
  const guildId = params.guildId

  const { t, locale } = useLocale()
  const isArabic = locale === "ar"
  const text = (ar: string, en: string) =>
    isArabic ? ar : en

  const [tab, setTab] = useState<Tab>("overview")
  const [currentMember, setCurrentMember] =
    useState<Member | null>(member)

  const [actionModal, setActionModal] =
    useState<ActionModal>(null)

  const [nickname, setNickname] = useState("")
  const [selectedRoleId, setSelectedRoleId] =
    useState("")
  const [selectedRoleIds, setSelectedRoleIds] =
    useState<string[]>([])
  const [serverRoles, setServerRoles] =
    useState<ServerRole[]>([])
  const [roleSearch, setRoleSearch] =
    useState("")
  const [rolesLoading, setRolesLoading] =
    useState(false)
  const [rolesError, setRolesError] =
    useState<string | null>(null)
  const [timeoutDuration, setTimeoutDuration] =
    useState("600000")
  const [reason, setReason] = useState("")
  const [deleteMessageSeconds, setDeleteMessageSeconds] =
    useState("0")

  const [submitting, setSubmitting] =
    useState(false)
  const [actionError, setActionError] =
    useState<string | null>(null)
  const [actionSuccess, setActionSuccess] =
    useState<string | null>(null)

  useEffect(() => {
    setCurrentMember(member)

    if (!member) {
      return
    }

    setTab("overview")
    setNickname(member.nickname ?? "")
    setActionModal(null)
    setSelectedRoleId("")
    setSelectedRoleIds([])
    setRoleSearch("")
    setRolesError(null)
    setTimeoutDuration("600000")
    setDeleteMessageSeconds("0")
    setReason("")
    setActionError(null)
    setActionSuccess(null)
    setSubmitting(false)
  }, [member])

  useEffect(() => {
    if (!member) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return
      }

      if (actionModal) {
        closeActionModal()
        return
      }

      onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [member, onClose, actionModal])

  useEffect(() => {
    if (
      actionModal !== "addRole" ||
      !guildId ||
      !currentMember
    ) {
      return
    }

    let cancelled = false

    async function loadRoles() {
      try {
        setRolesLoading(true)
        setRolesError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/roles`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        )

        const responseText = await response.text()

        let data: RolesResponse

        try {
          data = responseText
            ? (JSON.parse(responseText) as RolesResponse)
            : { success: response.ok }
        } catch {
          throw new Error(
            text(
              "أعاد السيرفر بيانات رتب غير صالحة",
              "The server returned invalid role data"
            )
          )
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ??
              data.message ??
              text(
                "تعذر تحميل رتب السيرفر",
                "Failed to load server roles"
              )
          )
        }

        if (!cancelled) {
          setServerRoles(
            Array.isArray(data.roles)
              ? data.roles
              : []
          )
        }
      } catch (error) {
        if (!cancelled) {
          setRolesError(
            error instanceof Error
              ? error.message
              : text(
                  "تعذر تحميل رتب السيرفر",
                  "Failed to load server roles"
                )
          )
        }
      } finally {
        if (!cancelled) {
          setRolesLoading(false)
        }
      }
    }

    void loadRoles()

    return () => {
      cancelled = true
    }
  }, [actionModal, guildId, currentMember])

  const highestRole = useMemo(() => {
    if (
      !currentMember ||
      currentMember.roles.length === 0
    ) {
      return null
    }

    return [...currentMember.roles].sort(
      (a, b) => b.position - a.position
    )[0]
  }, [currentMember])

  const availableRoles = useMemo(() => {
    if (!currentMember) {
      return []
    }

    const currentRoleIds = new Set(
      currentMember.roles.map((role) => role.id)
    )

    const query = roleSearch
      .trim()
      .toLowerCase()

    return serverRoles
      .filter((role) => {
        if (currentRoleIds.has(role.id)) {
          return false
        }

        if (role.managed) {
          return false
        }

        if (
          query &&
          !role.name.toLowerCase().includes(query)
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => b.position - a.position)
  }, [
    currentMember,
    serverRoles,
    roleSearch,
  ])

  function closeActionModal() {
    if (submitting) {
      return
    }

    setActionModal(null)
    setSelectedRoleId("")
    setSelectedRoleIds([])
    setRoleSearch("")
    setRolesError(null)
    setTimeoutDuration("600000")
    setDeleteMessageSeconds("0")
    setReason("")
    setActionError(null)
    setActionSuccess(null)
  }

  function openActionModal(
    modal: Exclude<ActionModal, null>,
    roleId = ""
  ) {
    if (!currentMember) {
      return
    }

    setActionModal(modal)
    setNickname(currentMember.nickname ?? "")
    setSelectedRoleId(roleId)
    setSelectedRoleIds([])
    setRoleSearch("")
    setRolesError(null)
    setTimeoutDuration("600000")
    setDeleteMessageSeconds("0")
    setReason("")
    setActionError(null)
    setActionSuccess(null)
  }

  function toggleRoleSelection(roleId: string) {
    setSelectedRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId]
    )
  }

  async function addSelectedRoles() {
    if (
      !currentMember ||
      !guildId ||
      selectedRoleIds.length === 0
    ) {
      setActionError(
        text(
          "اختر رتبة واحدة على الأقل",
          "Select at least one role"
        )
      )
      return
    }

    try {
      setSubmitting(true)
      setActionError(null)
      setActionSuccess(null)

      let latestMember: Member | undefined

      for (const roleId of selectedRoleIds) {
        const response = await fetch(
          `/api/dashboard/${guildId}/members/${currentMember.id}`,
          {
            method: "PUT",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              action: "add_role",
              roleId,
              reason:
                reason.trim() ||
                "Roles added from TOX dashboard",
            }),
          }
        )

        const responseText = await response.text()

        let data: MemberActionResponse

        try {
          data = responseText
            ? (JSON.parse(
                responseText
              ) as MemberActionResponse)
            : { success: response.ok }
        } catch {
          throw new Error(
            text(
              "أعاد السيرفر استجابة غير صالحة",
              "The server returned an invalid response"
            )
          )
        }

        if (!response.ok || !data.success) {
          const role = serverRoles.find(
            (item) => item.id === roleId
          )

          throw new Error(
            `${
              role?.name ?? roleId
            }: ${
              data.error ??
              data.message ??
              text(
                "فشلت إضافة الرتبة",
                "Failed to add role"
              )
            }`
          )
        }

        if (data.member) {
          latestMember = data.member
        }
      }

      if (latestMember) {
        setCurrentMember(latestMember)
        onMemberUpdated?.(latestMember)
      }

      setActionSuccess(
        text(
          `تمت إضافة ${selectedRoleIds.length} رتبة بنجاح`,
          `${selectedRoleIds.length} role(s) added successfully`
        )
      )

      window.setTimeout(() => {
        closeActionModal()
      }, 700)
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : text(
              "فشلت إضافة الرتب",
              "Failed to add roles"
            )
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function runMemberAction({
    method,
    body,
    removeMember = false,
  }: {
    method: "PATCH" | "PUT" | "DELETE"
    body: Record<string, unknown>
    removeMember?: boolean
  }) {
    if (!currentMember || !guildId) {
      return
    }

    try {
      setSubmitting(true)
      setActionError(null)
      setActionSuccess(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/members/${currentMember.id}`,
        {
          method,
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      )

      const responseText = await response.text()

      let data: MemberActionResponse

      try {
        data = responseText
          ? (JSON.parse(
              responseText
            ) as MemberActionResponse)
          : {
              success: response.ok,
            }
      } catch {
        throw new Error(
          text(
            "أعاد السيرفر استجابة غير صالحة",
            "The server returned an invalid response"
          )
        )
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            text(
              "فشل تنفيذ الإجراء",
              "The member action failed"
            )
        )
      }

      setActionSuccess(
        data.message ??
          text(
            "تم تنفيذ الإجراء بنجاح",
            "Action completed successfully"
          )
      )

      if (removeMember) {
        onMemberRemoved?.(currentMember.id)

        window.setTimeout(() => {
          closeActionModal()
          onClose()
        }, 700)

        return
      }

      if (data.member) {
        setCurrentMember(data.member)
        onMemberUpdated?.(data.member)
      }

      window.setTimeout(() => {
        closeActionModal()
      }, 700)
    } catch (error) {
      console.error(
        "Member action failed:",
        error
      )

      setActionError(
        error instanceof Error
          ? error.message
          : text(
              "فشل تنفيذ الإجراء",
              "The member action failed"
            )
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentMember) {
    return null
  }

  const initials = currentMember.displayName
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={t("action.close")}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[460px] overflow-y-auto border-l border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-semibold">
              {t("members.detailsTitle")}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t("members.detailsSubtitle")}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t("action.close")}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {currentMember.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentMember.avatarUrl}
                    alt={currentMember.displayName}
                    className="size-20 rounded-2xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary">
                    {initials}
                  </div>
                )}

                <span
                  className={cn(
                    "absolute -bottom-1 -right-1 size-4 rounded-full border-[3px] border-card",
                    statusClass(currentMember.status)
                  )}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold">
                    {currentMember.displayName}
                  </h2>

                  {currentMember.bot && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-[10px] font-medium text-primary">
                      <Bot className="size-3" />
                      {t("members.badge.bot")}
                    </span>
                  )}

                  {currentMember.isTimedOut && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-1 text-[10px] font-medium text-amber-400">
                      <Clock3 className="size-3" />
                      {t("members.badge.timedOut")}
                    </span>
                  )}
                </div>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  @{currentMember.username}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      statusClass(currentMember.status)
                    )}
                  />

                  {t(
                    `members.status.${currentMember.status}`
                  )}
                </div>

                {highestRole && (
                  <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          highestRole.color ??
                          "#8b8d98",
                      }}
                    />

                    <span className="truncate">
                      {highestRole.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/30 p-1">
            {(
              [
                [
                  "overview",
                  "members.tab.overview",
                ],
                ["roles", "members.tab.roles"],
                [
                  "activity",
                  "members.tab.activity",
                ],
              ] as const
            ).map(([value, labelKey]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition",
                  tab === value
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <CopyField
                  label={t("members.discordId")}
                  value={currentMember.id}
                />

                <CopyField
                  label={t("members.username")}
                  value={currentMember.username}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <p className="text-[11px] uppercase tracking-wide">
                      {t("members.joined")}
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-medium">
                    {currentMember.joinedAt
                      ? formatLocalizedDate(
                          currentMember.joinedAt,
                          locale
                        )
                      : t("common.unavailable")}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="size-4" />
                    <p className="text-[11px] uppercase tracking-wide">
                      {t(
                        "members.boostingSince"
                      )}
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-medium">
                    {currentMember.boostingSince
                      ? formatLocalizedDate(
                          currentMember.boostingSince,
                          locale
                        )
                      : t("common.none")}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" />
                  <p className="text-[11px] uppercase tracking-wide">
                    {t("members.nickname")}
                  </p>
                </div>

                <p className="mt-2 text-sm font-medium">
                  {currentMember.nickname ??
                    t("members.noNickname")}
                </p>
              </div>

              {currentMember.isTimedOut && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock3 className="size-4" />
                    <p className="text-sm font-semibold">
                      {t(
                        "members.timeoutActive"
                      )}
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-amber-200/70">
                    {currentMember.timedOutUntil
                      ? formatLocalizedDate(
                          currentMember.timedOutUntil,
                          locale
                        )
                      : t("common.unavailable")}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "roles" && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {t("members.roles")}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentMember.roles.length}{" "}
                    {t(
                      "members.rolesAssigned"
                    )}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    openActionModal("addRole")
                  }
                >
                  <ShieldPlus className="size-4" />
                  {t("members.addRole")}
                </Button>
              </div>

              {currentMember.roles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
                  <Shield className="mx-auto size-8 text-muted-foreground/40" />

                  <p className="mt-3 text-sm font-medium">
                    {t("members.noRoles")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentMember.roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              role.color ??
                              "#8b8d98",
                          }}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {role.name}
                          </p>

                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {role.id}
                          </p>
                        </div>
                      </div>

                      {role.managed ? (
                        <span className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                          {t(
                            "members.managedRole"
                          )}
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            setSelectedRoleId(
                              role.id
                            )
                            setActionModal(
                              "removeRole"
                            )
                            setActionError(null)
                            setActionSuccess(null)
                          }}
                          title={text(
                            "إزالة الرتبة",
                            "Remove role"
                          )}
                        >
                          <ShieldMinus className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "activity" && (
            <div className="mt-5 rounded-xl border border-dashed border-border px-5 py-12 text-center">
              <Hash className="mx-auto size-9 text-muted-foreground/40" />

              <h3 className="mt-4 font-semibold">
                {t(
                  "members.activityEmptyTitle"
                )}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {t(
                  "members.activityEmptyDescription"
                )}
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="mb-3 text-sm font-semibold">
              {t("members.actions")}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() =>
                  openActionModal("nickname")
                }
              >
                <Edit3 className="size-4" />
                {t("members.editNickname")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() =>
                  openActionModal("addRole")
                }
              >
                <ShieldPlus className="size-4" />
                {t("members.addRole")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="gap-2 text-amber-400 hover:text-amber-300"
                onClick={() =>
                  openActionModal(
                    currentMember.isTimedOut
                      ? "removeTimeout"
                      : "timeout"
                  )
                }
              >
                <Clock3 className="size-4" />
                {currentMember.isTimedOut
                  ? text(
                      "إزالة التايم أوت",
                      "Remove timeout"
                    )
                  : t("members.timeout")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="gap-2 text-orange-400 hover:text-orange-300"
                onClick={() =>
                  openActionModal("kick")
                }
              >
                <UserRoundX className="size-4" />
                {t("members.kick")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="col-span-2 gap-2 text-red-400 hover:text-red-300"
                onClick={() =>
                  openActionModal("ban")
                }
              >
                <Ban className="size-4" />
                {t("members.ban")}
              </Button>
            </div>
          </div>
        </div>

        {actionModal === "nickname" && (
          <ModalShell
            title={t("members.editNickname")}
            description={text(
              "اكتب الاسم المستعار الجديد، أو اتركه فارغًا لإزالة الاسم الحالي.",
              "Enter a new nickname, or leave it empty to remove the current nickname."
            )}
            submitting={submitting}
            error={actionError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={text(
              "حفظ التعديل",
              "Save changes"
            )}
            onSubmit={() =>
              void runMemberAction({
                method: "PATCH",
                body: {
                  action: "nickname",
                  nickname: nickname.trim()
                    ? nickname.trim()
                    : null,
                  reason:
                    reason.trim() ||
                    "Nickname updated from TOX dashboard",
                },
              })
            }
          >
            <label className="block">
              <span className="text-xs font-medium">
                {t("members.nickname")}
              </span>
              <input
                value={nickname}
                onChange={(event) =>
                  setNickname(
                    event.target.value.slice(
                      0,
                      32
                    )
                  )
                }
                maxLength={32}
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder={currentMember.displayName}
              />
              <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                {nickname.length}/32
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-medium">
                {text("السبب", "Reason")}
              </span>
              <input
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder={text(
                  "سبب اختياري",
                  "Optional reason"
                )}
              />
            </label>
          </ModalShell>
        )}

        {actionModal === "addRole" && (
          <ModalShell
            title={text(
              "إضافة رتب",
              "Add roles"
            )}
            description={text(
              "اختر رتبة أو أكثر من رتب السيرفر غير الموجودة عند العضو.",
              "Select one or more server roles the member does not already have."
            )}
            submitting={submitting}
            error={actionError ?? rolesError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={text(
              `إضافة الرتب (${selectedRoleIds.length})`,
              `Add roles (${selectedRoleIds.length})`
            )}
            onSubmit={() => {
              void addSelectedRoles()
            }}
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={roleSearch}
                onChange={(event) =>
                  setRoleSearch(event.target.value)
                }
                className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                placeholder={text(
                  "ابحث عن رتبة...",
                  "Search roles..."
                )}
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-border bg-background/40 p-2">
              {rolesLoading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  {text(
                    "جاري تحميل الرتب...",
                    "Loading roles..."
                  )}
                </div>
              ) : availableRoles.length === 0 ? (
                <div className="py-12 text-center">
                  <Shield className="mx-auto size-8 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium">
                    {text(
                      "لا توجد رتب متاحة",
                      "No available roles"
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {text(
                      "قد يملك العضو جميع الرتب المتاحة أو أن الرتب مُدارة بواسطة بوتات.",
                      "The member may already have all available roles, or the remaining roles are managed."
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {availableRoles.map((role) => {
                    const selected =
                      selectedRoleIds.includes(role.id)

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() =>
                          toggleRoleSelection(role.id)
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
                          selected
                            ? "border-primary/50 bg-primary/10"
                            : "border-transparent hover:border-border hover:bg-muted/50"
                        )}
                      >
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              role.color &&
                              role.color !== "#000000"
                                ? role.color
                                : "#8b8d98",
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {role.name}
                          </p>

                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {text(
                              `${role.memberCount} عضو • الموضع ${role.position}`,
                              `${role.memberCount} members • position ${role.position}`
                            )}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-md border",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          )}
                        >
                          {selected && (
                            <Check className="size-3.5" />
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <label className="block">
              <span className="text-xs font-medium">
                {text("السبب", "Reason")}
              </span>

              <input
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder={text(
                  "سبب اختياري",
                  "Optional reason"
                )}
              />
            </label>
          </ModalShell>
        )}

        {actionModal === "removeRole" && (
          <ModalShell
            title={text(
              "إزالة الرتبة",
              "Remove role"
            )}
            description={text(
              "سيتم إزالة الرتبة المحددة من العضو.",
              "The selected role will be removed from the member."
            )}
            danger
            submitting={submitting}
            error={actionError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={text(
              "إزالة الرتبة",
              "Remove role"
            )}
            onSubmit={() => {
              if (!selectedRoleId) {
                setActionError(
                  text(
                    "لم يتم تحديد الرتبة",
                    "No role was selected"
                  )
                )
                return
              }

              void runMemberAction({
                method: "PUT",
                body: {
                  action: "remove_role",
                  roleId: selectedRoleId,
                  reason:
                    reason.trim() ||
                    "Role removed from TOX dashboard",
                },
              })
            }}
          >
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <p className="text-sm font-medium">
                {
                  currentMember.roles.find(
                    (role) =>
                      role.id === selectedRoleId
                  )?.name
                }
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {selectedRoleId}
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-medium">
                {text("السبب", "Reason")}
              </span>

              <input
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-red-500"
                placeholder={text(
                  "سبب اختياري",
                  "Optional reason"
                )}
              />
            </label>
          </ModalShell>
        )}

        {actionModal === "timeout" && (
          <ModalShell
            title={t("members.timeout")}
            description={text(
              "اختر مدة التايم أوت وأدخل السبب.",
              "Choose a timeout duration and enter a reason."
            )}
            submitting={submitting}
            error={actionError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={t("members.timeout")}
            onSubmit={() =>
              void runMemberAction({
                method: "PATCH",
                body: {
                  action: "timeout",
                  durationMs: Number(
                    timeoutDuration
                  ),
                  reason:
                    reason.trim() ||
                    "Timeout applied from TOX dashboard",
                },
              })
            }
          >
            <label className="block">
              <span className="text-xs font-medium">
                {text("المدة", "Duration")}
              </span>
              <select
                value={timeoutDuration}
                onChange={(event) =>
                  setTimeoutDuration(
                    event.target.value
                  )
                }
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option value="60000">
                  {text("دقيقة", "1 minute")}
                </option>
                <option value="300000">
                  {text("5 دقائق", "5 minutes")}
                </option>
                <option value="600000">
                  {text("10 دقائق", "10 minutes")}
                </option>
                <option value="3600000">
                  {text("ساعة", "1 hour")}
                </option>
                <option value="86400000">
                  {text("يوم", "1 day")}
                </option>
                <option value="604800000">
                  {text("7 أيام", "7 days")}
                </option>
                <option value="2419200000">
                  {text("28 يومًا", "28 days")}
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium">
                {text("السبب", "Reason")}
              </span>
              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder={text(
                  "سبب التايم أوت",
                  "Timeout reason"
                )}
              />
            </label>
          </ModalShell>
        )}

        {actionModal === "removeTimeout" && (
          <ModalShell
            title={text(
              "إزالة التايم أوت",
              "Remove timeout"
            )}
            description={text(
              "سيتم السماح للعضو بالتفاعل في السيرفر من جديد.",
              "The member will be allowed to interact in the server again."
            )}
            submitting={submitting}
            error={actionError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={text(
              "إزالة التايم أوت",
              "Remove timeout"
            )}
            onSubmit={() =>
              void runMemberAction({
                method: "PATCH",
                body: {
                  action: "remove_timeout",
                  reason:
                    reason.trim() ||
                    "Timeout removed from TOX dashboard",
                },
              })
            }
          >
            <label className="block">
              <span className="text-xs font-medium">
                {text("السبب", "Reason")}
              </span>
              <input
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder={text(
                  "سبب اختياري",
                  "Optional reason"
                )}
              />
            </label>
          </ModalShell>
        )}

        {actionModal === "kick" && (
          <ModalShell
            title={t("members.kick")}
            description={text(
              "سيتم إخراج العضو من السيرفر، ويمكنه العودة عبر رابط دعوة جديد.",
              "The member will be removed from the server and may return with a new invite."
            )}
            danger
            submitting={submitting}
            error={actionError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={t("members.kick")}
            onSubmit={() =>
              void runMemberAction({
                method: "DELETE",
                removeMember: true,
                body: {
                  action: "kick",
                  reason:
                    reason.trim() ||
                    "Member kicked from TOX dashboard",
                },
              })
            }
          >
            <label className="block">
              <span className="text-xs font-medium">
                {text("سبب الطرد", "Kick reason")}
              </span>
              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
                placeholder={text(
                  "اكتب سبب الطرد",
                  "Enter the kick reason"
                )}
              />
            </label>
          </ModalShell>
        )}

        {actionModal === "ban" && (
          <ModalShell
            title={t("members.ban")}
            description={text(
              "سيتم حظر العضو من السيرفر. هذا إجراء حساس.",
              "The member will be banned from the server. This is a sensitive action."
            )}
            danger
            submitting={submitting}
            error={actionError}
            success={actionSuccess}
            onClose={closeActionModal}
            submitLabel={t("members.ban")}
            onSubmit={() =>
              void runMemberAction({
                method: "DELETE",
                removeMember: true,
                body: {
                  action: "ban",
                  reason:
                    reason.trim() ||
                    "Member banned from TOX dashboard",
                  deleteMessageSeconds:
                    Number(
                      deleteMessageSeconds
                    ),
                },
              })
            }
          >
            <label className="block">
              <span className="text-xs font-medium">
                {text(
                  "سبب الحظر",
                  "Ban reason"
                )}
              </span>
              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
                placeholder={text(
                  "اكتب سبب الحظر",
                  "Enter the ban reason"
                )}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium">
                {text(
                  "حذف الرسائل السابقة",
                  "Delete previous messages"
                )}
              </span>
              <select
                value={deleteMessageSeconds}
                onChange={(event) =>
                  setDeleteMessageSeconds(
                    event.target.value
                  )
                }
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-red-500"
              >
                <option value="0">
                  {text(
                    "بدون حذف",
                    "Do not delete"
                  )}
                </option>
                <option value="3600">
                  {text(
                    "آخر ساعة",
                    "Previous hour"
                  )}
                </option>
                <option value="21600">
                  {text(
                    "آخر 6 ساعات",
                    "Previous 6 hours"
                  )}
                </option>
                <option value="43200">
                  {text(
                    "آخر 12 ساعة",
                    "Previous 12 hours"
                  )}
                </option>
                <option value="86400">
                  {text(
                    "آخر 24 ساعة",
                    "Previous 24 hours"
                  )}
                </option>
                <option value="604800">
                  {text(
                    "آخر 7 أيام",
                    "Previous 7 days"
                  )}
                </option>
              </select>
            </label>
          </ModalShell>
        )}
      </aside>
    </div>
  )
}