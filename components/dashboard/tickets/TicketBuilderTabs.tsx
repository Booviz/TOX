"use client"

import {
  LayoutPanelTop,
  ListTree,
  MessageSquareText,
  Settings2,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketBuilderTab,
  TicketBuilderTabsProps,
} from "./types"

const TABS: Array<{
  id: TicketBuilderTab
  label: string
  shortLabel: string
  description: string
  icon: React.ReactNode
}> = [
  {
    id: "panel",
    label: "Panel Setup",
    shortLabel: "Panel",
    description:
      "Design the panel members will use to create tickets.",
    icon: (
      <LayoutPanelTop className="size-4" />
    ),
  },
  {
    id: "categories",
    label: "Ticket Categories",
    shortLabel: "Categories",
    description:
      "Create and organize ticket departments.",
    icon: (
      <ListTree className="size-4" />
    ),
  },
  {
    id: "permissions",
    label: "Channel & Permissions",
    shortLabel: "Permissions",
    description:
      "Configure channels, staff roles and access.",
    icon: (
      <ShieldCheck className="size-4" />
    ),
  },
  {
    id: "messages",
    label: "Messages",
    shortLabel: "Messages",
    description:
      "Customize opening, closing and reminder messages.",
    icon: (
      <MessageSquareText className="size-4" />
    ),
  },
  {
    id: "advanced",
    label: "Advanced",
    shortLabel: "Advanced",
    description:
      "Configure transcripts, automation and workflow controls.",
    icon: (
      <Settings2 className="size-4" />
    ),
  },
]

export function TicketBuilderTabs({
  activeTab,
  onTabChange,
}: TicketBuilderTabsProps) {
  return (
    <div>
      <nav
        className="grid grid-cols-5 gap-2"
        aria-label="Ticket builder sections"
      >
        {TABS.map((tab) => {
          const active =
            activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onTabChange(tab.id)
              }
              aria-current={
                active
                  ? "page"
                  : undefined
              }
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
                  active
                    ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_0_20px_rgba(139,92,246,0.22)]"
                    : "border-border bg-background/50 text-muted-foreground group-hover:border-primary/20 group-hover:text-primary"
                )}
              >
                {tab.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  <span className="hidden 2xl:inline">
                    {tab.label}
                  </span>

                  <span className="2xl:hidden">
                    {tab.shortLabel}
                  </span>
                </span>

                <span className="mt-1 hidden max-w-[180px] truncate text-[11px] leading-4 text-muted-foreground 2xl:block">
                  {tab.description}
                </span>
              </span>

              <span
                className={cn(
                  "pointer-events-none absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-all duration-200",
                  active
                    ? "scale-x-100 bg-primary opacity-100 shadow-[0_0_14px_rgba(139,92,246,0.75)]"
                    : "scale-x-50 bg-transparent opacity-0"
                )}
              />
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default TicketBuilderTabs