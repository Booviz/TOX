"use client";

import {
  LayoutDashboard,
  Globe,
  Ticket,
  Users,
  Bot,
  BarChart3,
  Settings,
  Circle,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Globe, label: "Servers" },
  { icon: Ticket, label: "Tickets" },
  { icon: Users, label: "Members" },
  { icon: Bot, label: "AI Center" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="tox-sidebar">

      <div className="tox-sidebar-logo">
        <span>T</span>
        <strong>TOX OS</strong>
      </div>

      <nav className="tox-sidebar-nav">
        {items.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={active ? "active" : ""}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="tox-sidebar-user">
        <div className="avatar">M</div>

        <div>
          <strong>Mohammed</strong>

          <p>
            <Circle
              size={10}
              fill="#22c55e"
              color="#22c55e"
            />
            Online
          </p>
        </div>
      </div>

    </aside>
  );
}