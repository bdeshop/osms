import { DUMMY_USER } from "@/lib/dummyAuth";
import DashboardHeader from "@/sidebar/DashboardHeader";
import DashboardSidebar from "@/sidebar/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/10">
      <DashboardSidebar role={DUMMY_USER.role} />

      <div className="flex flex-col flex-1">
        <DashboardHeader  />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

    </div>
  );
}