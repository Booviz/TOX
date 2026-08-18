import { NextRequest, NextResponse } from "next/server"

import supabase from "@/lib/supabase"

export const dynamic = "force-dynamic"

const BOT_API_URL =
  process.env.TOX_BOT_API_URL ??
  process.env.TOX_API_URL ??
  "http://127.0.0.1:3002"

type RouteContext = {
  params: Promise<{
    guildId: string
  }>
}

type LevelRewardInput = {
  level: number
  roleId: string
  enabled?: boolean
}

type LevelSettingsInput = {
  enabled?: boolean
  minXp?: number
  maxXp?: number
  cooldownSeconds?: number
  ignoreBots?: boolean
  ignoreCommands?: boolean
  voiceXpEnabled?: boolean
  antiFarmingEnabled?: boolean
  ignoredChannelIds?: string[]
  ignoredRoleIds?: string[]
  levelUpMessageEnabled?: boolean
  levelUpChannelId?: string | null
  levelUpMessage?: string
  mentionUser?: boolean
  showRank?: boolean
  showXp?: boolean
  sendAsDm?: boolean
  rewards?: LevelRewardInput[]
}

type BotMember = {
  id: string
  username?: string
  displayName?: string
  avatar?: string | null
}

type BotMembersResponse = {
  success?: boolean
  error?: string
  members?: BotMember[]
}

const DEFAULT_SETTINGS = {
  enabled: true,
  minXp: 15,
  maxXp: 25,
  cooldownSeconds: 60,
  ignoreBots: true,
  ignoreCommands: true,
  voiceXpEnabled: false,
  antiFarmingEnabled: true,
  ignoredChannelIds: [] as string[],
  ignoredRoleIds: [] as string[],
  levelUpMessageEnabled: true,
  levelUpChannelId: null as string | null,
  levelUpMessage:
    "🎉 Congratulations {user}! You reached Level {level}.",
  mentionUser: true,
  showRank: true,
  showXp: true,
  sendAsDm: false,
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

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
}

function mapSettings(row: Record<string, unknown> | null) {
  if (!row) {
    return DEFAULT_SETTINGS
  }

  return {
    enabled:
      typeof row.enabled === "boolean"
        ? row.enabled
        : DEFAULT_SETTINGS.enabled,

    minXp:
      typeof row.min_xp === "number"
        ? row.min_xp
        : DEFAULT_SETTINGS.minXp,

    maxXp:
      typeof row.max_xp === "number"
        ? row.max_xp
        : DEFAULT_SETTINGS.maxXp,

    cooldownSeconds:
      typeof row.cooldown_seconds === "number"
        ? row.cooldown_seconds
        : DEFAULT_SETTINGS.cooldownSeconds,

    ignoreBots:
      typeof row.ignore_bots === "boolean"
        ? row.ignore_bots
        : DEFAULT_SETTINGS.ignoreBots,

    ignoreCommands:
      typeof row.ignore_commands === "boolean"
        ? row.ignore_commands
        : DEFAULT_SETTINGS.ignoreCommands,

    voiceXpEnabled:
      typeof row.voice_xp_enabled === "boolean"
        ? row.voice_xp_enabled
        : DEFAULT_SETTINGS.voiceXpEnabled,

    antiFarmingEnabled:
      typeof row.anti_farming_enabled === "boolean"
        ? row.anti_farming_enabled
        : DEFAULT_SETTINGS.antiFarmingEnabled,

    ignoredChannelIds:
      toStringArray(row.ignored_channel_ids),

    ignoredRoleIds:
      toStringArray(row.ignored_role_ids),

    levelUpMessageEnabled:
      typeof row.level_up_message_enabled === "boolean"
        ? row.level_up_message_enabled
        : DEFAULT_SETTINGS.levelUpMessageEnabled,

    levelUpChannelId:
      typeof row.level_up_channel_id === "string"
        ? row.level_up_channel_id
        : null,

    levelUpMessage:
      typeof row.level_up_message === "string" &&
      row.level_up_message.trim()
        ? row.level_up_message
        : DEFAULT_SETTINGS.levelUpMessage,

    mentionUser:
      typeof row.mention_user === "boolean"
        ? row.mention_user
        : DEFAULT_SETTINGS.mentionUser,

    showRank:
      typeof row.show_rank === "boolean"
        ? row.show_rank
        : DEFAULT_SETTINGS.showRank,

    showXp:
      typeof row.show_xp === "boolean"
        ? row.show_xp
        : DEFAULT_SETTINGS.showXp,

    sendAsDm:
      typeof row.send_as_dm === "boolean"
        ? row.send_as_dm
        : DEFAULT_SETTINGS.sendAsDm,
  }
}

function xpForLevel(level: number) {
  return 100 * level * level
}

function getLevelProgress(xp: number, level: number) {
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)

  if (nextLevelXp <= currentLevelXp) return 100

  const progress =
    ((xp - currentLevelXp) /
      (nextLevelXp - currentLevelXp)) *
    100

  return Math.max(0, Math.min(100, Math.round(progress)))
}

async function fetchGuildMembers(
  guildId: string
): Promise<BotMember[]> {
  try {
    const response = await fetch(
      `${BOT_API_URL}/members/${guildId}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      console.error(
        `Levels: members API returned ${response.status}`
      )
      return []
    }

    const data =
      (await response.json()) as BotMembersResponse

    if (!data.success || !Array.isArray(data.members)) {
      console.error(
        "Levels: invalid members API response",
        data.error ?? ""
      )
      return []
    }

    return data.members
  } catch (error) {
    console.error(
      "Levels: failed to fetch Discord members:",
      error
    )
    return []
  }
}

async function ensureSettings(guildId: string) {
  const { data, error } = await supabase
    .from("level_settings")
    .select("*")
    .eq("guild_id", guildId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (data) {
    return data
  }

  const now = new Date().toISOString()

  const { data: created, error: createError } = await supabase
    .from("level_settings")
    .insert({
      guild_id: guildId,
      enabled: DEFAULT_SETTINGS.enabled,
      min_xp: DEFAULT_SETTINGS.minXp,
      max_xp: DEFAULT_SETTINGS.maxXp,
      cooldown_seconds: DEFAULT_SETTINGS.cooldownSeconds,
      ignore_bots: DEFAULT_SETTINGS.ignoreBots,
      ignore_commands: DEFAULT_SETTINGS.ignoreCommands,
      voice_xp_enabled: DEFAULT_SETTINGS.voiceXpEnabled,
      anti_farming_enabled: DEFAULT_SETTINGS.antiFarmingEnabled,
      ignored_channel_ids: DEFAULT_SETTINGS.ignoredChannelIds,
      ignored_role_ids: DEFAULT_SETTINGS.ignoredRoleIds,
      level_up_message_enabled:
        DEFAULT_SETTINGS.levelUpMessageEnabled,
      level_up_channel_id: DEFAULT_SETTINGS.levelUpChannelId,
      level_up_message: DEFAULT_SETTINGS.levelUpMessage,
      mention_user: DEFAULT_SETTINGS.mentionUser,
      show_rank: DEFAULT_SETTINGS.showRank,
      show_xp: DEFAULT_SETTINGS.showXp,
      send_as_dm: DEFAULT_SETTINGS.sendAsDm,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single()

  if (createError || !created) {
    throw new Error(
      createError?.message ??
        "Failed to create default level settings."
    )
  }

  return created
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

    const settingsRow = await ensureSettings(guildId)

    const [
      { data: rewards, error: rewardsError },
      { data: members, error: membersError },
      discordMembers,
    ] = await Promise.all([
      supabase
        .from("level_rewards")
        .select("*")
        .eq("guild_id", guildId)
        .order("level", { ascending: true }),

      supabase
        .from("level_members")
        .select("*")
        .eq("guild_id", guildId)
        .order("xp", { ascending: false })
        .limit(100),

      fetchGuildMembers(guildId),
    ])

    if (rewardsError) {
      return jsonError(rewardsError.message, 500)
    }

    if (membersError) {
      return jsonError(membersError.message, 500)
    }

    const discordMemberMap = new Map(
      discordMembers.map((member) => [
        String(member.id),
        member,
      ])
    )

    const leaderboard = (members ?? []).map(
      (member, index) => {
        const userId = String(member.user_id)
        const discordMember =
          discordMemberMap.get(userId)

        const xp = Number(member.xp ?? 0)
        const level = Number(member.level ?? 0)

        return {
          rank: index + 1,
          userId,

          name:
            discordMember?.displayName ??
            discordMember?.username ??
            userId,

          displayName:
            discordMember?.displayName ??
            discordMember?.username ??
            userId,

          username:
            discordMember?.username ?? userId,

          avatar:
            discordMember?.avatar ?? null,

          xp,
          level,
          progress: getLevelProgress(xp, level),

          messageCount: Number(
            member.message_count ?? 0
          ),

          voiceSeconds: Number(
            member.voice_seconds ?? 0
          ),

          lastXpAt: member.last_xp_at ?? null,
          updatedAt: member.updated_at ?? null,
        }
      }
    )

    const totalMembers = leaderboard.length

    const highestLevel =
      leaderboard.length > 0
        ? Math.max(
            ...leaderboard.map(
              (member) => member.level
            )
          )
        : 0

    const totalXp = leaderboard.reduce(
      (sum, member) => sum + member.xp,
      0
    )

    const totalMessages = leaderboard.reduce(
      (sum, member) =>
        sum + member.messageCount,
      0
    )

    return NextResponse.json({
      success: true,

      settings: mapSettings(settingsRow),

      rewards: (rewards ?? []).map((reward) => ({
        id: reward.id,
        level: Number(reward.level),
        roleId: reward.role_id,
        enabled: Boolean(reward.enabled),
      })),

      leaderboard,

      stats: {
        totalMembers,
        highestLevel,
        totalXp,
        totalMessages,
      },

      discord: {
        membersLoaded: discordMembers.length,
      },
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to load level system.",
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
      (await request.json()) as LevelSettingsInput

    const minXp = Math.max(
      1,
      Number(body.minXp ?? DEFAULT_SETTINGS.minXp)
    )

    const maxXp = Math.max(
      minXp,
      Number(body.maxXp ?? DEFAULT_SETTINGS.maxXp)
    )

    const cooldownSeconds = Math.max(
      1,
      Number(
        body.cooldownSeconds ??
          DEFAULT_SETTINGS.cooldownSeconds
      )
    )

    const now = new Date().toISOString()

    const { data: settings, error: settingsError } =
      await supabase
        .from("level_settings")
        .upsert(
          {
            guild_id: guildId,

            enabled:
              body.enabled ??
              DEFAULT_SETTINGS.enabled,

            min_xp: minXp,
            max_xp: maxXp,
            cooldown_seconds: cooldownSeconds,

            ignore_bots:
              body.ignoreBots ??
              DEFAULT_SETTINGS.ignoreBots,

            ignore_commands:
              body.ignoreCommands ??
              DEFAULT_SETTINGS.ignoreCommands,

            voice_xp_enabled:
              body.voiceXpEnabled ??
              DEFAULT_SETTINGS.voiceXpEnabled,

            anti_farming_enabled:
              body.antiFarmingEnabled ??
              DEFAULT_SETTINGS.antiFarmingEnabled,

            ignored_channel_ids: toStringArray(
              body.ignoredChannelIds
            ),

            ignored_role_ids: toStringArray(
              body.ignoredRoleIds
            ),

            level_up_message_enabled:
              body.levelUpMessageEnabled ??
              DEFAULT_SETTINGS.levelUpMessageEnabled,

            level_up_channel_id:
              typeof body.levelUpChannelId ===
                "string" &&
              body.levelUpChannelId.trim()
                ? body.levelUpChannelId.trim()
                : null,

            level_up_message:
              typeof body.levelUpMessage ===
                "string" &&
              body.levelUpMessage.trim()
                ? body.levelUpMessage.trim()
                : DEFAULT_SETTINGS.levelUpMessage,

            mention_user:
              body.mentionUser ??
              DEFAULT_SETTINGS.mentionUser,

            show_rank:
              body.showRank ??
              DEFAULT_SETTINGS.showRank,

            show_xp:
              body.showXp ??
              DEFAULT_SETTINGS.showXp,

            send_as_dm:
              body.sendAsDm ??
              DEFAULT_SETTINGS.sendAsDm,

            updated_at: now,
          },
          {
            onConflict: "guild_id",
          }
        )
        .select("*")
        .single()

    if (settingsError || !settings) {
      return jsonError(
        settingsError?.message ??
          "Failed to save level settings.",
        500
      )
    }

    if (Array.isArray(body.rewards)) {
      const { error: deleteError } =
        await supabase
          .from("level_rewards")
          .delete()
          .eq("guild_id", guildId)

      if (deleteError) {
        return jsonError(
          deleteError.message,
          500
        )
      }

      const cleanRewards = body.rewards
        .filter(
          (reward) =>
            Number.isFinite(
              Number(reward.level)
            ) &&
            Number(reward.level) > 0 &&
            typeof reward.roleId ===
              "string" &&
            reward.roleId.trim()
        )
        .map((reward) => ({
          guild_id: guildId,
          level: Math.floor(
            Number(reward.level)
          ),
          role_id: reward.roleId.trim(),
          enabled: reward.enabled ?? true,
          created_at: now,
          updated_at: now,
        }))

      if (cleanRewards.length > 0) {
        const { error: insertError } =
          await supabase
            .from("level_rewards")
            .insert(cleanRewards)

        if (insertError) {
          return jsonError(
            insertError.message,
            500
          )
        }
      }
    }

    const {
      data: savedRewards,
      error: rewardsError,
    } = await supabase
      .from("level_rewards")
      .select("*")
      .eq("guild_id", guildId)
      .order("level", { ascending: true })

    if (rewardsError) {
      return jsonError(
        rewardsError.message,
        500
      )
    }

    return NextResponse.json({
      success: true,

      message:
        "Level settings saved successfully.",

      settings: mapSettings(settings),

      rewards: (savedRewards ?? []).map(
        (reward) => ({
          id: reward.id,
          level: Number(reward.level),
          roleId: reward.role_id,
          enabled: Boolean(reward.enabled),
        })
      ),
    })
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Failed to save level settings.",
      500
    )
  }
}