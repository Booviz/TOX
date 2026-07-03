import { Activity, Database, Radio, Wifi } from "lucide-react";

const items = [
  { icon: Wifi, label: "API Status", value: "Online" },
  { icon: Radio, label: "Discord Gateway", value: "Stable" },
  { icon: Database, label: "Database", value: "Connected" },
  { icon: Activity, label: "Bot Latency", value: "38ms" },
];

export default function ServerHealth() {
  return (
    <section className="v3-card server-health">
      <h3>Server Health</h3>

      <div className="health-grid">
        {items.map(({ icon: Icon, label, value }) => (
          <div className="health-item" key={label}>
            <Icon size={20} />

            <div>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>

            <span />
          </div>
        ))}
      </div>
    </section>
  );
}