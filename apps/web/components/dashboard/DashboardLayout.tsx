import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Stats } from "./Stats";
import { Activity } from "./Activity";
import { Charts } from "./Charts";
import { AIWidget } from "./AIWidget";

export default function DashboardLayout() {
  return (
    <section className="dashboard-v2">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <Stats />

        <div className="dashboard-row">
          <Activity />
          <Charts />
        </div>

        <AIWidget />
      </main>
    </section>
  );
}