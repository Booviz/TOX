import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import ServerPageLayout from "../../../../components/dashboard/server-dashboard/ServerPageLayout";
import ChannelsManager from "../../../../components/dashboard/server-dashboard/ChannelsManager";

type Channel = {
  id: string;
  name: string;
  type: number;
  position: number;
  parentId: string | null;
};

export default async function ChannelsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return <div>Unauthorized</div>;
  }

  const response = await fetch(
    `http://localhost:3002/channels?guildId=${guildId}`,
    { cache: "no-store" }
  );

  const data = await response.json();
  const channels: Channel[] = data.channels ?? [];

  return (
    <ServerPageLayout guildId={guildId} active="Channels">
      <ChannelsManager guildId={guildId} channels={channels} />
    </ServerPageLayout>
  );
}