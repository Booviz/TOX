import Sidebar from "./Sidebar";
import Header from "./Header";
import { Stats } from "./Stats";
import Activity from "./Activity";
import GrowthChart from "./GrowthChart";
import { AIWidget } from "../AIWidget";
import QuickActions from "./QuickActions";
import ServerHealth from "./ServerHealth";
import ServersPanel from "./ServersPanel";
import AISuggestions from "./AISuggestions";
import RealServers from "./RealServers";

export default function DashboardV3() {
  return (
    <section className="dashboard-v3">

      <div className="dashboard-v3-container">

        <Sidebar />

        <main className="dashboard-v3-main"> 
            
            <Header />

            <Stats />
            
            <div className="v3-grid">
                <Activity />
                <GrowthChart />
            </div>


            <div className="v3-bottom-grid">
                <AIWidget />
                <QuickActions />
                <ServerHealth />
                <RealServers />
                <AISuggestions />
            </div>
            
        </main>

      </div>

    </section>
  );
}