import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guildId = searchParams.get("guildId");

  if (!guildId) {
    return NextResponse.json(
      { error: "Missing guildId" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    guildId,
    members: "Coming Soon",
    roles: "Coming Soon",
    channels: "Coming Soon",
    botStatus: "Online",
  });
}