import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Laaffic
        </Link>
        <div className="flex gap-4">
          <Link
            href="/docs"
            className="px-6 py-2 rounded-lg border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold transition-all"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 rounded-lg border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold transition-all"
          >
            Login
          </Link>
          <Link
            href="/user-register"
            className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
