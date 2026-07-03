import GlassCard from "./ui/GlassCard";

export default function DashboardPreview() {
  return (
    <section className="dashboard-preview-section" id="docs">
      <div className="dashboard-preview">

        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-label">TOX OS</p>
            <h3>Live Community Dashboard</h3>
          </div>

          <div className="live-badge">
            <span></span>
            Live
          </div>
        </div>

        <div className="dashboard-grid">

          <GlassCard className="stat-card">
            <p>Servers</p>
            <strong>42</strong>
            <span>+12%</span>
          </GlassCard>

          <GlassCard className="stat-card">
            <p>Tickets</p>
            <strong>128</strong>
            <span>+31%</span>
          </GlassCard>

          <GlassCard className="stat-card">
            <p>Members</p>
            <strong>9.3K</strong>
            <span>+8%</span>
          </GlassCard>

          <GlassCard className="stat-card">
            <p>AI Score</p>
            <strong>99%</strong>
            <span>Excellent</span>
          </GlassCard>

          <GlassCard className="logs-card">
            <h4>Live Logs</h4>

            <ul>
              <li>✓ New ticket created</li>
              <li>✓ Member verified</li>
              <li>✓ AI replied to user</li>
              <li>✓ Raid protection active</li>
            </ul>
          </GlassCard>

          <GlassCard className="graph-card">
            <h4>Activity Graph</h4>

            <div className="graph-bars">
              <div className="bar h1"></div>
              <div className="bar h2"></div>
              <div className="bar h3"></div>
              <div className="bar h4"></div>
              <div className="bar h5"></div>
              <div className="bar h6"></div>
            </div>
          </GlassCard>

          <GlassCard className="ai-status">
            🤖 TOX AI is watching your community...
          </GlassCard>

        </div>
      </div>
    </section>
  );
}