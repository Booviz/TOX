"use client"

import {
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Ticket,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketCategory,
  TicketPanelPreviewProps,
} from "./types"

const COLOR_STYLES: Record<
  TicketCategory["color"],
  {
    border: string
    icon: string
    background: string
  }
> = {
  purple: {
    border: "border-purple-500/30",
    icon: "bg-purple-500/20 text-purple-300",
    background: "bg-purple-500/[0.07]",
  },
  blue: {
    border: "border-blue-500/30",
    icon: "bg-blue-500/20 text-blue-300",
    background: "bg-blue-500/[0.07]",
  },
  green: {
    border: "border-emerald-500/30",
    icon: "bg-emerald-500/20 text-emerald-300",
    background: "bg-emerald-500/[0.07]",
  },
  yellow: {
    border: "border-amber-500/30",
    icon: "bg-amber-500/20 text-amber-300",
    background: "bg-amber-500/[0.07]",
  },
  red: {
    border: "border-red-500/30",
    icon: "bg-red-500/20 text-red-300",
    background: "bg-red-500/[0.07]",
  },
  cyan: {
    border: "border-cyan-500/30",
    icon: "bg-cyan-500/20 text-cyan-300",
    background: "bg-cyan-500/[0.07]",
  },
  pink: {
    border: "border-pink-500/30",
    icon: "bg-pink-500/20 text-pink-300",
    background: "bg-pink-500/[0.07]",
  },
  gray: {
    border: "border-slate-500/30",
    icon: "bg-slate-500/20 text-slate-300",
    background: "bg-slate-500/[0.07]",
  },
}

export default function TicketPanelPreview({
  guildName,
  guildIconUrl,
  appearance,
  categories,
}: TicketPanelPreviewProps) {
  const visibleCategories = [...categories]
    .filter((category) => category.enabled)
    .sort((a, b) => a.position - b.position)

  const variables: Record<string, string> = {
    "{server}": guildName,
    "{serverName}": guildName,
    "{serverIcon}": guildIconUrl || "/logo.png",
    "{memberCount}": "421",
    "{user}": "Mohammed",
    "{username}": "mohd_21",
    "{mention}": "@Mohammed",
    "{ticketNumber}": "0247",
    "{ticketId}": "TKT-0247",
    "{category}": "Support",
    "{staff}": "@Support Team",
    "{date}": "19/07/2026",
    "{time}": "03:24 PM",
  }

  function replaceVariables(value?: string) {
    if (!value) {
      return ""
    }

    let output = value

    for (const [token, replacement] of Object.entries(
      variables
    )) {
      output = output
        .split(token)
        .join(replacement)
    }

    return output
  }

  const title = replaceVariables(
    appearance.title
  )

  const description = replaceVariables(
    appearance.description
  )

  const footerText = replaceVariables(
    appearance.footerText
  )

  const thumbnailUrl = replaceVariables(
    appearance.thumbnailUrl
  )

  const imageUrl = replaceVariables(
    appearance.imageUrl
  )

  const footerIconUrl =
    replaceVariables(
      appearance.footerIconUrl
    )

  return (
    <aside className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Ticket className="size-4" />
          </span>

          <div>
            <h2 className="font-semibold">
              Live Preview
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              This is how your ticket
              panel will appear to
              members.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#313338] p-4">
          <div className="flex gap-3">
            <img
              src={
                guildIconUrl ||
                "/logo.png"
              }
              alt=""
              className="size-10 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-white">
                  {guildName}
                </span>

                <span className="rounded bg-[#5865f2] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  APP
                </span>

                <span className="text-xs text-gray-400">
                  Today
                </span>
              </div>

              <div
                className="relative mt-3 overflow-hidden rounded-lg bg-[#2b2d31] pl-4"
                style={{
                  borderLeft: `4px solid ${
                    appearance.color ||
                    "#9B4DFF"
                  }`,
                }}
              >
                <div className="p-4">
                  {appearance.thumbnailEnabled &&
                    thumbnailUrl && (
                      <img
                        src={getPreviewImageUrl(
                          thumbnailUrl
                        )}
                        alt=""
                        className="absolute right-4 top-4 size-16 rounded object-cover"
                      />
                    )}

                  <div
                    className={cn(
                      appearance.thumbnailEnabled &&
                        thumbnailUrl
                        ? "pr-20"
                        : ""
                    )}
                  >
                    {title && (
                      <h3 className="break-words text-base font-semibold leading-6 text-white">
                        {title}
                      </h3>
                    )}

                    {description && (
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#dbdee1]">
                        {description}
                      </p>
                    )}
                  </div>

                  {appearance.imageEnabled &&
                    imageUrl && (
                      <img
                        src={getPreviewImageUrl(
                          imageUrl
                        )}
                        alt="Ticket panel"
                        className="mt-4 max-h-64 w-full rounded-lg object-cover"
                      />
                    )}

                  {appearance.showCategories &&
                    visibleCategories.length >
                      0 && (
                      <div className="mt-4">
                        {appearance.useSelectMenu ? (
                          <SelectMenuPreview
                            categories={
                              visibleCategories
                            }
                          />
                        ) : (
                          <div className="space-y-2">
                            {visibleCategories.map(
                              (
                                category
                              ) => (
                                <CategoryPreview
                                  key={
                                    category.id
                                  }
                                  category={
                                    category
                                  }
                                  panelStyle={
                                    appearance.panelStyle
                                  }
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {(appearance.footerEnabled ||
                    appearance.timestampEnabled) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                      {appearance.footerEnabled &&
                        footerIconUrl && (
                          <img
                            src={getPreviewImageUrl(
                              footerIconUrl
                            )}
                            alt=""
                            className="size-5 rounded-full object-cover"
                          />
                        )}

                      {appearance.footerEnabled &&
                        footerText && (
                          <span>
                            {footerText}
                          </span>
                        )}

                      {appearance.footerEnabled &&
                        footerText &&
                        appearance.timestampEnabled && (
                          <span>•</span>
                        )}

                      {appearance.timestampEnabled && (
                        <span>
                          Today at 03:24 PM
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">
          Panel Summary
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SummaryCard
            label="Categories"
            value={String(
              visibleCategories.length
            )}
          />

          <SummaryCard
            label="Display"
            value={
              appearance.useSelectMenu
                ? "Dropdown"
                : "Buttons"
            }
          />

          <SummaryCard
            label="Style"
            value={capitalize(
              appearance.panelStyle
            )}
          />

          <SummaryCard
            label="Status"
            value="Ready"
          />
        </div>
      </section>
    </aside>
  )
}

function CategoryPreview({
  category,
  panelStyle,
}: {
  category: TicketCategory
  panelStyle:
    | "modern"
    | "compact"
    | "minimal"
}) {
  const styles =
    COLOR_STYLES[category.color]

  const compact =
    panelStyle === "compact"

  const minimal =
    panelStyle === "minimal"

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border transition",
        compact
          ? "px-3 py-2.5"
          : "px-3 py-3",
        styles.border,
        minimal
          ? "bg-transparent"
          : styles.background
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg",
          compact
            ? "size-8"
            : "size-9",
          styles.icon
        )}
      >
        <span className="text-sm">
          {category.emoji ||
            "🎫"}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {category.name ||
            "Unnamed Category"}
        </p>

        {!minimal &&
          category.description && (
            <p className="mt-0.5 truncate text-xs text-gray-400">
              {
                category.description
              }
            </p>
          )}
      </div>

      <ChevronRight className="size-4 shrink-0 text-gray-400" />
    </div>
  )
}

function SelectMenuPreview({
  categories,
}: {
  categories: TicketCategory[]
}) {
  const firstCategory =
    categories[0]

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1f22]">
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-[#dbdee1]">
            Select a ticket
            category
          </p>

          {firstCategory && (
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {firstCategory.emoji}{" "}
              {firstCategory.name}
            </p>
          )}
        </div>

        <ChevronDown className="size-4 shrink-0 text-gray-400" />
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background/30 p-3">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  )
}

function getPreviewImageUrl(
  source: string
) {
  if (!source) {
    return ""
  }

  if (
    source.startsWith("/") ||
    source.startsWith("data:") ||
    source.startsWith("blob:")
  ) {
    return source
  }

  return `/api/image-proxy?url=${encodeURIComponent(
    source
  )}`
}

function capitalize(
  value: string
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}