import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import ServerPageLayout from "../../../../../components/dashboard/server-dashboard/ServerPageLayout";
import RoleDetailsManager from "../../../../../components/dashboard/server-dashboard/RoleDetailsManager";

export default async function RoleDetailsPage({
  params,
}: {
  params: Promise<{
    guildId: string;
    roleId: string;
  }>;
}) {
  const { guildId, roleId } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return <div>Unauthorized</div>;
  }

  const roleResponse = await fetch(
    `http://localhost:3002/role?guildId=${guildId}&roleId=${roleId}`,
    { cache: "no-store" }
  );

  const roleData = await roleResponse.json();

  const permissionsResponse = await fetch("http://localhost:3002/permissions", {
    cache: "no-store",
  });

  const permissionsData = await permissionsResponse.json();

  return (
    <ServerPageLayout guildId={guildId} active="Roles">
      <RoleDetailsManager
        guildId={guildId}
        role={roleData.role}
        members={roleData.members || []}
        permissions={permissionsData.permissions || []}
      />
    </ServerPageLayout>
  );
}