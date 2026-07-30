import { NextRequest, NextResponse } from "next/server"

import supabase from "@/lib/supabase"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{
    guildId: string
  }>
}

type CustomLogInput = {
  eventKey?: string
  enabled?: boolean
  channelId?: string
  embedColor?: string
  mentionRoleId?: string | null
  ignoreBots?: boolean
  ignoreWebhooks?: boolean
  saveAttachments?: boolean
  saveImages?: boolean
  aiSummary?: boolean
  compactMode?: boolean
}

type PostBody = {
  action?: "test"
  eventKey?: string
  settings?: CustomLogInput
}

type CustomLogRow = {
  id: string
  guild_id: string
  event_key: string
  enabled: boolean
  channel_id: string | null
  embed_color: string
  mention_role_id: string | null
  ignore_bots: boolean
  ignore_webhooks: boolean
  save_attachments: boolean
  save_images: boolean
  ai_summary: boolean
  compact_mode: boolean
  created_at: string
  updated_at: string
}

const DISCORD_API_BASE = "https://discord.com/api/v10"

function getBotToken() {
  return (
    process.env.DISCORD_BOT_TOKEN ??
    process.env.DISCORD_TOKEN ??
    process.env.BOT_TOKEN ??
    ""
  )
}

function jsonError(message: string, status = 400) {
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

function normalizeHexColor(value?: string) {
  const fallback = "#7C3AED"
  const normalized = value?.trim() || fallback

  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    return fallback
  }

  return normalized.toUpperCase()
}

function hexToDecimal(value?: string) {
  return Number.parseInt(
    normalizeHexColor(value).replace("#", ""),
    16
  )
}

function mapRow(row: CustomLogRow) {
  return {
    id: row.id,
    guildId: row.guild_id,
    eventKey: row.event_key,
    enabled: row.enabled,
    channelId: row.channel_id ?? "",
    embedColor: row.embed_color,
    mentionRoleId: row.mention_role_id,
    ignoreBots: row.ignore_bots,
    ignoreWebhooks: row.ignore_webhooks,
    saveAttachments: row.save_attachments,
    saveImages: row.save_images,
    aiSummary: row.ai_summary,
    compactMode: row.compact_mode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function sendDiscordMessage(
  channelId: string,
  payload: Record<string, unknown>
) {
  const botToken = getBotToken()

  if (!botToken) {
    throw new Error(
      "Discord bot token is missing. Add DISCORD_BOT_TOKEN or DISCORD_TOKEN to the web project's .env file."
    )
  }

  const response = await fetch(
    `${DISCORD_API_BASE}/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  )

  const text = await response.text()

  let data: Record<string, unknown> = {}

  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>
    } catch {
      data = {
        message: text,
      }
    }
  }

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : `Discord returned ${response.status}.`

    throw new Error(message)
  }

  return data
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } = await params

    const { data, error } = await supabase
      .from("custom_log_settings")
      .select("*")
      .eq("guild_id", guildId)
      .order("event_key", {
        ascending: true,
      })

    if (error) {
      return jsonError(error.message, 500)
    }

    const rows = (data ?? []) as CustomLogRow[]

    return NextResponse.json({
      success: true,
      settings: rows.map(mapRow),
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to load custom log settings.",
      500
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } = await params
    const body = (await request.json()) as CustomLogInput

    const eventKey =
      typeof body.eventKey === "string"
        ? body.eventKey.trim()
        : ""

    if (!eventKey) {
      return jsonError("eventKey is required.")
    }

    const channelId =
      typeof body.channelId === "string"
        ? body.channelId.trim()
        : ""

    const row = {
      guild_id: guildId,
      event_key: eventKey,
      enabled: body.enabled ?? false,
      channel_id: channelId || null,
      embed_color: normalizeHexColor(body.embedColor),
      mention_role_id:
        typeof body.mentionRoleId === "string" &&
        body.mentionRoleId.trim()
          ? body.mentionRoleId.trim()
          : null,
      ignore_bots: body.ignoreBots ?? true,
      ignore_webhooks: body.ignoreWebhooks ?? true,
      save_attachments: body.saveAttachments ?? true,
      save_images: body.saveImages ?? true,
      ai_summary: body.aiSummary ?? false,
      compact_mode: body.compactMode ?? false,
    }

    const { data, error } = await supabase
      .from("custom_log_settings")
      .upsert(row, {
        onConflict: "guild_id,event_key",
      })
      .select("*")
      .single()

    if (error || !data) {
      return jsonError(
        error?.message ??
          "Failed to save custom log settings.",
        500
      )
    }

    return NextResponse.json({
      success: true,
      message: "Custom log settings saved successfully.",
      setting: mapRow(data as CustomLogRow),
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to save custom log settings.",
      500
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } = await params
    const body = (await request.json()) as PostBody

    if (body.action !== "test") {
      return jsonError("Unknown action.")
    }

    const eventKey =
      typeof body.eventKey === "string"
        ? body.eventKey.trim()
        : ""

    if (!eventKey) {
      return jsonError("eventKey is required.")
    }

    let settings = body.settings

    if (!settings?.channelId) {
      const { data, error } = await supabase
        .from("custom_log_settings")
        .select("*")
        .eq("guild_id", guildId)
        .eq("event_key", eventKey)
        .maybeSingle()

      if (error) {
        return jsonError(error.message, 500)
      }

      if (data) {
        const row = data as CustomLogRow

        settings = {
          eventKey: row.event_key,
          enabled: row.enabled,
          channelId: row.channel_id ?? "",
          embedColor: row.embed_color,
          mentionRoleId: row.mention_role_id,
          ignoreBots: row.ignore_bots,
          ignoreWebhooks: row.ignore_webhooks,
          saveAttachments: row.save_attachments,
          saveImages: row.save_images,
          aiSummary: row.ai_summary,
          compactMode: row.compact_mode,
        }
      }
    }

    const channelId =
      typeof settings?.channelId === "string"
        ? settings.channelId.trim()
        : ""

    if (!channelId) {
      return jsonError(
        "Select a Log Channel before sending a test log."
      )
    }

    const mentionRoleId =
      typeof settings?.mentionRoleId === "string"
        ? settings.mentionRoleId.trim()
        : ""

    const now = new Date()

    const payload = {
      content: mentionRoleId
        ? `<@&${mentionRoleId}>`
        : undefined,
      embeds: [
        {
          title: "TOX Custom Log Test",
          description:
            "This is a real test message from the TOX Custom Logs system.",
          color: hexToDecimal(settings?.embedColor),
          fields: [
            {
              name: "Event",
              value: eventKey,
              inline: true,
            },
            {
              name: "Server ID",
              value: guildId,
              inline: true,
            },
            {
              name: "Channel ID",
              value: channelId,
              inline: false,
            },
            {
              name: "Status",
              value:
                "The dashboard, Discord API and selected channel are connected successfully.",
              inline: false,
            },
          ],
          footer: {
            text: "TOX Event System • Test Log",
          },
          timestamp: now.toISOString(),
        },
      ],
      allowed_mentions: {
        roles: mentionRoleId ? [mentionRoleId] : [],
        parse: [],
      },
    }

    const discordMessage = await sendDiscordMessage(
      channelId,
      payload
    )

    return NextResponse.json({
      success: true,
      message: "Test log sent successfully.",
      channelId,
      discordMessageId:
        typeof discordMessage.id === "string"
          ? discordMessage.id
          : null,
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to send the test log.",
      500
    )
  }
}