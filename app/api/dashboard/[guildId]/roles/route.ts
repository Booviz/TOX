import { NextResponse } from "next/server"
import { auth } from "@/auth"

const BOT_API_URL =
  process.env.TOX_BOT_API_URL ??
  "http://127.0.0.1:3002"

type RouteContext = {
  params: Promise<{
    guildId: string
  }>
}

type BotApiResponse = {
  success?: boolean
  error?: string
  message?: string
  role?: unknown
  roles?: unknown[]
  guild?: {
    id?: string
    name?: string
  }
  total?: number
}

async function requireSession() {
  const session = await auth()
  return session?.accessToken ? session : null
}

async function readBotResponse(
  response: Response
): Promise<BotApiResponse> {
  const text = await response.text()

  if (!text) {
    return { success: response.ok }
  }

  try {
    return JSON.parse(text) as BotApiResponse
  } catch {
    return {
      success: false,
      error: "TOX Bot returned invalid JSON",
    }
  }
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  )
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await requireSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { guildId } = await context.params

    const response = await fetch(
      `${BOT_API_URL}/roles/${guildId}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    )

    const data = await readBotResponse(response)

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error("Roles GET API error:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load roles",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await requireSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { guildId } = await context.params
    const body = await request.json()

    const response = await fetch(
      `${BOT_API_URL}/roles/${guildId}`,
      {
        method: "POST",
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
    console.error("Roles POST API error:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create role",
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await requireSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { guildId } = await context.params
    const body = await request.json()

    const roleId =
      typeof body?.roleId === "string"
        ? body.roleId.trim()
        : ""

    if (!roleId) {
      return NextResponse.json(
        {
          success: false,
          error: "roleId is required",
        },
        {
          status: 400,
        }
      )
    }

    const response = await fetch(
      `${BOT_API_URL}/roles/${guildId}/${roleId}`,
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
    console.error("Roles PATCH API error:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update role",
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await requireSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { guildId } = await context.params
    const body = await request.json()

    const roleId =
      typeof body?.roleId === "string"
        ? body.roleId.trim()
        : ""

    if (!roleId) {
      return NextResponse.json(
        {
          success: false,
          error: "roleId is required",
        },
        {
          status: 400,
        }
      )
    }

    const response = await fetch(
      `${BOT_API_URL}/roles/${guildId}/${roleId}`,
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
    console.error("Roles DELETE API error:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete role",
      },
      {
        status: 500,
      }
    )
  }
}