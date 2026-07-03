import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import ServerPageLayout from "../../../../components/dashboard/server-dashboard/ServerPageLayout";

type Member = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  joinedAt: number;
  roles: {
    id: string;
    name: string;
  }[];
};

export default async function MembersPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return <div>Unauthorized</div>;
  }

  const response = await fetch(
    `http://localhost:3002/members?guildId=${guildId}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();
  const members: Member[] = data.members ?? [];

  return (
    <ServerPageLayout guildId={guildId} active="Members">
      <div
        style={{
          minHeight: "100vh",
          background: "#09090b",
          color: "#fff",
          padding: 40,
        }}
      >
        <h1
          style={{
            fontSize: 38,
            marginBottom: 8,
          }}
        >
          Members
        </h1>

        <p
          style={{
            color: "#8b8b95",
            marginBottom: 30,
          }}
        >
          Manage Discord members for this server.
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#171717",
                border: "1px solid #2d2d2d",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <img
                src={member.avatar}
                alt={member.displayName}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  {member.displayName}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#8b8b95",
                  }}
                >
                  @{member.username}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {member.roles.length > 0 ? (
                  member.roles.map((role) => (
                    <span
                      key={role.id}
                      style={{
                        background: "rgba(124,58,237,.18)",
                        color: "#c4b5fd",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 13,
                      }}
                    >
                      {role.name}
                    </span>
                  ))
                ) : (
                  <span
                    style={{
                      color: "#8b8b95",
                    }}
                  >
                    No roles
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ServerPageLayout>
  );
}