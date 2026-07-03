import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const response = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
    }
  );

  const guilds = await response.json();

  return NextResponse.json(guilds);
}