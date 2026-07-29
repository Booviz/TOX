// Central domain types — Prisma-ready shape for TOX Platform.
// Every entity mirrors the intended DB model so the demo service layer
// can be swapped for real repositories without changing the UI.

export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise'
export type HealthState = 'healthy' | 'warning' | 'critical'
export type MemberStatus = 'online' | 'idle' | 'dnd' | 'offline'

export interface User {
  id: string
  username: string
  displayName: string
  avatarColor: string
  email: string
  role: 'Owner' | 'TOX Team Admin' | 'Moderator' | 'Support' | 'Analyst'
}

export interface Guild {
  id: string
  name: string
  iconColor: string
  memberCount: number
  onlineCount: number
  ownerAdmin: 'owner' | 'admin'
  botInstalled: boolean
  botOnline: boolean
  missingPermissions: boolean
  plan: PlanTier
  health: HealthState
  boosts: number
}

export interface Member {
  id: string
  displayName: string
  username: string
  discordId: string
  avatarColor: string
  status: MemberStatus
  roles: string[]
  joinedAt: string
  accountCreatedAt: string
  messages: number
  level: number
  flagged: boolean
}

export interface Role {
  id: string
  name: string
  color: string
  memberCount: number
  position: number
  managed: boolean
  hoisted: boolean
  mentionable: boolean
  permissions: string[]
  dangerous: boolean
}

export type ChannelType = 'text' | 'voice' | 'forum' | 'announcement' | 'category'
export interface Channel {
  id: string
  name: string
  type: ChannelType
  parentId: string | null
  discordId: string
  topic?: string
  members?: number
  synced: boolean
  position: number
}

export type TicketStatus = 'open' | 'claimed' | 'pending' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export interface Ticket {
  id: string
  number: number
  subject: string
  category: string
  status: TicketStatus
  priority: TicketPriority
  owner: string
  ownerColor: string
  assignee: string | null
  createdAt: string
  lastActivity: string
  messages: number
  satisfaction: number | null
}

export interface TicketPanel {
  id: string
  name: string
  description: string
  style: 'button' | 'select'
  categories: number
  channel: string
  enabled: boolean
  ticketsOpened: number
}

export type LogCategory =
  | 'message'
  | 'member'
  | 'role'
  | 'channel'
  | 'voice'
  | 'moderation'
  | 'invite'
  | 'webhook'
  | 'ticket'
  | 'server'
export interface LogEvent {
  id: string
  category: LogCategory
  action: string
  actor: string
  target: string
  timestamp: string
  before?: string
  after?: string
}

export type AutoModRuleType =
  | 'spam'
  | 'flood'
  | 'mentions'
  | 'caps'
  | 'links'
  | 'invites'
  | 'profanity'
  | 'scam'
  | 'raid'
  | 'attachments'
export interface AutoModRule {
  id: string
  name: string
  type: AutoModRuleType
  enabled: boolean
  threshold: number
  window: number
  action: 'delete' | 'warn' | 'timeout' | 'kick' | 'ban' | 'quarantine'
  triggers: number
}

export type CaseType = 'note' | 'warn' | 'timeout' | 'kick' | 'ban' | 'softban' | 'unban'
export interface ModerationCase {
  id: string
  caseNumber: number
  type: CaseType
  member: string
  memberColor: string
  moderator: string
  reason: string
  createdAt: string
  duration?: string
  points: number
  active: boolean
}

export interface LevelEntry {
  rank: number
  member: string
  memberColor: string
  level: number
  xp: number
  messages: number
  voiceMinutes: number
}

export interface CustomCommand {
  id: string
  name: string
  trigger: 'slash' | 'prefix'
  description: string
  uses: number
  enabled: boolean
  responseType: 'text' | 'embed' | 'role' | 'dm'
}

export interface FormApplication {
  id: string
  name: string
  type: 'form' | 'application'
  fields: number
  submissions: number
  pending: number
  status: 'open' | 'closed'
}

export interface Backup {
  id: string
  name: string
  createdAt: string
  size: string
  type: 'manual' | 'scheduled'
  includes: string[]
}

export interface Integration {
  id: string
  name: string
  category: string
  connected: boolean
  description: string
}

export interface Webhook {
  id: string
  name: string
  channel: string
  events: number
  active: boolean
  lastDelivery: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'danger'
}

export interface ModuleConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
}

export interface ActivityItem {
  id: string
  actor: string
  actorColor: string
  action: string
  time: string
  type: LogCategory | 'ai'
}

export interface AiOperation {
  id: string
  kind: 'create' | 'update' | 'delete'
  target: string
  summary: string
  status: 'pending' | 'approved' | 'rejected'
}
