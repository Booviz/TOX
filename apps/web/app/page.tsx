import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import DashboardV3 from "../components/dashboard/dashboard-v3/DashboardV3";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DashboardV3 />
    </>
  );
}