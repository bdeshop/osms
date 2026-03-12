"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // Check if user already has a token and redirect to dashboard
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");

        if (authToken && userStr) {
          const user = JSON.parse(userStr);
          const userRole = user.role;

          if (userRole === "ADMIN") {
            router.replace("/admin/overview");
            return;
          } else if (userRole === "USER") {
            router.replace("/user/overview");
            return;
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call backend API using the service
      const data = (await authAPI.login(email, password)) as any;

      console.log("Login response:", data);

      // Store token and user data in localStorage and cookies
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Also set cookie for middleware to work
        document.cookie = `authToken=${data.data.token}; path=/; max-age=86400`;

        console.log("Stored user:", data.data.user);
      }

      // Redirect based on role
      const userRole = data.data?.user?.role;
      console.log("User role:", userRole);

      if (userRole === "ADMIN") {
        console.log("Redirecting to /admin/overview");
        router.replace("/admin/overview");
      } else if (userRole === "USER") {
        console.log("Redirecting to /user/overview");
        router.replace("/user/overview");
      } else {
        console.log("Unknown role, redirecting to /adminLogin");
        router.replace("/adminLogin");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-amber-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated background with reduced animation */}
      <div
        className="absolute inset-0 bg-linear-to-br from-gray-800 via-gray-900 to-black opacity-90 animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      {/* Card */}
      <div className="relative z-10 bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl p-10 w-full max-w-md shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Avatar icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="#1a1a1a"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              <circle cx="19" cy="11" r="4" fill="#f59e0b" />
              <path
                d="M17.5 11h3M19 9.5v3"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-white mb-7 tracking-wide">
          Admin Login
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg mb-4 border border-red-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="block text-gray-300 text-sm font-medium"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="block text-gray-300 text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:bg-amber-500/10 p-1 rounded transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-linear-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60 hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                Login
              </>
            )}
          </button>

          {/* Signup link */}
          <div className="mt-6 pt-6 border-t border-gray-600">
            <p className="text-center text-gray-400 text-sm mb-4">
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-gray-600 hover:border-amber-500/50"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
