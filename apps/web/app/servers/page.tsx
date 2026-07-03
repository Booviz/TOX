import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

function canManageGuild(guild: Guild) {
  const perms = BigInt(guild.permissions);
  return guild.owner || (perms & BigInt(0x20)) === BigInt(0x20) || (perms & BigInt(0x8)) === BigInt(0x8);
}

export default async function ServersPage() {
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
  const manageableGuilds = guilds.filter(canManageGuild);

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fff", padding: "60px" }}>
      <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>Choose Server</h1>
      <p style={{ color: "#8b8b95", fontSize: "18px", marginBottom: "34px" }}>
        Select a Discord server to manage.
      </p>

      <div style={{ display: "grid", gap: "16px", maxWidth: "900px" }}>
        {manageableGuilds.map((guild) => (
          <div
            key={guild.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              padding: "20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            {guild.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                alt={guild.name}
                style={{ width: "64px", height: "64px", borderRadius: "18px", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#25143d" }} />
            )}

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "20px" }}>{guild.name}</h3>
              <p style={{ color: "#a78bfa", marginTop: "6px" }}>Can Manage</p>
            </div>

            <a
              href={`/dashboard/${guild.id}`}
              style={{
                padding: "12px 18px",
                borderRadius: "14px",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              }}
            >
              Manage
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}