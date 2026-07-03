import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import ServerPageLayout from "../../../../../components/dashboard/server-dashboard/ServerPageLayout";
import ChannelActions from "../../../../../components/dashboard/server-dashboard/ChannelActions";
import ChannelSettingsForm from "../../../../../components/dashboard/server-dashboard/ChannelSettingsForm";
import ChannelPermissionManager from "../../../../../components/dashboard/server-dashboard/ChannelPermissionManager";

export default async function ChannelDetailsPage({
  params,
}: {
  params: Promise<{
    guildId: string;
    channelId: string;
  }>;
}) {
  const { guildId, channelId } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return <div>Unauthorized</div>;
  }

  const response = await fetch(
    `http://localhost:3002/channel?guildId=${guildId}&channelId=${channelId}`,
    {
      cache: "no-store",
    }
  );

  const channel = await response.json();

  return (
    <ServerPageLayout guildId={guildId} active="Channels">
      <h1 style={{ fontSize: 36, marginBottom: 25 }}>
        General
      </h1>

      <div
        style={{
          background: "#171717",
          border: "1px solid #2d2d2d",
          borderRadius: 16,
          padding: 25,
          maxWidth: 1050,
        }}
      >
        <ChannelSettingsForm
          guildId={guildId}
          channelId={channelId}
          channel={channel}
        />

        <ChannelPermissionManager
          guildId={guildId}
          channelId={channelId}
          permissions={channel.permissionOverwrites || []}
        />

        <ChannelActions
          guildId={guildId}
          channelId={channelId}
        />
      </div>
    </ServerPageLayout>
  );
}