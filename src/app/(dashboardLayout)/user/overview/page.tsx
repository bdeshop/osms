import UserDashboard from "@/components/dashboard/UserDashboard";

export const metadata = {
  title: "User Dashboard - SMS Gateway",
  description: "Select packages and manage your SMS sending",
};

export default function UserOverviewPage() {
  return <UserDashboard />;
}
