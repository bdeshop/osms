"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { API_BASE } from "@/services/api";

export default function UserLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/user-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token and user data
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      // Redirect to user dashboard
      router.push("/user/overview");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pink-50 to-white">
      <div className="w-full mx-auto items-center grid md:grid-cols-2 gap-0 md:gap-12 lg:gap-16 px-6 py-12 md:p-12 lg:p-16">
        {/* LEFT SIDE - Marketing & Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center text-center relative">
          {/* Logo */}
          <div className="absolute top-0 left-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                LA
              </div>
              <span className="text-2xl font-bold text-pink-600">Laaffic</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-16 mb-6 leading-tight">
            SMS Drives Your Brand Forward
          </h1>

          <p className="text-xl text-gray-600 mb-12">
            Trusted Gaming Marketing Solution Provider
          </p>

          {/* Illustration Placeholder */}
          <div className="relative w-full rounded-3xl overflow-hidden">
            <img
              src="https://my.laaffic.com/img/logo.8d2ec636.png"
              alt="Gaming marketing illustration"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mt-10 text-gray-600 text-lg">
            5,000+ brands rely on Laaffic to power their Gaming marketing
          </p>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="bg-white p-8 md:p-10 lg:p-12 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-gray-600 text-sm mb-8">
            Welcome back! Please login to your account
          </p>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mb-6 border border-red-200">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-600/40 hover:shadow-pink-600/60 hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/user-register"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Sign up here
            </Link>
            <p className="mt-4 text-xs text-gray-500">
              © 2026 Laaffic PTE. LTD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
