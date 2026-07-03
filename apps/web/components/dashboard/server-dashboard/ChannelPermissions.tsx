type Permission = {
  id: string;
  type: number;
  name?: string;
  avatar?: string | null;
  allow: string[];
  deny: string[];
};

type Props = {
  permissions: Permission[];
};

function formatPermissionName(name: string) {
  return name.replace(/([A-Z])/g, " $1").trim();
}

export default function ChannelPermissions({ permissions }: Props) {
  return (
    <>
      <hr
        style={{
          margin: "30px 0",
          border: "1px solid #2d2d2d",
        }}
      />

      <h2 style={{ marginBottom: 20, fontSize: 22 }}>
        Permissions
      </h2>

      <div style={{ display: "grid", gap: 12 }}>
        {permissions?.length > 0 ? (
          permissions.map((permission) => (
            <div
              key={permission.id}
              style={{
                background: "#09090b",
                border: "1px solid #2d2d2d",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 12 }}>
                {permission.type === 0 ? "🛡️" : "👤"}{" "}
                {permission.name || permission.id}
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                {permission.allow?.map((item) => (
                  <div key={`allow-${item}`} style={{ color: "#4ade80" }}>
                    ✅ {formatPermissionName(item)}
                  </div>
                ))}

                {permission.deny?.map((item) => (
                  <div key={`deny-${item}`} style={{ color: "#ef4444" }}>
                    ❌ {formatPermissionName(item)}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              color: "#8b8b95",
              background: "#09090b",
              border: "1px solid #2d2d2d",
              borderRadius: 12,
              padding: 14,
            }}
          >
            No custom permissions for this channel.
          </div>
        )}
      </div>
    </>
  );
}