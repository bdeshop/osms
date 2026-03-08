"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader } from "lucide-react";

interface RoleProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleProtectedLayout({
  children,
  allowedRoles,
}: RoleProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem("user");
        const authToken = localStorage.getItem("authToken");

        if (!authToken || !userStr) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(userStr);
        const userRole = user.role;

        // Check if user role is allowed for this route
        if (!allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard based on role
          if (userRole === "ADMIN") {
            router.push("/admin/overview");
          } else if (userRole === "USER") {
            router.push("/user/overview");
          } else {
            router.push("/login");
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
