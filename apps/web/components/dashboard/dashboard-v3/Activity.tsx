import { Card } from "./components/Card";

export default function Activity() {
  const items = [
    ["New ticket opened", "2 min ago"],
    ["Member verified", "10 min ago"],
    ["AI handled report", "18 min ago"],
    ["Raid protection activated", "32 min ago"],
    ["Backup completed", "1 hour ago"],
  ];

  return (
    <Card className="v3-activity">
      <h3>Recent Activity</h3>

      {items.map(([title, time]) => (
        <div key={title} className="v3-activity-item">
          <strong>{title}</strong>
          <span>{time}</span>
        </div>
      ))}
    </Card>
  );
}