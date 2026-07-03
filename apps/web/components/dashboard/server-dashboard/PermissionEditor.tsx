"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  guildId: string;
  channelId: string;
  targetId: string;
  targetName: string;
  allow: string[];
  deny: string[];
};

type PermissionState = "allow" | "inherit" | "deny";

const PERMISSION_GROUPS = [
  {
    title: "General Permissions",
    permissions: [
      "ViewChannel",
      "ManageChannels",
      "ManageRoles",
      "ManageWebhooks",
      "ViewAuditLog",
    ],
  },
  {
    title: "Membership Permissions",
    permissions: [
      "CreateInstantInvite",
      "KickMembers",
      "BanMembers",
      "ModerateMembers",
    ],
  },
  {
    title: "Text Channel Permissions",
    permissions: [
      "SendMessages",
      "SendMessagesInThreads",
      "CreatePublicThreads",
      "CreatePrivateThreads",
      "EmbedLinks",
      "AttachFiles",
      "AddReactions",
      "UseExternalEmojis",
      "UseExternalStickers",
      "MentionEveryone",
      "ManageMessages",
      "ManageThreads",
      "ReadMessageHistory",
      "SendTTSMessages",
      "SendPolls",
    ],
  },
  {
    title: "Voice Channel Permissions",
    permissions: [
      "Connect",
      "Speak",
      "Stream",
      "MuteMembers",
      "DeafenMembers",
      "MoveMembers",
      "UseVAD",
      "PrioritySpeaker",
      "UseSoundboard",
      "UseExternalSounds",
      "SendVoiceMessages",
      "SetVoiceChannelStatus",
    ],
  },
  {
    title: "Advanced Permissions",
    permissions: [
      "Administrator",
      "UseApplicationCommands",
      "UseEmbeddedActivities",
      "UseExternalApps",
      "ViewCreatorMonetizationAnalytics",
      "CreateEvents",
      "CreateGuildExpressions",
    ],
  },
];

function formatPermissionName(name: string) {
  return name.replace(/([A-Z])/g, " $1").trim();
}

export default function PermissionEditor({
  guildId,
  channelId,
  targetId,
  targetName,
  allow,
  deny,
}: Props) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [states, setStates] = useState<Record<string, PermissionState>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3002/permissions")
      .then((r) => r.json())
      .then((d) => {
        setPermissions(d.permissions || []);

        const initialStates: Record<string, PermissionState> = {};

        (d.permissions || []).forEach((permission: string) => {
          if (allow.includes(permission)) initialStates[permission] = "allow";
          else if (deny.includes(permission)) initialStates[permission] = "deny";
          else initialStates[permission] = "inherit";
        });

        setStates(initialStates);
      });
  }, [allow, deny]);

  const groupedPermissions = useMemo(() => {
    const used = new Set(PERMISSION_GROUPS.flatMap((g) => g.permissions));
    const extra = permissions.filter((p) => !used.has(p));

    const groups = [
      ...PERMISSION_GROUPS.map((group) => ({
        ...group,
        permissions: group.permissions.filter((p) => permissions.includes(p)),
      })).filter((group) => group.permissions.length > 0),
      ...(extra.length
        ? [{ title: "Other Permissions", permissions: extra }]
        : []),
    ];

    if (!search.trim()) return groups;

    return groups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter((permission) =>
          formatPermissionName(permission)
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [permissions, search]);

  function setPermission(permission: string, value: PermissionState) {
    setStates((old) => ({
      ...old,
      [permission]: value,
    }));
  }

  async function savePermissions() {
    const response = await fetch(
      "http://localhost:3002/channel/permissions/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guildId,
          channelId,
          targetId,
          permissions: states,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert(`Permissions updated for ${targetName}!`);
    } else {
      alert(data.error || "Failed");
    }
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <h3 style={{ color: "#a78bfa" }}>Editing: {targetName}</h3>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Permissions..."
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #2d2d2d",
          background: "#09090b",
          color: "#fff",
          outline: "none",
        }}
      />

      {groupedPermissions.map((group) => (
        <div key={group.title} style={{ display: "grid", gap: 10 }}>
          <h3 style={{ marginTop: 8, color: "#fff" }}>{group.title}</h3>

          {group.permissions.map((permission) => {
            const current = states[permission] || "inherit";

            return (
              <div
                key={permission}
                style={{
                  background: "#09090b",
                  border: "1px solid #2d2d2d",
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {formatPermissionName(permission)}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setPermission(permission, "allow")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: current === "allow" ? "#16a34a" : "#1f2937",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Allow
                  </button>

                  <button
                    onClick={() => setPermission(permission, "inherit")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: current === "inherit" ? "#6b7280" : "#1f2937",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Inherit
                  </button>

                  <button
                    onClick={() => setPermission(permission, "deny")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: current === "deny" ? "#dc2626" : "#1f2937",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Deny
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <button
        onClick={savePermissions}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          background: "#7c3aed",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        Save Permissions
      </button>
    </div>
  );
}