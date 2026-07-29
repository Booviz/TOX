export type ChannelKind =
  | "category"
  | "text"
  | "announcement"
  | "voice"
  | "stage"
  | "forum"
  | "media"
  | "unknown"

export type ChannelSort =
  | "position-asc"
  | "position-desc"
  | "name-asc"
  | "name-desc"
  | "members-desc"
  | "members-asc"

export type ChannelPermissionOverwrite = {
  id: string
  type: "role" | "member"
  name?: string
  allow: string[]
  deny: string[]
}

export type ServerChannel = {
  id: string
  name: string
  type: number
  kind: ChannelKind

  position: number
  rawPosition?: number

  parentId: string | null
  parentName?: string | null

  topic?: string | null
  nsfw?: boolean
  rateLimitPerUser?: number

  bitrate?: number | null
  userLimit?: number | null

  memberCount?: number
  connectedMembers?: number

  managed?: boolean
  viewable?: boolean

  permissionOverwrites?: ChannelPermissionOverwrite[]

  createdAt?: number
}

export type ChannelsApiResponse = {
  success: boolean

  guild?: {
    id: string
    name: string
  }

  total?: number
  channels?: ServerChannel[]

  counts?: {
    all: number
    text: number
    voice: number
    categories: number
    private: number
  }

  error?: string
  message?: string
}

export type ChannelSidebarTab =
  | "overview"
  | "permissions"
  | "members"
  | "activity"

export type CreateChannelPayload = {
  name: string
  kind: ChannelKind
  parentId?: string | null

  topic?: string
  nsfw?: boolean
  rateLimitPerUser?: number

  bitrate?: number
  userLimit?: number

  permissionOverwrites?: ChannelPermissionOverwrite[]
}

export type UpdateChannelPayload = {
  channelId: string

  name?: string
  parentId?: string | null
  position?: number

  topic?: string | null
  nsfw?: boolean
  rateLimitPerUser?: number

  bitrate?: number
  userLimit?: number

  permissionOverwrites?: ChannelPermissionOverwrite[]

  reason?: string
}

export type ChannelDialogBaseProps = {
  guildId: string
  open: boolean
  onClose: () => void
}

export type CreateChannelDialogProps =
  ChannelDialogBaseProps & {
    categories: ServerChannel[]
    onCreated: (
      channel: ServerChannel
    ) => void
  }

export type EditChannelDialogProps =
  ChannelDialogBaseProps & {
    channel: ServerChannel | null
    categories: ServerChannel[]
    onUpdated: (
      channel: ServerChannel
    ) => void
  }

export type DeleteChannelDialogProps =
  ChannelDialogBaseProps & {
    channel: ServerChannel | null
    onDeleted: (
      channelId: string
    ) => void
  }

export type CloneChannelDialogProps =
  ChannelDialogBaseProps & {
    channel: ServerChannel | null
    onCloned: (
      channel: ServerChannel
    ) => void
  }