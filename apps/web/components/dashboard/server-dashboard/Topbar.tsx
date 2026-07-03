type Props = {
  guild: any;
};

export default function Topbar({ guild }: Props) {
  return (
    <>
      <a href="/servers" className="server-dashboard-back">
        ← Back to Servers
      </a>

      <div className="server-dashboard-header">
        {guild.icon ? (
          <img
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
            alt={guild.name}
            className="server-dashboard-icon"
          />
        ) : (
          <div className="server-dashboard-placeholder" />
        )}

        <div>
          <p className="server-dashboard-title-small">Server Dashboard</p>
          <h1 className="server-dashboard-title">{guild.name}</h1>
          <p className="server-dashboard-id">Guild ID: {guild.id}</p>
        </div>
      </div>
    </>
  );
}