"use client";

type Props = {
  guild: any;
  stats: any;
};

function formatDate(value?: string) {
  if (!value) return "Unknown";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function verificationLabel(level: number) {
  const labels: Record<number, string> = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Highest",
  };

  return labels[level] || "Unknown";
}

export default function Topbar({ guild, stats }: Props) {
  const serverName = stats?.name || guild.name;
  const icon =
    stats?.icon ||
    (guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : null);

  const features: string[] = stats?.features || [];

  return (
    <>
      <a href="/servers" className="server-dashboard-back">
        ← Back to Servers
      </a>

      <section className="tox-server-hero">
        <div className="tox-server-hero-bg">
          {stats?.banner ? (
            <img src={stats.banner} alt="" />
          ) : (
            <div className="tox-server-hero-gradient" />
          )}
          <div className="tox-server-hero-shadow" />
        </div>

        <div className="tox-server-hero-content">
          <div className="tox-server-main">
            {icon ? (
              <img src={icon} alt={serverName} className="tox-server-icon" />
            ) : (
              <div className="tox-server-icon tox-server-icon-empty">
                {serverName?.[0] || "T"}
              </div>
            )}

            <div>
              <p className="tox-server-kicker">TOX Server Dashboard</p>
              <h1>{serverName}</h1>

              <div className="tox-server-meta">
                <span>ID: {guild.id}</span>
                <span>Created: {formatDate(stats?.createdAt)}</span>
                <span>Verification: {verificationLabel(stats?.verificationLevel)}</span>
                <span>Boost Level: {stats?.boostLevel ?? 0}</span>
              </div>

              <div className="tox-server-badges">
                <span>{stats?.members ?? 0} Members</span>
                <span>{stats?.roles ?? 0} Roles</span>
                <span>{stats?.channels ?? 0} Channels</span>
                <span>{stats?.boosts ?? 0} Boosts</span>

                {features.includes("COMMUNITY") && <span>Community</span>}
                {features.includes("VERIFIED") && <span>Verified</span>}
                {features.includes("PARTNERED") && <span>Partner</span>}
                {features.includes("DISCOVERABLE") && <span>Discoverable</span>}
              </div>
            </div>
          </div>

          <div className="tox-server-side">
            {stats?.owner && (
              <div className="tox-owner-card">
                <img src={stats.owner.avatar} alt="" />
                <div>
                  <p>Server Owner</p>
                  <strong>{stats.owner.displayName}</strong>
                </div>
              </div>
            )}

            <div className="tox-server-actions">
              <button onClick={() => window.location.reload()}>
                Refresh
              </button>

              <a href={`/dashboard/${guild.id}/settings`}>
                Settings
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}