import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  Hash,
  Shield,
  Ticket,
  ScrollText,
  ShieldAlert,
  Gavel,
  Sparkles,
  DoorOpen,
  TrendingUp,
  Terminal,
  ClipboardList,
  DatabaseBackup,
  BarChart3,
  Plug,
  Webhook,
  Blocks,
  Settings,
} from "lucide-react"

export type NavItem = {
  labelKey: string
  href: string
  icon: LucideIcon
}

export type NavGroup = {
  labelKey: string
  items: NavItem[]
}

export function buildNav(guildId: string): NavGroup[] {
  const base = `/dashboard/${guildId}`
  return [
    {
      labelKey: "nav.general",
      items: [
        { labelKey: "nav.overview", href: base, icon: LayoutDashboard },
        { labelKey: "nav.analytics", href: `${base}/analytics`, icon: BarChart3 },
        { labelKey: "nav.ai", href: `${base}/ai`, icon: Sparkles },
      ],
    },
    {
      labelKey: "nav.community",
      items: [
        { labelKey: "nav.members", href: `${base}/members`, icon: Users },
        { labelKey: "nav.roles", href: `${base}/roles`, icon: Shield },
        { labelKey: "nav.channels", href: `${base}/channels`, icon: Hash },
        { labelKey: "nav.welcome", href: `${base}/welcome`, icon: DoorOpen },
        { labelKey: "nav.levels", href: `${base}/levels`, icon: TrendingUp },
      ],
    },
    {
      labelKey: "nav.support",
      items: [
        { labelKey: "nav.tickets", href: `${base}/tickets`, icon: Ticket },
        { labelKey: "nav.forms", href: `${base}/forms`, icon: ClipboardList },
      ],
    },
    {
      labelKey: "nav.safety",
      items: [
        { labelKey: "nav.moderation", href: `${base}/moderation`, icon: Gavel },
        { labelKey: "nav.automod", href: `${base}/automod`, icon: ShieldAlert },
        { labelKey: "nav.logs", href: `${base}/logs`, icon: ScrollText },
      ],
    },
    {
      labelKey: "nav.advanced",
      items: [
        { labelKey: "nav.commands", href: `${base}/commands`, icon: Terminal },
        { labelKey: "nav.backup", href: `${base}/backup`, icon: DatabaseBackup },
        { labelKey: "nav.integrations", href: `${base}/integrations`, icon: Plug },
        { labelKey: "nav.webhooks", href: `${base}/webhooks`, icon: Webhook },
        { labelKey: "nav.modules", href: `${base}/modules`, icon: Blocks },
        { labelKey: "nav.settings", href: `${base}/settings`, icon: Settings },
      ],
    },
  ]
}
