"use client"

import {
  ArrowDown,
  ArrowUp,
  Copy,
  Plus,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  TicketCategoriesTabProps,
  TicketCategory,
  TicketCategoryColor,
} from "./types"

const COLORS: Array<{
  value: TicketCategoryColor
  label: string
  className: string
}> = [
  {
    value: "purple",
    label: "Purple",
    className: "bg-purple-500",
  },
  {
    value: "blue",
    label: "Blue",
    className: "bg-blue-500",
  },
  {
    value: "green",
    label: "Green",
    className: "bg-emerald-500",
  },
  {
    value: "yellow",
    label: "Yellow",
    className: "bg-amber-500",
  },
  {
    value: "red",
    label: "Red",
    className: "bg-red-500",
  },
  {
    value: "cyan",
    label: "Cyan",
    className: "bg-cyan-500",
  },
  {
    value: "pink",
    label: "Pink",
    className: "bg-pink-500",
  },
  {
    value: "gray",
    label: "Gray",
    className: "bg-slate-500",
  },
]

export default function TicketCategoriesTab({
  value,
  channels,
  roles,
  onChange,
}: TicketCategoriesTabProps) {
  const categoryChannels = channels.filter(
  (channel) =>
    (channel as any).kind === "category" ||
    channel.type === "category" ||
    (channel as any).type === 4
)

  function updateCategory(
    id: string,
    patch: Partial<TicketCategory>
  ) {
    onChange(
      value.map((category) =>
        category.id === id
          ? {
              ...category,
              ...patch,
            }
          : category
      )
    )
  }

  function addCategory() {
    const newCategory: TicketCategory = {
      id: `category-${Date.now()}`,
      name: "New Category",
      description:
        "Describe this ticket category.",
      emoji: "🎫",
      color: "purple",
      buttonStyle: "primary",
      enabled: true,
      openCategoryId: "",
      closedCategoryId: "",
      supportRoleIds: [],
      mentionRoleIds: [],
      ticketNameTemplate:
        "ticket-{ticketNumber}",
      openingMessage:
        "Welcome {mention}. A staff member will assist you shortly.",
      maxOpenTicketsPerUser: 1,
      requireReason: true,
      requireConfirmation: false,
      position: value.length,
    }

    onChange([...value, newCategory])
  }

  function duplicateCategory(
    category: TicketCategory
  ) {
    const nextPosition =
      value.length

    onChange([
      ...value,
      {
        ...category,
        id: `${category.id}-copy-${Date.now()}`,
        name: `${category.name} Copy`,
        supportRoleIds: [
          ...category.supportRoleIds,
        ],
        mentionRoleIds: [
          ...category.mentionRoleIds,
        ],
        position: nextPosition,
      },
    ])
  }

  function deleteCategory(
    id: string
  ) {
    onChange(
      value
        .filter(
          (category) =>
            category.id !== id
        )
        .map(
          (category, index) => ({
            ...category,
            position: index,
          })
        )
    )
  }

  function moveCategory(
    id: string,
    direction: "up" | "down"
  ) {
    const ordered = [...value].sort(
      (a, b) =>
        a.position - b.position
    )

    const currentIndex =
      ordered.findIndex(
        (category) =>
          category.id === id
      )

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >=
        ordered.length
    ) {
      return
    }

    const next = [...ordered]

    ;[
      next[currentIndex],
      next[targetIndex],
    ] = [
      next[targetIndex],
      next[currentIndex],
    ]

    onChange(
      next.map(
        (category, index) => ({
          ...category,
          position: index,
        })
      )
    )
  }

  function toggleRole(
    category: TicketCategory,
    roleId: string
  ) {
    const active =
      category.supportRoleIds.includes(
        roleId
      )

    updateCategory(category.id, {
      supportRoleIds: active
        ? category.supportRoleIds.filter(
            (id) => id !== roleId
          )
        : [
            ...category.supportRoleIds,
            roleId,
          ],
    })
  }

  const orderedCategories =
    [...value].sort(
      (a, b) =>
        a.position - b.position
    )

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Ticket Categories
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create and organize the
              ticket departments members
              can choose from.
            </p>
          </div>

          <button
            type="button"
            onClick={addCategory}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add Category
          </button>
        </div>
      </section>

      {orderedCategories.length ===
      0 ? (
        <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-semibold">
            No ticket categories yet
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first category
            to start building the ticket
            panel.
          </p>

          <button
            type="button"
            onClick={addCategory}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" />
            Create Category
          </button>
        </section>
      ) : (
        <div className="space-y-5">
          {orderedCategories.map(
            (
              category,
              categoryIndex
            ) => (
              <section
                key={category.id}
                className={cn(
                  "rounded-2xl border bg-card transition",
                  category.enabled
                    ? "border-border"
                    : "border-border/60 opacity-70"
                )}
              >
                <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-xl">
                      {category.emoji ||
                        "🎫"}
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {category.name ||
                          "Unnamed Category"}
                      </h3>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        Category{" "}
                        {categoryIndex + 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <SmallButton
                      label="Move up"
                      disabled={
                        categoryIndex === 0
                      }
                      onClick={() =>
                        moveCategory(
                          category.id,
                          "up"
                        )
                      }
                    >
                      <ArrowUp className="size-4" />
                    </SmallButton>

                    <SmallButton
                      label="Move down"
                      disabled={
                        categoryIndex ===
                        orderedCategories.length -
                          1
                      }
                      onClick={() =>
                        moveCategory(
                          category.id,
                          "down"
                        )
                      }
                    >
                      <ArrowDown className="size-4" />
                    </SmallButton>

                    <SmallButton
                      label="Duplicate"
                      onClick={() =>
                        duplicateCategory(
                          category
                        )
                      }
                    >
                      <Copy className="size-4" />
                    </SmallButton>

                    <SmallButton
                      label="Delete"
                      danger
                      onClick={() =>
                        deleteCategory(
                          category.id
                        )
                      }
                    >
                      <Trash2 className="size-4" />
                    </SmallButton>

                    <Toggle
                      enabled={
                        category.enabled
                      }
                      onClick={() =>
                        updateCategory(
                          category.id,
                          {
                            enabled:
                              !category.enabled,
                          }
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Category name"
                      description="Shown to members in the ticket panel."
                    >
                      <input
                        value={
                          category.name
                        }
                        onChange={(event) =>
                          updateCategory(
                            category.id,
                            {
                              name: event
                                .target
                                .value,
                            }
                          )
                        }
                        className="ticket-input"
                        placeholder="Support"
                      />
                    </Field>

                    <Field
                      label="Emoji"
                      description="Use one Discord or Unicode emoji."
                    >
                      <input
                        value={
                          category.emoji
                        }
                        onChange={(event) =>
                          updateCategory(
                            category.id,
                            {
                              emoji:
                                event
                                  .target
                                  .value,
                            }
                          )
                        }
                        className="ticket-input"
                        placeholder="🎫"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Description"
                    description="Short explanation shown below the category name."
                  >
                    <textarea
                      value={
                        category.description
                      }
                      onChange={(event) =>
                        updateCategory(
                          category.id,
                          {
                            description:
                              event.target
                                .value,
                          }
                        )
                      }
                      rows={3}
                      className="ticket-input min-h-24 resize-y py-3"
                      placeholder="Describe what this category is used for."
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Open tickets category"
                      description="New ticket channels for this category will be created here."
                    >
                      <select
                        value={
                          category.openCategoryId
                        }
                        onChange={(event) =>
                          updateCategory(
                            category.id,
                            {
                              openCategoryId:
                                event.target.value,
                            }
                          )
                        }
                        className="ticket-input"
                      >
                        <option value="">
                          Use global open category
                        </option>

                        {categoryChannels.map(
                          (channel) => (
                            <option
                              key={channel.id}
                              value={channel.id}
                            >
                              {channel.name}
                            </option>
                          )
                        )}
                      </select>
                    </Field>

                    <Field
                      label="Closed tickets category"
                      description="Closed ticket channels for this category will be moved here."
                    >
                      <select
                        value={
                          category.closedCategoryId
                        }
                        onChange={(event) =>
                          updateCategory(
                            category.id,
                            {
                              closedCategoryId:
                                event.target.value,
                            }
                          )
                        }
                        className="ticket-input"
                      >
                        <option value="">
                          Use global closed category
                        </option>

                        {categoryChannels.map(
                          (channel) => (
                            <option
                              key={channel.id}
                              value={channel.id}
                            >
                              {channel.name}
                            </option>
                          )
                        )}
                      </select>
                    </Field>
                  </div>

                  <Field
                    label="Ticket channel name"
                    description="Variables such as {ticketNumber} are supported."
                  >
                    <input
                      value={
                        category.ticketNameTemplate
                      }
                      onChange={(event) =>
                        updateCategory(
                          category.id,
                          {
                            ticketNameTemplate:
                              event.target.value,
                          }
                        )
                      }
                      className="ticket-input"
                      placeholder="support-{ticketNumber}"
                    />
                  </Field>

                  <div>
                    <p className="text-xs font-semibold">
                      Category color
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Used in the panel
                      preview and category
                      controls.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {COLORS.map(
                        (color) => {
                          const selected =
                            category.color ===
                            color.value

                          return (
                            <button
                              key={
                                color.value
                              }
                              type="button"
                              onClick={() =>
                                updateCategory(
                                  category.id,
                                  {
                                    color:
                                      color.value,
                                  }
                                )
                              }
                              className={cn(
                                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
                                selected
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-border bg-background/30 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "size-3 rounded-full",
                                  color.className
                                )}
                              />

                              {color.label}
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      Support roles
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      These roles can see
                      and manage tickets in
                      this category.
                    </p>

                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {roles.length ===
                      0 ? (
                        <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2">
                          No Discord roles
                          loaded yet.
                        </div>
                      ) : (
                        roles
                          .filter(
                            (role) =>
                              !role.managed
                          )
                          .map(
                            (role) => {
                              const active =
                                category.supportRoleIds.includes(
                                  role.id
                                )

                              return (
                                <button
                                  key={
                                    role.id
                                  }
                                  type="button"
                                  onClick={() =>
                                    toggleRole(
                                      category,
                                      role.id
                                    )
                                  }
                                  className={cn(
                                    "flex items-center justify-between rounded-xl border p-3 text-left text-sm transition",
                                    active
                                      ? "border-primary bg-primary/10 text-foreground"
                                      : "border-border bg-background/30 text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <span className="truncate">
                                    {
                                      role.name
                                    }
                                  </span>

                                  <span
                                    className={cn(
                                      "size-3 rounded-full border",
                                      active
                                        ? "border-primary bg-primary"
                                        : "border-border"
                                    )}
                                  />
                                </button>
                              )
                            }
                          )
                      )}
                    </div>
                  </div>

                  <Field
                    label="Opening message"
                    description="Sent automatically when a ticket is created."
                  >
                    <textarea
                      value={
                        category.openingMessage
                      }
                      onChange={(event) =>
                        updateCategory(
                          category.id,
                          {
                            openingMessage:
                              event.target
                                .value,
                          }
                        )
                      }
                      rows={4}
                      className="ticket-input min-h-28 resize-y py-3"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Maximum open tickets"
                      description="Per user in this category."
                    >
                      <input
                        type="number"
                        min={1}
                        max={25}
                        value={
                          category.maxOpenTicketsPerUser
                        }
                        onChange={(event) =>
                          updateCategory(
                            category.id,
                            {
                              maxOpenTicketsPerUser:
                                Math.max(
                                  1,
                                  Number(
                                    event
                                      .target
                                      .value
                                  ) || 1
                                ),
                            }
                          )
                        }
                        className="ticket-input"
                      />
                    </Field>

                    <OptionCard
                      label="Require reason"
                      description="Ask the member why they are opening the ticket."
                      enabled={
                        category.requireReason
                      }
                      onClick={() =>
                        updateCategory(
                          category.id,
                          {
                            requireReason:
                              !category.requireReason,
                          }
                        )
                      }
                    />

                    <OptionCard
                      label="Confirmation"
                      description="Require confirmation before creating the ticket."
                      enabled={
                        category.requireConfirmation
                      }
                      onClick={() =>
                        updateCategory(
                          category.id,
                          {
                            requireConfirmation:
                              !category.requireConfirmation,
                          }
                        )
                      }
                    />
                  </div>
                </div>
              </section>
            )
          )}
        </div>
      )}
    </div>
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

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 rounded-full transition",
        enabled
          ? "bg-primary"
          : "bg-muted"
      )}
      aria-label={
        enabled
          ? "Disable category"
          : "Enable category"
      }
    >
      <span
        className={cn(
          "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition",
          enabled
            ? "left-6"
            : "left-1"
        )}
      />
    </button>
  )
}

function SmallButton({
  label,
  onClick,
  children,
  disabled = false,
  danger = false,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-35",
        danger
          ? "border-red-500/25 bg-red-500/[0.06] text-red-400 hover:bg-red-500/10"
          : "border-border bg-background/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function OptionCard({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string
  description: string
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition",
        enabled
          ? "border-primary bg-primary/[0.08]"
          : "border-border bg-background/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">
          {label}
        </span>

        <span
          className={cn(
            "size-3 rounded-full",
            enabled
              ? "bg-emerald-400"
              : "bg-muted"
          )}
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}