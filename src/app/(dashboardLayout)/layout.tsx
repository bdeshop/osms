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
      <div className="flex min-h-screen bg-gray-900">
        {/* Sticky Sidebar */}
        <div className="sticky top-0 h-screen">
          <DashboardSidebarWrapper />
        </div>

        <div className="flex flex-col flex-1">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40">
            <DashboardHeader />
          </div>

          <main className="flex-1 bg-linear-to-br from-gray-900 via-gray-800 to-black overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleProtectedLayout>
  );
}
