"use client"

import {
  LogOut,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  WelcomeSidebarProps,
  WelcomeTab,
} from "./types"

const ITEMS: Array<{
  id: WelcomeTab
  label: string
  description: string
  icon: React.ReactNode
}> = [
  {
    id: "welcome",
    label: "Welcome Message",
    description:
      "Configure the message sent when a member joins.",
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "goodbye",
    label: "Goodbye Message",
    description:
      "Configure the message sent when a member leaves.",
    icon: <LogOut className="size-4" />,
  },
  {
    id: "dm",
    label: "Direct Message",
    description:
      "Send a private welcome message to new members.",
    icon: <Mail className="size-4" />,
  },
  {
    id: "settings",
    label: "Settings",
    description:
      "Manage filters, logging and test behavior.",
    icon: <Settings className="size-4" />,
  },
]

export function WelcomeSidebar({
  activeTab,
  onTabChange,
}: WelcomeSidebarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-2">
      <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {ITEMS.map((item) => {
          const active =
            activeTab === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onTabChange(item.id)
              }
              className={cn(
                "flex min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                active
                  ? "border-primary/35 bg-primary/15 text-primary shadow-[0_0_24px_rgba(139,92,246,0.08)]"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.icon}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {item.label}
                </span>

                <span className="mt-1 hidden truncate text-[11px] text-muted-foreground 2xl:block">
                  {item.description}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}