import {
  Activity,
  Cpu,
  HardDrive,
  Gauge,
  Clock3,
} from "lucide-react";

type Props = {
  stats: any;
};

export default function PerformanceV2({ stats }: Props) {
  const memory = Math.min(stats.memoryMB || 0, 100);

  const ping = Math.min(stats.ping || 0, 300);

  const pingPercent = 100 - (ping / 300) * 100;

  const uptimeMinutes = Math.floor((stats.uptimeSeconds || 0) / 60);

  return (
    <div className="server-card performance-card">
      <div className="card-header">
        <div>
          <p>Performance</p>
          <h2>System Resources</h2>
        </div>

        <Activity size={20} />
      </div>

      <div className="performance-grid">

        <div className="performance-item">
          <div className="performance-title">
            <HardDrive size={18} />
            <span>Memory</span>
          </div>

          <strong>{stats.memoryMB} MB</strong>

          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${memory}%` }}
            />
          </div>
        </div>

        <div className="performance-item">
          <div className="performance-title">
            <Gauge size={18} />
            <span>Gateway Ping</span>
          </div>

          <strong>{stats.ping} ms</strong>

          <div className="progress">
            <div
              className="progress-fill green"
              style={{ width: `${pingPercent}%` }}
            />
          </div>
        </div>

        <div className="performance-item">
          <div className="performance-title">
            <Clock3 size={18} />
            <span>Uptime</span>
          </div>

          <strong>{uptimeMinutes} min</strong>

          <div className="mini-value">
            Running normally
          </div>
        </div>

        <div className="performance-item">
          <div className="performance-title">
            <Cpu size={18} />
            <span>Bot Health</span>
          </div>

          <strong>Excellent</strong>

          <div className="mini-value">
            Stable Performance
          </div>
        </div>

      </div>
    </div>
  );
}