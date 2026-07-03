import "./server-dashboard.css";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Stats from "./Stats";

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
          <Topbar guild={guild} />
          <Stats stats={stats} />
        </main>
      </div>
    </div>
  );
}