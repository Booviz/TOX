export type ServerRole = {
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

export type RolesApiResponse = {
  success: boolean

  guild?: {
    id: string
    name: string
  }

  total?: number
  roles?: ServerRole[]

  error?: string
  message?: string
}

export type RoleSort =
  | "position-desc"
  | "position-asc"
  | "members-desc"
  | "members-asc"
  | "name-asc"
  | "name-desc"

export type RoleTab =
  | "overview"
  | "members"
  | "permissions"
  | "analytics"
  | "logs"

export type RolePermissionGroup = {
  id: string
  label: string
  permissions: string[]
}

export type CreateRolePayload = {
  name: string
  color: string | null
  hoist: boolean
  mentionable: boolean
  permissions: string[]
}

export type CreateRoleDialogProps = {
  guildId: string
  open: boolean
  onClose: () => void
  onCreated: (role: ServerRole) => void
}

export type PermissionItem = {
  id: string
  label: string
  description?: string
}