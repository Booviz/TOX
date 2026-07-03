import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import ServerPageLayout from "../../../../components/dashboard/server-dashboard/ServerPageLayout";
import RolesManager from "../../../../components/dashboard/server-dashboard/RolesManager";

type Role = {
  id: string;
  name: string;
  color: string;
  position: number;
  members: number;
};

export default async function RolesPage({
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
    `http://localhost:3002/roles?guildId=${guildId}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();
  const roles: Role[] = data.roles ?? [];

  return (
    <ServerPageLayout guildId={guildId} active="Roles">
      <h1
        style={{
          fontSize: 38,
          marginBottom: 8,
          color: "#fff",
        }}
      >
        Roles
      </h1>

      <p
        style={{
          color: "#8b8b95",
          marginBottom: 30,
        }}
      >
        Manage Discord roles for this server.
      </p>

      <RolesManager guildId={guildId} roles={roles} />
    </ServerPageLayout>
  );
}