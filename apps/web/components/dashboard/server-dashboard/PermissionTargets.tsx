"use client";

type PermissionTarget = {
  id: string;
  type: number;
  name?: string;
  avatar?: string | null;
};

type Props = {
  guildId: string;
  targets: PermissionTarget[];
  selectedTargetId: string | null;
  onSelect: (targetId: string) => void;
  onAddRole: () => void;
};

export default function PermissionTargets({
  targets,
  selectedTargetId,
  onSelect,
  onAddRole,
}: Props) {
  return (
    <div
      style={{
        background: "#09090b",
        border: "1px solid #2d2d2d",
        borderRadius: 14,
        padding: 16,
        display: "grid",
        gap: 10,
        alignSelf: "start",
        height: "fit-content",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>Permission Targets</h3>

      <button
        onClick={onAddRole}
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px dashed #7c3aed",
          background: "rgba(124,58,237,.12)",
          color: "#c4b5fd",
          cursor: "pointer",
          fontWeight: 800,
          textAlign: "left",
        }}
      >
        + Add Role
      </button>

      {targets.map((target) => (
        <button
          key={target.id}
          onClick={() => onSelect(target.id)}
          style={{
            textAlign: "left",
            padding: "12px 14px",
            borderRadius: 12,
            border:
              selectedTargetId === target.id
                ? "1px solid #7c3aed"
                : "1px solid #2d2d2d",
            background:
              selectedTargetId === target.id
                ? "rgba(124,58,237,.18)"
                : "#111113",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          {target.type === 0 ? "🛡️" : "👤"} {target.name || target.id}
        </button>
      ))}
    </div>
  );
}