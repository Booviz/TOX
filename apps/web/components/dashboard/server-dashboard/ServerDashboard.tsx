import "./server-dashboard.css";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Stats from "./Stats";
import QuickActionsV2 from "./QuickActionsV2";
import ServerHealthV2 from "./ServerHealthV2";
import PerformanceV2 from "./PerformanceV2";
import LiveActivityV2 from "./LiveActivityV2";

type Props = {
  guild: any;
  stats: any;
};

export default function ServerDashboard({ guild, stats }: Props) {
  return (
    <div className="server-dashboard">
      <div className="server-dashboard-shell">
        <Sidebar guildId={guild.id} />

        <main className="server-dashboard-content">
          <Topbar guild={guild} stats={stats} />
          <Stats stats={stats} />

          <div className="server-dashboard-v2-grid">
            <QuickActionsV2 guildId={guild.id} />
            <ServerHealthV2 stats={stats} />
          </div>

          <div className="server-dashboard-v2-grid">
            <PerformanceV2 stats={stats} />
            <LiveActivityV2 stats={stats} />
          </div>
        </main>
      </div>
    </div>
  );
}