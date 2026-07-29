"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react"
import { useParams } from "next/navigation"
import {
  Activity,
  ArrowDown,
  Ban,
  Bot,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock3,
  Copy,
  FileText,
  Gavel,
  Hash,
  LoaderCircle,
  MessageSquare,
  MessagesSquare,
  Mic,
  MicOff,
  Palette,
  Pencil,
  RefreshCw,
  Search,
  Shield,
  TimerOff,
  Trash2,
  UserMinus,
  UserPlus,
  UserRoundX,
  Video,
  X,
} from "lucide-react"

import { useLocale } from "@/lib/i18n"
import {
  formatLocalizedDate,
  formatLocalizedNumber,
  formatLocalizedRelativeTime,
} from "@/lib/i18n/date"

type LogMetadata = Record<string, unknown>

type DiscordLog = {
  id: number | string
  guild_id: string
  event_type: string
  actor_id: string | null
  actor_name: string | null
  target_id: string | null
  target_name: string | null
  channel_id: string | null
  channel_name: string | null
  description: string | null
  metadata: LogMetadata | null
  created_at: string
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

type LogsResponse = {
  logs?: DiscordLog[]
  pagination?: Pagination
  error?: string
}

type EventStyle = {
  icon: ComponentType<{ className?: string }>
  iconClass: string
  lineClass: string
}

type MetadataChange = {
  old?: unknown
  new?: unknown
}

type DeletedMessage = {
  id?: string
  authorId?: string | null
  authorName?: string | null
  content?: string | null
  createdAt?: string | null
  attachments?: Array<{
    id?: string
    name?: string | null
    url?: string | null
    contentType?: string | null
    size?: number | null
  }>
}

const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
}

const EVENT_TYPES = [
  "ALL",
  "MESSAGE_DELETE",
  "MESSAGE_UPDATE",
  "MESSAGE_BULK_DELETE",
  "CHANNEL_CREATE",
  "CHANNEL_UPDATE",
  "CHANNEL_DELETE",
  "ROLE_CREATE",
  "ROLE_UPDATE",
  "ROLE_DELETE",
  "MEMBER_JOIN",
  "MEMBER_LEAVE",
  "MEMBER_KICK",
  "MEMBER_BAN",
  "MEMBER_UNBAN",
  "MEMBER_TIMEOUT",
  "MEMBER_TIMEOUT_REMOVE",
  "VOICE_JOIN",
  "VOICE_LEAVE",
  "VOICE_MOVE",
  "GUILD_CREATE",
  "GUILD_DELETE",
] as const

function getEventStyle(eventType: string): EventStyle {
  switch (eventType) {
    case "MESSAGE_DELETE":
      return {
        icon: Trash2,
        iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
        lineClass: "bg-red-500/30",
      }
    case "MESSAGE_UPDATE":
      return {
        icon: Pencil,
        iconClass: "border-amber-500/25 bg-amber-500/10 text-amber-400",
        lineClass: "bg-amber-500/30",
      }
    case "MESSAGE_BULK_DELETE":
      return {
        icon: MessagesSquare,
        iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
        lineClass: "bg-red-500/30",
      }
    case "CHANNEL_CREATE":
      return {
        icon: CirclePlus,
        iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        lineClass: "bg-emerald-500/30",
      }
    case "CHANNEL_UPDATE":
      return {
        icon: Hash,
        iconClass: "border-amber-500/25 bg-amber-500/10 text-amber-400",
        lineClass: "bg-amber-500/30",
      }
    case "CHANNEL_DELETE":
      return {
        icon: Trash2,
        iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
        lineClass: "bg-red-500/30",
      }
    case "ROLE_CREATE":
      return {
        icon: Shield,
        iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        lineClass: "bg-emerald-500/30",
      }
    case "ROLE_UPDATE":
      return {
        icon: Palette,
        iconClass: "border-amber-500/25 bg-amber-500/10 text-amber-400",
        lineClass: "bg-amber-500/30",
      }
    case "ROLE_DELETE":
      return {
        icon: Trash2,
        iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
        lineClass: "bg-red-500/30",
      }
    case "MEMBER_JOIN":
      return {
        icon: UserPlus,
        iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        lineClass: "bg-emerald-500/30",
      }
    case "MEMBER_LEAVE":
      return {
        icon: UserMinus,
        iconClass: "border-blue-500/25 bg-blue-500/10 text-blue-400",
        lineClass: "bg-blue-500/30",
      }
    case "MEMBER_KICK":
      return {
        icon: UserRoundX,
        iconClass: "border-orange-500/25 bg-orange-500/10 text-orange-400",
        lineClass: "bg-orange-500/30",
      }
    case "MEMBER_BAN":
      return {
        icon: Ban,
        iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
        lineClass: "bg-red-500/30",
      }
    case "MEMBER_UNBAN":
      return {
        icon: Gavel,
        iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        lineClass: "bg-emerald-500/30",
      }
    case "MEMBER_TIMEOUT":
      return {
        icon: Clock3,
        iconClass: "border-violet-500/25 bg-violet-500/10 text-violet-400",
        lineClass: "bg-violet-500/30",
      }
    case "MEMBER_TIMEOUT_REMOVE":
      return {
        icon: TimerOff,
        iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        lineClass: "bg-emerald-500/30",
      }
    case "VOICE_JOIN":
      return {
        icon: Mic,
        iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        lineClass: "bg-emerald-500/30",
      }
    case "VOICE_LEAVE":
    case "VOICE_DISCONNECT":
      return {
        icon: MicOff,
        iconClass: "border-blue-500/25 bg-blue-500/10 text-blue-400",
        lineClass: "bg-blue-500/30",
      }
    case "VOICE_CAMERA_ON":
    case "VOICE_CAMERA_OFF":
      return {
        icon: Video,
        iconClass: "border-violet-500/25 bg-violet-500/10 text-violet-400",
        lineClass: "bg-violet-500/30",
      }
    case "GUILD_CREATE":
      return {
        icon: Bot,
        iconClass: "border-violet-500/25 bg-violet-500/10 text-violet-400",
        lineClass: "bg-violet-500/30",
      }
    case "GUILD_DELETE":
      return {
        icon: X,
        iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
        lineClass: "bg-red-500/30",
      }
    default:
      return {
        icon: Activity,
        iconClass: "border-white/10 bg-white/5 text-white/60",
        lineClass: "bg-white/15",
      }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readMetadataString(metadata: LogMetadata | null, key: string) {
  const value = metadata?.[key]
  return typeof value === "string" ? value : null
}

function readMetadataNumber(metadata: LogMetadata | null, key: string) {
  const value = metadata?.[key]
  return typeof value === "number" ? value : null
}

function readMetadataBoolean(metadata: LogMetadata | null, key: string) {
  const value = metadata?.[key]
  return typeof value === "boolean" ? value : null
}

function getChangeMap(
  metadata: LogMetadata | null
): Record<string, MetadataChange> {
  const value = metadata?.changes
  if (!isRecord(value)) return {}

  const result: Record<string, MetadataChange> = {}
  for (const [key, change] of Object.entries(value)) {
    if (isRecord(change)) {
      result[key] = { old: change.old, new: change.new }
    }
  }
  return result
}

function getDeletedMessages(metadata: LogMetadata | null): DeletedMessage[] {
  const value = metadata?.deletedMessages
  if (!Array.isArray(value)) return []
  return value.filter((item): item is DeletedMessage => isRecord(item))
}

type Translate = (key: string) => string

function valueToText(value: unknown, t: Translate) {
  if (value === null || value === undefined) return t("common.unavailable")
  if (typeof value === "boolean") {
    return value ? t("common.enabled") : t("common.disabled")
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return t("common.none")
    return value
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join(", ")
  }
  try {
    return JSON.stringify(value)
  } catch {
    return t("common.unavailable")
  }
}

function getChangeLabel(key: string, t: Translate) {
  const translated = t(`logs.change.${key}`)
  return translated === `logs.change.${key}` ? key : translated
}

function getEventTitle(eventType: string, t: Translate) {
  const key = `logs.event.${eventType}`
  const translated = t(key)
  return translated === key ? eventType.replaceAll("_", " ") : translated
}

function getEventBadge(eventType: string, t: Translate) {
  const key = `logs.badge.${eventType}`
  const translated = t(key)
  return translated === key ? eventType.replaceAll("_", " ") : translated
}

function getPreviewText(log: DiscordLog, t: Translate) {
  if (log.event_type === "MESSAGE_DELETE") {
    return readMetadataString(log.metadata, "content")
  }

  if (log.event_type === "MESSAGE_UPDATE") {
    const oldContent = readMetadataString(log.metadata, "oldContent")
    const newContent = readMetadataString(log.metadata, "newContent")
    if (oldContent || newContent) {
      return `${oldContent ?? t("common.empty")} → ${
        newContent ?? t("common.empty")
      }`
    }
  }

  if (log.event_type === "MESSAGE_BULK_DELETE") {
    const count = readMetadataNumber(log.metadata, "messageCount")
    if (count !== null) {
      return `${t("logs.deletedMessagesCount")}: ${count}`
    }
  }

  return null
}

function CopyValue({ value }: { value: string }) {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error("Failed to copy value:", error)
    }
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      title={t("action.copy")}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/40 transition hover:bg-white/[0.08] hover:text-white"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

function DetailField({
  label,
  value,
  copyable = false,
}: {
  label: string
  value: string
  copyable?: boolean
}) {
  const { t } = useLocale()

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/30">
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="min-w-0 break-all text-sm text-white/80">{value}</p>
        {copyable && value !== t("common.unavailable") && (
          <CopyValue value={value} />
        )}
      </div>
    </div>
  )
}

function ChangeCard({
  label,
  oldValue,
  newValue,
}: {
  label: string
  oldValue: unknown
  newValue: unknown
}) {
  const { t } = useLocale()

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <p className="text-xs font-semibold text-white/75">{label}</p>
      <div className="mt-3 grid gap-3">
        <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] p-3">
          <p className="text-[10px] font-medium text-red-300/70">
            {t("common.before")}
          </p>
          <p className="mt-1 break-words text-sm leading-6 text-white/70">
            {valueToText(oldValue, t)}
          </p>
        </div>

        <div className="flex justify-center text-white/25">
          <ArrowDown className="h-4 w-4" />
        </div>

        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] p-3">
          <p className="text-[10px] font-medium text-emerald-300/70">
            {t("common.after")}
          </p>
          <p className="mt-1 break-words text-sm leading-6 text-white/70">
            {valueToText(newValue, t)}
          </p>
        </div>
      </div>
    </div>
  )
}

function MessageUpdateMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t } = useLocale()
  const oldContent = readMetadataString(metadata, "oldContent")
  const newContent = readMetadataString(metadata, "newContent")
  const messageUrl = readMetadataString(metadata, "messageUrl")

  return (
    <div className="grid gap-4">
      <ChangeCard
        label={t("logs.messageContent")}
        oldValue={oldContent ?? t("common.empty")}
        newValue={newContent ?? t("common.empty")}
      />
      {messageUrl && (
        <DetailField
          label={t("logs.messageUrl")}
          value={messageUrl}
          copyable
        />
      )}
    </div>
  )
}

function MessageDeleteMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t } = useLocale()
  const content = readMetadataString(metadata, "content")
  const attachments = metadata?.attachments

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-4">
        <p className="text-xs font-semibold text-red-300/80">
          {t("logs.deletedMessageContent")}
        </p>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/75">
          {content || t("logs.noTextContent")}
        </p>
      </div>

      {Array.isArray(attachments) && attachments.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold">
            {t("logs.attachments")}
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment, index) => {
              if (!isRecord(attachment)) return null
              const name =
                typeof attachment.name === "string"
                  ? attachment.name
                  : `${t("logs.attachment")} ${index + 1}`
              const url =
                typeof attachment.url === "string" ? attachment.url : null

              return (
                <div
                  key={`${name}-${index}`}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <p className="text-sm text-white/75">{name}</p>
                  {url && (
                    <p className="mt-1 break-all text-xs text-violet-300">
                      {url}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function BulkDeleteMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t, locale } = useLocale()
  const messageCount = readMetadataNumber(metadata, "messageCount") ?? 0
  const storedMessagesCount =
    readMetadataNumber(metadata, "storedMessagesCount") ?? 0
  const truncated = readMetadataBoolean(metadata, "truncated") ?? false
  const messages = getDeletedMessages(metadata)

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailField
          label={t("logs.deletedMessagesCount")}
          value={formatLocalizedNumber(messageCount, locale)}
        />
        <DetailField
          label={t("logs.savedMessagesCount")}
          value={formatLocalizedNumber(storedMessagesCount, locale)}
        />
      </div>

      {truncated && (
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.05] px-4 py-3 text-xs leading-6 text-amber-200/70">
          {t("logs.bulkTruncated")}
        </div>
      )}

      {messages.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold">
            {t("logs.deletedMessages")}
          </h4>
          <div className="max-h-[420px] space-y-3 overflow-y-auto pl-1">
            {messages.map((message, index) => (
              <div
                key={message.id ?? String(index)}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium text-white/70">
                    {message.authorName ?? t("common.unknown")}
                  </p>
                  {message.createdAt && (
                    <p className="text-[10px] text-white/25">
                      {formatLocalizedDate(message.createdAt, locale)}
                    </p>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/60">
                  {message.content || t("logs.noTextContent")}
                </p>

                {message.id && (
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                    <p className="truncate text-[10px] text-white/25">
                      {message.id}
                    </p>
                    <CopyValue value={message.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UpdateMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t } = useLocale()
  const entries = Object.entries(getChangeMap(metadata))

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm text-white/40">
        {t("logs.noDisplayableChanges")}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {entries.map(([key, change]) => (
        <ChangeCard
          key={key}
          label={getChangeLabel(key, t)}
          oldValue={change.old}
          newValue={change.new}
        />
      ))}
    </div>
  )
}

function ModerationMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t } = useLocale()
  const reason = readMetadataString(metadata, "reason")
  const changesValue = metadata?.changes
  const changes = Array.isArray(changesValue) ? changesValue : []
  const timeoutChange = changes.find(
    (change) =>
      isRecord(change) &&
      change.key === "communication_disabled_until"
  )
  const timeoutOld = isRecord(timeoutChange) ? timeoutChange.old : null
  const timeoutNew = isRecord(timeoutChange) ? timeoutChange.new : null
  const auditLogEntryId = readMetadataString(metadata, "auditLogEntryId")

  return (
    <div className="space-y-4">
      <DetailField
        label={t("logs.reason")}
        value={reason ?? t("logs.noReason")}
      />

      {(timeoutOld !== null || timeoutNew !== null) && (
        <ChangeCard
          label={t("logs.timeoutDuration")}
          oldValue={timeoutOld ?? t("logs.timeoutNotActive")}
          newValue={timeoutNew ?? t("logs.timeoutRemoved")}
        />
      )}

      {auditLogEntryId && (
        <DetailField
          label={t("logs.auditLogId")}
          value={auditLogEntryId}
          copyable
        />
      )}
    </div>
  )
}

function MemberMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t, locale } = useLocale()
  const username = readMetadataString(metadata, "username")
  const avatar = readMetadataString(metadata, "avatar")
  const joinedAt = readMetadataString(metadata, "joinedAt")
  const accountCreated = readMetadataString(metadata, "accountCreated")
  const leftAt = readMetadataString(metadata, "leftAt")
  const bot = readMetadataBoolean(metadata, "bot")

  return (
    <div className="space-y-4">
      {avatar && (
        <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt={username ?? t("common.unknown")}
            className="h-14 w-14 rounded-full border border-white/10 object-cover"
          />
          <div>
            <p className="font-medium text-white/85">
              {username ?? t("common.unknown")}
            </p>
            <p className="mt-1 text-xs text-white/35">
              {bot ? t("logs.discordBot") : t("logs.discordMember")}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {username && (
          <DetailField label={t("logs.username")} value={username} />
        )}
        {accountCreated && (
          <DetailField
            label={t("logs.accountCreated")}
            value={formatLocalizedDate(accountCreated, locale)}
          />
        )}
        {joinedAt && (
          <DetailField
            label={t("logs.joinedServerAt")}
            value={formatLocalizedDate(joinedAt, locale)}
          />
        )}
        {leftAt && (
          <DetailField
            label={t("logs.leftServerAt")}
            value={formatLocalizedDate(leftAt, locale)}
          />
        )}
      </div>
    </div>
  )
}

function GenericMetadata({ metadata }: { metadata: LogMetadata | null }) {
  const { t } = useLocale()
  const entries = Object.entries(metadata ?? {})

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm text-white/40">
        {t("logs.noAdditionalData")}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <DetailField
          key={key}
          label={getChangeLabel(key, t)}
          value={valueToText(value, t)}
          copyable={key.toLowerCase().includes("id") && typeof value === "string"}
        />
      ))}
    </div>
  )
}

function SmartMetadata({ log }: { log: DiscordLog }) {
  switch (log.event_type) {
    case "MESSAGE_UPDATE":
      return <MessageUpdateMetadata metadata={log.metadata} />
    case "MESSAGE_DELETE":
      return <MessageDeleteMetadata metadata={log.metadata} />
    case "MESSAGE_BULK_DELETE":
      return <BulkDeleteMetadata metadata={log.metadata} />
    case "ROLE_UPDATE":
    case "CHANNEL_UPDATE":
      return <UpdateMetadata metadata={log.metadata} />
    case "MEMBER_KICK":
    case "MEMBER_BAN":
    case "MEMBER_UNBAN":
    case "MEMBER_TIMEOUT":
    case "MEMBER_TIMEOUT_REMOVE":
      return <ModerationMetadata metadata={log.metadata} />
    case "MEMBER_JOIN":
    case "MEMBER_LEAVE":
      return <MemberMetadata metadata={log.metadata} />
    default:
      return <GenericMetadata metadata={log.metadata} />
  }
}

function LogItem({
  log,
  isLast,
  onOpen,
}: {
  log: DiscordLog
  isLast: boolean
  onOpen: (log: DiscordLog) => void
}) {
  const { t, locale } = useLocale()
  const style = getEventStyle(log.event_type)
  const Icon = style.icon
  const preview = getPreviewText(log, t)

  return (
    <div className="relative pl-14">
      {!isLast && (
        <div
          className={`absolute left-[21px] top-11 h-[calc(100%+16px)] w-px ${style.lineClass}`}
        />
      )}

      <div
        className={`absolute left-0 top-4 flex h-11 w-11 items-center justify-center rounded-xl border ${style.iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <button
        type="button"
        onClick={() => onOpen(log)}
        className="w-full rounded-2xl border border-white/[0.07] bg-[#11131a] p-4 text-left transition hover:border-white/[0.14] hover:bg-[#151821]"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                {getEventTitle(log.event_type, t)}
              </h2>
              <span className="rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/40">
                {getEventBadge(log.event_type, t)}
              </span>
            </div>

            <p className="mt-1 text-xs text-white/40">
             {t(`logs.description.${log.event_type}`)}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              {log.actor_name && (
                <span className="text-white/65">
                  {t("logs.by")}:{" "}
                  <strong className="font-medium text-white/90">
                    {log.actor_name}
                  </strong>
                </span>
              )}

              {log.target_name && (
                <span className="text-white/65">
                  {t("logs.target")}:{" "}
                  <strong className="font-medium text-white/90">
                    {log.target_name}
                  </strong>
                </span>
              )}

              {log.channel_name && (
                <span className="inline-flex items-center gap-1 text-white/65">
                  <Hash className="h-3.5 w-3.5" />
                  <strong className="font-medium text-white/90">
                    {log.channel_name}
                  </strong>
                </span>
              )}
            </div>

            {preview && (
              <p className="mt-3 line-clamp-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-xs leading-6 text-white/55">
                {preview}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/[0.06] pt-3 lg:block lg:border-0 lg:pt-0 lg:text-right">
            <p className="inline-flex items-center gap-1.5 text-xs text-white/55">
              <Clock3 className="h-3.5 w-3.5" />
              {formatLocalizedRelativeTime(log.created_at, locale)}
            </p>
            <p className="mt-1 text-[10px] text-white/25">
              {formatLocalizedDate(log.created_at, locale)}
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}

function LogDrawer({
  log,
  onClose,
}: {
  log: DiscordLog | null
  onClose: () => void
}) {
  const { t, locale } = useLocale()

  useEffect(() => {
    if (!log) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [log, onClose])

  if (!log) return null

  const style = getEventStyle(log.event_type)
  const Icon = style.icon

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <button
        type="button"
        aria-label={t("action.close")}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <aside className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-r border-white/[0.08] bg-[#0d0f16] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border ${style.iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">
                {getEventTitle(log.event_type, t)}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-white/35">
                  {t("logs.logNumber")} #{log.id}
                </p>
                <span className="rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/35">
                  {getEventBadge(log.event_type, t)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {log.description && (
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-xs font-medium text-white/35">
              {t("logs.eventDescriptionLabel")}
            </p>

            <p className="mt-2 text-sm leading-7 text-white/70">
              {t(`logs.description.${log.event_type}`)}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <DetailField
            label={t("logs.eventType")}
            value={log.event_type}
          />
          <DetailField
            label={t("logs.eventTime")}
            value={formatLocalizedDate(log.created_at, locale)}
          />
          <DetailField
            label={t("logs.executor")}
            value={log.actor_name ?? t("common.unknown")}
          />
          <DetailField
            label={t("logs.executorId")}
            value={log.actor_id ?? t("common.unavailable")}
            copyable
          />
          <DetailField
            label={t("logs.targetName")}
            value={log.target_name ?? t("common.unavailable")}
          />
          <DetailField
            label={t("logs.targetId")}
            value={log.target_id ?? t("common.unavailable")}
            copyable
          />
          <DetailField
            label={t("logs.channelName")}
            value={
              log.channel_name
                ? `#${log.channel_name}`
                : t("common.unavailable")
            }
          />
          <DetailField
            label={t("logs.channelId")}
            value={log.channel_id ?? t("common.unavailable")}
            copyable
          />
        </div>

        <div className="mt-7">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold">
              {t("logs.eventDetails")}
            </h3>
          </div>
          <SmartMetadata log={log} />
        </div>
      </aside>
    </div>
  )
}

export default function LogsPage() {
  const { t, locale } = useLocale()
  const params = useParams<{ guildId: string }>()

  const guildId = Array.isArray(params.guildId)
    ? params.guildId[0]
    : params.guildId

  const [logs, setLogs] = useState<DiscordLog[]>([])
  const [selectedLog, setSelectedLog] = useState<DiscordLog | null>(null)
  const [pagination, setPagination] =
    useState<Pagination>(EMPTY_PAGINATION)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [eventType, setEventType] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eventOptions = useMemo(
    () =>
      EVENT_TYPES.map((value) => ({
        value,
        label: t(`logs.filter.${value}`),
      })),
    [t]
  )

  const queryString = useMemo(() => {
    const query = new URLSearchParams()
    query.set("page", String(page))
    query.set("limit", "20")
    query.set("eventType", eventType)
    if (debouncedSearch) query.set("search", debouncedSearch)
    return query.toString()
  }, [page, eventType, debouncedSearch])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPage(1)
    }, 450)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const loadLogs = useCallback(
    async (manualRefresh = false) => {
      if (!guildId) return

      try {
        if (manualRefresh) setRefreshing(true)
        else setLoading(true)

        setError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/logs?${queryString}`,
          { cache: "no-store" }
        )

        const data = (await response.json()) as LogsResponse

        if (!response.ok) {
          throw new Error(data.error ?? t("logs.errorDefault"))
        }

        setLogs(data.logs ?? [])
        setPagination(data.pagination ?? EMPTY_PAGINATION)
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("logs.errorDefault")
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [guildId, queryString, t]
  )

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  return (
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/[0.08] bg-[#11131a] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                <Activity className="h-3.5 w-3.5" />
                {t("logs.systemName")}
              </div>

              <h1 className="mt-3 text-2xl font-bold">{t("logs.title")}</h1>

              <p className="mt-2 text-sm text-white/40">
                {t("logs.subtitle")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadLogs(true)}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm text-white/75 transition hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              {refreshing ? t("logs.refreshing") : t("logs.refresh")}
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_230px]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("logs.searchPlaceholder")}
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 pl-11 pr-4 text-sm outline-none placeholder:text-white/25 focus:border-violet-500/40"
              />
            </label>

            <div className="relative">
              <select
                value={eventType}
                onChange={(event) => {
                  setEventType(event.target.value)
                  setPage(1)
                }}
                className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm outline-none focus:border-violet-500/40"
              >
                {eventOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#11131a] p-4">
            <p className="text-xs text-white/35">{t("logs.total")}</p>
            <p className="mt-1 text-xl font-bold">
              {formatLocalizedNumber(pagination.total, locale)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#11131a] p-4">
            <p className="text-xs text-white/35">{t("logs.currentPage")}</p>
            <p className="mt-1 text-xl font-bold">
              {formatLocalizedNumber(pagination.page, locale)}
              <span className="ml-2 text-xs font-normal text-white/25">
                {t("logs.of")}{" "}
                {formatLocalizedNumber(pagination.totalPages, locale)}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#11131a] p-4">
            <p className="text-xs text-white/35">
              {t("logs.currentFilter")}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-violet-300">
              {eventOptions.find((option) => option.value === eventType)
                ?.label ?? t("logs.allEvents")}
            </p>
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-white/[0.07] bg-[#11131a]">
              <div className="text-center">
                <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-violet-400" />
                <p className="mt-3 text-sm text-white/40">
                  {t("logs.loading")}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.05] p-10 text-center">
              <p className="text-sm text-red-300">{error}</p>
              <button
                type="button"
                onClick={() => void loadLogs()}
                className="mt-4 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-500"
              >
                {t("action.retry")}
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/[0.09] bg-[#11131a] p-14 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-white/20" />
              <h2 className="mt-4 font-semibold">{t("logs.emptyTitle")}</h2>
              <p className="mt-2 text-sm text-white/35">
                {t("logs.emptyDescription")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <LogItem
                  key={String(log.id)}
                  log={log}
                  isLast={index === logs.length - 1}
                  onOpen={setSelectedLog}
                />
              ))}
            </div>
          )}
        </section>

        {!loading && !error && pagination.total > 0 && (
          <footer className="mt-6 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#11131a] p-4">
            <p className="text-xs text-white/35">
              {t("logs.page")}{" "}
              {formatLocalizedNumber(pagination.page, locale)}{" "}
              {t("logs.of")}{" "}
              {formatLocalizedNumber(pagination.totalPages, locale)}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t("action.previous")}
                disabled={!pagination.hasPreviousPage}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 text-sm text-violet-300">
                {formatLocalizedNumber(pagination.page, locale)}
              </span>

              <button
                type="button"
                aria-label={t("action.next")}
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((current) => current + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </footer>
        )}
      </div>

      <LogDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
    </main>
  )
}