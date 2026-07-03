"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Role = {
  id: string;
  name: string;
  color: string;
  position: number;
  members: number;
  managed?: boolean;
};

type Props = {
  guildId: string;
  roles: Role[];
};

export default function RolesManager({ guildId, roles }: Props) {
  const [search, setSearch] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search roles..."
          style={{
            flex: 1,
            padding: "15px 18px",
            borderRadius: 14,
            border: "1px solid #2d2d2d",
            background: "#09090b",
            color: "#fff",
            outline: "none",
            fontWeight: 700,
          }}
        />

        <button
          style={{
            padding: "15px 20px",
            borderRadius: 14,
            border: "none",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            color: "#fff",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          + Create Role
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filteredRoles.map((role) => (
          <Link
            key={role.id}
            href={`/dashboard/${guildId}/roles/${role.id}`}
            style={{
              textDecoration: "none",
              color: "#fff",
              background:
                "linear-gradient(135deg, rgba(255,255,255,.055), rgba(255,255,255,.025))",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 18,
              padding: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 14px 40px rgba(0,0,0,.22)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background:
                    role.color === "#000000" ? "#99a1af" : role.color,
                  display: "inline-block",
                  boxShadow: `0 0 18px ${
                    role.color === "#000000" ? "#99a1af" : role.color
                  }`,
                }}
              />

              <div>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: 6,
                    fontSize: 19,
                    color:
                      role.color === "#000000" ? "#fff" : role.color,
                  }}
                >
                  @{role.name}
                </h3>

                <p style={{ margin: 0, color: "#8b8b95", fontSize: 14 }}>
                  {role.members} Members • Position #{role.position}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {role.managed && (
                <span
                  style={{
                    background: "rgba(250,204,21,.12)",
                    color: "#fde68a",
                    padding: "7px 12px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  Managed
                </span>
              )}

              <span
                style={{
                  background: "rgba(124,58,237,.18)",
                  color: "#c4b5fd",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontWeight: 900,
                }}
              >
                Edit
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}