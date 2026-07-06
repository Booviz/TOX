"use client";

type Props = {
  guildId: string;
};

const actions = [
  {
    icon: "➕",
    title: "Create Channel",
    description: "Create a new text or voice channel",
    color: "#3b82f6",
  },
  {
    icon: "👑",
    title: "Create Role",
    description: "Add a new server role",
    color: "#8b5cf6",
  },
  {
    icon: "🔄",
    title: "Sync Server",
    description: "Refresh all Discord data",
    color: "#10b981",
  },
  {
    icon: "📦",
    title: "Backup",
    description: "Create server backup",
    color: "#f59e0b",
  },
  {
    icon: "📜",
    title: "Audit Logs",
    description: "View moderation logs",
    color: "#ef4444",
  },
  {
    icon: "⚙️",
    title: "Settings",
    description: "Open server settings",
    color: "#6366f1",
  },
];

export default function QuickActionsV2({ guildId }: Props) {
  return (
    <div className="server-card">
      <div className="section-header">
        <div>
          <h2>Quick Actions</h2>
          <p>Instant server management</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.title}
            className="quick-action-btn"
            style={
              {
                "--action-color": action.color,
              } as React.CSSProperties
            }
          >
            <div
              className="quick-action-icon"
              style={{
                background: action.color,
              }}
            >
              {action.icon}
            </div>

            <div className="quick-action-content">
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}