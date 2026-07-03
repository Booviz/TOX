"use client";

import { useEffect, useState } from "react";
import PermissionTargets from "./PermissionTargets";
import PermissionEditor from "./PermissionEditor";

type Permission = {
  id: string;
  type: number;
  name?: string;
  avatar?: string | null;
  allow: string[];
  deny: string[];
};

type Role = {
  id: string;
  name: string;
  color?: string;
  position?: number;
};

type Props = {
  guildId: string;
  channelId: string;
  permissions: Permission[];
};

export default function ChannelPermissionManager({
  guildId,
  channelId,
  permissions,
}: Props) {
  const [targets, setTargets] = useState<Permission[]>(permissions);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(
    permissions[0]?.id ?? null
  );

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleSearch, setRoleSearch] = useState("");

  const selectedPermission = targets.find(
    (permission) => permission.id === selectedTargetId
  );

  useEffect(() => {
    fetch(`http://localhost:3002/roles?guildId=${guildId}`)
      .then((r) => r.json())
      .then((d) => {
        setRoles(d.roles || []);
      });
  }, [guildId]);

async function addSelectedRole() {
  if (!selectedRole) return;

  const alreadyExists = targets.some(
    (target) => target.id === selectedRole.id
  );

  if (!alreadyExists) {
    const response = await fetch(
      "http://localhost:3002/channel/permissions/add-role",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guildId,
          channelId,
          roleId: selectedRole.id,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.error || "Failed to add role");
      return;
    }

    const newTarget: Permission = data.permission;

    setTargets((old) => [...old, newTarget]);
    setSelectedTargetId(selectedRole.id);
  } else {
    setSelectedTargetId(selectedRole.id);
  }

  setSelectedRole(null);
  setShowRoleModal(false);
}

  return (
    <>
      <div
        style={{
          marginTop: 30,
          display: "flex",
          gap: 18,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          style={{
            width: 240,
            flexShrink: 0,
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >
          <PermissionTargets
            guildId={guildId}
            targets={targets}
            selectedTargetId={selectedTargetId}
            onSelect={setSelectedTargetId}
            onAddRole={() => setShowRoleModal(true)}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: "#09090b",
            border: "1px solid #2d2d2d",
            borderRadius: 14,
            padding: 16,
          }}
        >

            {selectedPermission && selectedPermission.name !== "@everyone" && (
  <button
    onClick={async () => {
      if (!confirm(`Remove ${selectedPermission.name}?`)) return;

      const response = await fetch(
        "http://localhost:3002/channel/permissions/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guildId,
            channelId,
            targetId: selectedPermission.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.error || "Failed to remove");
        return;
      }

      setTargets((old) =>
        old.filter((target) => target.id !== selectedPermission.id)
      );

       setSelectedTargetId(targets[0]?.id ?? null);
        }}
         style={{
          marginBottom: 14,
          padding: "10px 14px",
          borderRadius: 10,
          border: "none",
          background: "#dc2626",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 800,
        }}
        >
          Remove {selectedPermission.name}
       </button>
        )}

          {selectedPermission ? (
            <PermissionEditor
              guildId={guildId}
              channelId={channelId}
              targetId={selectedPermission.id}
              targetName={selectedPermission.name || selectedPermission.id}
              allow={selectedPermission.allow}
              deny={selectedPermission.deny}
            />
          ) : (
            <div style={{ color: "#8b8b95" }}>
              No permission target selected.
            </div>
          )}
        </div>
      </div>

      {showRoleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 420,
              background: "#111113",
              border: "1px solid #2d2d2d",
              borderRadius: 18,
              padding: 22,
              color: "#fff",
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Add Role</h2>

            <input
  value={roleSearch}
  onChange={(e) => setRoleSearch(e.target.value)}
  placeholder="Search role..."
  style={{
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #2d2d2d",
    background: "#09090b",
    color: "#fff",
    marginBottom: 14,
  }}
/>

            <div style={{ display: "grid", gap: 10, maxHeight: 300, overflowY: "auto" }}>
             {roles
  .filter((role) => {
    if (role.name === "@everyone") return false;
    if (role.name.trim() === "") return false;
    if (!role.name.toLowerCase().includes(roleSearch.toLowerCase())) return false;

    return !targets.some((target) => target.id === role.id);
  })
  .map((role) => (
        <button
           key={role.id}
           onClick={() => setSelectedRole(role)}
           style={{
           textAlign: "left",
           padding: "12px 14px",
           borderRadius: 12,
           border:
          selectedRole?.id === role.id
            ? "1px solid #7c3aed"
            : "1px solid #2d2d2d",
           background:
          selectedRole?.id === role.id
            ? "rgba(124,58,237,.18)"
            : "#09090b",
           color: role.color && role.color !== "#000000" ? role.color : "#fff",
           cursor: "pointer",
           fontWeight: 800,
        }}
         >
         🛡️ {role.name}
         </button>
         ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedRole(null);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#374151",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>

              <button
                onClick={addSelectedRole}
                disabled={!selectedRole}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: selectedRole ? "#7c3aed" : "#4b5563",
                  color: "#fff",
                  cursor: selectedRole ? "pointer" : "not-allowed",
                  fontWeight: 700,
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}