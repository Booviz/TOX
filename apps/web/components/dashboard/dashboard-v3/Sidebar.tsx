import { LayoutDashboard, Users, Ticket, Bot, BarChart3, Settings } from "lucide-react";
import { Card } from "./components/Card";

export default function Sidebar() {
  return (
    <Card className="v3-sidebar">

      <div className="v3-logo">
        <div className="v3-logo-icon">T</div>

        <div>
          <strong>TOX OS</strong>
          <p>Dashboard V3</p>
        </div>
      </div>

      <nav>

        <a className="active">
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a>
          <Users size={18} />
          Members
        </a>

        <a>
          <Ticket size={18} />
          Tickets
        </a>

        <a>
          <Bot size={18} />
          AI Center
        </a>

        <a>
          <BarChart3 size={18} />
          Analytics
        </a>

        <a>
          <Settings size={18} />
          Settings
        </a>

      </nav>

    </Card>
  );
}