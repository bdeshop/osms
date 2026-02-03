// app/register/page.tsx  (or components/auth/Register.tsx)
"use client";

import { useState } from "react";
import Link from "next/link";

const RegisterUser = () => {
  const [contactType, setContactType] = useState("telegram");

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="w-full mx-auto grid md:grid-cols-2 gap-0 md:gap-12 items-center lg:gap-16 px-6 py-12 md:p-12 lg:p-16">

        {/* LEFT SIDE - Marketing & Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center text-center relative">
          {/* Logo */}
          <div className="absolute top-0 left-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                LL
              </div>
              <span className="text-2xl font-bold text-purple-700">Laaffic</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-16 mb-6 leading-tight">
            SMS Drives Your Brand
            Forward
          </h1>

          <p className="text-xl text-gray-600 mb-12">
            Trusted Gaming Marketing Solution Provider
          </p>

          {/* Illustration Placeholder */}
          <div className="relative w-full  rounded-3xl overflow-hidden ">
            {/* Replace src with your actual illustration */}
            <img
              src="https://my.laaffic.com/img/logo.8d2ec636.png"
              alt="Gaming marketing illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE - Signup Form */}
        <div className="bg-white   p-8 md:p-10 lg:p-12 relative">
          {/* Language Selector */}
          <div className="absolute top-6 right-6">
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>English</option>
              <option>বাংলা</option>
            </select>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">              Sign In
          </h2>

          <form className="space-y-6 mt-8">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                * Username
              </label>
              <input
                type="text"
                placeholder="Please enter username(6-30)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * Password
                </label>
                <input
                  type="password"
                  placeholder="Please enter password(8-32)"
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password(8-32)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                * contact details
              </label>
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="telegram">telegram</option>
                  <option value="whatsapp">whatsapp</option>
                  <option value="discord">discord</option>
                </select>
                <input
                  type="text"
                  placeholder="pleaseEnter"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Email + Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * Email
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreement"
                className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="agreement" className="text-sm text-gray-600">
                Review and accept{" "}
                <Link href="#" className="text-purple-600 hover:underline">
                  Laaffic Platform User Service Agreement
                </Link>
                <br />
                I agree to receive SMS messages. Message and data charges may apply. Reply STOP to opt out.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-pink-600 hover:to-purple-700 transition shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-600 hover:underline font-medium">
              Login here
            </Link>
            <p className="mt-4">© 2026 Laaffic PTE. LTD.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterUser;