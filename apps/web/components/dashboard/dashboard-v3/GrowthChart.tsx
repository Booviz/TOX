import { Card } from "./components/Card";

export default function GrowthChart() {
  const bars = [30, 60, 45, 85, 70, 100, 80];

  return (
    <Card className="v3-growth">
      <div className="v3-growth-top">
        <h3>Community Growth</h3>
        <span>Live</span>
      </div>

      <div className="v3-bars">
        {bars.map((height, index) => (
          <div
            key={index}
            className="v3-bar"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Card>
  );
}