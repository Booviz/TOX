import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

const BOT_API_URL =
  process.env.TOX_BOT_API_URL ??
  "http://127.0.0.1:3002"

type RouteContext = {
  params: Promise<{
    guildId: string
    memberId: string
  }>
}

type BotApiResponse = {
  success?: boolean
  error?: string
  message?: string
  member?: unknown
}

async function readBotResponse(
  response: Response
): Promise<BotApiResponse> {
  const text = await response.text()

  if (!text) {
    return {
      success: response.ok,
    }
  }

  try {
    return JSON.parse(text) as BotApiResponse
  } catch {
    console.error(
      "TOX Bot returned a non-JSON response:",
      text
    )

    return {
      success: false,
      error: "TOX Bot returned an invalid response",
    }
  }
}

async function verifySession() {
  const session = await auth()

  if (!session?.accessToken) {
    return null
  }

  return session
}

/*
 * PATCH
 *
 * العمليات المدعومة:
 * - تعديل الاسم المستعار
 * - إعطاء Timeout
 * - إزالة Timeout
 *
 * أمثلة Body:
 *
 * {
 *   "action": "nickname",
 *   "nickname": "New nickname"
 * }
 *
 * {
 *   "action": "timeout",
 *   "durationMs": 600000,
 *   "reason": "Spam"
 * }
 *
 * {
 *   "action": "remove_timeout",
 *   "reason": "Timeout removed"
 * }
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await verifySession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          requiresLogin: true,
        },
        {
          status: 401,
        }
      )
    }

    const { guildId, memberId } =
      await context.params

    const body = await request.json()

    const response = await fetch(
      `${BOT_API_URL}/members/${guildId}/${memberId}`,
      {
        method: "PATCH",
        cache: "no-store",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(body),
      }
    )

    const data = await readBotResponse(response)

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(
      "Member PATCH action failed:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update member",
      },
      {
        status: 500,
      }
    )
  }
}

/*
 * PUT
 *
 * العمليات المدعومة:
 * - إضافة رتبة
 * - إزالة رتبة
 *
 * أمثلة Body:
 *
 * {
 *   "action": "add_role",
 *   "roleId": "ROLE_ID",
 *   "reason": "Added from TOX dashboard"
 * }
 *
 * {
 *   "action": "remove_role",
 *   "roleId": "ROLE_ID",
 *   "reason": "Removed from TOX dashboard"
 * }
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await verifySession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          requiresLogin: true,
        },
        {
          status: 401,
        }
      )
    }

    const { guildId, memberId } =
      await context.params

    const body = await request.json()

    const response = await fetch(
      `${BOT_API_URL}/members/${guildId}/${memberId}`,
      {
        method: "PUT",
        cache: "no-store",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(body),
      }
    )

    const data = await readBotResponse(response)

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(
      "Member role action failed:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update member roles",
      },
      {
        status: 500,
      }
    )
  }
}

/*
 * DELETE
 *
 * العمليات المدعومة:
 * - Kick
 * - Ban
 *
 * أمثلة Body:
 *
 * {
 *   "action": "kick",
 *   "reason": "Rule violation"
 * }
 *
 * {
 *   "action": "ban",
 *   "reason": "Serious rule violation",
 *   "deleteMessageSeconds": 86400
 * }
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await verifySession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          requiresLogin: true,
        },
        {
          status: 401,
        }
      )
    }

    const { guildId, memberId } =
      await context.params

    const body = await request.json()

    const response = await fetch(
      `${BOT_API_URL}/members/${guildId}/${memberId}`,
      {
        method: "DELETE",
        cache: "no-store",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(body),
      }
    )

    const data = await readBotResponse(response)

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(
      "Member moderation action failed:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to moderate member",
      },
      {
        status: 500,
      }
    )
  }
}