import GlassCard from "../ui/GlassCard";

export function Charts() {
  return (
    <GlassCard className="tox-chart">
      <div className="chart-header">
        <h3>Community Growth</h3>
        <span>Live</span>
      </div>

      <div className="chart-bars">
        <span className="bar-1" />
        <span className="bar-2" />
        <span className="bar-3" />
        <span className="bar-4" />
        <span className="bar-5" />
        <span className="bar-6" />
        <span className="bar-7" />
      </div>
    </GlassCard>
  );
}