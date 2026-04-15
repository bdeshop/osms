"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const products = [
    {
      name: "SMS Marketing",
      description: "Send bulk SMS campaigns",
      href: "/products/sms",
      icon: "📱",
    },
    {
      name: "Voice Services",
      description: "AI-powered voice calls",
      href: "/products/voice",
      icon: "📞",
    },
    {
      name: "OTP Services",
      description: "Secure OTP delivery",
      href: "/products/otp",
      icon: "🔐",
    },
    {
      name: "WhatsApp",
      description: "WhatsApp business messaging",
      href: "/products/whatsapp",
      icon: "💬",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          o-sms
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Products with Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <button className="text-gray-700 hover:text-pink-600 font-medium text-sm flex items-center gap-1 transition-colors">
              Products
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isProductsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 mt-0 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${
                isProductsOpen
                  ? "opacity-100 visible scale-y-100"
                  : "opacity-0 invisible scale-y-95"
              }`}
              style={{
                transformOrigin: "top",
              }}
            >
              <div className="py-2">
                {products.map((product, idx) => (
                  <Link
                    key={idx}
                    href={product.href}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-pink-50 transition-colors group/item"
                  >
                    <span className="text-xl mt-0.5">{product.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover/item:text-pink-600 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {product.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* View All Link */}
              <Link
                href="/products"
                className="block px-4 py-3 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-colors text-center"
              >
                View All Products →
              </Link>
            </div>
          </div>

          <Link
            href="/packages"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors"
          >
            Packages
          </Link>
          <Link
            href="/docs"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex gap-4 items-center">
          <select className="text-gray-700 text-sm border-0 bg-transparent hover:text-pink-600 cursor-pointer">
            <option>English</option>
            <option>বাংলা</option>
          </select>
          <Link
            href="/login"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/user-register"
            className="px-6 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-all text-sm"
          >
            Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}
