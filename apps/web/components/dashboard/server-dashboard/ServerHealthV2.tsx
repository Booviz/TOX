type Props = {
  stats: any;
};

function percent(value: number, max: number) {
  return Math.min(100, Math.round((value / max) * 100));
}

export default function ServerHealthV2({ stats }: Props) {
  const pingPercent = percent(stats.ping, 600);
  const memoryPercent = percent(stats.memoryMB, 256);

  const uptimeMinutes = Math.floor((stats.uptimeSeconds || 0) / 60);

  const health =
    Math.max(
      0,
      100 -
        Math.round(
          pingPercent * 0.35 +
          memoryPercent * 0.25
        )
    );

  return (
    <div className="server-card">

      <div className="section-header">
        <div>
          <h2>Server Health</h2>
          <p>Live status of your Discord bot</p>
        </div>

        <div
          className={`health-score ${
            health >= 90
              ? "excellent"
              : health >= 70
              ? "good"
              : "warning"
          }`}
        >
          {health}%
        </div>
      </div>

      <div className="health-grid">

        <div className="health-item">
          <div className="health-top">
            <span>🟢 Bot Status</span>
            <strong>{stats.botStatus}</strong>
          </div>
        </div>

        <div className="health-item">
          <div className="health-top">
            <span>⚡ Ping</span>
            <strong>{stats.ping} ms</strong>
          </div>

          <div className="health-bar">
            <div
              className="health-fill"
              style={{
                width: `${pingPercent}%`,
              }}
            />
          </div>
        </div>

        <div className="health-item">
          <div className="health-top">
            <span>💾 Memory</span>
            <strong>{stats.memoryMB} MB</strong>
          </div>

          <div className="health-bar">
            <div
              className="health-fill purple"
              style={{
                width: `${memoryPercent}%`,
              }}
            />
          </div>
        </div>

        <div className="health-item">
          <div className="health-top">
            <span>⏱ Uptime</span>
            <strong>{uptimeMinutes} min</strong>
          </div>
        </div>

      </div>

    </div>
  );
}