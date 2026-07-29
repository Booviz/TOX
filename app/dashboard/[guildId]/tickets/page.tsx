"use client"

import {
  Copy,
  Loader2,
  Plus,
  Save,
  Send,
  Ticket,
  Trash2,
} from "lucide-react"
import { useParams } from "next/navigation"
import {
  useEffect,
  useMemo,
  useState,
} from "react"

import TicketAdvancedTab from "@/components/dashboard/tickets/TicketAdvancedTab"
import TicketBuilderTabs from "@/components/dashboard/tickets/TicketBuilderTabs"
import TicketCategoriesTab from "@/components/dashboard/tickets/TicketCategoriesTab"
import TicketMessagesTab from "@/components/dashboard/tickets/TicketMessagesTab"
import TicketPanelPreview from "@/components/dashboard/tickets/TicketPanelPreview"
import TicketPanelSetup from "@/components/dashboard/tickets/TicketPanelSetup"
import TicketPermissionsTab from "@/components/dashboard/tickets/TicketPermissionsTab"
import TicketVariables from "@/components/dashboard/tickets/TicketVariables"

import {
  DEFAULT_TICKET_SYSTEM_SETTINGS,
} from "@/components/dashboard/tickets/types"

import type {
  TicketBuilderTab,
  TicketChannelOption,
  TicketRoleOption,
  TicketSystemSettings,
} from "@/components/dashboard/tickets/types"

type TicketPanelRow = {
  id?: string
  guild_id?: string
  panel_key?: string
  name?: string
  enabled?: boolean
  panel_channel_id?: string | null
  panel_message_id?: string | null
  appearance?: TicketSystemSettings["appearance"] | null
  channel_settings?: TicketSystemSettings["channels"] | null
  permission_settings?: TicketSystemSettings["permissions"] | null
  message_settings?: TicketSystemSettings["messages"] | null
  advanced_settings?: TicketSystemSettings["advanced"] | null
  ticket_categories?: Array<{
    id?: string
    category_key?: string
    name?: string
    description?: string
    emoji?: string
    color?: string
    button_style?: string
    enabled?: boolean
    discord_category_id?: string | null
    open_discord_category_id?: string | null
    closed_discord_category_id?: string | null
    support_role_ids?: string[] | null
    mention_role_ids?: string[] | null
    ticket_name_template?: string
    opening_message?: string
    max_open_tickets_per_user?: number
    require_reason?: boolean
    require_confirmation?: boolean
    position?: number
  }> | null
  created_at?: string | null
  updated_at?: string | null
}

type ApiErrorResponse = {
  error?: string
  message?: string
}

function cloneDefaultSettings(
  guildId: string
): TicketSystemSettings {
  return {
    ...DEFAULT_TICKET_SYSTEM_SETTINGS,
    guildId,
    appearance: {
      ...DEFAULT_TICKET_SYSTEM_SETTINGS.appearance,
    },
    categories:
      DEFAULT_TICKET_SYSTEM_SETTINGS.categories.map(
        (category) => ({
          ...category,
          supportRoleIds: [
            ...category.supportRoleIds,
          ],
          mentionRoleIds: [
            ...category.mentionRoleIds,
          ],
        })
      ),
    channels: {
      ...DEFAULT_TICKET_SYSTEM_SETTINGS.channels,
    },
    permissions: {
      ...DEFAULT_TICKET_SYSTEM_SETTINGS.permissions,
      staffRoleIds: [
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.permissions.staffRoleIds,
      ],
      adminRoleIds: [
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.permissions.adminRoleIds,
      ],
      transcriptRoleIds: [
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.permissions.transcriptRoleIds,
      ],
      blockedRoleIds: [
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.permissions.blockedRoleIds,
      ],
    },
    messages: {
      ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages,
      opening: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.opening,
      },
      closeConfirmation: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.closeConfirmation,
      },
      closed: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.closed,
      },
      claimed: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.claimed,
      },
      memberAdded: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.memberAdded,
      },
      memberRemoved: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.memberRemoved,
      },
      dmReminder: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.messages.dmReminder,
      },
    },
    advanced: {
      ...DEFAULT_TICKET_SYSTEM_SETTINGS.advanced,
      transcript: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.advanced.transcript,
      },
      automation: {
        ...DEFAULT_TICKET_SYSTEM_SETTINGS.advanced.automation,
      },
    },
  }
}

function mapPanelRowToSettings(
  row: TicketPanelRow,
  guildId: string
): TicketSystemSettings {
  const defaults =
    cloneDefaultSettings(guildId)

  const categories =
    row.ticket_categories?.length
      ? row.ticket_categories
          .map((category, index) => ({
            id:
              category.category_key ??
              category.id ??
              `category-${index + 1}`,
            name:
              category.name ??
              `Category ${index + 1}`,
            description:
              category.description ?? "",
            emoji:
              category.emoji ?? "🎫",
            color:
              (category.color ??
                "purple") as TicketSystemSettings["categories"][number]["color"],
            buttonStyle:
              (category.button_style ??
                "primary") as TicketSystemSettings["categories"][number]["buttonStyle"],
            enabled:
              category.enabled ?? true,
            openCategoryId:

              category.open_discord_category_id ??
              category.discord_category_id ??
              "",
              closedCategoryId:
               category.closed_discord_category_id ??
              "",
            supportRoleIds: Array.isArray(
              category.support_role_ids
            )
              ? [
                  ...category.support_role_ids,
                ]
              : [],
            mentionRoleIds: Array.isArray(
              category.mention_role_ids
            )
              ? [
                  ...category.mention_role_ids,
                ]
              : [],
            ticketNameTemplate:
              category.ticket_name_template ??
              "ticket-{ticketNumber}",
            openingMessage:
              category.opening_message ??
              "",
            maxOpenTicketsPerUser:
              category.max_open_tickets_per_user ??
              1,
            requireReason:
              category.require_reason ?? true,
            requireConfirmation:
              category.require_confirmation ??
              false,
            position:
              category.position ?? index,
          }))
          .sort(
            (a, b) =>
              a.position - b.position
          )
      : defaults.categories

  return {
    ...defaults,
    guildId,
    panelId:
      row.panel_key ??
      defaults.panelId,
    enabled:
      row.enabled ??
      defaults.enabled,
    name:
      row.name ??
      defaults.name,
    appearance: {
      ...defaults.appearance,
      ...(row.appearance ?? {}),
    },
    categories,
    channels: {
      ...defaults.channels,
      ...(row.channel_settings ?? {}),
      panelChannelId:
        row.panel_channel_id ??
        row.channel_settings
          ?.panelChannelId ??
        defaults.channels
          .panelChannelId,
    },
    permissions: {
      ...defaults.permissions,
      ...(row.permission_settings ??
        {}),
      staffRoleIds: [
        ...(
          row.permission_settings
            ?.staffRoleIds ?? []
        ),
      ],
      adminRoleIds: [
        ...(
          row.permission_settings
            ?.adminRoleIds ?? []
        ),
      ],
      transcriptRoleIds: [
        ...(
          row.permission_settings
            ?.transcriptRoleIds ?? []
        ),
      ],
      blockedRoleIds: [
        ...(
          row.permission_settings
            ?.blockedRoleIds ?? []
        ),
      ],
    },
    messages: {
      ...defaults.messages,
      ...(row.message_settings ?? {}),
      opening: {
        ...defaults.messages.opening,
        ...(row.message_settings
          ?.opening ?? {}),
      },
      closeConfirmation: {
        ...defaults.messages
          .closeConfirmation,
        ...(row.message_settings
          ?.closeConfirmation ?? {}),
      },
      closed: {
        ...defaults.messages.closed,
        ...(row.message_settings
          ?.closed ?? {}),
      },
      claimed: {
        ...defaults.messages.claimed,
        ...(row.message_settings
          ?.claimed ?? {}),
      },
      memberAdded: {
        ...defaults.messages
          .memberAdded,
        ...(row.message_settings
          ?.memberAdded ?? {}),
      },
      memberRemoved: {
        ...defaults.messages
          .memberRemoved,
        ...(row.message_settings
          ?.memberRemoved ?? {}),
      },
      dmReminder: {
        ...defaults.messages
          .dmReminder,
        ...(row.message_settings
          ?.dmReminder ?? {}),
      },
    },
    advanced: {
      ...defaults.advanced,
      ...(row.advanced_settings ??
        {}),
      transcript: {
        ...defaults.advanced
          .transcript,
        ...(row.advanced_settings
          ?.transcript ?? {}),
      },
      automation: {
        ...defaults.advanced
          .automation,
        ...(row.advanced_settings
          ?.automation ?? {}),
      },
    },
    createdAt:
      row.created_at ?? null,
    updatedAt:
      row.updated_at ?? null,
  }
}

function cloneSettings(
  value: TicketSystemSettings
): TicketSystemSettings {
  return JSON.parse(
    JSON.stringify(value)
  ) as TicketSystemSettings
}

function createPanelKey(
  baseName: string
) {
  const normalized =
    baseName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    "ticket-panel"

  return `${normalized}-${Date.now().toString(36)}`
}

async function readJsonResponse<T>(
  response: Response
): Promise<T> {
  const text = await response.text()

  if (!text) {
    return {} as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(
      `API returned an invalid response (${response.status}).`
    )
  }
}

export default function TicketsPage() {
  const params = useParams<{
    guildId: string
  }>()

  const guildId = params.guildId

  const [activeTab, setActiveTab] =
    useState<TicketBuilderTab>("panel")

  const [settings, setSettings] =
  
    useState<TicketSystemSettings>(
      cloneDefaultSettings(guildId)
    )
  const [panels, setPanels] =
    useState<TicketSystemSettings[]>([])

  const [activePanelId, setActivePanelId] =
    useState("")

  const [savedPanels, setSavedPanels] =
    useState<Record<string, TicketSystemSettings>>({})

  const [channels, setChannels] =
    useState<TicketChannelOption[]>([])

  const [roles, setRoles] =
    useState<TicketRoleOption[]>([])

  const [guildName, setGuildName] =
    useState("TOX COMMUNITY")

  const [guildIconUrl, setGuildIconUrl] =
    useState<string | null>(
      "/logo.png"
    )

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [testing, setTesting] =
    useState(false)

  const [message, setMessage] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTicketBuilder() {
      try {
        setLoading(true)
        setMessage(null)
        setError(null)

        const [
          ticketsResponse,
          dashboardResponse,
          channelsResponse,
          rolesResponse,
        ] = await Promise.all([
          fetch(
            `/api/dashboard/${guildId}/tickets`,
            {
              method: "GET",
              cache: "no-store",
            }
          ),
          fetch(
            `/api/dashboard/${guildId}`,
            {
              method: "GET",
              cache: "no-store",
            }
          ).catch(() => null),
          fetch(
            `/api/dashboard/${guildId}/channels`,
            {
              method: "GET",
              cache: "no-store",
            }
          ).catch(() => null),
          fetch(
            `/api/dashboard/${guildId}/roles`,
            {
              method: "GET",
              cache: "no-store",
            }
          ).catch(() => null),
        ])

        const ticketPayload =
          await readJsonResponse<
            TicketPanelRow[] | ApiErrorResponse
          >(ticketsResponse)

        if (!ticketsResponse.ok) {
          const apiError =
            ticketPayload as ApiErrorResponse

          throw new Error(
            apiError.error ??
              apiError.message ??
              "Failed to load ticket settings."
          )
        }

        const panelRows = Array.isArray(
          ticketPayload
        )
          ? ticketPayload
          : []

        const loadedPanels = panelRows.map(panel =>
              mapPanelRowToSettings(
               panel,
                guildId
              )
        )

        const loadedSettings =
          panelRows.length > 0
            ? mapPanelRowToSettings(
                panelRows[0],
                guildId
              )
            : cloneDefaultSettings(
                guildId
              )

        if (dashboardResponse?.ok) {
          const dashboardPayload =
            (await readJsonResponse<{
              guild?: {
                id?: string
                name?: string
                iconUrl?: string | null
              }
              name?: string
              iconUrl?: string | null
            }>(
              dashboardResponse
            )) ?? {}

          const loadedGuildName =
            dashboardPayload.guild?.name ??
            dashboardPayload.name

          const loadedGuildIcon =
            dashboardPayload.guild?.iconUrl ??
            dashboardPayload.iconUrl

          if (loadedGuildName) {
            setGuildName(loadedGuildName)
          }

          if (loadedGuildIcon !== undefined) {
            setGuildIconUrl(loadedGuildIcon)
          }
        }

        if (channelsResponse?.ok) {
          const channelsPayload =
            await readJsonResponse<
              | TicketChannelOption[]
              | {
                  channels?: TicketChannelOption[]
                }
            >(channelsResponse)

          const loadedChannels =
            Array.isArray(channelsPayload)
              ? channelsPayload
              : channelsPayload.channels ?? []

          setChannels(loadedChannels)
        }

        if (rolesResponse?.ok) {
          const rolesPayload =
            await readJsonResponse<
              | TicketRoleOption[]
              | {
                  roles?: TicketRoleOption[]
                }
            >(rolesResponse)

          const loadedRoles =
            Array.isArray(rolesPayload)
              ? rolesPayload
              : rolesPayload.roles ?? []

          setRoles(loadedRoles)
        }

        if (!cancelled) {
          const initialPanels =
            loadedPanels.length > 0
              ? loadedPanels
              : [loadedSettings]

          const clonedPanels =
            initialPanels.map((panel) =>
              cloneSettings(panel)
            )

          const savedPanelMap =
            Object.fromEntries(
              clonedPanels.map((panel) => [
                panel.panelId,
                cloneSettings(panel),
              ])
            )

          setPanels(clonedPanels)
          setSavedPanels(savedPanelMap)
          setActivePanelId(
            clonedPanels[0].panelId
          )
          setSettings(
            cloneSettings(clonedPanels[0])
          )
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load ticket settings."
          )

          const fallback =
            cloneDefaultSettings(
              guildId
            )

          const clonedFallback =
            cloneSettings(fallback)

          setPanels([clonedFallback])
          setActivePanelId(
            clonedFallback.panelId
          )
          setSettings(
            cloneSettings(clonedFallback)
          )
          setSavedPanels({
            [clonedFallback.panelId]:
              cloneSettings(clonedFallback),
          })
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadTicketBuilder()

    return () => {
      cancelled = true
    }
  }, [guildId])

  const hasChanges = useMemo(() => {
    const savedPanel =
      savedPanels[activePanelId]

    if (!savedPanel) {
      return true
    }

    return (
      JSON.stringify(settings) !==
      JSON.stringify(savedPanel)
    )
  }, [
    activePanelId,
    savedPanels,
    settings,
  ])

  async function saveChanges() {
    try {
      setSaving(true)
      setMessage(null)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/tickets`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            panel_key:
              settings.panelId,
            name: settings.name,
            enabled:
              settings.enabled,
            appearance:
              settings.appearance,
            channel_settings:
              settings.channels,
            permission_settings:
              settings.permissions,
            message_settings:
              settings.messages,
            advanced_settings:
              settings.advanced,
            categories: settings.categories.map(
              (category) => ({
                ...category,

                discord_category_id:
                  category.openCategoryId,

                open_discord_category_id:
                  category.openCategoryId,

                closed_discord_category_id:
                  category.closedCategoryId,

                 })
              ),


          }),
        }
      )

      const payload =
        await readJsonResponse<
          TicketPanelRow | ApiErrorResponse
        >(response)

      if (!response.ok) {
        const apiError =
          payload as ApiErrorResponse

        throw new Error(
          apiError.error ??
            apiError.message ??
            "Failed to save ticket settings."
        )
      }

      const saved =
        mapPanelRowToSettings(
          payload as TicketPanelRow,
          guildId
        )

      saved.categories =
        settings.categories.map(
          (category) => ({
            ...category,
            supportRoleIds: [
              ...category.supportRoleIds,
            ],
            mentionRoleIds: [
              ...category.mentionRoleIds,
            ],
          })
        )

      const clonedSaved =
        cloneSettings(saved)

      setSettings(clonedSaved)

      setPanels((current) =>
        current.map((panel) =>
          panel.panelId ===
          clonedSaved.panelId
            ? cloneSettings(clonedSaved)
            : panel
        )
      )

      setActivePanelId(
        clonedSaved.panelId
      )

      setMessage(
        "Ticket panel saved successfully."
      )
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save ticket settings."
      )
    } finally {
      setSaving(false)
    }
  }

  async function testPanel() {
    try {
      setTesting(true)
      setMessage(null)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/tickets`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "test",
            channelId: settings.channels.panelChannelId,
            settings,
          }),
        }
      )

      const payload =
        await readJsonResponse<
          {
            success?: boolean
            message?: string
          } & ApiErrorResponse
        >(response)

      if (!response.ok) {
        throw new Error(
          payload.error ??
            payload.message ??
            "Failed to test ticket panel."
        )
      }

      setMessage(
        payload.message ??
          "Test panel request sent successfully."
      )
    } catch (testError) {
      setError(
        testError instanceof Error
          ? testError.message
          : "Failed to test ticket panel."
      )
    } finally {
      setTesting(false)
    }
  }

  function insertVariable(
    token: string
  ) {
    if (activeTab === "panel") {
      setSettings((current) => ({
        ...current,
        appearance: {
          ...current.appearance,
          description:
            current.appearance.description +
            token,
        },
      }))

      return
    }

    if (activeTab === "messages") {
      setSettings((current) => ({
        ...current,
        messages: {
          ...current.messages,
          opening: {
            ...current.messages.opening,
            description:
              current.messages.opening.description +
              token,
          },
        },
      }))
    }
  }


  function syncActivePanel(
    nextSettings: TicketSystemSettings
  ) {
    setPanels((current) =>
      current.map((panel) =>
        panel.panelId ===
        activePanelId
          ? cloneSettings(nextSettings)
          : panel
      )
    )
  }

useEffect(() => {
  if (!activePanelId) {
    return
  }

  setPanels((current) =>
    current.map((panel) =>
      panel.panelId === activePanelId
        ? cloneSettings(settings)
        : panel
    )
  )
}, [settings, activePanelId])

  function selectPanel(panelId: string) {
    syncActivePanel(settings)

    const selectedPanel =
      panels.find(
        (panel) =>
          panel.panelId === panelId
      )

    if (!selectedPanel) {
      return
    }

    setActivePanelId(panelId)
    setSettings(
      cloneSettings(selectedPanel)
    )
    setMessage(null)
    setError(null)
  }

  function createPanel() {
    syncActivePanel(settings)

    const panelNumber =
      panels.length + 1

    const newPanel =
      cloneDefaultSettings(guildId)

    newPanel.panelId =
      createPanelKey(
        `panel-${panelNumber}`
      )

    newPanel.name =
      `Ticket Panel ${panelNumber}`

    newPanel.appearance = {
      ...newPanel.appearance,
      title:
        `Ticket Panel ${panelNumber}`,
    }

    const clonedPanel =
      cloneSettings(newPanel)

setSavedPanels((current) => ({
  ...current,
  [clonedPanel.panelId]:
    cloneSettings(clonedPanel),
}))

    setPanels((current) => [
      ...current,
      clonedPanel,
    ])

    setActivePanelId(
      clonedPanel.panelId
    )

    setSettings(
      cloneSettings(clonedPanel)
    )

    setActiveTab("panel")
    setMessage(
      "New panel created. Configure it, then press Save Changes."
    )
    setError(null)
  }

  function duplicatePanel(
    panelId: string
  ) {
    syncActivePanel(settings)

    const sourcePanel =
      panelId === activePanelId
        ? settings
        : panels.find(
            (panel) =>
              panel.panelId === panelId
          )

    if (!sourcePanel) {
      return
    }

    const duplicatedPanel =
      cloneSettings(sourcePanel)

    duplicatedPanel.panelId =
      createPanelKey(
        `${sourcePanel.panelId}-copy`
      )

    duplicatedPanel.name =
      `${sourcePanel.name} Copy`

    duplicatedPanel.createdAt = null
    duplicatedPanel.updatedAt = null

    setPanels((current) => [
      ...current,
      duplicatedPanel,
    ])

    setActivePanelId(
      duplicatedPanel.panelId
    )

    setSettings(
      cloneSettings(duplicatedPanel)
    )

    setActiveTab("panel")
    setMessage(
      "Panel duplicated. Press Save Changes to store it."
    )
    setError(null)
  }

  function deletePanel(
    panelId: string
  ) {
    if (panels.length <= 1) {
      setError(
        "You must keep at least one ticket panel."
      )
      return
    }

    const remainingPanels =
      panels.filter(
        (panel) =>
          panel.panelId !== panelId
      )

    const nextPanel =
      remainingPanels[0]

    setPanels(remainingPanels)

    setSavedPanels((current) => {
      const next = {
        ...current,
      }

      delete next[panelId]

      return next
    })

    if (
      activePanelId === panelId
    ) {
      setActivePanelId(
        nextPanel.panelId
      )
      setSettings(
        cloneSettings(nextPanel)
      )
    }

    setMessage(
      "Panel removed locally."
    )
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-7 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading ticket system...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-5 py-7 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Ticket className="size-5" />
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Ticket System Builder
                </h1>

                {hasChanges && (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                    Unsaved changes
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Create and customize the
                ticket panel members will
                use inside your server.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                void testPanel()
              }
              disabled={
                testing || saving
              }
              className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {testing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}

              Test Panel
            </button>

            <button
              type="button"
              onClick={() =>
                void saveChanges()
              }
              disabled={
                saving ||
                testing ||
                !hasChanges
              }
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              Save Changes
            </button>
          </div>
        </header>

<section className="mt-7 rounded-2xl border border-border bg-card p-4">
          <div className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)_auto] xl:items-center">
            <div>
              <h2 className="text-sm font-bold">
                Panels
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Manage multiple ticket panels for your server.
              </p>
            </div>

            <div className="flex min-w-0 gap-3 overflow-x-auto pb-1">
              {panels.map((panel) => {
                const selected =
                  activePanelId ===
                  panel.panelId

                return (
                  <div
                    key={panel.panelId}
                    className={`group relative min-w-[190px] rounded-xl border transition ${
                      selected
                        ? "border-primary bg-primary/10 shadow-[0_0_22px_rgba(124,58,237,0.16)]"
                        : "border-border bg-background/30 hover:border-primary/40 hover:bg-muted/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        selectPanel(
                          panel.panelId
                        )
                      }
                      className="w-full px-4 py-3 text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {panel.name}
                          </p>

                          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span>
                              {
                                panel
                                  .categories
                                  .length
                              }{" "}
                              Categories
                            </span>

                            <span
                              className={`size-1.5 rounded-full ${
                                panel.enabled
                                  ? "bg-emerald-400"
                                  : "bg-red-400"
                              }`}
                            />
                          </div>
                        </div>

                        {selected && (
                          <span className="rounded-md bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary">
                            Active
                          </span>
                        )}
                      </div>
                    </button>

                    <div className="flex border-t border-border/70 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() =>
                          duplicatePanel(
                            panel.panelId
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-bl-xl py-2 text-[11px] text-muted-foreground transition hover:bg-muted/30 hover:text-foreground"
                      >
                        <Copy className="size-3.5" />
                        Duplicate
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deletePanel(
                            panel.panelId
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-br-xl border-l border-border/70 py-2 text-[11px] text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={createPanel}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="size-4" />
              New Panel
            </button>
          </div>
        </section>
        <div className="mt-7 rounded-2xl border border-border bg-card p-2">
          <TicketBuilderTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="mt-5 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <main className="min-w-0 space-y-5">
            {activeTab === "panel" && (
              <TicketPanelSetup
                value={
                  settings.appearance
                }
                channels={channels}
                onChange={(appearance) =>
                  setSettings(
                    (current) => ({
                      ...current,
                      appearance,
                    })
                  )
                }
              />
            )}

            {activeTab ===
              "categories" && (
              <TicketCategoriesTab
                value={
                  settings.categories
                }
                channels={channels}
                roles={roles}
                onChange={(categories) =>
                  setSettings(
                    (current) => ({
                      ...current,
                      categories,
                    })
                  )
                }
              />
            )}

            {activeTab ===
              "permissions" && (
              <TicketPermissionsTab
                channels={channels}
                roles={roles}
                channelSettings={
                  settings.channels
                }
                permissionSettings={
                  settings.permissions
                }
                onChannelSettingsChange={(
                  channelSettings
                ) =>
                  setSettings(
                    (current) => ({
                      ...current,
                      channels:
                        channelSettings,
                    })
                  )
                }
                onPermissionSettingsChange={(
                  permissionSettings
                ) =>
                  setSettings(
                    (current) => ({
                      ...current,
                      permissions:
                        permissionSettings,
                    })
                  )
                }
              />
            )}

            {activeTab ===
              "messages" && (
              <TicketMessagesTab
                value={
                  settings.messages
                }
                onChange={(messages) =>
                  setSettings(
                    (current) => ({
                      ...current,
                      messages,
                    })
                  )
                }
              />
            )}

            {activeTab ===
              "advanced" && (
              <TicketAdvancedTab
                value={
                  settings.advanced
                }
                channels={channels}
                roles={roles}
                onChange={(advanced) =>
                  setSettings(
                    (current) => ({
                      ...current,
                      advanced,
                    })
                  )
                }
              />
            )}

            {message && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
                {error}
              </div>
            )}
          </main>

          <aside className="space-y-5 xl:self-start">
            <TicketPanelPreview
              guildName={guildName}
              guildIconUrl={
                guildIconUrl
              }
              appearance={
                settings.appearance
              }
              categories={
                settings.categories
              }
            />

            <TicketVariables
              onInsert={
                insertVariable
              }
            />
          </aside>
        </div>
      </div>
    </div>
  )
}