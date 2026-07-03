import "./server-dashboard.css";

import Sidebar from "./Sidebar";

type Props = {
  guildId: string;
  active: string;
  children: React.ReactNode;
};

export default function ServerPageLayout({ guildId, active, children }: Props) {
  return (
    <div className="server-dashboard">
      <div className="server-dashboard-shell">
        <Sidebar guildId={guildId} active={active} />

        <main className="server-dashboard-content">{children}</main>
      </div>
    </div>
  );
}