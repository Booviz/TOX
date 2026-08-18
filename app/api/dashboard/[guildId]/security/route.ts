import { NextRequest, NextResponse } from "next/server"

import supabase from "@/lib/supabase"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ guildId: string }>
}

type SecuritySettingsInput = {
  protectionEnabled?: boolean
  protectionLevel?: string
  antiRaid?: Record<string, unknown>
  antiNuke?: Record<string, unknown>
  antiBot?: Record<string, unknown>
  antiSpam?: Record<string, unknown>
  whitelist?: Record<string, unknown>
}

type SecuritySettingsRow = {
  guild_id: string
  protection_enabled: boolean
  protection_level: string
  anti_raid: Record<string, unknown> | null
  anti_nuke: Record<string, unknown> | null
  anti_bot: Record<string, unknown> | null
  anti_spam: Record<string, unknown> | null
  whitelist: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

const defaults = {
  protectionEnabled: true,
  protectionLevel: "high",
  antiRaid: {
    enabled: true,
    joinLimit: 10,
    windowSeconds: 10,
    minimumAccountAgeDays: 7,
    automaticLockdown: true,
    lockdownDurationMinutes: 5,
    raiseVerificationLevel: true,
    disableInvitesOnRaid: true,
    enableSlowmodeOnRaid: true,
    alertStaffOnRaid: true,
    ignoreWhitelistedMembers: true,
    alertChannelId: "",
    punishment: "quarantine",
  },
  antiNuke: { rules: [] },
  antiBot: { enabled: true },
  antiSpam: { enabled: true },
  whitelist: {
    users: [],
    roles: [],
    bots: [],
    channels: [],
  },
}

function jsonError(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  )
}

function asObject(value: unknown) {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function mapRow(row: SecuritySettingsRow) {
  return {
    guildId: row.guild_id,
    protectionEnabled: row.protection_enabled,
    protectionLevel: row.protection_level,
    antiRaid: row.anti_raid ?? {},
    antiNuke: row.anti_nuke ?? {},
    antiBot: row.anti_bot ?? {},
    antiSpam: row.anti_spam ?? {},
    whitelist: row.whitelist ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { guildId } = await params

    if (!guildId) {
      return jsonError("guildId is required.")
    }

    const { data, error } = await supabase
      .from("security_settings")
      .select("*")
      .eq("guild_id", guildId)
      .maybeSingle()

    if (error) {
      return jsonError(error.message, 500)
    }

    if (!data) {
      const now = new Date().toISOString()

      const { data: created, error: createError } =
        await supabase
          .from("security_settings")
          .insert({
            guild_id: guildId,
            protection_enabled: defaults.protectionEnabled,
            protection_level: defaults.protectionLevel,
            anti_raid: defaults.antiRaid,
            anti_nuke: defaults.antiNuke,
            anti_bot: defaults.antiBot,
            anti_spam: defaults.antiSpam,
            whitelist: defaults.whitelist,
            created_at: now,
            updated_at: now,
          })
          .select("*")
          .single()

      if (createError || !created) {
        return jsonError(
          createError?.message ??
            "Failed to create default security settings.",
          500
        )
      }

      return NextResponse.json({
        success: true,
        settings: mapRow(created as SecuritySettingsRow),
      })
    }

    return NextResponse.json({
      success: true,
      settings: mapRow(data as SecuritySettingsRow),
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to load security settings.",
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

    if (!guildId) {
      return jsonError("guildId is required.")
    }

    const body =
      (await request.json()) as SecuritySettingsInput

    const row = {
      guild_id: guildId,
      protection_enabled: body.protectionEnabled ?? true,
      protection_level:
        typeof body.protectionLevel === "string" &&
        body.protectionLevel.trim()
          ? body.protectionLevel.trim()
          : "high",
      anti_raid: asObject(body.antiRaid),
      anti_nuke: asObject(body.antiNuke),
      anti_bot: asObject(body.antiBot),
      anti_spam: asObject(body.antiSpam),
      whitelist: asObject(body.whitelist),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("security_settings")
      .upsert(row, { onConflict: "guild_id" })
      .select("*")
      .single()

    if (error || !data) {
      return jsonError(
        error?.message ??
          "Failed to save security settings.",
        500
      )
    }

    return NextResponse.json({
      success: true,
      message: "Security settings saved successfully.",
      settings: mapRow(data as SecuritySettingsRow),
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to save security settings.",
      500
    )
  }
}