export type MemberRole = {
  id: string
  name: string
  color: string | null
  position: number
  managed: boolean
}

export type Member = {
  id: string

  username: string
  rawUsername: string

  displayName: string
  globalName: string | null
  nickname: string | null

  avatarUrl: string | null

  bot: boolean

  roles: MemberRole[]

  joinedAt: string | null
  boostingSince: string | null

  pending: boolean

  timedOutUntil: string | null
  isTimedOut: boolean

  status:
    | "online"
    | "idle"
    | "dnd"
    | "offline"

  activity: string | null
}

export type MembersResponse = {
  members: Member[]

  counts: {
    all: number
    humans: number
    bots: number
    online: number
    offline: number
    timedOut: number
  }

  roles: MemberRole[]

  pagination: {
    page: number
    limit: number

    total: number
    totalPages: number

    hasPreviousPage: boolean
    hasNextPage: boolean

    from: number
    to: number
  }

  filters: {
    search: string
    roleId: string
    type: string
    sort: string
  }
}