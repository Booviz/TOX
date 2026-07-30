export type Locale = "en" | "ar"

export type Dictionary = Record<string, string>

export const en: Dictionary = {
  // Application
  "app.name": "TOX",
  "app.tagline": "All-in-one Discord management",

  // Navigation groups
  "nav.group.main": "Main",
  "nav.group.server": "Server Management",
  "nav.group.tools": "Tools",

  "nav.general": "General",
  "nav.community": "Community",
  "nav.support": "Support",
  "nav.safety": "Safety",
  "nav.advanced": "Advanced",

  // Navigation items
  "nav.overview": "Overview",
  "nav.analytics": "Analytics",
  "nav.ai": "AI Assistant",
  "nav.members": "Members",
  "nav.roles": "Roles",
  "nav.channels": "Channels",
  "nav.welcome": "Welcome",
  "nav.levels": "Levels",
  "nav.tickets": "Tickets",
  "nav.forms": "Forms",
  "nav.moderation": "Moderation",
  "nav.automod": "AutoMod",
  "nav.logs": "Logs",
  "nav.customLogs": "Custom Logs",
  "nav.commands": "Custom Commands",
  "nav.backup": "Backup",
  "nav.integrations": "Integrations",
  "nav.webhooks": "Webhooks",
  "nav.modules": "Modules",
  "nav.settings": "Settings",
  "nav.audit": "Audit Logs",

  // Actions
  "action.save": "Save changes",
  "action.cancel": "Cancel",
  "action.create": "Create",
  "action.delete": "Delete",
  "action.search": "Search",
  "action.refresh": "Refresh",
  "action.retry": "Try again",
  "action.close": "Close",
  "action.copy": "Copy",
  "action.previous": "Previous",
  "action.next": "Next",
  "action.viewAll": "View all",
  "action.upgrade": "Upgrade plan",

  // Common
  "common.loading": "Loading",
  "common.online": "Online",
  "common.offline": "Offline",
  "common.unknown": "Unknown",
  "common.unavailable": "Unavailable",
  "common.none": "None",
  "common.empty": "Empty",
  "common.enabled": "Enabled",
  "common.disabled": "Disabled",
  "common.before": "Before",
  "common.after": "After",
  "common.notSpecified": "Not specified",
  "common.yes": "Yes",
  "common.no": "No",

  // Header
  "header.switchServer": "Switch server",
  "header.loadingServers": "Loading servers...",
  "header.noServers": "No connected servers found.",
  "header.viewAllServers": "View all servers",
  "header.loadingServer": "Loading server...",
  "header.defaultServer": "Discord server",

  "header.notifications": "Notifications",
  "header.newNotifications": "new",
  "header.noNotifications": "No notifications yet",
  "header.notificationsDescription":
    "TOX notifications will appear here after database tracking is connected.",
  "header.viewAllNotifications": "View all notifications",

  "header.help": "Help",
  "header.profile": "Profile",
  "header.billing": "Billing",
  "header.aiBuilder": "AI Builder",
  "header.signOut": "Sign out",
  "header.discordUser": "Discord user",
  "header.signedInWithDiscord": "Signed in with Discord",
  "header.openNavigation": "Open navigation",
  "header.openProfile": "Open profile menu",

  // Landing page
  "landing.cta.add": "Add TOX to Discord",
  "landing.cta.demo": "Live demo",
  "landing.signin": "Sign in",
  "landing.hero.title":
    "One platform to run your entire Discord server",
  "landing.hero.sub":
    "Tickets, moderation, security, logging, leveling, backups and analytics — unified and supercharged by an AI configuration builder.",

  // Logs page
  "logs.systemName": "TOX Audit System",
  "logs.title": "Server Logs",
  "logs.subtitle":
    "View and monitor every event recorded by TOX in your server.",

  "logs.refresh": "Refresh logs",
  "logs.refreshing": "Refreshing...",
  "logs.searchPlaceholder":
    "Search by user, channel or event...",
  "logs.allEvents": "All events",

  "logs.total": "Total logs",
  "logs.currentPage": "Current page",
  "logs.currentFilter": "Current filter",
  "logs.page": "Page",
  "logs.of": "of",

  "logs.loading": "Loading logs...",
  "logs.emptyTitle": "No logs found",
  "logs.emptyDescription":
    "There are no events matching your current search or filter.",
  "logs.errorDefault":
    "An error occurred while loading server logs.",

  "logs.eventDescription":
    "A new server event was recorded.",
  "logs.by": "By",
  "logs.target": "Target",
  "logs.channel": "Channel",

  "logs.eventType": "Event type",
  "logs.eventTime": "Event time",
  "logs.executor": "Executor",
  "logs.executorId": "Executor ID",
  "logs.targetName": "Affected item",
  "logs.targetId": "Target ID",
  "logs.channelName": "Channel",
  "logs.channelId": "Channel ID",
  "logs.eventDescriptionLabel": "Event description",
  "logs.eventDetails": "Event details",
  "logs.logNumber": "Log",

  "logs.reason": "Reason",
  "logs.noReason": "No reason was provided",
  "logs.auditLogId": "Audit log ID",

  "logs.messageContent": "Message content",
  "logs.deletedMessageContent": "Deleted message content",
  "logs.noTextContent": "No text content",
  "logs.attachments": "Attachments",
  "logs.attachment": "Attachment",
  "logs.messageUrl": "Message URL",

  "logs.deletedMessages": "Deleted messages",
  "logs.deletedMessagesCount": "Deleted messages",
  "logs.savedMessagesCount": "Stored messages",
  "logs.bulkTruncated":
    "Only the first 50 messages were stored to keep this log lightweight.",

  "logs.noAdditionalData":
    "No additional data is available.",
  "logs.noDisplayableChanges":
    "There are no displayable changes.",

  "logs.timeoutDuration": "Timeout duration",
  "logs.timeoutNotActive": "No timeout was active",
  "logs.timeoutRemoved": "Timeout removed",

  "logs.username": "Username",
  "logs.accountCreated": "Account created",
  "logs.joinedServerAt": "Joined server",
  "logs.leftServerAt": "Left server",
  "logs.discordBot": "Discord bot",
  "logs.discordMember": "Discord member",

  // Log filters
  "logs.filter.ALL": "All events",
  "logs.filter.MESSAGE_DELETE": "Message deleted",
  "logs.filter.MESSAGE_UPDATE": "Message updated",
  "logs.filter.MESSAGE_BULK_DELETE":
    "Bulk message deletion",
  "logs.filter.CHANNEL_CREATE": "Channel created",
  "logs.filter.CHANNEL_UPDATE": "Channel updated",
  "logs.filter.CHANNEL_DELETE": "Channel deleted",
  "logs.filter.ROLE_CREATE": "Role created",
  "logs.filter.ROLE_UPDATE": "Role updated",
  "logs.filter.ROLE_DELETE": "Role deleted",
  "logs.filter.MEMBER_JOIN": "Member joined",
  "logs.filter.MEMBER_LEAVE": "Member left",
  "logs.filter.MEMBER_KICK": "Member kicked",
  "logs.filter.MEMBER_BAN": "Member banned",
  "logs.filter.MEMBER_UNBAN": "Member unbanned",
  "logs.filter.MEMBER_TIMEOUT": "Member timed out",
  "logs.filter.MEMBER_TIMEOUT_REMOVE":
    "Timeout removed",
  "logs.filter.VOICE_JOIN": "Voice joined",
  "logs.filter.VOICE_LEAVE": "Voice left",
  "logs.filter.VOICE_MOVE": "Voice moved",
  "logs.filter.GUILD_CREATE": "Bot installed",
  "logs.filter.GUILD_DELETE": "Bot removed",

  // Log event titles
  "logs.event.MESSAGE_DELETE": "Message deleted",
  "logs.event.MESSAGE_UPDATE": "Message updated",
  "logs.event.MESSAGE_BULK_DELETE":
    "Messages deleted in bulk",

  "logs.event.CHANNEL_CREATE": "Channel created",
  "logs.event.CHANNEL_UPDATE": "Channel updated",
  "logs.event.CHANNEL_DELETE": "Channel deleted",

  "logs.event.ROLE_CREATE": "Role created",
  "logs.event.ROLE_UPDATE": "Role updated",
  "logs.event.ROLE_DELETE": "Role deleted",

  "logs.event.MEMBER_JOIN": "Member joined the server",
  "logs.event.MEMBER_LEAVE": "Member left the server",
  "logs.event.MEMBER_KICK": "Member kicked",
  "logs.event.MEMBER_BAN": "Member banned",
  "logs.event.MEMBER_UNBAN": "Member unbanned",
  "logs.event.MEMBER_TIMEOUT": "Member timed out",
  "logs.event.MEMBER_TIMEOUT_REMOVE":
    "Member timeout removed",

  "logs.event.VOICE_JOIN": "Member joined voice",
  "logs.event.VOICE_LEAVE": "Member left voice",
  "logs.event.VOICE_DISCONNECT":
    "Member disconnected from voice",
  "logs.event.VOICE_MOVE":
    "Member moved between voice channels",
  "logs.event.VOICE_SWITCH":
    "Member switched voice channels",
  "logs.event.VOICE_SERVER_MUTE":
    "Member server-muted",
  "logs.event.VOICE_SERVER_UNMUTE":
    "Member server-unmuted",
  "logs.event.VOICE_SERVER_DEAFEN":
    "Member server-deafened",
  "logs.event.VOICE_SERVER_UNDEAFEN":
    "Member server-undeafened",
  "logs.event.VOICE_SELF_MUTE":
    "Member muted themselves",
  "logs.event.VOICE_SELF_UNMUTE":
    "Member unmuted themselves",
  "logs.event.VOICE_SELF_DEAFEN":
    "Member deafened themselves",
  "logs.event.VOICE_SELF_UNDEAFEN":
    "Member undeafened themselves",
  "logs.event.VOICE_CAMERA_ON": "Camera enabled",
  "logs.event.VOICE_CAMERA_OFF": "Camera disabled",
  "logs.event.VOICE_STREAM_START":
    "Screen sharing started",
  "logs.event.VOICE_STREAM_STOP":
    "Screen sharing stopped",

  "logs.event.GUILD_CREATE": "TOX added to the server",
  "logs.event.GUILD_DELETE": "TOX removed from the server",
    

  // Event descriptions
  "logs.description.MESSAGE_DELETE": "A message was deleted from a text channel.",
  "logs.description.MESSAGE_UPDATE": "A message was edited.",
  "logs.description.MESSAGE_BULK_DELETE": "Multiple messages were deleted at once.",

  "logs.description.CHANNEL_CREATE": "A new channel has been created.",
  "logs.description.CHANNEL_UPDATE": "A channel has been updated.",
  "logs.description.CHANNEL_DELETE": "A channel has been deleted.",

  "logs.description.ROLE_CREATE": "A new role has been created.",
  "logs.description.ROLE_UPDATE": "A role has been updated.",
  "logs.description.ROLE_DELETE": "A role has been deleted.",

  "logs.description.MEMBER_JOIN": "A member joined the server.",
  "logs.description.MEMBER_LEAVE": "A member left the server.",
  "logs.description.MEMBER_KICK": "A member was kicked.",
  "logs.description.MEMBER_BAN": "A member was banned.",
  "logs.description.MEMBER_UNBAN": "A member was unbanned.",
  "logs.description.MEMBER_TIMEOUT": "A timeout has been applied.",
  "logs.description.MEMBER_TIMEOUT_REMOVE": "The timeout has been removed.",

  "logs.description.VOICE_JOIN": "A member joined a voice channel.",
  "logs.description.VOICE_LEAVE": "A member left a voice channel.",
  "logs.description.VOICE_MOVE": "A member moved to another voice channel.",

  "logs.description.GUILD_CREATE": "TOX was added to this server.",
  "logs.description.GUILD_DELETE": "TOX was removed from this server.",

  // Event badges
  "logs.badge.MESSAGE_DELETE": "Message deleted",
  "logs.badge.MESSAGE_UPDATE": "Message updated",
  "logs.badge.MESSAGE_BULK_DELETE":
    "Bulk messages deleted",
  "logs.badge.CHANNEL_CREATE": "Channel created",
  "logs.badge.CHANNEL_UPDATE": "Channel updated",
  "logs.badge.CHANNEL_DELETE": "Channel deleted",
  "logs.badge.ROLE_CREATE": "Role created",
  "logs.badge.ROLE_UPDATE": "Role updated",
  "logs.badge.ROLE_DELETE": "Role deleted",
  "logs.badge.MEMBER_JOIN": "Member joined",
  "logs.badge.MEMBER_LEAVE": "Member left",
  "logs.badge.MEMBER_KICK": "Member kicked",
  "logs.badge.MEMBER_BAN": "Member banned",
  "logs.badge.MEMBER_UNBAN": "Member unbanned",
  "logs.badge.MEMBER_TIMEOUT": "Member timeout",
  "logs.badge.MEMBER_TIMEOUT_REMOVE":
    "Timeout removed",
  "logs.badge.VOICE_JOIN": "Voice joined",
  "logs.badge.VOICE_LEAVE": "Voice left",
  "logs.badge.VOICE_DISCONNECT": "Voice disconnected",
  "logs.badge.VOICE_MOVE": "Voice moved",
  "logs.badge.VOICE_SWITCH": "Voice switched",
  "logs.badge.VOICE_SERVER_MUTE": "Server mute",
  "logs.badge.VOICE_SERVER_UNMUTE": "Server unmute",
  "logs.badge.VOICE_SERVER_DEAFEN": "Server deafen",
  "logs.badge.VOICE_SERVER_UNDEAFEN":
    "Server undeafen",
  "logs.badge.VOICE_SELF_MUTE": "Self mute",
  "logs.badge.VOICE_SELF_UNMUTE": "Self unmute",
  "logs.badge.VOICE_SELF_DEAFEN": "Self deafen",
  "logs.badge.VOICE_SELF_UNDEAFEN": "Self undeafen",
  "logs.badge.VOICE_CAMERA_ON": "Camera enabled",
  "logs.badge.VOICE_CAMERA_OFF": "Camera disabled",
  "logs.badge.VOICE_STREAM_START": "Stream started",
  "logs.badge.VOICE_STREAM_STOP": "Stream stopped",
  "logs.badge.GUILD_CREATE": "Bot installed",
  "logs.badge.GUILD_DELETE": "Bot removed",

  // Change field labels
  "logs.change.name": "Name",
  "logs.change.color": "Color",
  "logs.change.topic": "Channel topic",
  "logs.change.position": "Position",
  "logs.change.parentId": "Category",
  "logs.change.type": "Channel type",
  "logs.change.nsfw": "NSFW",
  "logs.change.rateLimitPerUser": "Slowmode",
  "logs.change.bitrate": "Bitrate",
  "logs.change.userLimit": "User limit",
  "logs.change.mentionable": "Mentionable",
  "logs.change.hoist": "Display role separately",
  "logs.change.permissions": "Permissions",
  "logs.change.permissionOverwrites":
    "Channel permissions",
  "logs.change.oldValue": "Previous value",
  "logs.change.newValue": "New value",
  // Overview page
  "overview.loadingTitle": "Loading server dashboard",
  "overview.loadingDescription": "Fetching live information from Discord...",
  "overview.errorTitle": "Could not load this server",
  "overview.errorUnavailable": "The server information is unavailable right now.",
  "overview.error.loadServer": "Failed to load server information",
  "overview.error.noServerData": "Discord server data was not returned",
  "overview.backToServers": "Back to servers",
  "overview.subtitle": "Server overview and live Discord information",
  "overview.botOnline": "Bot online",
  "overview.botOffline": "Bot offline",
  "overview.aiBuilder": "AI Builder",
  "overview.totalMembers": "Total members",
  "overview.onlineMembers": "Online members",
  "overview.channels": "Channels",
  "overview.roles": "Roles",
  "overview.serverInformation": "Server Information",
  "overview.serverInformationDescription": "Live information fetched directly from Discord.",
  "overview.serverName": "Server name",
  "overview.serverId": "Server ID",
  "overview.preferredLanguage": "Preferred language",
  "overview.verification": "Verification",
  "overview.verification.none": "None",
  "overview.verification.low": "Low",
  "overview.verification.medium": "Medium",
  "overview.verification.high": "High",
  "overview.verification.veryHigh": "Very high",
  "overview.boostLevel": "Boost level",
  "overview.noBoostLevel": "No boost level",
  "overview.level": "Level",
  "overview.boostCount": "Boost count",
  "overview.textChannels": "Text channels",
  "overview.voiceChannels": "Voice channels",
  "overview.serverFeatures": "Server Features",
  "overview.liveMetrics": "Live Metrics",
  "overview.liveMetricsDescription": "Information collected by the TOX bot.",
  "overview.messagesToday": "Messages Today",
  "overview.openTickets": "Open Tickets",
  "overview.newJoins": "New Joins",
  "overview.warningsToday": "Warnings Today",
  "overview.serverAccess": "Server Access",
  "overview.serverAccessDescription": "Your current Discord permissions for this server.",
  "overview.serverOwner": "Server Owner",
  "overview.manageServer": "Manage Server",
  "overview.botStatus": "Bot status",
  "overview.totalChannels": "Total channels",
  "overview.totalRoles": "Total roles",
  "overview.discordLocale": "Discord locale",
  "overview.analytics": "Analytics",
  "overview.analyticsDescription": "Historical data will appear after TOX starts recording server activity.",
  "overview.viewAnalytics": "View analytics",
  "overview.noHistoricalActivity": "No historical activity yet",
  "overview.noHistoricalActivityDescription": "Message activity, member growth, tickets and moderation charts will be available after the TOX bot records data in the database.",
  "overview.quickActions": "Quick actions",
  "overview.newTicketPanel": "New ticket panel",
  "overview.addCommand": "Add command",
  "overview.backupNow": "Backup now",
  "overview.aiAssistant": "AI Assistant",
  "overview.aiAssistantDescription": "Describe what you want to configure and TOX AI will help build the setup for this server.",
  "overview.openAiBuilder": "Open AI Builder",
  "overview.serverSummary": "Server summary",
  "overview.members": "Members",
  "overview.boosts": "Boosts",
  "overview.recentActivity": "Recent activity",
  "overview.noActivityRecorded": "No activity recorded",
  "overview.recentActivityDescription": "Recent joins, tickets, warnings and role changes will appear here after database tracking is connected.",

  // Members page
  "members.title": "Members",
  "members.subtitle": "Manage and monitor every member in this Discord server.",
  "members.loading": "Loading members...",
  "members.loadingDescription": "Fetching live member information from the TOX bot.",
  "members.errorTitle": "Unable to load members",
  "members.errorDefault": "An error occurred while loading server members.",
  "members.refreshing": "Refreshing...",
  "members.searchPlaceholder": "Search by name, username or Discord ID...",
  "members.total": "Total members",
  "members.listTitle": "Member list",
  "members.membersFound": "members found",
  "members.member": "Member",
  "members.roles": "Roles",
  "members.joined": "Joined",
  "members.status": "Status",
  "members.nickname": "Nickname",
  "members.noNickname": "No nickname",
  "members.username": "Username",
  "members.discordId": "Discord ID",
  "members.boosting": "Server booster",
  "members.boostingSince": "Boosting since",
  "members.openDetails": "Open member details",
  "members.filter.all": "All",
  "members.filter.humans": "Humans",
  "members.filter.bots": "Bots",
  "members.filter.online": "Online",
  "members.filter.offline": "Offline",
  "members.filter.timedOut": "Timed out",
  "members.filter.allRoles": "All roles",
  "members.sort.joinedNewest": "Joined newest",
  "members.sort.joinedOldest": "Joined oldest",
  "members.sort.nameAz": "Name A–Z",
  "members.sort.nameZa": "Name Z–A",
  "members.status.online": "Online",
  "members.status.idle": "Idle",
  "members.status.dnd": "Do Not Disturb",
  "members.status.offline": "Offline",
  "members.badge.bot": "Bot",
  "members.badge.timedOut": "Timed out",
  "members.emptyTitle": "No members found",
  "members.emptyDescription": "No server members match the current search or filters.",
  "members.detailsTitle": "Member details",
  "members.detailsSubtitle": "View account information, roles and activity.",
  "members.tab.overview": "Overview",
  "members.tab.roles": "Roles",
  "members.tab.activity": "Activity",
  "members.timeoutActive": "Timeout active",
  "members.rolesAssigned": "roles assigned",
  "members.addRole": "Add role",
  "members.noRoles": "This member has no assigned roles.",
  "members.managedRole": "Managed role",
  "members.activityEmptyTitle": "No activity recorded",
  "members.activityEmptyDescription": "Recent activity, voice state and moderation history will appear here after activity tracking is connected.",
  "members.actions": "Member actions",
  "members.editNickname": "Edit nickname",
  "members.timeout": "Timeout",
  "members.kick": "Kick member",
  "members.ban": "Ban member",
  "members.actionsComingSoon": "Member management actions will be enabled in the next step.",
  "sidebar.collapse": "Collapse",
  "sidebar.expand": "Expand",

}

export const ar: Dictionary = {
  // التطبيق
  "app.name": "TOX",
  "app.tagline": "منصة إدارة ديسكورد المتكاملة",

  // مجموعات القائمة
  "nav.group.main": "الرئيسية",
  "nav.group.server": "إدارة السيرفر",
  "nav.group.tools": "الأدوات",

  "nav.general": "عام",
  "nav.community": "المجتمع",
  "nav.support": "الدعم",
  "nav.safety": "الأمان",
  "nav.advanced": "متقدم",

  // عناصر القائمة
  "nav.overview": "نظرة عامة",
  "nav.analytics": "التحليلات",
  "nav.ai": "مساعد الذكاء",
  "nav.members": "الأعضاء",
  "nav.roles": "الرتب",
  "nav.channels": "الرومات",
  "nav.welcome": "الترحيب",
  "nav.levels": "المستويات",
  "nav.tickets": "التذاكر",
  "nav.forms": "النماذج",
  "nav.moderation": "الإشراف",
  "nav.automod": "الحماية التلقائية",
  "nav.logs": "السجلات",
  "nav.customLogs": "السجلات المخصصة",
  "nav.commands": "الأوامر المخصصة",
  "nav.backup": "النسخ الاحتياطي",
  "nav.integrations": "التكاملات",
  "nav.webhooks": "الويب هوك",
  "nav.modules": "الوحدات",
  "nav.settings": "الإعدادات",
  "nav.audit": "سجل التدقيق",

  // الإجراءات
  "action.save": "حفظ التغييرات",
  "action.cancel": "إلغاء",
  "action.create": "إنشاء",
  "action.delete": "حذف",
  "action.search": "بحث",
  "action.refresh": "تحديث",
  "action.retry": "إعادة المحاولة",
  "action.close": "إغلاق",
  "action.copy": "نسخ",
  "action.previous": "السابق",
  "action.next": "التالي",
  "action.viewAll": "عرض الكل",
  "action.upgrade": "ترقية الخطة",

  // الحالات العامة
  "common.loading": "جارٍ التحميل",
  "common.online": "متصل",
  "common.offline": "غير متصل",
  "common.unknown": "غير معروف",
  "common.unavailable": "غير متوفر",
  "common.none": "لا يوجد",
  "common.empty": "فارغ",
  "common.enabled": "مفعّل",
  "common.disabled": "غير مفعّل",
  "common.before": "قبل",
  "common.after": "بعد",
  "common.notSpecified": "غير محدد",
  "common.yes": "نعم",
  "common.no": "لا",

  // الهيدر
  "header.switchServer": "تبديل السيرفر",
  "header.loadingServers": "جارٍ تحميل السيرفرات...",
  "header.noServers": "لا توجد سيرفرات متصلة.",
  "header.viewAllServers": "عرض جميع السيرفرات",
  "header.loadingServer": "جارٍ تحميل السيرفر...",
  "header.defaultServer": "سيرفر ديسكورد",

  "header.notifications": "الإشعارات",
  "header.newNotifications": "جديد",
  "header.noNotifications": "لا توجد إشعارات",
  "header.notificationsDescription":
    "ستظهر إشعارات TOX هنا بعد ربط نظام التتبع بقاعدة البيانات.",
  "header.viewAllNotifications": "عرض جميع الإشعارات",

  "header.help": "المساعدة",
  "header.profile": "الملف الشخصي",
  "header.billing": "الفواتير",
  "header.aiBuilder": "منشئ الذكاء الاصطناعي",
  "header.signOut": "تسجيل الخروج",
  "header.discordUser": "مستخدم ديسكورد",
  "header.signedInWithDiscord": "تم تسجيل الدخول بواسطة ديسكورد",
  "header.openNavigation": "فتح القائمة",
  "header.openProfile": "فتح قائمة الحساب",

  // الصفحة الرئيسية
  "landing.cta.add": "أضف TOX إلى ديسكورد",
  "landing.cta.demo": "تجربة حية",
  "landing.signin": "تسجيل الدخول",
  "landing.hero.title":
    "منصة واحدة لإدارة سيرفر ديسكورد بالكامل",
  "landing.hero.sub":
    "التذاكر والإشراف والحماية والسجلات والمستويات والنسخ الاحتياطي والتحليلات — موحدة ومدعومة بمنشئ إعدادات ذكي.",

  // صفحة السجلات
  "logs.systemName": "نظام تدقيق TOX",
  "logs.title": "سجلات السيرفر",
  "logs.subtitle":
    "اعرض وراقب جميع الأحداث التي يسجلها TOX داخل السيرفر.",

  "logs.refresh": "تحديث السجلات",
  "logs.refreshing": "جارٍ التحديث...",
  "logs.searchPlaceholder":
    "ابحث باسم المستخدم أو الروم أو الحدث...",
  "logs.allEvents": "جميع الأحداث",

  "logs.total": "إجمالي السجلات",
  "logs.currentPage": "الصفحة الحالية",
  "logs.currentFilter": "الفلتر الحالي",
  "logs.page": "الصفحة",
  "logs.of": "من",

  "logs.loading": "جارٍ تحميل السجلات...",
  "logs.emptyTitle": "لا توجد سجلات",
  "logs.emptyDescription":
    "لا توجد أحداث مطابقة للبحث أو الفلتر الحالي.",
  "logs.errorDefault":
    "حدث خطأ أثناء تحميل سجلات السيرفر.",

  "logs.eventDescription":
    "تم تسجيل حدث جديد داخل السيرفر.",
  "logs.by": "بواسطة",
  "logs.target": "العنصر",
  "logs.channel": "الروم",

  "logs.eventType": "نوع الحدث",
  "logs.eventTime": "وقت الحدث",
  "logs.executor": "المنفذ",
  "logs.executorId": "معرف المنفذ",
  "logs.targetName": "العنصر المتأثر",
  "logs.targetId": "معرف العنصر",
  "logs.channelName": "الروم",
  "logs.channelId": "معرف الروم",
  "logs.eventDescriptionLabel": "وصف الحدث",
  "logs.eventDetails": "تفاصيل الحدث",
  "logs.logNumber": "السجل",

  "logs.reason": "السبب",
  "logs.noReason": "لم يتم تحديد سبب",
  "logs.auditLogId": "معرف سجل التدقيق",

  "logs.messageContent": "محتوى الرسالة",
  "logs.deletedMessageContent":
    "محتوى الرسالة المحذوفة",
  "logs.noTextContent": "لا يوجد محتوى نصي",
  "logs.attachments": "المرفقات",
  "logs.attachment": "مرفق",
  "logs.messageUrl": "رابط الرسالة",

  "logs.deletedMessages": "الرسائل المحذوفة",
  "logs.deletedMessagesCount":
    "عدد الرسائل المحذوفة",
  "logs.savedMessagesCount":
    "عدد الرسائل المحفوظة",
  "logs.bulkTruncated":
    "تم حفظ أول 50 رسالة فقط حتى لا يصبح السجل ضخمًا.",

  "logs.noAdditionalData":
    "لا توجد بيانات إضافية.",
  "logs.noDisplayableChanges":
    "لا توجد تغييرات قابلة للعرض.",

  "logs.timeoutDuration": "مدة التايم أوت",
  "logs.timeoutNotActive":
    "لم يكن هناك تايم أوت",
  "logs.timeoutRemoved": "تمت إزالة التايم أوت",

  "logs.username": "اسم المستخدم",
  "logs.accountCreated": "تاريخ إنشاء الحساب",
  "logs.joinedServerAt": "تاريخ دخول السيرفر",
  "logs.leftServerAt": "تاريخ الخروج",
  "logs.discordBot": "بوت ديسكورد",
  "logs.discordMember": "عضو ديسكورد",

  // فلاتر الأحداث
  "logs.filter.ALL": "جميع الأحداث",
  "logs.filter.MESSAGE_DELETE": "حذف رسالة",
  "logs.filter.MESSAGE_UPDATE": "تعديل رسالة",
  "logs.filter.MESSAGE_BULK_DELETE":
    "حذف رسائل جماعي",
  "logs.filter.CHANNEL_CREATE": "إنشاء روم",
  "logs.filter.CHANNEL_UPDATE": "تعديل روم",
  "logs.filter.CHANNEL_DELETE": "حذف روم",
  "logs.filter.ROLE_CREATE": "إنشاء رتبة",
  "logs.filter.ROLE_UPDATE": "تعديل رتبة",
  "logs.filter.ROLE_DELETE": "حذف رتبة",
  "logs.filter.MEMBER_JOIN": "دخول عضو",
  "logs.filter.MEMBER_LEAVE": "خروج عضو",
  "logs.filter.MEMBER_KICK": "طرد عضو",
  "logs.filter.MEMBER_BAN": "حظر عضو",
  "logs.filter.MEMBER_UNBAN": "فك حظر عضو",
  "logs.filter.MEMBER_TIMEOUT": "إعطاء تايم أوت",
  "logs.filter.MEMBER_TIMEOUT_REMOVE":
    "إزالة التايم أوت",
  "logs.filter.VOICE_JOIN": "دخول فويس",
  "logs.filter.VOICE_LEAVE": "خروج من الفويس",
  "logs.filter.VOICE_MOVE": "نقل في الفويس",
  "logs.filter.GUILD_CREATE": "إضافة البوت",
  "logs.filter.GUILD_DELETE": "إزالة البوت",

  // عناوين الأحداث
  "logs.event.MESSAGE_DELETE": "تم حذف رسالة",
  "logs.event.MESSAGE_UPDATE": "تم تعديل رسالة",
  "logs.event.MESSAGE_BULK_DELETE":
    "تم حذف رسائل جماعيًا",

  "logs.event.CHANNEL_CREATE": "تم إنشاء روم",
  "logs.event.CHANNEL_UPDATE": "تم تعديل روم",
  "logs.event.CHANNEL_DELETE": "تم حذف روم",

  "logs.event.ROLE_CREATE": "تم إنشاء رتبة",
  "logs.event.ROLE_UPDATE": "تم تعديل رتبة",
  "logs.event.ROLE_DELETE": "تم حذف رتبة",

  "logs.event.MEMBER_JOIN":
    "دخل عضو إلى السيرفر",
  "logs.event.MEMBER_LEAVE":
    "خرج عضو من السيرفر",
  "logs.event.MEMBER_KICK": "تم طرد عضو",
  "logs.event.MEMBER_BAN": "تم حظر عضو",
  "logs.event.MEMBER_UNBAN": "تم فك حظر عضو",
  "logs.event.MEMBER_TIMEOUT":
    "تم إعطاء عضو تايم أوت",
  "logs.event.MEMBER_TIMEOUT_REMOVE":
    "تمت إزالة التايم أوت",

  "logs.event.VOICE_JOIN":
    "دخل عضو إلى روم صوتي",
  "logs.event.VOICE_LEAVE":
    "خرج عضو من الروم الصوتي",
  "logs.event.VOICE_DISCONNECT":
    "تم فصل عضو من الروم الصوتي",
  "logs.event.VOICE_MOVE":
    "تم نقل عضو بين الرومات الصوتية",
  "logs.event.VOICE_SWITCH":
    "انتقل عضو إلى روم صوتي آخر",
  "logs.event.VOICE_SERVER_MUTE":
    "تم كتم عضو في الروم الصوتي",
  "logs.event.VOICE_SERVER_UNMUTE":
    "تم إلغاء كتم عضو",
  "logs.event.VOICE_SERVER_DEAFEN":
    "تم منع عضو من سماع الروم",
  "logs.event.VOICE_SERVER_UNDEAFEN":
    "تم إلغاء منع العضو من السماع",
  "logs.event.VOICE_SELF_MUTE":
    "قام عضو بكتم نفسه",
  "logs.event.VOICE_SELF_UNMUTE":
    "قام عضو بإلغاء كتم نفسه",
  "logs.event.VOICE_SELF_DEAFEN":
    "قام عضو بإغلاق الصوت الوارد",
  "logs.event.VOICE_SELF_UNDEAFEN":
    "قام عضو بإعادة الصوت الوارد",
  "logs.event.VOICE_CAMERA_ON":
    "تم تشغيل الكاميرا",
  "logs.event.VOICE_CAMERA_OFF":
    "تم إيقاف الكاميرا",
  "logs.event.VOICE_STREAM_START":
    "بدأ بث الشاشة",
  "logs.event.VOICE_STREAM_STOP":
    "توقف بث الشاشة",

  "logs.event.GUILD_CREATE": "تمت إضافة TOX إلى السيرفر",
    
  "logs.event.GUILD_DELETE": "تمت إزالة TOX من السيرفر",
    

  // أوصاف الأحداث
  "logs.description.MESSAGE_DELETE": "تم حذف رسالة من أحد الرومات.",
  "logs.description.MESSAGE_UPDATE": "تم تعديل رسالة.",
  "logs.description.MESSAGE_BULK_DELETE": "تم حذف عدة رسائل دفعة واحدة.",

  "logs.description.CHANNEL_CREATE": "تم إنشاء روم جديد.",
  "logs.description.CHANNEL_UPDATE": "تم تعديل بيانات أحد الرومات.",
  "logs.description.CHANNEL_DELETE": "تم حذف أحد الرومات.",

  "logs.description.ROLE_CREATE": "تم إنشاء رتبة جديدة.",
  "logs.description.ROLE_UPDATE": "تم تعديل إحدى الرتب.",
  "logs.description.ROLE_DELETE": "تم حذف إحدى الرتب.",

  "logs.description.MEMBER_JOIN": "انضم عضو جديد إلى السيرفر.",
  "logs.description.MEMBER_LEAVE": "غادر عضو السيرفر.",
  "logs.description.MEMBER_KICK": "تم طرد أحد الأعضاء.",
  "logs.description.MEMBER_BAN": "تم حظر أحد الأعضاء.",
  "logs.description.MEMBER_UNBAN": "تم فك الحظر عن أحد الأعضاء.",
  "logs.description.MEMBER_TIMEOUT": "تم إعطاء تايم أوت لعضو.",
  "logs.description.MEMBER_TIMEOUT_REMOVE": "تم إزالة التايم أوت عن العضو.",

  "logs.description.VOICE_JOIN": "دخل أحد الأعضاء إلى روم صوتي.",
  "logs.description.VOICE_LEAVE": "خرج أحد الأعضاء من روم صوتي.",
  "logs.description.VOICE_MOVE": "انتقل أحد الأعضاء بين الرومات الصوتية.",

  "logs.description.GUILD_CREATE": "تمت إضافة TOX إلى السيرفر.",
  "logs.description.GUILD_DELETE": "تمت إزالة TOX من السيرفر.",


  // شارات الأحداث
  "logs.badge.MESSAGE_DELETE": "حذف رسالة",
  "logs.badge.MESSAGE_UPDATE": "تعديل رسالة",
  "logs.badge.MESSAGE_BULK_DELETE":
    "حذف رسائل جماعي",
  "logs.badge.CHANNEL_CREATE": "إنشاء روم",
  "logs.badge.CHANNEL_UPDATE": "تعديل روم",
  "logs.badge.CHANNEL_DELETE": "حذف روم",
  "logs.badge.ROLE_CREATE": "إنشاء رتبة",
  "logs.badge.ROLE_UPDATE": "تعديل رتبة",
  "logs.badge.ROLE_DELETE": "حذف رتبة",
  "logs.badge.MEMBER_JOIN": "دخول عضو",
  "logs.badge.MEMBER_LEAVE": "خروج عضو",
  "logs.badge.MEMBER_KICK": "طرد عضو",
  "logs.badge.MEMBER_BAN": "حظر عضو",
  "logs.badge.MEMBER_UNBAN": "فك حظر",
  "logs.badge.MEMBER_TIMEOUT": "تايم أوت",
  "logs.badge.MEMBER_TIMEOUT_REMOVE":
    "إزالة تايم أوت",
  "logs.badge.VOICE_JOIN": "دخول فويس",
  "logs.badge.VOICE_LEAVE": "خروج فويس",
  "logs.badge.VOICE_DISCONNECT": "فصل من الفويس",
  "logs.badge.VOICE_MOVE": "نقل في الفويس",
  "logs.badge.VOICE_SWITCH": "تغيير روم صوتي",
  "logs.badge.VOICE_SERVER_MUTE": "كتم سيرفر",
  "logs.badge.VOICE_SERVER_UNMUTE": "إلغاء الكتم",
  "logs.badge.VOICE_SERVER_DEAFEN": "منع السماع",
  "logs.badge.VOICE_SERVER_UNDEAFEN":
    "إلغاء منع السماع",
  "logs.badge.VOICE_SELF_MUTE": "كتم ذاتي",
  "logs.badge.VOICE_SELF_UNMUTE": "إلغاء الكتم الذاتي",
  "logs.badge.VOICE_SELF_DEAFEN": "إغلاق الصوت",
  "logs.badge.VOICE_SELF_UNDEAFEN": "إعادة الصوت",
  "logs.badge.VOICE_CAMERA_ON": "تشغيل الكاميرا",
  "logs.badge.VOICE_CAMERA_OFF": "إيقاف الكاميرا",
  "logs.badge.VOICE_STREAM_START": "بدء البث",
  "logs.badge.VOICE_STREAM_STOP": "إيقاف البث",
  "logs.badge.GUILD_CREATE": "إضافة البوت",
  "logs.badge.GUILD_DELETE": "إزالة البوت",

  // أسماء التغييرات
  "logs.change.name": "الاسم",
  "logs.change.color": "اللون",
  "logs.change.topic": "وصف الروم",
  "logs.change.position": "الترتيب",
  "logs.change.parentId": "القسم",
  "logs.change.type": "نوع الروم",
  "logs.change.nsfw": "المحتوى الحساس",
  "logs.change.rateLimitPerUser": "الوضع البطيء",
  "logs.change.bitrate": "جودة الصوت",
  "logs.change.userLimit": "حد المستخدمين",
  "logs.change.mentionable": "إمكانية المنشن",
  "logs.change.hoist": "إظهار الرتبة منفصلة",
  "logs.change.permissions": "الصلاحيات",
  "logs.change.permissionOverwrites":
    "صلاحيات الروم",
  "logs.change.oldValue": "القيمة السابقة",
  "logs.change.newValue": "القيمة الجديدة",
  // صفحة النظرة العامة
  "overview.loadingTitle": "جارٍ تحميل لوحة السيرفر",
  "overview.loadingDescription": "جارٍ جلب المعلومات المباشرة من ديسكورد...",
  "overview.errorTitle": "تعذر تحميل هذا السيرفر",
  "overview.errorUnavailable": "معلومات السيرفر غير متوفرة حاليًا.",
  "overview.error.loadServer": "فشل تحميل معلومات السيرفر",
  "overview.error.noServerData": "لم يتم إرجاع بيانات سيرفر ديسكورد",
  "overview.backToServers": "العودة إلى السيرفرات",
  "overview.subtitle": "نظرة عامة ومعلومات مباشرة عن سيرفر ديسكورد",
  "overview.botOnline": "البوت متصل",
  "overview.botOffline": "البوت غير متصل",
  "overview.aiBuilder": "منشئ الذكاء",
  "overview.totalMembers": "إجمالي الأعضاء",
  "overview.onlineMembers": "الأعضاء المتصلون",
  "overview.channels": "الرومات",
  "overview.roles": "الرتب",
  "overview.serverInformation": "معلومات السيرفر",
  "overview.serverInformationDescription": "معلومات مباشرة يتم جلبها من ديسكورد.",
  "overview.serverName": "اسم السيرفر",
  "overview.serverId": "معرف السيرفر",
  "overview.preferredLanguage": "اللغة المفضلة",
  "overview.verification": "مستوى التحقق",
  "overview.verification.none": "لا يوجد",
  "overview.verification.low": "منخفض",
  "overview.verification.medium": "متوسط",
  "overview.verification.high": "مرتفع",
  "overview.verification.veryHigh": "مرتفع جدًا",
  "overview.boostLevel": "مستوى البوست",
  "overview.noBoostLevel": "لا يوجد مستوى بوست",
  "overview.level": "المستوى",
  "overview.boostCount": "عدد البوستات",
  "overview.textChannels": "الرومات الكتابية",
  "overview.voiceChannels": "الرومات الصوتية",
  "overview.serverFeatures": "خصائص السيرفر",
  "overview.liveMetrics": "الإحصائيات المباشرة",
  "overview.liveMetricsDescription": "معلومات يجمعها بوت TOX.",
  "overview.messagesToday": "رسائل اليوم",
  "overview.openTickets": "التذاكر المفتوحة",
  "overview.newJoins": "الأعضاء الجدد",
  "overview.warningsToday": "تحذيرات اليوم",
  "overview.serverAccess": "صلاحيات السيرفر",
  "overview.serverAccessDescription": "صلاحياتك الحالية في ديسكورد لهذا السيرفر.",
  "overview.serverOwner": "مالك السيرفر",
  "overview.manageServer": "إدارة السيرفر",
  "overview.botStatus": "حالة البوت",
  "overview.totalChannels": "إجمالي الرومات",
  "overview.totalRoles": "إجمالي الرتب",
  "overview.discordLocale": "لغة ديسكورد",
  "overview.analytics": "التحليلات",
  "overview.analyticsDescription": "ستظهر البيانات التاريخية بعد أن يبدأ TOX بتسجيل نشاط السيرفر.",
  "overview.viewAnalytics": "عرض التحليلات",
  "overview.noHistoricalActivity": "لا يوجد نشاط تاريخي حتى الآن",
  "overview.noHistoricalActivityDescription": "ستتوفر مخططات نشاط الرسائل ونمو الأعضاء والتذاكر والإشراف بعد أن يسجل بوت TOX البيانات في قاعدة البيانات.",
  "overview.quickActions": "إجراءات سريعة",
  "overview.newTicketPanel": "لوحة تذاكر جديدة",
  "overview.addCommand": "إضافة أمر",
  "overview.backupNow": "نسخ احتياطي الآن",
  "overview.aiAssistant": "مساعد الذكاء",
  "overview.aiAssistantDescription": "اكتب ما تريد إعداده وسيساعدك ذكاء TOX في بناء إعدادات هذا السيرفر.",
  "overview.openAiBuilder": "فتح منشئ الذكاء",
  "overview.serverSummary": "ملخص السيرفر",
  "overview.members": "الأعضاء",
  "overview.boosts": "البوستات",
  "overview.recentActivity": "النشاط الأخير",
  "overview.noActivityRecorded": "لا يوجد نشاط مسجل",
  "overview.recentActivityDescription": "ستظهر هنا عمليات الدخول الحديثة والتذاكر والتحذيرات وتغييرات الرتب بعد ربط التتبع بقاعدة البيانات.",

  // صفحة الأعضاء
  "members.title": "الأعضاء",
  "members.subtitle": "إدارة ومراقبة جميع أعضاء سيرفر ديسكورد.",
  "members.loading": "جارٍ تحميل الأعضاء...",
  "members.loadingDescription": "جارٍ جلب معلومات الأعضاء المباشرة من بوت TOX.",
  "members.errorTitle": "تعذر تحميل الأعضاء",
  "members.errorDefault": "حدث خطأ أثناء تحميل أعضاء السيرفر.",
  "members.refreshing": "جارٍ التحديث...",
  "members.searchPlaceholder": "ابحث بالاسم أو اسم المستخدم أو معرف ديسكورد...",
  "members.total": "إجمالي الأعضاء",
  "members.listTitle": "قائمة الأعضاء",
  "members.membersFound": "عضو",
  "members.member": "العضو",
  "members.roles": "الرتب",
  "members.joined": "تاريخ الانضمام",
  "members.status": "الحالة",
  "members.nickname": "الاسم المستعار",
  "members.noNickname": "لا يوجد اسم مستعار",
  "members.username": "اسم المستخدم",
  "members.discordId": "معرف ديسكورد",
  "members.boosting": "يدعم السيرفر",
  "members.boostingSince": "يدعم السيرفر منذ",
  "members.openDetails": "فتح تفاصيل العضو",
  "members.filter.all": "الكل",
  "members.filter.humans": "الأعضاء",
  "members.filter.bots": "البوتات",
  "members.filter.online": "المتصلون",
  "members.filter.offline": "غير المتصلين",
  "members.filter.timedOut": "تايم أوت",
  "members.filter.allRoles": "جميع الرتب",
  "members.sort.joinedNewest": "الأحدث انضمامًا",
  "members.sort.joinedOldest": "الأقدم انضمامًا",
  "members.sort.nameAz": "الاسم أ–ي",
  "members.sort.nameZa": "الاسم ي–أ",
  "members.status.online": "متصل",
  "members.status.idle": "خامل",
  "members.status.dnd": "عدم الإزعاج",
  "members.status.offline": "غير متصل",
  "members.badge.bot": "بوت",
  "members.badge.timedOut": "تايم أوت",
  "members.emptyTitle": "لا توجد نتائج",
  "members.emptyDescription": "لا يوجد أعضاء يطابقون البحث أو الفلاتر الحالية.",
  "members.detailsTitle": "تفاصيل العضو",
  "members.detailsSubtitle": "عرض معلومات الحساب والرتب والنشاط.",
  "members.tab.overview": "نظرة عامة",
  "members.tab.roles": "الرتب",
  "members.tab.activity": "النشاط",
  "members.timeoutActive": "التايم أوت مفعّل",
  "members.rolesAssigned": "رتبة مضافة",
  "members.addRole": "إضافة رتبة",
  "members.noRoles": "لا توجد رتب مضافة لهذا العضو.",
  "members.managedRole": "رتبة مُدارة",
  "members.activityEmptyTitle": "لا يوجد نشاط مسجل",
  "members.activityEmptyDescription": "سيظهر هنا النشاط الأخير وحالة الفويس وسجل الإشراف بعد ربط نظام تتبع النشاط.",
  "members.actions": "إجراءات العضو",
  "members.editNickname": "تعديل الاسم المستعار",
  "members.timeout": "تايم أوت",
  "members.kick": "طرد العضو",
  "members.ban": "حظر العضو",
  "members.actionsComingSoon": "سيتم تفعيل إجراءات إدارة الأعضاء في الخطوة القادمة.",
  "sidebar.collapse": "تصغير القائمة",
  "sidebar.expand": "توسيع القائمة",

}

export const dictionaries: Record<
  Locale,
  Dictionary
> = {
  en,
  ar,
}