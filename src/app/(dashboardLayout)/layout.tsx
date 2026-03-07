import { DUMMY_USER } from "@/lib/dummyAuth";
import DashboardHeader from "@/sidebar/DashboardHeader";
import DashboardSidebar from "@/sidebar/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <DashboardSidebar role={DUMMY_USER.role} />

      <div className="flex flex-col flex-1">
        <DashboardHeader />

        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {children}
        </main>
      </div>
    </div>
  );
}
