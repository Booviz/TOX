import {
  ShieldAlert,
  Ticket,
  Sparkles,
  ArrowRight
} from "lucide-react";

const suggestions = [
  {
    icon: <ShieldAlert size={20} />,
    title: "Enable Anti Raid",
    text: "Protection is currently disabled.",
  },
  {
    icon: <Ticket size={20} />,
    title: "12 Pending Tickets",
    text: "Some tickets are waiting for staff.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "AI Recommendation",
    text: "Enable Auto Reply for Applications.",
  },
];

export default function AISuggestions() {
  return (
    <section className="v3-card ai-suggestions">
      <div className="ai-header">
        <div>
          <p>Artificial Intelligence</p>
          <h3>AI Suggestions</h3>
        </div>
      </div>

      <div className="ai-list">
        {suggestions.map((item) => (
          <div className="ai-item" key={item.title}>
            <div className="ai-icon">
              {item.icon}
            </div>

            <div className="ai-info">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>

            <ArrowRight size={18} />
          </div>
        ))}
      </div>
    </section>
  );
}