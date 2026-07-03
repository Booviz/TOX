import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import ServerDashboard from "../../../components/dashboard/server-dashboard/ServerDashboard";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

type ServerDashboardPageProps = {
  params: Promise<{
    guildId: string;
  }>;
};

export default async function ServerDashboardPage({
  params,
}: ServerDashboardPageProps) {
  const { guildId } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    redirect("/api/auth/signin");
  }

  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${(session as any).accessToken}`,
    },
    cache: "no-store",
  });

  const guilds: Guild[] = await response.json();
  const guild = guilds.find((item) => item.id === guildId);

  if (!guild) {
    redirect("/servers");
  }

  const statsResponse = await fetch(
    `http://localhost:3002/server?guildId=${guildId}`,
    {
      cache: "no-store",
    }
  );

  const stats = await statsResponse.json();

  return <ServerDashboard guild={guild} stats={stats} />;
}