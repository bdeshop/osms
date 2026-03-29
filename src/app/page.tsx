"use client";

import Link from "next/link";
import { ArrowRight, Code, Zap, Shield, BookOpen } from "lucide-react";
import { API_BASE } from "@/services/api";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-amber-400">SMS Gateway</div>
          <div className="flex gap-4">
            <Link
              href="/adminLogin"
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Send SMS at Scale
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Simple, reliable, and affordable SMS gateway API for your business.
            Send messages to millions of users with just a few lines of code.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/api-docs"
              className="px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold flex items-center gap-2 transition-all"
            >
              View API Docs <ArrowRight size={20} />
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
            <Zap className="text-amber-400 mb-4" size={32} />
            <h3 className="text-white font-bold text-xl mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-400">
              Send SMS instantly with our high-speed infrastructure
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
            <Shield className="text-amber-400 mb-4" size={32} />
            <h3 className="text-white font-bold text-xl mb-2">Secure</h3>
            <p className="text-gray-400">
              Enterprise-grade security with token-based authentication
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
            <Code className="text-amber-400 mb-4" size={32} />
            <h3 className="text-white font-bold text-xl mb-2">Easy to Use</h3>
            <p className="text-gray-400">
              Simple REST API with code examples in multiple languages
            </p>
          </div>
        </div>

        {/* API Preview */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 mb-20">
          <h2 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
            <BookOpen className="text-amber-400" />
            Quick Example
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 mb-4">Send SMS with JavaScript:</p>
              <pre className="bg-gray-900 rounded p-4 text-amber-400 text-sm overflow-x-auto">
                {`const response = await fetch(
  '${API_BASE}/api/messaging/send',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: '8801772411171',
      message: 'Hello SMS'
    })
  }
);

const data = await response.json();
console.log(data);`}
              </pre>
            </div>
            <div>
              <p className="text-gray-400 mb-4">Or use cURL:</p>
              <pre className="bg-gray-900 rounded p-4 text-amber-400 text-sm overflow-x-auto">
                {`curl -X POST \\
  ${API_BASE}/api/messaging/send \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "8801772411171",
    "message": "Hello SMS"
  }'`}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-lg p-12">
          <h2 className="text-white font-bold text-3xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-8">
            Check out our complete API documentation with code examples
          </p>
          <Link
            href="/api-docs"
            className="inline-block px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold transition-all"
          >
            View Full Documentation →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-20 py-8 text-center text-gray-400">
        <p>© 2024 SMS Gateway. All rights reserved.</p>
      </footer>
    </div>
  );
}
