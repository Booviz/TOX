import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import CreateChannelModal from "../../../../components/dashboard/server-dashboard/CreateChannelModal";

type Channel = {
  id: string;
  name: string;
  type: number;
  position: number;
  parentId: string | null;
};

function getIcon(type: number) {
  if (type === 4) return "📁";
  if (type === 2) return "🔊";
  return "#";
}

function ChannelCard({
  channel,
  guildId,
}: {
  channel: Channel;
  guildId: string;
}) {
  return (
    <Link
      href={`/dashboard/${guildId}/channels/${channel.id}`}
      style={{
        cursor: "pointer",
        textDecoration: "none",
        color: "#fff",
        background: "#171717",
        border: "1px solid #2d2d2d",
        padding: "16px 18px",
        borderRadius: 14,
      }}
    >
      <strong>
        {getIcon(channel.type)} {channel.name}
      </strong>

      <p style={{ color: "#8b8b95", marginTop: 6 }}>
        ID: {channel.id}
      </p>
    </Link>
  );
}

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

  const categories = channels.filter((c) => c.type === 4);
  const withoutCategory = channels.filter((c) => c.type !== 4 && !c.parentId);

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fff", padding: 40 }}>
      <h1 style={{ fontSize: 38, marginBottom: 8 }}>Channels</h1>

      <p style={{ color: "#8b8b95", marginBottom: 30 }}>
        Manage Discord channels for this server.
      </p>

      <CreateChannelModal guildId={guildId} />

      {categories.map((category) => {
        const children = channels.filter((c) => c.parentId === category.id);

        return (
          <div key={category.id} style={{ marginBottom: 28 }}>
            <h2 style={{ color: "#a78bfa", fontSize: 16, marginBottom: 12 }}>
              📁 {category.name}
            </h2>

            <div style={{ display: "grid", gap: 10 }}>
              {children.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} guildId={guildId} />
              ))}
            </div>
          </div>
        );
      })}

      {withoutCategory.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: "#a78bfa", fontSize: 16, marginBottom: 12 }}>
            Other Channels
          </h2>

          <div style={{ display: "grid", gap: 10 }}>
            {withoutCategory.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} guildId={guildId} />
            ))}
          </div>
        </div>
      )}

        

    </div>
  );
}