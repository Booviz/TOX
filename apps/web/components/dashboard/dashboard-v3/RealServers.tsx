"use client";

import { useEffect, useState } from "react";
import { Server, ShieldCheck } from "lucide-react";
import { Card } from "./components/Card";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

function hasManageGuildPermission(permissions: string) {
  const perms = BigInt(permissions);
  const MANAGE_GUILD = BigInt(0x20);
  const ADMINISTRATOR = BigInt(0x8);

  return (
    (perms & MANAGE_GUILD) === MANAGE_GUILD ||
    (perms & ADMINISTRATOR) === ADMINISTRATOR
  );
}

export default function RealServers() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuilds() {
      try {
        const res = await fetch("/api/discord/guilds");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.log("Guilds API returned:", data);
          setGuilds([]);
          setLoading(false);
          return;
        }

        const manageableGuilds = data.filter((guild: Guild) => {
          return guild.owner || hasManageGuildPermission(guild.permissions);
        });

        setGuilds(manageableGuilds);
      } catch (error) {
        console.error("Failed to load guilds:", error);
        setGuilds([]);
      } finally {
        setLoading(false);
      }
    }

    loadGuilds();
  }, []);

  return (
    <Card className="real-servers">
      <div className="real-servers-header">
        <div>
          <p>Discord API</p>
          <h3>Your Manageable Servers</h3>
        </div>
      </div>

      {loading ? (
        <p className="real-servers-loading">Loading servers...</p>
      ) : guilds.length === 0 ? (
        <p className="real-servers-loading">No manageable servers found.</p>
      ) : (
        <div className="real-servers-grid">
          {guilds.map((guild) => (
            <div className="real-server-card" key={guild.id}>
              <div className="real-server-icon">
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                  />
                ) : (
                  <Server size={24} />
                )}
              </div>

              <div className="real-server-info">
                <h4>{guild.name}</h4>

                <span>
                  <ShieldCheck size={15} />
                  Can Manage
                </span>
              </div>

              <button>Manage</button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}