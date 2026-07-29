import type {
  ActivityItem,
  AutoModRule,
  Backup,
  Channel,
  CustomCommand,
  FormApplication,
  Guild,
  Integration,
  LevelEntry,
  LogEvent,
  Member,
  ModerationCase,
  ModuleConfig,
  AppNotification,
  Role,
  Ticket,
  TicketPanel,
  User,
  Webhook,
} from './types'

export const currentUser: User = {
  id: 'u_1',
  username: 'nova.dev',
  displayName: 'Nova',
  avatarColor: '#7c3aed',
  email: 'nova@toxplatform.gg',
  role: 'Owner',
}

const colors = ['#7c3aed', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#14b8a6']
const pick = (i: number) => colors[i % colors.length]

export const guilds: Guild[] = [
  { id: 'g_atlas', name: 'Atlas Community', iconColor: '#7c3aed', memberCount: 48213, onlineCount: 6120, ownerAdmin: 'owner', botInstalled: true, botOnline: true, missingPermissions: false, plan: 'business', health: 'healthy', boosts: 42 },
  { id: 'g_nebula', name: 'Nebula Gaming', iconColor: '#06b6d4', memberCount: 129045, onlineCount: 18422, ownerAdmin: 'admin', botInstalled: true, botOnline: true, missingPermissions: true, plan: 'enterprise', health: 'warning', boosts: 118 },
  { id: 'g_forge', name: 'The Forge', iconColor: '#22c55e', memberCount: 8901, onlineCount: 940, ownerAdmin: 'owner', botInstalled: true, botOnline: false, missingPermissions: false, plan: 'pro', health: 'critical', boosts: 7 },
  { id: 'g_market', name: 'Market Hub', iconColor: '#f59e0b', memberCount: 22740, onlineCount: 2210, ownerAdmin: 'admin', botInstalled: false, botOnline: false, missingPermissions: false, plan: 'free', health: 'warning', boosts: 0 },
  { id: 'g_studio', name: 'Studio Collective', iconColor: '#ec4899', memberCount: 3120, onlineCount: 411, ownerAdmin: 'owner', botInstalled: true, botOnline: true, missingPermissions: false, plan: 'pro', health: 'healthy', boosts: 14 },
]

export function getGuild(id: string): Guild {
  return guilds.find((g) => g.id === id) ?? guilds[0]
}

const firstNames = ['Aria', 'Kai', 'Luna', 'Milo', 'Zara', 'Finn', 'Nova', 'Rex', 'Iris', 'Leo', 'Maya', 'Enzo', 'Cleo', 'Otis', 'Vera', 'Dex']
const lastTags = ['0421', '7788', '1337', '0001', '9090', '4242', '5150', '0007', '3141', '2718']

export const members: Member[] = Array.from({ length: 64 }).map((_, i) => {
  const name = firstNames[i % firstNames.length]
  const statusPool: Member['status'][] = ['online', 'idle', 'dnd', 'offline']
  const rolePool = ['Member', 'Verified', 'Booster', 'Support', 'Moderator', 'Admin', 'VIP']
  return {
    id: `m_${i + 1}`,
    displayName: `${name}`,
    username: `${name.toLowerCase()}.${lastTags[i % lastTags.length]}`,
    discordId: `${100000000000000000 + i * 918273}`,
    avatarColor: pick(i),
    status: statusPool[i % statusPool.length],
    roles: [rolePool[i % rolePool.length], ...(i % 4 === 0 ? ['Booster'] : [])],
    joinedAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    accountCreatedAt: new Date(Date.now() - (i + 30) * 86400000 * 12).toISOString(),
    messages: Math.floor(2000 - i * 21 + (i % 7) * 340),
    level: Math.max(1, 60 - i),
    flagged: i % 13 === 0,
  }
})

export const roles: Role[] = [
  { id: 'r_owner', name: 'Owner', color: '#ef4444', memberCount: 1, position: 10, managed: false, hoisted: true, mentionable: false, permissions: ['Administrator'], dangerous: true },
  { id: 'r_admin', name: 'Admin', color: '#7c3aed', memberCount: 4, position: 9, managed: false, hoisted: true, mentionable: true, permissions: ['Manage Server', 'Ban Members', 'Manage Roles'], dangerous: true },
  { id: 'r_mod', name: 'Moderator', color: '#06b6d4', memberCount: 12, position: 8, managed: false, hoisted: true, mentionable: true, permissions: ['Kick Members', 'Timeout Members', 'Manage Messages'], dangerous: false },
  { id: 'r_support', name: 'Support', color: '#22c55e', memberCount: 21, position: 7, managed: false, hoisted: true, mentionable: true, permissions: ['Manage Messages', 'View Audit Log'], dangerous: false },
  { id: 'r_vip', name: 'VIP', color: '#f59e0b', memberCount: 148, position: 6, managed: false, hoisted: false, mentionable: false, permissions: ['Priority Speaker'], dangerous: false },
  { id: 'r_booster', name: 'Booster', color: '#ec4899', memberCount: 42, position: 5, managed: true, hoisted: false, mentionable: false, permissions: [], dangerous: false },
  { id: 'r_verified', name: 'Verified', color: '#3b82f6', memberCount: 41230, position: 4, managed: false, hoisted: false, mentionable: false, permissions: ['Send Messages', 'Connect'], dangerous: false },
  { id: 'r_member', name: 'Member', color: '#8a93a6', memberCount: 48012, position: 3, managed: false, hoisted: false, mentionable: false, permissions: ['Read Messages'], dangerous: false },
]

export const channels: Channel[] = [
  { id: 'c_info', name: 'INFORMATION', type: 'category', parentId: null, discordId: '900000000000000001', synced: true, position: 0 },
  { id: 'c_rules', name: 'rules', type: 'text', parentId: 'c_info', discordId: '900000000000000002', topic: 'Server rules and guidelines', synced: true, position: 1 },
  { id: 'c_announce', name: 'announcements', type: 'announcement', parentId: 'c_info', discordId: '900000000000000003', synced: true, position: 2 },
  { id: 'c_general', name: 'GENERAL', type: 'category', parentId: null, discordId: '900000000000000010', synced: true, position: 3 },
  { id: 'c_chat', name: 'general-chat', type: 'text', parentId: 'c_general', discordId: '900000000000000011', topic: 'Main community chat', synced: true, position: 4 },
  { id: 'c_media', name: 'media', type: 'text', parentId: 'c_general', discordId: '900000000000000012', synced: false, position: 5 },
  { id: 'c_help', name: 'help-forum', type: 'forum', parentId: 'c_general', discordId: '900000000000000013', synced: true, position: 6 },
  { id: 'c_voice', name: 'VOICE', type: 'category', parentId: null, discordId: '900000000000000020', synced: true, position: 7 },
  { id: 'c_lounge', name: 'Lounge', type: 'voice', parentId: 'c_voice', discordId: '900000000000000021', members: 12, synced: true, position: 8 },
  { id: 'c_gaming', name: 'Gaming', type: 'voice', parentId: 'c_voice', discordId: '900000000000000022', members: 4, synced: true, position: 9 },
]

const subjects = ['Payment not received', 'Ban appeal', 'Bug report: bot offline', 'Partnership request', 'Role not assigned', 'Report a member', 'Feature suggestion', 'Account recovery', 'Refund request', 'General question']
const cats = ['Support', 'Billing', 'Reports', 'Appeals', 'Partnerships']
export const tickets: Ticket[] = Array.from({ length: 28 }).map((_, i) => {
  const statusPool: Ticket['status'][] = ['open', 'claimed', 'pending', 'closed']
  const prio: Ticket['priority'][] = ['low', 'medium', 'high', 'urgent']
  return {
    id: `t_${i + 1}`,
    number: 1042 - i,
    subject: subjects[i % subjects.length],
    category: cats[i % cats.length],
    status: statusPool[i % statusPool.length],
    priority: prio[i % prio.length],
    owner: firstNames[i % firstNames.length],
    ownerColor: pick(i),
    assignee: i % 3 === 0 ? null : firstNames[(i + 3) % firstNames.length],
    createdAt: new Date(Date.now() - i * 3600000 * 5).toISOString(),
    lastActivity: new Date(Date.now() - i * 3600000).toISOString(),
    messages: 3 + (i % 24),
    satisfaction: i % 4 === 3 ? 4 + (i % 2) : null,
  }
})

export const ticketPanels: TicketPanel[] = [
  { id: 'p_support', name: 'Support Center', description: 'General support requests with 5 intake questions', style: 'button', categories: 3, channel: '#open-a-ticket', enabled: true, ticketsOpened: 1284 },
  { id: 'p_billing', name: 'Billing & Payments', description: 'Payment, refund and subscription issues', style: 'select', categories: 4, channel: '#billing-support', enabled: true, ticketsOpened: 412 },
  { id: 'p_appeals', name: 'Ban Appeals', description: 'Appeal a moderation action', style: 'button', categories: 1, channel: '#appeals', enabled: false, ticketsOpened: 96 },
]

const logActions: Record<string, LogEvent['category']> = {
  'Message deleted': 'message',
  'Member joined': 'member',
  'Member left': 'member',
  'Role updated': 'role',
  'Channel created': 'channel',
  'Joined voice': 'voice',
  'Member timed out': 'moderation',
  'Invite created': 'invite',
  'Webhook triggered': 'webhook',
  'Ticket opened': 'ticket',
  'Setting changed': 'server',
}
const logKeys = Object.keys(logActions)
export const logs: LogEvent[] = Array.from({ length: 40 }).map((_, i) => {
  const action = logKeys[i % logKeys.length]
  return {
    id: `l_${i + 1}`,
    category: logActions[action],
    action,
    actor: firstNames[i % firstNames.length],
    target: i % 2 === 0 ? `#${channels[4].name}` : firstNames[(i + 5) % firstNames.length],
    timestamp: new Date(Date.now() - i * 240000).toISOString(),
    before: action === 'Role updated' ? 'Color: #8a93a6' : action === 'Setting changed' ? 'Slowmode: off' : undefined,
    after: action === 'Role updated' ? 'Color: #7c3aed' : action === 'Setting changed' ? 'Slowmode: 5s' : undefined,
  }
})

export const automodRules: AutoModRule[] = [
  { id: 'a_spam', name: 'Anti-Spam', type: 'spam', enabled: true, threshold: 5, window: 10, action: 'timeout', triggers: 842 },
  { id: 'a_flood', name: 'Message Flood', type: 'flood', enabled: true, threshold: 8, window: 5, action: 'delete', triggers: 311 },
  { id: 'a_mentions', name: 'Mass Mentions', type: 'mentions', enabled: true, threshold: 6, window: 8, action: 'warn', triggers: 128 },
  { id: 'a_caps', name: 'Excessive Caps', type: 'caps', enabled: false, threshold: 70, window: 0, action: 'delete', triggers: 54 },
  { id: 'a_links', name: 'Suspicious Links', type: 'links', enabled: true, threshold: 1, window: 0, action: 'delete', triggers: 967 },
  { id: 'a_invites', name: 'Discord Invites', type: 'invites', enabled: true, threshold: 1, window: 0, action: 'delete', triggers: 623 },
  { id: 'a_profanity', name: 'Profanity Filter', type: 'profanity', enabled: true, threshold: 1, window: 0, action: 'warn', triggers: 1490 },
  { id: 'a_scam', name: 'Scam Detection', type: 'scam', enabled: true, threshold: 1, window: 0, action: 'ban', triggers: 88 },
  { id: 'a_raid', name: 'Raid Protection', type: 'raid', enabled: true, threshold: 20, window: 30, action: 'quarantine', triggers: 4 },
]

export const moderationCases: ModerationCase[] = Array.from({ length: 24 }).map((_, i) => {
  const typePool: ModerationCase['type'][] = ['warn', 'timeout', 'kick', 'ban', 'note', 'softban', 'unban']
  const reasons = ['Spam in #general', 'Advertising', 'Harassment', 'NSFW content', 'Ban evasion', 'Scam links', 'Toxic behavior', 'Rule 3 violation']
  const type = typePool[i % typePool.length]
  return {
    id: `case_${i + 1}`,
    caseNumber: 2048 - i,
    type,
    member: firstNames[i % firstNames.length],
    memberColor: pick(i),
    moderator: ['Nova', 'Kai', 'Luna'][i % 3],
    reason: reasons[i % reasons.length],
    createdAt: new Date(Date.now() - i * 3600000 * 8).toISOString(),
    duration: type === 'timeout' ? `${(i % 7) + 1}h` : type === 'ban' ? 'Permanent' : undefined,
    points: type === 'warn' ? 1 : type === 'timeout' ? 2 : type === 'ban' ? 5 : 0,
    active: i % 3 !== 0,
  }
})

export const leaderboard: LevelEntry[] = members
  .slice()
  .sort((a, b) => b.messages - a.messages)
  .slice(0, 25)
  .map((m, i) => ({
    rank: i + 1,
    member: m.displayName,
    memberColor: m.avatarColor,
    level: m.level,
    xp: m.messages * 12,
    messages: m.messages,
    voiceMinutes: Math.floor(m.messages / 3),
  }))

export const commands: CustomCommand[] = [
  { id: 'cmd_rules', name: '/rules', trigger: 'slash', description: 'Posts the server rules embed', uses: 3201, enabled: true, responseType: 'embed' },
  { id: 'cmd_ticket', name: '/ticket', trigger: 'slash', description: 'Opens a new support ticket', uses: 1842, enabled: true, responseType: 'text' },
  { id: 'cmd_verify', name: '!verify', trigger: 'prefix', description: 'Assigns the Verified role', uses: 9903, enabled: true, responseType: 'role' },
  { id: 'cmd_dm', name: '/welcome-dm', trigger: 'slash', description: 'Sends the onboarding DM', uses: 512, enabled: false, responseType: 'dm' },
]

export const formsAndApps: FormApplication[] = [
  { id: 'f_staff', name: 'Staff Application', type: 'application', fields: 12, submissions: 240, pending: 8, status: 'open' },
  { id: 'f_partner', name: 'Partnership Form', type: 'form', fields: 7, submissions: 96, pending: 3, status: 'open' },
  { id: 'f_feedback', name: 'Community Feedback', type: 'form', fields: 5, submissions: 1204, pending: 0, status: 'open' },
  { id: 'f_event', name: 'Event Host Application', type: 'application', fields: 9, submissions: 44, pending: 12, status: 'closed' },
]

export const backups: Backup[] = [
  { id: 'b_1', name: 'Weekly snapshot', createdAt: new Date(Date.now() - 86400000).toISOString(), size: '2.4 MB', type: 'scheduled', includes: ['Roles', 'Channels', 'Permissions', 'Settings'] },
  { id: 'b_2', name: 'Before role revamp', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), size: '2.1 MB', type: 'manual', includes: ['Roles', 'Permissions'] },
  { id: 'b_3', name: 'Full server backup', createdAt: new Date(Date.now() - 86400000 * 9).toISOString(), size: '3.8 MB', type: 'manual', includes: ['Roles', 'Channels', 'Permissions', 'Emojis', 'Settings', 'Modules'] },
]

export const integrations: Integration[] = [
  { id: 'i_youtube', name: 'YouTube', category: 'Notifications', connected: true, description: 'Announce new uploads to a channel' },
  { id: 'i_twitch', name: 'Twitch', category: 'Notifications', connected: true, description: 'Go-live alerts for streamers' },
  { id: 'i_x', name: 'X (Twitter)', category: 'Notifications', connected: false, description: 'Cross-post tweets automatically' },
  { id: 'i_sheets', name: 'Google Sheets', category: 'Data', connected: false, description: 'Export tickets and forms to Sheets' },
  { id: 'i_stripe', name: 'Stripe', category: 'Payments', connected: true, description: 'Sync subscriptions and roles' },
  { id: 'i_github', name: 'GitHub', category: 'Developer', connected: false, description: 'Post commits and issues' },
]

export const webhooks: Webhook[] = [
  { id: 'w_1', name: 'Mod alerts', channel: '#mod-log', events: 6, active: true, lastDelivery: new Date(Date.now() - 120000).toISOString() },
  { id: 'w_2', name: 'Ticket notifications', channel: '#ticket-feed', events: 4, active: true, lastDelivery: new Date(Date.now() - 900000).toISOString() },
  { id: 'w_3', name: 'Analytics export', channel: '#analytics', events: 2, active: false, lastDelivery: new Date(Date.now() - 86400000).toISOString() },
]

export const modules: ModuleConfig[] = [
  { id: 'mod_tickets', name: 'Tickets', description: 'Advanced ticketing with panels and transcripts', enabled: true, category: 'Support' },
  { id: 'mod_automod', name: 'AutoMod', description: 'Automated moderation and raid protection', enabled: true, category: 'Security' },
  { id: 'mod_logs', name: 'Logging', description: 'Unified server event logging', enabled: true, category: 'Insights' },
  { id: 'mod_welcome', name: 'Welcome', description: 'Welcome, leave and boost messages', enabled: true, category: 'Engagement' },
  { id: 'mod_levels', name: 'Levels', description: 'Message and voice XP with rewards', enabled: false, category: 'Engagement' },
  { id: 'mod_backup', name: 'Backup', description: 'Manual and scheduled server backups', enabled: true, category: 'Utility' },
  { id: 'mod_commands', name: 'Custom Commands', description: 'Slash and prefix command builder', enabled: true, category: 'Utility' },
  { id: 'mod_forms', name: 'Forms', description: 'Forms and application review', enabled: false, category: 'Support' },
]

export const notifications: AppNotification[] = [
  { id: 'n_1', title: 'Raid mitigated', body: 'AutoMod quarantined 18 accounts in Nebula Gaming', time: '2m', read: false, type: 'warning' },
  { id: 'n_2', title: 'New staff application', body: 'Aria submitted a staff application', time: '18m', read: false, type: 'info' },
  { id: 'n_3', title: 'Backup completed', body: 'Weekly snapshot finished successfully', time: '1h', read: true, type: 'success' },
  { id: 'n_4', title: 'Bot offline', body: 'TOX lost connection in The Forge', time: '3h', read: true, type: 'danger' },
]

export const activity: ActivityItem[] = [
  { id: 'act_1', actor: 'Luna', actorColor: '#06b6d4', action: 'claimed ticket #1042', time: '1m', type: 'ticket' },
  { id: 'act_2', actor: 'AutoMod', actorColor: '#ef4444', action: 'timed out Rex for spam', time: '4m', type: 'moderation' },
  { id: 'act_3', actor: 'Kai', actorColor: '#22c55e', action: 'created role VIP+', time: '12m', type: 'role' },
  { id: 'act_4', actor: 'TOX AI', actorColor: '#7c3aed', action: 'updated welcome message', time: '20m', type: 'ai' },
  { id: 'act_5', actor: 'Milo', actorColor: '#f59e0b', action: 'joined the server', time: '31m', type: 'member' },
  { id: 'act_6', actor: 'Nova', actorColor: '#ec4899', action: 'edited AutoMod rule Anti-Spam', time: '48m', type: 'moderation' },
]

// Time-series helpers for charts
export function memberGrowth(days = 30) {
  const base = 47000
  return Array.from({ length: days }).map((_, i) => ({
    date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    members: base + i * 42 + Math.round(Math.sin(i / 3) * 120),
    joins: 60 + Math.round(Math.abs(Math.sin(i / 2)) * 90),
    leaves: 20 + Math.round(Math.abs(Math.cos(i / 2)) * 30),
  }))
}

export function messageActivity(days = 30) {
  return Array.from({ length: days }).map((_, i) => ({
    date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    messages: 8000 + Math.round(Math.abs(Math.sin(i / 2)) * 6000) + i * 30,
    voice: 1200 + Math.round(Math.abs(Math.cos(i / 3)) * 900),
  }))
}

export const ticketBreakdown = [
  { name: 'Support', value: 1284, color: '#7c3aed' },
  { name: 'Billing', value: 412, color: '#06b6d4' },
  { name: 'Reports', value: 268, color: '#22c55e' },
  { name: 'Appeals', value: 96, color: '#f59e0b' },
  { name: 'Partnerships', value: 54, color: '#ec4899' },
]
