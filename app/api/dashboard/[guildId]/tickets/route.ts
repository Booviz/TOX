import { NextRequest, NextResponse } from "next/server"

import supabase from "@/lib/supabase"

type RouteContext = {
  params: Promise<{
    guildId: string
  }>
}

type TicketCategoryInput = {
  id?: string
  name?: string
  description?: string
  emoji?: string
  color?: string
  buttonStyle?: string
  enabled?: boolean
  openCategoryId?: string
  closedCategoryId?: string
  supportRoleIds?: string[]
  mentionRoleIds?: string[]
  ticketNameTemplate?: string
  openingMessage?: string
  maxOpenTicketsPerUser?: number
  requireReason?: boolean
  requireConfirmation?: boolean
  position?: number
}

type TicketSettingsInput = {
  panelId?: string
  name?: string
  enabled?: boolean

  appearance?: {
    title?: string
    description?: string
    color?: string
    imageEnabled?: boolean
    imageUrl?: string
    thumbnailEnabled?: boolean
    thumbnailUrl?: string
    footerEnabled?: boolean
    footerText?: string
    footerIconUrl?: string
    timestampEnabled?: boolean
    showCategories?: boolean
    useSelectMenu?: boolean
    panelStyle?: string
  }

  categories?: TicketCategoryInput[]

  channels?: {
    panelChannelId?: string
    existingTicketChannelId?: string
    openCategoryId?: string
    closedCategoryId?: string
    ticketNameTemplate?: string
    syncCategoryPermissions?: boolean
    privateByDefault?: boolean
    hideFromEveryone?: boolean
  }

  permissions?: Record<string, unknown>
  messages?: Record<string, unknown>
  advanced?: Record<string, unknown>
}

type PostBody = {
  action?: "test" | "publish"
  channelId?: string
  settings?: TicketSettingsInput
}

const DISCORD_API_BASE =
  "https://discord.com/api/v10"

function getBotToken() {
  return (
    process.env.DISCORD_BOT_TOKEN ??
    process.env.BOT_TOKEN ??
    process.env.DISCORD_TOKEN ??
    ""
  )
}

function jsonError(
  message: string,
  status = 400
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
    }
  )
}

function normalizeHexColor(
  value?: string
) {
  const fallback = 0x9b4dff

  if (!value) {
    return fallback
  }

  const normalized =
    value.trim().replace("#", "")

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      normalized
    )
  ) {
    return fallback
  }

  return Number.parseInt(
    normalized,
    16
  )
}

function replacePreviewVariables(
  value: string | undefined,
  guildName = "TOX COMMUNITY"
) {
  if (!value) {
    return ""
  }

  const variables: Record<
    string,
    string
  > = {
    "{user}": "Test Member",
    "{username}": "test_member",
    "{mention}": "@Test Member",
    "{userId}": "123456789012345678",
    "{server}": guildName,
    "{serverName}": guildName,
    "{serverIcon}": "",
    "{guildId}":
      "123456789012345678",
    "{memberCount}": "421",
    "{channel}": "#ticket-0247",
    "{ticketNumber}": "0247",
    "{ticketId}": "TKT-0247",
    "{category}": "Support",
    "{reason}":
      "Testing the ticket panel.",
    "{staff}": "@Support Team",
    "{date}": "19/07/2026",
    "{time}": "03:24 PM",
  }

  let output = value

  for (const [
    token,
    replacement,
  ] of Object.entries(variables)) {
    output = output
      .split(token)
      .join(replacement)
  }

  return output
}

function getButtonStyle(
  value?: string
) {
  switch (value) {
    case "secondary":
      return 2
    case "success":
      return 3
    case "danger":
      return 4
    default:
      return 1
  }
}

function buildLegacyComponents(
  settings: TicketSettingsInput,
  disabled: boolean
) {
  const appearance =
    settings.appearance ?? {}

  if (
    appearance.showCategories ===
    false
  ) {
    return []
  }

  const categories = (
    settings.categories ?? []
  )
    .filter(
      (category) =>
        category.enabled !== false
    )
    .sort(
      (a, b) =>
        (a.position ?? 0) -
        (b.position ?? 0)
    )
    .slice(0, 25)

  if (categories.length === 0) {
    return []
  }

  if (
    appearance.useSelectMenu
  ) {
    return [
      {
        type: 1,
        components: [
          {
            type: 3,
            custom_id:
              "tox_ticket_test_select",
            placeholder:
              "Select a ticket category",
            min_values: 1,
            max_values: 1,
            disabled,
            options: categories.map(
              (
                category,
                index
              ) => ({
                label:
                  category.name?.slice(
                    0,
                    100
                  ) ||
                  `Category ${index + 1}`,
                value:
                  category.id ||
                  `category-${index + 1}`,
                description:
                  category.description?.slice(
                    0,
                    100
                  ) || undefined,
                emoji:
                  category.emoji
                    ? {
                        name:
                          category.emoji,
                      }
                    : undefined,
              })
            ),
          },
        ],
      },
    ]
  }

  const rows: Array<{
    type: number
    components: unknown[]
  }> = []

  for (
    let index = 0;
    index < categories.length;
    index += 5
  ) {
    const chunk =
      categories.slice(
        index,
        index + 5
      )

    rows.push({
      type: 1,
      components: chunk.map(
        (
          category,
          chunkIndex
        ) => ({
          type: 2,
          style: getButtonStyle(
            category.buttonStyle
          ),
          custom_id:
            `tox_ticket_test_${category.id ?? index + chunkIndex}`,
          label:
            category.name?.slice(
              0,
              80
            ) ||
            `Category ${
              index +
              chunkIndex +
              1
            }`,
          emoji:
            category.emoji
              ? {
                  name:
                    category.emoji,
                }
              : undefined,
          disabled,
        })
      ),
    })
  }

  return rows.slice(0, 5)
}

function buildDiscordPayload(
  settings: TicketSettingsInput,
  guildName = "TOX COMMUNITY",
  testMode = true
) {
  const appearance =
    settings.appearance ?? {}

  const embed: Record<
    string,
    unknown
  > = {
    title:
      replacePreviewVariables(
        appearance.title,
        guildName
      ) || "Ticket System",
    description:
      replacePreviewVariables(
        appearance.description,
        guildName
      ) ||
      "Choose the appropriate ticket category.",
    color: normalizeHexColor(
      appearance.color
    ),
  }

  if (
    appearance.imageEnabled &&
    appearance.imageUrl
  ) {
    embed.image = {
      url: replacePreviewVariables(
        appearance.imageUrl,
        guildName
      ),
    }
  }

  if (
    appearance.thumbnailEnabled &&
    appearance.thumbnailUrl
  ) {
    const thumbnail =
      replacePreviewVariables(
        appearance.thumbnailUrl,
        guildName
      )

    if (
      thumbnail.startsWith("http")
    ) {
      embed.thumbnail = {
        url: thumbnail,
      }
    }
  }

  if (
    appearance.footerEnabled &&
    appearance.footerText
  ) {
    const footer: Record<
      string,
      string
    > = {
      text:
        replacePreviewVariables(
          appearance.footerText,
          guildName
        ),
    }

    const footerIcon =
      replacePreviewVariables(
        appearance.footerIconUrl,
        guildName
      )

    if (
      footerIcon.startsWith(
        "http"
      )
    ) {
      footer.icon_url =
        footerIcon
    }

    embed.footer = footer
  }

  if (
    appearance.timestampEnabled
  ) {
    embed.timestamp =
      new Date().toISOString()
  }

  return {
    content: undefined,
    
    embeds: [embed],
    components:
      buildLegacyComponents(
        settings,
        testMode
      ),
    allowed_mentions: {
      parse: [],
    },
  }
}

async function sendDiscordMessage(
  channelId: string,
  payload: Record<
    string,
    unknown
  >
) {
  const botToken =
    getBotToken()

  if (!botToken) {
    throw new Error(
      "Discord bot token is missing. Add DISCORD_BOT_TOKEN to the web project's .env file."
    )
  }

  const response = await fetch(
    `${DISCORD_API_BASE}/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bot ${botToken}`,
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        payload
      ),
      cache: "no-store",
    }
  )

  const text =
    await response.text()

  let data: Record<
    string,
    unknown
  > = {}

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = {
        message: text,
      }
    }
  }

  if (!response.ok) {
    const discordMessage =
      typeof data.message ===
      "string"
        ? data.message
        : `Discord returned ${response.status}.`

    throw new Error(
      discordMessage
    )
  }

  return data
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } =
      await params

    const {
      data,
      error,
    } = await supabase
      .from("ticket_panels")
      .select(
        "*, ticket_categories(*)"
      )
      .eq(
        "guild_id",
        guildId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      )

    if (error) {
      return jsonError(
        error.message,
        500
      )
    }

    return NextResponse.json(
      data ?? []
    )
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to load ticket settings.",
      500
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } =
      await params

    const body =
      (await request.json()) as {
        panel_key?: string
        name?: string
        enabled?: boolean
        appearance?: TicketSettingsInput["appearance"]
        channel_settings?: TicketSettingsInput["channels"]
        permission_settings?: TicketSettingsInput["permissions"]
        message_settings?: TicketSettingsInput["messages"]
        advanced_settings?: TicketSettingsInput["advanced"]
        categories?: TicketCategoryInput[]
      }

    const panelKey =
      body.panel_key ??
      "default-panel"

    const {
      data: panel,
      error: panelError,
    } = await supabase
      .from("ticket_panels")
      .upsert(
        {
          guild_id: guildId,
          panel_key: panelKey,
          name:
            body.name ??
            "Ticket System",
          enabled:
            body.enabled ??
            true,
          panel_channel_id:
            body.channel_settings
              ?.panelChannelId ??
            null,
          appearance:
            body.appearance ?? {},
          channel_settings:
            body.channel_settings ??
            {},
          permission_settings:
            body.permission_settings ??
            {},
          message_settings:
            body.message_settings ??
            {},
          advanced_settings:
            body.advanced_settings ??
            {},
        },
        {
          onConflict:
            "guild_id,panel_key",
        }
      )
      .select()
      .single()

    if (
      panelError ||
      !panel
    ) {
      return jsonError(
        panelError?.message ??
          "Failed to save ticket panel.",
        500
      )
    }

    if (
      Array.isArray(
        body.categories
      )
    ) {
      const {
        error: deleteError,
      } = await supabase
        .from(
          "ticket_categories"
        )
        .delete()
        .eq(
          "panel_id",
          panel.id
        )

      if (deleteError) {
        return jsonError(
          deleteError.message,
          500
        )
      }

      if (
        body.categories.length >
        0
      ) {
        const categoryRows =
          body.categories.map(
            (
              category,
              index
            ) => ({
              panel_id:
                panel.id,
              category_key:
                category.id ??
                `category-${index + 1}`,
              name:
                category.name ??
                `Category ${index + 1}`,
              description:
                category.description ??
                "",
              emoji:
                category.emoji ??
                "🎫",
              color:
                category.color ??
                "purple",
              button_style:
                category.buttonStyle ??
                "primary",
              enabled:
                category.enabled ??
                true,
              discord_category_id:
                category.openCategoryId ||
                null,
              open_discord_category_id:
                category.openCategoryId ||
                null,
              closed_discord_category_id:
                category.closedCategoryId ||
                null,
              support_role_ids:
                category.supportRoleIds ??
                [],
              mention_role_ids:
                category.mentionRoleIds ??
                [],
              ticket_name_template:
                category.ticketNameTemplate ??
                "ticket-{ticketNumber}",
              opening_message:
                category.openingMessage ??
                "",
              max_open_tickets_per_user:
                category.maxOpenTicketsPerUser ??
                1,
              require_reason:
                category.requireReason ??
                true,
              require_confirmation:
                category.requireConfirmation ??
                false,
              position:
                category.position ??
                index,
            })
          )

        const {
          error:
            categoryError,
        } = await supabase
          .from(
            "ticket_categories"
          )
          .insert(categoryRows)

        if (
          categoryError
        ) {
          return jsonError(
            categoryError.message,
            500
          )
        }
      }
    }

    const {
      data: savedPanel,
      error:
        savedPanelError,
    } = await supabase
      .from("ticket_panels")
      .select(
        "*, ticket_categories(*)"
      )
      .eq(
        "id",
        panel.id
      )
      .single()

    if (
      savedPanelError
    ) {
      return jsonError(
        savedPanelError.message,
        500
      )
    }

    return NextResponse.json(
      savedPanel
    )
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to save ticket settings.",
      500
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } =
      await params

    const body =
      (await request.json()) as PostBody

    if (
      !body.action
    ) {
      return jsonError(
        "Action is required."
      )
    }

    const settings =
      body.settings ?? {}

    let channelId =
      body.channelId ??
      settings.channels?.panelChannelId ??
      ""

    // If the current page state did not include the channel,
    // fall back to the panel saved in Supabase.
    if (!channelId) {
      const panelKey =
        settings.panelId ??
        "default-panel"

      const {
        data: savedPanel,
        error: savedPanelError,
      } = await supabase
        .from("ticket_panels")
        .select(
          "panel_channel_id, channel_settings"
        )
        .eq("guild_id", guildId)
        .eq("panel_key", panelKey)
        .maybeSingle()

      if (savedPanelError) {
        return jsonError(
          savedPanelError.message,
          500
        )
      }

      const savedChannelSettings =
        savedPanel?.channel_settings &&
        typeof savedPanel.channel_settings ===
          "object"
          ? (savedPanel.channel_settings as {
              panelChannelId?: string
            })
          : {}

      channelId =
        savedPanel?.panel_channel_id ??
        savedChannelSettings.panelChannelId ??
        ""
    }

    if (!channelId) {
      return jsonError(
        "Panel Channel is empty. Open Channel & Permissions, select a text channel, press Save Changes, then try Test Panel again."
      )
    }

    if (
      body.action ===
      "test"
    ) {
      const payload =
        buildDiscordPayload(
          settings,
          "TOX COMMUNITY",
          false
        )

      const message =
        await sendDiscordMessage(
          channelId,
          payload
        )

      return NextResponse.json({
        success: true,
        message:
          "Test panel sent successfully.",
        guildId,
        channelId,
        discordMessageId:
          typeof message.id ===
          "string"
            ? message.id
            : null,
      })
    }

    if (
      body.action ===
      "publish"
    ) {
      const payload =
        buildDiscordPayload(
          settings,
          "TOX COMMUNITY",
          false
        )

      const message =
        await sendDiscordMessage(
          channelId,
          payload
        )

      return NextResponse.json({
        success: true,
        message:
          "Ticket panel published successfully.",
        guildId,
        channelId,
        discordMessageId:
          typeof message.id ===
          "string"
            ? message.id
            : null,
      })
    }

    return jsonError(
      "Unknown action."
    )
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to send ticket panel.",
      500
    )
  }
}