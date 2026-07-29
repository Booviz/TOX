"use client"

export type TicketBuilderTab =
  | "panel"
  | "categories"
  | "permissions"
  | "messages"
  | "advanced"

export type TicketPanelStyle = "modern" | "compact" | "minimal"
export type TicketPanelOpenMode = "create-channel" | "existing-channel"
export type TicketCategoryColor =
  | "purple"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "cyan"
  | "pink"
  | "gray"
export type TicketButtonStyle =
  | "primary"
  | "secondary"
  | "success"
  | "danger"

export type TicketCategory = {
  id: string
  name: string
  description: string
  emoji: string
  color: TicketCategoryColor
  buttonStyle: TicketButtonStyle
  enabled: boolean
  openCategoryId: string
  closedCategoryId: string
  supportRoleIds: string[]
  mentionRoleIds: string[]
  ticketNameTemplate: string
  openingMessage: string
  maxOpenTicketsPerUser: number
  requireReason: boolean
  requireConfirmation: boolean
  position: number
}

export type TicketPanelAppearance = {
  title: string
  description: string
  color: string
  imageEnabled: boolean
  imageUrl: string
  thumbnailEnabled: boolean
  thumbnailUrl: string
  footerEnabled: boolean
  footerText: string
  footerIconUrl: string
  timestampEnabled: boolean
  showCategories: boolean
  useSelectMenu: boolean
  panelStyle: TicketPanelStyle
}

export type TicketChannelSettings = {
  openMode: TicketPanelOpenMode
  panelChannelId: string
  existingTicketChannelId: string
  openCategoryId: string
  closedCategoryId: string
  ticketNameTemplate: string
  syncCategoryPermissions: boolean
  privateByDefault: boolean
  hideFromEveryone: boolean
}

export type TicketPermissionSettings = {
  staffRoleIds: string[]
  adminRoleIds: string[]
  transcriptRoleIds: string[]
  blockedRoleIds: string[]
  allowUserClose: boolean
  allowUserAddMembers: boolean
  allowUserRemoveMembers: boolean
  staffCanRename: boolean
  staffCanMove: boolean
  staffCanDelete: boolean
  staffCanClaim: boolean
}

export type TicketMessageTemplate = {
  enabled: boolean
  content: string
}

export type TicketEmbedMessageTemplate = {
  enabled: boolean
  title: string
  description: string
  color: string
  imageUrl: string
  thumbnailUrl: string
  footerText: string
  footerIconUrl: string
  timestamp: boolean
}

export type TicketMessageSettings = {
  opening: TicketEmbedMessageTemplate
  closeConfirmation: TicketEmbedMessageTemplate
  closed: TicketEmbedMessageTemplate
  claimed: TicketMessageTemplate
  memberAdded: TicketMessageTemplate
  memberRemoved: TicketMessageTemplate
  dmReminder: TicketEmbedMessageTemplate
}

export type TicketTranscriptSettings = {
  enabled: boolean
  format: "html" | "text" | "both"
  sendToUser: boolean
  sendToStaff: boolean
  logChannelId: string
  includeAttachments: boolean
  includeEmbeds: boolean
}

export type TicketAutomationSettings = {
  autoCloseEnabled: boolean
  autoCloseAfterHours: number
  autoCloseWarningEnabled: boolean
  autoCloseWarningHours: number
  inactivityReminderEnabled: boolean
  inactivityReminderHours: number
  autoDeleteEnabled: boolean
  autoDeleteAfterHours: number
}

export type TicketAdvancedSettings = {
  requireCloseReason: boolean
  requireClaimBeforeClose: boolean
  oneTicketPerCategory: boolean
  preventDuplicateTickets: boolean
  pingStaffOnOpen: boolean
  pingUserOnOpen: boolean
  enableClaiming: boolean
  enablePriority: boolean
  enableRating: boolean
  enableDmReminder: boolean
  transcript: TicketTranscriptSettings
  automation: TicketAutomationSettings
}

export type TicketSystemSettings = {
  guildId: string
  panelId: string
  enabled: boolean
  name: string
  appearance: TicketPanelAppearance
  categories: TicketCategory[]
  channels: TicketChannelSettings
  permissions: TicketPermissionSettings
  messages: TicketMessageSettings
  advanced: TicketAdvancedSettings
  createdAt?: string | null
  updatedAt?: string | null
}

export type TicketChannelOption = {
  id: string
  name: string
  type: "text" | "announcement" | "forum" | "category" | "unknown"
  parentId?: string | null
  parentName?: string | null
}

export type TicketRoleOption = {
  id: string
  name: string
  color?: string | null
  managed?: boolean
  position?: number
}

export type TicketVariable = {
  token: string
  label: string
  description: string
  example: string
}

export type TicketBuilderTabsProps = {
  activeTab: TicketBuilderTab
  onTabChange: (tab: TicketBuilderTab) => void
}

export type TicketPanelSetupProps = {
  value: TicketPanelAppearance
  channels: TicketChannelOption[]
  onChange: (value: TicketPanelAppearance) => void
}

export type TicketCategoriesTabProps = {
  value: TicketCategory[]
  channels: TicketChannelOption[]
  roles: TicketRoleOption[]
  onChange: (value: TicketCategory[]) => void
}

export type TicketPermissionsTabProps = {
  channels: TicketChannelOption[]
  roles: TicketRoleOption[]
  channelSettings: TicketChannelSettings
  permissionSettings: TicketPermissionSettings
  onChannelSettingsChange: (value: TicketChannelSettings) => void
  onPermissionSettingsChange: (value: TicketPermissionSettings) => void
}

export type TicketMessagesTabProps = {
  value: TicketMessageSettings
  onChange: (value: TicketMessageSettings) => void
}

export type TicketAdvancedTabProps = {
  value: TicketAdvancedSettings
  channels: TicketChannelOption[]
  roles: TicketRoleOption[]
  onChange: (value: TicketAdvancedSettings) => void
}

export type TicketPanelPreviewProps = {
  guildName: string
  guildIconUrl?: string | null
  appearance: TicketPanelAppearance
  categories: TicketCategory[]
}

export type TicketVariablesProps = {
  onInsert?: (token: string) => void
}

export type TicketBuilderApiResponse = {
  success: boolean
  settings?: TicketSystemSettings
  channels?: TicketChannelOption[]
  roles?: TicketRoleOption[]
  guild?: {
    id: string
    name: string
    iconUrl?: string | null
  }
  message?: string
  error?: string
}

export const TICKET_VARIABLES: TicketVariable[] = [
  { token: "{user}", label: "User", description: "Member display name.", example: "Mohammed" },
  { token: "{username}", label: "Username", description: "Member username.", example: "mohd_21" },
  { token: "{mention}", label: "Mention", description: "Mentions the member.", example: "@Mohammed" },
  { token: "{userId}", label: "User ID", description: "Member Discord ID.", example: "123456789" },
  { token: "{server}", label: "Server", description: "Server name.", example: "TOX COMMUNITY" },
  { token: "{serverName}", label: "Server Name", description: "Alias for server name.", example: "TOX COMMUNITY" },
  { token: "{guildId}", label: "Guild ID", description: "Discord server ID.", example: "123456789" },
  { token: "{memberCount}", label: "Member Count", description: "Current member count.", example: "421" },
  { token: "{channel}", label: "Channel", description: "Ticket channel mention.", example: "#ticket-0247" },
  { token: "{ticketNumber}", label: "Ticket Number", description: "Generated ticket number.", example: "0247" },
  { token: "{ticketId}", label: "Ticket ID", description: "Internal ticket ID.", example: "TKT-0247" },
  { token: "{category}", label: "Category", description: "Selected ticket category.", example: "Support" },
  { token: "{reason}", label: "Reason", description: "Ticket or close reason.", example: "Account issue" },
  { token: "{staff}", label: "Staff", description: "Staff handling the ticket.", example: "@Support Team" },
  { token: "{date}", label: "Date", description: "Current date.", example: "19/07/2026" },
  { token: "{time}", label: "Time", description: "Current time.", example: "09:30 PM" },
]

export const DEFAULT_TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: "support",
    name: "دعم فني",
    description: "الحصول على مساعدة في المشاكل التقنية.",
    emoji: "🎧",
    color: "purple",
    buttonStyle: "primary",
    enabled: true,
    openCategoryId: "",
    closedCategoryId: "",
    supportRoleIds: [],
    mentionRoleIds: [],
    ticketNameTemplate: "support-{ticketNumber}",
    openingMessage: "مرحبًا {mention}، سيتم مساعدتك من فريق الدعم قريبًا.",
    maxOpenTicketsPerUser: 1,
    requireReason: true,
    requireConfirmation: false,
    position: 0,
  },
  {
    id: "complaint",
    name: "شكوى",
    description: "الإبلاغ عن مشكلة أو مخالفة.",
    emoji: "🛡️",
    color: "blue",
    buttonStyle: "secondary",
    enabled: true,
    openCategoryId: "",
    closedCategoryId: "",
    supportRoleIds: [],
    mentionRoleIds: [],
    ticketNameTemplate: "complaint-{ticketNumber}",
    openingMessage: "مرحبًا {mention}، يرجى توضيح تفاصيل الشكوى.",
    maxOpenTicketsPerUser: 1,
    requireReason: true,
    requireConfirmation: true,
    position: 1,
  },
  {
    id: "suggestion",
    name: "اقتراح",
    description: "شاركنا اقتراحك لتطوير السيرفر.",
    emoji: "💡",
    color: "yellow",
    buttonStyle: "success",
    enabled: true,
    openCategoryId: "",
    closedCategoryId: "",
    supportRoleIds: [],
    mentionRoleIds: [],
    ticketNameTemplate: "suggestion-{ticketNumber}",
    openingMessage: "شكرًا لك {mention}، اكتب اقتراحك بالتفصيل.",
    maxOpenTicketsPerUser: 2,
    requireReason: false,
    requireConfirmation: false,
    position: 2,
  },
  {
    id: "other",
    name: "أخرى",
    description: "طلبات أخرى لا تندرج ضمن الأقسام السابقة.",
    emoji: "📋",
    color: "green",
    buttonStyle: "secondary",
    enabled: true,
    openCategoryId: "",
    closedCategoryId: "",
    supportRoleIds: [],
    mentionRoleIds: [],
    ticketNameTemplate: "ticket-{ticketNumber}",
    openingMessage: "مرحبًا {mention}، يرجى توضيح طلبك.",
    maxOpenTicketsPerUser: 1,
    requireReason: true,
    requireConfirmation: false,
    position: 3,
  },
]

export const DEFAULT_TICKET_SYSTEM_SETTINGS: TicketSystemSettings = {
  guildId: "",
  panelId: "default-panel",
  enabled: true,
  name: "Ticket System",

  appearance: {
    title: "Ticket System",
    description:
      "مرحبًا بك في نظام التذاكر الخاص بـ **{server}**.\nيرجى اختيار نوع التذكرة المناسب لك وسيتم مساعدتك في أقرب وقت ممكن.",
    color: "#9B4DFF",
    imageEnabled: true,
    imageUrl: "",
    thumbnailEnabled: false,
    thumbnailUrl: "",
    footerEnabled: true,
    footerText: "{server} • We're here to help",
    footerIconUrl: "",
    timestampEnabled: true,
    showCategories: true,
    useSelectMenu: false,
    panelStyle: "modern",
  },

  categories: DEFAULT_TICKET_CATEGORIES.map((category) => ({
    ...category,
    supportRoleIds: [...category.supportRoleIds],
    mentionRoleIds: [...category.mentionRoleIds],
  })),

  channels: {
    openMode: "create-channel",
    panelChannelId: "",
    existingTicketChannelId: "",
    openCategoryId: "",
    closedCategoryId: "",
    ticketNameTemplate: "ticket-{ticketNumber}",
    syncCategoryPermissions: true,
    privateByDefault: true,
    hideFromEveryone: true,
  },

  permissions: {
    staffRoleIds: [],
    adminRoleIds: [],
    transcriptRoleIds: [],
    blockedRoleIds: [],
    allowUserClose: false,
    allowUserAddMembers: false,
    allowUserRemoveMembers: false,
    staffCanRename: true,
    staffCanMove: true,
    staffCanDelete: true,
    staffCanClaim: true,
  },

  messages: {
    opening: {
      enabled: true,
      title: "Ticket {ticketNumber}",
      description:
        "مرحبًا {mention}، تم إنشاء تذكرتك بنجاح.\nيرجى شرح طلبك بالتفصيل وسيقوم فريق الدعم بالرد عليك قريبًا.",
      color: "#9B4DFF",
      imageUrl: "",
      thumbnailUrl: "{serverIcon}",
      footerText: "{server} • Support System",
      footerIconUrl: "{serverIcon}",
      timestamp: true,
    },
    closeConfirmation: {
      enabled: true,
      title: "Close Ticket",
      description: "هل أنت متأكد من إغلاق التذكرة؟",
      color: "#F59E0B",
      imageUrl: "",
      thumbnailUrl: "",
      footerText: "",
      footerIconUrl: "",
      timestamp: false,
    },
    closed: {
      enabled: true,
      title: "Ticket Closed",
      description: "تم إغلاق التذكرة بواسطة {staff}.",
      color: "#EF4444",
      imageUrl: "",
      thumbnailUrl: "",
      footerText: "{server} • Ticket System",
      footerIconUrl: "{serverIcon}",
      timestamp: true,
    },
    claimed: {
      enabled: true,
      content: "تم استلام التذكرة بواسطة {staff}.",
    },
    memberAdded: {
      enabled: true,
      content: "تمت إضافة {mention} إلى التذكرة.",
    },
    memberRemoved: {
      enabled: true,
      content: "تمت إزالة {mention} من التذكرة.",
    },
    dmReminder: {
      enabled: true,
      title: "Ticket Reminder",
      description: "لديك تذكرة مفتوحة في {server} وتنتظر ردك.",
      color: "#9B4DFF",
      imageUrl: "",
      thumbnailUrl: "{serverIcon}",
      footerText: "{server} • Ticket Reminder",
      footerIconUrl: "{serverIcon}",
      timestamp: true,
    },
  },

  advanced: {
    requireCloseReason: true,
    requireClaimBeforeClose: false,
    oneTicketPerCategory: true,
    preventDuplicateTickets: true,
    pingStaffOnOpen: true,
    pingUserOnOpen: true,
    enableClaiming: true,
    enablePriority: true,
    enableRating: false,
    enableDmReminder: true,

    transcript: {
      enabled: true,
      format: "html",
      sendToUser: true,
      sendToStaff: false,
      logChannelId: "",
      includeAttachments: true,
      includeEmbeds: true,
    },

    automation: {
      autoCloseEnabled: false,
      autoCloseAfterHours: 72,
      autoCloseWarningEnabled: true,
      autoCloseWarningHours: 24,
      inactivityReminderEnabled: false,
      inactivityReminderHours: 24,
      autoDeleteEnabled: false,
      autoDeleteAfterHours: 24,
    },
  },

  createdAt: null,
  updatedAt: null,
}