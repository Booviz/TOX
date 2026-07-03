import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardV3 from "../../components/dashboard/dashboard-v3/DashboardV3";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <DashboardV3 />;
}