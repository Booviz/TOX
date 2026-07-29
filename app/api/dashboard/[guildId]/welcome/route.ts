import { NextResponse } from "next/server";

const TOX_API_URL =
  process.env.TOX_API_URL ??
  process.env.TOX_BOT_API_URL ??
  "http://127.0.0.1:3002";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    guildId: string;
  }>;
};

type ApiPayload = {
  success?: boolean;
  error?: string;
  message?: string;
  [key: string]: unknown;
};

async function readApiResponse(
  response: Response
): Promise<ApiPayload> {
  const text = await response.text();

  if (!text) {
    return {
      success: response.ok,
    };
  }

  try {
    return JSON.parse(text) as ApiPayload;
  } catch {
    return {
      success: false,
      error:
        "TOX Bot API returned invalid JSON.",
    };
  }
}

function internalError(
  error: unknown,
  fallbackMessage: string
) {
  console.error(
    fallbackMessage,
    error
  );

  return NextResponse.json(
    {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : fallbackMessage,
    },
    {
      status: 500,
    }
  );
}

/**
 * GET /api/dashboard/[guildId]/welcome
 *
 * يجلب:
 * - إعدادات الترحيب
 * - قنوات السيرفر
 * - رتب السيرفر
 * - بيانات المعاينة
 */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    if (!guildId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "guildId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${TOX_API_URL}/welcome/${guildId}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept:
            "application/json",
        },
      }
    );

    const data =
      await readApiResponse(response);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return internalError(
      error,
      "Failed to load welcome settings."
    );
  }
}


/**
 * PUT /api/dashboard/[guildId]/welcome
 *
 * يحفظ إعدادات:
 * - Welcome
 * - Goodbye
 * - Direct Message
 * - General Settings
 */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    if (!guildId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "guildId is required.",
        },
        {
          status: 400,
        }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Request body must be valid JSON.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body ||
      typeof body !== "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Welcome settings payload is required.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${TOX_API_URL}/welcome/${guildId}`,
      {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type":
            "application/json",
          Accept:
            "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data =
      await readApiResponse(response);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return internalError(
      error,
      "Failed to save welcome settings."
    );
  }
}


/**
 * POST /api/dashboard/[guildId]/welcome
 *
 * يرسل رسالة تجريبية
 * (Welcome / Goodbye / DM)
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    if (!guildId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "guildId is required.",
        },
        {
          status: 400,
        }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Request body must be valid JSON.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${TOX_API_URL}/welcome/${guildId}/test`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type":
            "application/json",
          Accept:
            "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data =
      await readApiResponse(response);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return internalError(
      error,
      "Failed to send test welcome message."
    );
  }
}