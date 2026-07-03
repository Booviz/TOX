"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Role = {
  id: string;
  name: string;
  color: string;
  position: number;
  members: number;
  managed: boolean;
  mentionable: boolean;
  hoist: boolean;
  permissions: string[];
};

type Member = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
};

type Props = {
  guildId: string;
  role: Role;
  members: Member[];
  permissions: string[];
};

type Tab = "overview" | "permissions" | "members" | "danger";

function formatPermissionName(name: string) {
  return name.replace(/([A-Z])/g, " $1").trim();
}

export default function RoleDetailsManager({
  guildId,
  role,
  members,
  permissions,
}: Props) {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [name, setName] = useState(role.name);
  const [color, setColor] = useState(role.color === "#000000" ? "#99a1af" : role.color);
  const [hoist, setHoist] = useState(role.hoist);
  const [mentionable, setMentionable] = useState(role.mentionable);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions || []
  );
  const [permissionSearch, setPermissionSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) =>
      formatPermissionName(permission)
        .toLowerCase()
        .includes(permissionSearch.toLowerCase())
    );
  }, [permissions, permissionSearch]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      `${member.displayName} ${member.username}`
        .toLowerCase()
        .includes(memberSearch.toLowerCase())
    );
  }, [members, memberSearch]);

  function togglePermission(permission: string) {
    setSelectedPermissions((old) =>
      old.includes(permission)
        ? old.filter((p) => p !== permission)
        : [...old, permission]
    );
  }

  async function saveRole() {
    setSaving(true);

    const response = await fetch("http://localhost:3002/roles/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        roleId: role.id,
        name,
        color,
        hoist,
        mentionable,
        permissions: selectedPermissions,
      }),
    });

    const data = await response.json();
    setSaving(false);

    if (!data.success) {
      alert(data.error || "Failed to save role");
      return;
    }

    alert("Role saved!");
    router.refresh();
  }

  async function deleteRole() {
    if (!confirm(`Delete role ${name}?`)) return;

    const response = await fetch("http://localhost:3002/roles/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        roleId: role.id,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.error || "Failed to delete role");
      return;
    }

    router.push(`/dashboard/${guildId}/roles`);
  }

  async function cloneRole() {
    const response = await fetch("http://localhost:3002/roles/clone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId,
        roleId: role.id,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.error || "Failed to clone role");
      return;
    }

    router.push(`/dashboard/${guildId}/roles/${data.roleId}`);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "permissions", label: "Permissions" },
    { key: "members", label: "Members" },
    { key: "danger", label: "Danger Zone" },
  ];

  return (
    <div style={{ color: "#fff" }}>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,.22), rgba(15,15,18,.95))",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 22,
          padding: 26,
          marginBottom: 22,
          boxShadow: "0 20px 60px rgba(0,0,0,.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: color,
              boxShadow: `0 0 30px ${color}`,
            }}
          />

          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 34 }}>@{name}</h1>
            <p style={{ margin: "6px 0 0", color: "#b4b4bd" }}>
              Position #{role.position} • {members.length} members • ID: {role.id}
            </p>
          </div>

          {role.managed && (
            <span
              style={{
                background: "rgba(250,204,21,.12)",
                color: "#fde68a",
                padding: "9px 14px",
                borderRadius: 999,
                fontWeight: 900,
              }}
            >
              Managed
            </span>
          )}

          <button
            onClick={saveRole}
            disabled={saving || role.managed}
            style={{
              padding: "13px 20px",
              borderRadius: 14,
              border: "none",
              background: saving || role.managed ? "#4b5563" : "#7c3aed",
              color: "#fff",
              fontWeight: 900,
              cursor: saving || role.managed ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 22,
          background: "#111113",
          border: "1px solid #2d2d2d",
          borderRadius: 16,
          padding: 8,
          width: "fit-content",
        }}
      >
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            style={{
              padding: "11px 16px",
              borderRadius: 12,
              border: "none",
              background: tab === item.key ? "#7c3aed" : "transparent",
              color: tab === item.key ? "#fff" : "#b4b4bd",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div
          style={{
            background: "#171717",
            border: "1px solid #2d2d2d",
            borderRadius: 18,
            padding: 24,
            display: "grid",
            gap: 18,
            maxWidth: 860,
          }}
        >
          <h2 style={{ margin: 0 }}>Overview</h2>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontWeight: 900 }}>Role Name</span>
            <input
              value={name}
              disabled={role.managed}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #2d2d2d",
                background: "#09090b",
                color: "#fff",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontWeight: 900 }}>Role Color</span>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="color"
                value={color}
                disabled={role.managed}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: 64,
                  height: 46,
                  border: "none",
                  background: "transparent",
                  cursor: role.managed ? "not-allowed" : "pointer",
                }}
              />

              <input
                value={color}
                disabled={role.managed}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #2d2d2d",
                  background: "#09090b",
                  color: "#fff",
                  outline: "none",
                }}
              />
            </div>
          </label>

          <label
            style={{
              background: "#09090b",
              border: "1px solid #2d2d2d",
              borderRadius: 14,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>Display role members separately</strong>
              <p style={{ margin: "6px 0 0", color: "#8b8b95" }}>
                Shows members with this role separately in the member list.
              </p>
            </div>

            <input
              type="checkbox"
              checked={hoist}
              disabled={role.managed}
              onChange={(e) => setHoist(e.target.checked)}
            />
          </label>

          <label
            style={{
              background: "#09090b",
              border: "1px solid #2d2d2d",
              borderRadius: 14,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>Allow anyone to mention this role</strong>
              <p style={{ margin: "6px 0 0", color: "#8b8b95" }}>
                Users can mention this role using @{name}.
              </p>
            </div>

            <input
              type="checkbox"
              checked={mentionable}
              disabled={role.managed}
              onChange={(e) => setMentionable(e.target.checked)}
            />
          </label>
        </div>
      )}

      {tab === "permissions" && (
        <div
          style={{
            background: "#171717",
            border: "1px solid #2d2d2d",
            borderRadius: 18,
            padding: 24,
            display: "grid",
            gap: 16,
            maxWidth: 960,
          }}
        >
          <h2 style={{ margin: 0 }}>Permissions</h2>

          <input
            value={permissionSearch}
            onChange={(e) => setPermissionSearch(e.target.value)}
            placeholder="Search permissions..."
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid #2d2d2d",
              background: "#09090b",
              color: "#fff",
              outline: "none",
            }}
          />

          <div style={{ display: "grid", gap: 10 }}>
            {filteredPermissions.map((permission) => {
              const active = selectedPermissions.includes(permission);

              return (
                <button
                  key={permission}
                  onClick={() => !role.managed && togglePermission(permission)}
                  disabled={role.managed}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border: active ? "1px solid #22c55e" : "1px solid #2d2d2d",
                    background: active ? "rgba(34,197,94,.12)" : "#09090b",
                    color: "#fff",
                    cursor: role.managed ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 900,
                  }}
                >
                  <span>{formatPermissionName(permission)}</span>
                  <span style={{ color: active ? "#22c55e" : "#8b8b95" }}>
                    {active ? "Enabled" : "Disabled"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "members" && (
        <div
          style={{
            background: "#171717",
            border: "1px solid #2d2d2d",
            borderRadius: 18,
            padding: 24,
            maxWidth: 960,
            display: "grid",
            gap: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>Members with this role</h2>

          <input
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Search members..."
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid #2d2d2d",
              background: "#09090b",
              color: "#fff",
              outline: "none",
            }}
          />

          <div style={{ display: "grid", gap: 10 }}>
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  background: "#09090b",
                  border: "1px solid #2d2d2d",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <img
                  src={member.avatar}
                  alt=""
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <strong>{member.displayName}</strong>
                  <p style={{ margin: "4px 0 0", color: "#8b8b95" }}>
                    @{member.username}
                  </p>
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div style={{ color: "#8b8b95" }}>No members found.</div>
            )}
          </div>
        </div>
      )}

      {tab === "danger" && (
        <div
          style={{
            background: "#171717",
            border: "1px solid #7f1d1d",
            borderRadius: 18,
            padding: 24,
            display: "grid",
            gap: 16,
            maxWidth: 860,
          }}
        >
          <h2 style={{ margin: 0, color: "#ef4444" }}>Danger Zone</h2>

          <button
            onClick={cloneRole}
            disabled={role.managed}
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              border: "none",
              background: "#7c3aed",
              color: "#fff",
              fontWeight: 900,
              cursor: role.managed ? "not-allowed" : "pointer",
            }}
          >
            Clone Role
          </button>

          <button
            onClick={deleteRole}
            disabled={role.managed}
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontWeight: 900,
              cursor: role.managed ? "not-allowed" : "pointer",
            }}
          >
            Delete Role
          </button>
        </div>
      )}
    </div>
  );
}