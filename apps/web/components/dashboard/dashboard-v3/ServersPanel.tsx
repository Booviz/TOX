import { Server, Users, Ticket, Circle } from "lucide-react";

const servers = [
  {
    name: "21 GANG",
    members: "2,391",
    tickets: "183",
    status: "Online",
  },
  {
    name: "TOX Community",
    members: "842",
    tickets: "24",
    status: "Online",
  },
  {
    name: "VETO System",
    members: "1,204",
    tickets: "57",
    status: "Online",
  },
];

export default function ServersPanel() {
  return (
    <section className="v3-card servers-panel">
      <div className="servers-panel-header">
        <div>
          <p>Connected Servers</p>
          <h3>My Servers</h3>
        </div>

        <button>Add Server</button>
      </div>

      <div className="servers-grid">
        {servers.map((server) => (
          <div className="server-card" key={server.name}>
            <div className="server-icon">
              <Server size={22} />
            </div>

            <div className="server-info">
              <h4>{server.name}</h4>

              <div className="server-meta">
                <span>
                  <Users size={15} />
                  {server.members} Members
                </span>

                <span>
                  <Ticket size={15} />
                  {server.tickets} Tickets
                </span>
              </div>

              <div className="server-status">
                <Circle size={10} fill="#22c55e" color="#22c55e" />
                {server.status}
              </div>
            </div>

            <button className="manage-btn">Manage</button>
          </div>
        ))}
      </div>
    </section>
  );
}