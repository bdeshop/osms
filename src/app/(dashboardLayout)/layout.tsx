"use client";

import DashboardHeader from "@/sidebar/DashboardHeader";
import DashboardSidebarWrapper from "@/sidebar/DashboardSidebarWrapper";
import RoleProtectedLayout from "@/components/RoleProtectedLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtectedLayout allowedRoles={["ADMIN", "USER"]}>
      <div className="flex min-h-screen bg-gray-900 overflow-x-hidden" suppressHydrationWarning>
        {/* Sidebar - Internal logic handles Desktop/Mobile visibility */}
        <DashboardSidebarWrapper />

        <div className="flex flex-col flex-1 min-w-0">
          {/* Sticky Header */}
          <DashboardHeader />

          <main className="flex-1 bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleProtectedLayout>
  );
}
