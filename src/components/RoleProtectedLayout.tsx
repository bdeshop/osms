"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only run once
    if (hasChecked) return;
    setHasChecked(true);

    try {
      // Get user from localStorage
      const userStr = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      console.log("RoleProtectedLayout - Checking auth:", {
        hasToken: !!authToken,
        hasUser: !!userStr,
      });

      if (!authToken || !userStr) {
        console.log("No auth token or user, redirecting to /adminLogin");
        router.push("/adminLogin");
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userRole = user.role;

      console.log("User role from localStorage:", userRole);
      console.log("Allowed roles:", allowedRoles);

      // Check if user role is allowed for this route
      if (!allowedRoles.includes(userRole)) {
        console.log("User role not allowed for this route, redirecting...");
        // Redirect to appropriate dashboard based on role
        if (userRole === "ADMIN") {
          console.log("Redirecting to /admin/overview");
          router.push("/admin/overview");
        } else if (userRole === "USER") {
          console.log("Redirecting to /user/overview");
          router.push("/user/overview");
        } else {
          console.log("Unknown role, redirecting to /adminLogin");
          router.push("/adminLogin");
        }
        setIsLoading(false);
        return;
      }

      console.log("User authorized");
      setIsAuthorized(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/adminLogin");
      setIsLoading(false);
    }
  }, [hasChecked, router, allowedRoles]);

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
