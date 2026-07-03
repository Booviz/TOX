import { Server, Users, Ticket, Sparkles } from "lucide-react";
import { Card } from "./components/Card";

const stats = [
  {
    icon: Server,
    title: "Servers",
    value: "42",
    change: "+12%",
  },
  {
    icon: Users,
    title: "Members",
    value: "9.3K",
    change: "+8%",
  },
  {
    icon: Ticket,
    title: "Tickets",
    value: "128",
    change: "+31%",
  },
  {
    icon: Sparkles,
    title: "AI Score",
    value: "99%",
    change: "Excellent",
  },
];

export function Stats() {
  return (
    <section className="v3-stats">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title} className="v3-stat-card">
            <div className="v3-stat-top">
              <div className="v3-stat-icon">
                <Icon size={22} />
              </div>
            </div>

            <p>{item.title}</p>

            <h3>{item.value}</h3>

            <span>{item.change}</span>
          </Card>
        );
      })}
    </section>
  );
}