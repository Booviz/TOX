"use client"

export type WelcomeTab =
  | "welcome"
  | "goodbye"
  | "dm"
  | "settings"

export type WelcomeMessageType =
  | "embed"
  | "image"
  | "text"

export type WelcomeChannelOption = {
  id: string
  name: string
  kind:
    | "text"
    | "announcement"
    | "forum"
    | "media"
    | "unknown"
  parentId?: string | null
  parentName?: string | null
}

export type WelcomeRoleOption = {
  id: string
  name: string
  color?: string | null
  managed?: boolean
  position?: number
}

export type WelcomeEmbedSettings = {
  title: string
  description: string
  color: string
  thumbnailUrl: string
  imageUrl: string
  footerText: string
  footerIconUrl: string
  authorName: string
  authorIconUrl: string
  timestamp: boolean
}

export type WelcomeTextSettings = {
  content: string
}

export type WelcomeImageSettings = {
  imageUrl: string
  content?: string
}

export type WelcomeReactionSettings = {
  enabled: boolean
  emoji: string
}

export type WelcomeDeleteSettings = {
  enabled: boolean
  afterSeconds: number
}

export type WelcomeDelaySettings = {
  enabled: boolean
  delaySeconds: number
}

export type WelcomeCanvasAvatarShape =
  | "circle"
  | "rounded"
  | "square"

export type WelcomeCanvasAvatarSettings = {
  x: number
  y: number
  size: number
  shape: WelcomeCanvasAvatarShape
  borderWidth: number
  borderColor: string
  shadow: boolean
}

export type WelcomeCanvasTextAlign =
  | "left"
  | "center"
  | "right"

export type WelcomeCanvasTextItem = {
  id: string
  enabled: boolean
  content: string
  x: number
  y: number
  maxWidth: number
  fontSize: number
  fontWeight: number
  color: string
  align: WelcomeCanvasTextAlign
  strokeWidth: number
  strokeColor: string
}

export type WelcomeCanvasSettings = {
  enabled: boolean

  width: number
  height: number

  backgroundUrl: string
  backgroundColor: string

  avatar: WelcomeCanvasAvatarSettings
  texts: WelcomeCanvasTextItem[]

  quality: number
  format: "png" | "jpeg"
}

export type WelcomeMessageSettings = {
  enabled: boolean
  channelId: string
  type: WelcomeMessageType

  mentionMember: boolean

  embed: WelcomeEmbedSettings
  text: WelcomeTextSettings
  image: WelcomeImageSettings
  canvas: WelcomeCanvasSettings

  reaction: WelcomeReactionSettings
  delete: WelcomeDeleteSettings
  delay: WelcomeDelaySettings

  allowedRoleIds: string[]
}

export type GoodbyeMessageSettings = {
  enabled: boolean
  channelId: string
  type: WelcomeMessageType

  embed: WelcomeEmbedSettings
  text: WelcomeTextSettings
  image: WelcomeImageSettings

  delete: WelcomeDeleteSettings
  allowedRoleIds: string[]
}

export type DirectMessageSettings = {
  enabled: boolean
  type: WelcomeMessageType

  embed: WelcomeEmbedSettings
  text: WelcomeTextSettings
  image: WelcomeImageSettings

  delay: WelcomeDelaySettings
}

export type WelcomeGeneralSettings = {
  ignoreBots: boolean
  ignoreRejoins: boolean
  logChannelId: string
  testUserId: string
}

export type WelcomeSettings = {
  guildId: string

  welcome: WelcomeMessageSettings
  goodbye: GoodbyeMessageSettings
  dm: DirectMessageSettings
  settings: WelcomeGeneralSettings

  updatedAt?: string | null
}

export type WelcomePreviewMember = {
  id: string
  username: string
  displayName: string
  mention: string
  avatarUrl: string
  joinedAt: string
}

export type WelcomePreviewServer = {
  id: string
  name: string
  iconUrl: string
  memberCount: number
}

export type WelcomePreviewData = {
  member: WelcomePreviewMember
  server: WelcomePreviewServer
  channelName: string
}

export type WelcomeVariable = {
  token: string
  label: string
  description: string
  example: string
}

export type WelcomeApiResponse = {
  success: boolean

  guild?: {
    id: string
    name: string
    iconUrl?: string | null
    memberCount?: number
  }

  settings?: WelcomeSettings
  channels?: WelcomeChannelOption[]
  roles?: WelcomeRoleOption[]
  preview?: WelcomePreviewData

  message?: string
  error?: string
}

export type SaveWelcomePayload = {
  settings: WelcomeSettings
}

export type TestWelcomePayload = {
  action: "test"
  target:
    | "welcome"
    | "goodbye"
    | "dm"
  userId?: string
  channelId?: string
}

export type WelcomeToolbarProps = {
  guildName: string
  saving: boolean
  testing: boolean
  hasChanges: boolean
  onSave: () => void
  onTest: () => void
}

export type WelcomeSidebarProps = {
  activeTab: WelcomeTab
  onTabChange: (
    tab: WelcomeTab
  ) => void
}

export type WelcomePreviewProps = {
  activeTab: WelcomeTab
  settings: WelcomeSettings
  preview: WelcomePreviewData
}

export type WelcomeVariablesProps = {
  onInsert: (
    token: string
  ) => void
}

export type WelcomeMessageTabProps = {
  value: WelcomeMessageSettings
  channels: WelcomeChannelOption[]
  roles: WelcomeRoleOption[]
  preview?: WelcomePreviewData
  onChange: (
    value: WelcomeMessageSettings
  ) => void
}

export type GoodbyeMessageTabProps = {
  value: GoodbyeMessageSettings
  channels: WelcomeChannelOption[]
  roles: WelcomeRoleOption[]
  onChange: (
    value: GoodbyeMessageSettings
  ) => void
}

export type DirectMessageTabProps = {
  value: DirectMessageSettings
  onChange: (
    value: DirectMessageSettings
  ) => void
}

export type SettingsTabProps = {
  value: WelcomeGeneralSettings
  channels: WelcomeChannelOption[]
  onChange: (
    value: WelcomeGeneralSettings
  ) => void
}

export type TestWelcomeDialogProps = {
  open: boolean
  testing: boolean
  users?: Array<{
    id: string
    username: string
    displayName: string
    avatarUrl?: string | null
  }>
  channels: WelcomeChannelOption[]
  onClose: () => void
  onSubmit: (
    payload: TestWelcomePayload
  ) => void
}

export type WelcomeImageCanvasProps = {
  value: WelcomeCanvasSettings
  preview: WelcomePreviewData
  disabled?: boolean
  previewOnly?: boolean
  onChange: (
    value: WelcomeCanvasSettings
  ) => void
}

export type WelcomeImageControlsProps = {
  value: WelcomeCanvasSettings
  disabled?: boolean
  selectedTextId: string | null
  onSelectedTextIdChange: (
    value: string | null
  ) => void
  onChange: (
    value: WelcomeCanvasSettings
  ) => void
}

export type WelcomeImageBuilderProps = {
  value: WelcomeCanvasSettings
  preview: WelcomePreviewData
  disabled?: boolean
  onChange: (
    value: WelcomeCanvasSettings
  ) => void
}

export const DEFAULT_EMBED_SETTINGS: WelcomeEmbedSettings = {
  title: "👋 Welcome to {server}!",
  description:
    "Hey {mention}, welcome to **{server}**!\nYou are member **#{memberCount}**.\nPlease read the rules and enjoy your stay!",
  color: "#9b5cff",
  thumbnailUrl: "{userAvatar}",
  imageUrl: "",
  footerText: "Welcome to {server}",
  footerIconUrl: "{serverIcon}",
  authorName: "",
  authorIconUrl: "",
  timestamp: true,
}

export const DEFAULT_WELCOME_CANVAS_SETTINGS: WelcomeCanvasSettings = {
  enabled: false,

  width: 1024,
  height: 500,

  backgroundUrl: "",
  backgroundColor: "#0b1020",

  avatar: {
    x: 632,
    y: 146,
    size: 195,
    shape: "circle",
    borderWidth: 6,
    borderColor: "#9b5cff",
    shadow: true,
  },

  texts: [
    {
      id: "welcome-title",
      enabled: true,
      content: "WELCOME {username}",
      x: 512,
      y: 390,
      maxWidth: 880,
      fontSize: 42,
      fontWeight: 800,
      color: "#ffffff",
      align: "center",
      strokeWidth: 0,
      strokeColor: "#000000",
    },
    {
      id: "member-count",
      enabled: true,
      content: "Member #{memberCount}",
      x: 512,
      y: 445,
      maxWidth: 880,
      fontSize: 24,
      fontWeight: 600,
      color: "#c4b5fd",
      align: "center",
      strokeWidth: 0,
      strokeColor: "#000000",
    },
  ],

  quality: 0.92,
  format: "png",
}

export const DEFAULT_WELCOME_SETTINGS: WelcomeSettings = {
  guildId: "",

  welcome: {
    enabled: true,
    channelId: "",
    type: "embed",

    mentionMember: true,

    embed: {
      ...DEFAULT_EMBED_SETTINGS,
    },

    text: {
      content:
        "Welcome {mention} to **{server}**! You are member #{memberCount}.",
    },

    image: {
      imageUrl: "",
      content:
        "Welcome {mention} to **{server}**!",
    },

    canvas: {
      ...DEFAULT_WELCOME_CANVAS_SETTINGS,
      avatar: {
        ...DEFAULT_WELCOME_CANVAS_SETTINGS.avatar,
      },
      texts:
        DEFAULT_WELCOME_CANVAS_SETTINGS.texts.map(
          (item) => ({
            ...item,
          })
        ),
    },

    reaction: {
      enabled: false,
      emoji: "👋",
    },

    delete: {
      enabled: false,
      afterSeconds: 300,
    },

    delay: {
      enabled: false,
      delaySeconds: 0,
    },

    allowedRoleIds: [],
  },

  goodbye: {
    enabled: false,
    channelId: "",
    type: "embed",

    embed: {
      ...DEFAULT_EMBED_SETTINGS,
      title: "👋 Goodbye {username}",
      description:
        "**{username}** has left **{server}**.\nWe now have **{memberCount}** members.",
    },

    text: {
      content:
        "{username} has left **{server}**.",
    },

    image: {
      imageUrl: "",
      content:
        "{username} has left **{server}**.",
    },

    delete: {
      enabled: false,
      afterSeconds: 300,
    },

    allowedRoleIds: [],
  },

  dm: {
    enabled: false,
    type: "embed",

    embed: {
      ...DEFAULT_EMBED_SETTINGS,
      title: "Welcome to {server}!",
      description:
        "Hey {username}, thanks for joining **{server}**!",
    },

    text: {
      content:
        "Hey {username}, thanks for joining **{server}**!",
    },

    image: {
      imageUrl: "",
      content:
        "Welcome to **{server}**, {username}!",
    },

    delay: {
      enabled: false,
      delaySeconds: 0,
    },
  },

  settings: {
    ignoreBots: true,
    ignoreRejoins: false,
    logChannelId: "",
    testUserId: "",
  },

  updatedAt: null,
}