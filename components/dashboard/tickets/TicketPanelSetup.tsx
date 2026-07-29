"use client"

import {
  Check,
  ChevronDown,
  Image as ImageIcon,
  LayoutPanelTop,
  ListTree,
  MonitorSmartphone,
  Palette,
  PanelTop,
  Sparkles,
  Type,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketPanelSetupProps,
  TicketPanelStyle,
} from "./types"

const PANEL_STYLES: Array<{
  value: TicketPanelStyle
  label: string
  description: string
  icon: React.ReactNode
}> = [
  {
    value: "modern",
    label: "Modern",
    description:
      "Rich cards with descriptions and clear spacing.",
    icon: <Sparkles className="size-4" />,
  },
  {
    value: "compact",
    label: "Compact",
    description:
      "Smaller controls that use less vertical space.",
    icon: <MonitorSmartphone className="size-4" />,
  },
  {
    value: "minimal",
    label: "Minimal",
    description:
      "Simple buttons with limited visual details.",
    icon: <PanelTop className="size-4" />,
  },
]

export function TicketPanelSetup({
  value,
  onChange,
}: TicketPanelSetupProps) {
  function update(
    patch: Partial<typeof value>
  ) {
    onChange({
      ...value,
      ...patch,
    })
  }

  return (
    <div className="space-y-5">
      <Section
        icon={
          <LayoutPanelTop className="size-4" />
        }
        title="Panel content"
        description="Configure the title, description and main color of the ticket panel."
      >
        <div className="grid gap-4">
          <Field
            label="Panel title"
            description="The heading shown at the top of the ticket panel."
          >
            <input
              value={value.title}
              maxLength={256}
              onChange={(event) =>
                update({
                  title:
                    event.target.value,
                })
              }
              placeholder="Ticket System"
              className="ticket-input"
            />
          </Field>

          <Field
            label="Panel description"
            description="Explain how members should use the ticket system."
          >
            <textarea
              value={value.description}
              maxLength={4096}
              rows={7}
              onChange={(event) =>
                update({
                  description:
                    event.target.value,
                })
              }
              placeholder="Choose the ticket category that matches your request."
              className="ticket-input min-h-40 resize-y py-3"
            />

            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                Supports ticket variables
                such as {"{server}"}.
              </span>

              <span>
                {value.description.length}
                /4096
              </span>
            </div>
          </Field>

          <Field
            label="Embed color"
            description="Controls the colored line shown on the Discord embed."
          >
            <div className="flex gap-3">
              <div className="relative min-w-0 flex-1">
                <Palette className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={value.color}
                  maxLength={7}
                  onChange={(event) =>
                    update({
                      color:
                        event.target.value,
                    })
                  }
                  placeholder="#9B4DFF"
                  className="ticket-input pl-10 uppercase"
                />
              </div>

              <input
                type="color"
                value={
                  isValidHex(value.color)
                    ? value.color
                    : "#9B4DFF"
                }
                onChange={(event) =>
                  update({
                    color:
                      event.target.value.toUpperCase(),
                  })
                }
                className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-background p-1"
                aria-label="Choose embed color"
              />
            </div>
          </Field>
        </div>
      </Section>

      <Section
        icon={
          <ImageIcon className="size-4" />
        }
        title="Panel images"
        description="Add a main banner and an optional thumbnail to the panel."
      >
        <div className="space-y-4">
          <ToggleCard
            label="Main image"
            description="Display a large banner inside the ticket embed."
            enabled={value.imageEnabled}
            onToggle={() =>
              update({
                imageEnabled:
                  !value.imageEnabled,
              })
            }
          />

          {value.imageEnabled && (
            <div className="rounded-xl border border-border bg-background/30 p-4">
              <Field
                label="Main image URL"
                description="Use a direct PNG, JPG, WEBP or GIF image URL."
              >
                <input
                  value={value.imageUrl}
                  onChange={(event) =>
                    update({
                      imageUrl:
                        event.target.value,
                    })
                  }
                  placeholder="https://example.com/ticket-banner.png"
                  className="ticket-input"
                />
              </Field>

              {value.imageUrl && (
                <ImagePreview
                  source={value.imageUrl}
                  label="Main image preview"
                />
              )}
            </div>
          )}

          <ToggleCard
            label="Thumbnail"
            description="Display a small image at the top-right of the embed."
            enabled={
              value.thumbnailEnabled
            }
            onToggle={() =>
              update({
                thumbnailEnabled:
                  !value.thumbnailEnabled,
              })
            }
          />

          {value.thumbnailEnabled && (
            <div className="rounded-xl border border-border bg-background/30 p-4">
              <Field
                label="Thumbnail URL"
                description="You can also use a supported variable such as {serverIcon}."
              >
                <input
                  value={
                    value.thumbnailUrl
                  }
                  onChange={(event) =>
                    update({
                      thumbnailUrl:
                        event.target.value,
                    })
                  }
                  placeholder="{serverIcon}"
                  className="ticket-input"
                />
              </Field>

              {value.thumbnailUrl &&
                !value.thumbnailUrl.startsWith(
                  "{"
                ) && (
                  <ImagePreview
                    source={
                      value.thumbnailUrl
                    }
                    label="Thumbnail preview"
                    compact
                  />
                )}
            </div>
          )}
        </div>
      </Section>

      <Section
        icon={<Type className="size-4" />}
        title="Footer"
        description="Configure footer text, icon and timestamp."
      >
        <div className="space-y-4">
          <ToggleCard
            label="Enable footer"
            description="Show footer text and an optional footer icon."
            enabled={value.footerEnabled}
            onToggle={() =>
              update({
                footerEnabled:
                  !value.footerEnabled,
              })
            }
          />

          {value.footerEnabled && (
            <div className="grid gap-4 rounded-xl border border-border bg-background/30 p-4 md:grid-cols-2">
              <Field
                label="Footer text"
                description="Shown at the bottom of the embed."
              >
                <input
                  value={value.footerText}
                  maxLength={2048}
                  onChange={(event) =>
                    update({
                      footerText:
                        event.target.value,
                    })
                  }
                  placeholder="{server} • We're here to help"
                  className="ticket-input"
                />
              </Field>

              <Field
                label="Footer icon URL"
                description="Optional small icon next to the footer."
              >
                <input
                  value={
                    value.footerIconUrl
                  }
                  onChange={(event) =>
                    update({
                      footerIconUrl:
                        event.target.value,
                    })
                  }
                  placeholder="{serverIcon}"
                  className="ticket-input"
                />
              </Field>
            </div>
          )}

          <ToggleCard
            label="Show timestamp"
            description="Display the current time at the bottom of the embed."
            enabled={
              value.timestampEnabled
            }
            onToggle={() =>
              update({
                timestampEnabled:
                  !value.timestampEnabled,
              })
            }
          />
        </div>
      </Section>

      <Section
        icon={
          <ListTree className="size-4" />
        }
        title="Category display"
        description="Choose how members select the department they want."
      >
        <div className="space-y-4">
          <ToggleCard
            label="Show ticket categories"
            description="Display the enabled categories configured in the next tab."
            enabled={
              value.showCategories
            }
            onToggle={() =>
              update({
                showCategories:
                  !value.showCategories,
              })
            }
          />

          {value.showCategories && (
            <ToggleCard
              label="Use select menu"
              description="Use one dropdown instead of individual category buttons."
              enabled={
                value.useSelectMenu
              }
              onToggle={() =>
                update({
                  useSelectMenu:
                    !value.useSelectMenu,
                })
              }
            />
          )}
        </div>
      </Section>

      <Section
        icon={
          <Sparkles className="size-4" />
        }
        title="Panel style"
        description="Choose the visual density of category controls in the panel preview."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {PANEL_STYLES.map(
            (style) => {
              const selected =
                value.panelStyle ===
                style.value

              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() =>
                    update({
                      panelStyle:
                        style.value,
                    })
                  }
                  className={cn(
                    "relative rounded-2xl border p-4 text-left transition",
                    selected
                      ? "border-primary/45 bg-primary/[0.09] text-foreground shadow-[0_0_24px_rgba(139,92,246,0.08)]"
                      : "border-border bg-background/30 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {style.icon}
                  </span>

                  <p className="mt-3 text-sm font-semibold">
                    {style.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {style.description}
                  </p>

                  {selected && (
                    <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </button>
              )
            }
          )}
        </div>
      </Section>

      <style jsx global>{`
        .ticket-input {
          min-height: 48px;
          width: 100%;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.035);
          padding: 12px 16px;
          font-size: 14px;
          line-height: 1.4;
          color: var(--foreground);
          outline: none;
          transition:
            border-color 160ms ease,
            background 160ms ease,
            box-shadow 160ms ease;
        }

        .ticket-input:hover {
          border-color: rgba(124, 58, 237, 0.45);
          background: rgba(124, 58, 237, 0.045);
        }

        .ticket-input:focus,
        .ticket-input:focus-visible {
          border-color: var(--primary);
          background: #101728;
          box-shadow:
            0 0 0 3px rgba(124, 58, 237, 0.16),
            0 10px 30px -16px rgba(124, 58, 237, 0.65);
        }

        .ticket-input::placeholder {
          color: var(--muted-foreground);
          opacity: 1;
        }

        textarea.ticket-input {
          min-height: 160px;
          resize: vertical;
          padding-top: 14px;
          padding-bottom: 14px;
        }

        select.ticket-input {
          cursor: pointer;
        }

        .ticket-input:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }
      `}</style>
    </div>
  )
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  )
}

function Field({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">
        {label}
      </span>

      {description && (
        <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
          {description}
        </span>
      )}

      <div className="mt-2">
        {children}
      </div>
    </label>
  )
}

function ToggleCard({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background/30 p-4 text-left transition hover:bg-muted/25"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          enabled
            ? "bg-primary"
            : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition",
            enabled
              ? "left-6"
              : "left-1"
          )}
        />
      </span>
    </button>
  )
}

function ImagePreview({
  source,
  label,
  compact = false,
}: {
  source: string
  label: string
  compact?: boolean
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-black/10 p-3">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <img
        src={getPreviewImageUrl(source)}
        alt={label}
        className={cn(
          "rounded-lg object-cover",
          compact
            ? "size-24"
            : "max-h-72 w-full"
        )}
      />
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

function isValidHex(
  value: string
) {
  return /^#[0-9a-fA-F]{6}$/.test(
    value
  )
}

export default TicketPanelSetup