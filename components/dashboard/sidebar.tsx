"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeft, PanelLeftClose } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToxLogo } from "@/components/tox/logo"
import { useLocale } from "@/lib/i18n"
import { buildNav } from "@/lib/nav"
import { cn } from "@/lib/utils"

export function Sidebar({
  guildId,
  collapsed,
  onToggle,
}: {
  guildId: string
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const { t } = useLocale()
  const groups = buildNav(guildId)

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 flex-col border-e border-border bg-sidebar transition-[width] duration-200 md:flex",
        collapsed ? "w-[82px]" : "w-[290px]"
      )}
    >
      <div
        className={cn(
          "flex h-24 shrink-0 items-center border-b border-border px-6",
          collapsed && "justify-center px-0"
        )}
      >
        <Link
          href="/servers"
          className={cn(
            "flex min-w-0 items-center overflow-hidden",
            collapsed && "justify-center"
          )}
          aria-label="TOX Platform"
        >
          <div
            className={cn(
              "origin-left transition-transform duration-200",
              collapsed ? "scale-110" : "scale-[1.18]"
            )}
          >
            <ToxLogo showText={!collapsed} />
          </div>
        </Link>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {groups.map((group) => (
            <div
              key={group.labelKey}
              className="flex flex-col gap-1"
            >
              {!collapsed && (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(group.labelKey)}
                </p>
              )}

              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? t(item.labelKey) : undefined}
                    aria-label={collapsed ? t(item.labelKey) : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-[18px] shrink-0" />

                    {!collapsed && (
                      <span className="truncate">
                        {t(item.labelKey)}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "h-10 w-full gap-2",
            collapsed && "px-0"
          )}
          aria-label={
            collapsed
              ? t("sidebar.expand")
              : t("sidebar.collapse")
          }
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}

          {!collapsed && (
            <span>{t("sidebar.collapse")}</span>
          )}
        </Button>
      </div>
    </aside>
  )
}