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

type ApiResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  [key: string]: unknown;
};

async function readApiResponse(
  response: Response
): Promise<ApiResponse> {
  const text = await response.text();

  if (!text) {
    return {
      success: response.ok,
    };
  }

  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    return {
      success: false,
      error: "TOX Bot returned invalid JSON",
    };
  }
}

function internalError(
  error: unknown,
  fallback: string
) {
  console.error(fallback, error);

  return NextResponse.json(
    {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : fallback,
    },
    {
      status: 500,
    }
  );
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    const response = await fetch(
      `${TOX_API_URL}/channels/${guildId}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
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
      "Failed to load channels"
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    const body = await request.json();

    const response = await fetch(
      `${TOX_API_URL}/channels/${guildId}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
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
      "Failed to create channel"
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    const body = await request.json();

    const channelId =
      typeof body?.channelId === "string"
        ? body.channelId.trim()
        : "";

    if (!channelId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "channelId is required",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${TOX_API_URL}/channels/${guildId}/${channelId}`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
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
      "Failed to update channel"
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { guildId } =
      await context.params;

    const body = await request.json();

    const channelId =
      typeof body?.channelId === "string"
        ? body.channelId.trim()
        : "";

    if (!channelId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "channelId is required",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${TOX_API_URL}/channels/${guildId}/${channelId}`,
      {
        method: "DELETE",
        cache: "no-store",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
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
      "Failed to delete channel"
    );
  }
}