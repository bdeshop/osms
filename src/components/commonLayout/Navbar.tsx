import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          o-sms
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            href="#"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
          >
            Solutions
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
          >
            Partners
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
          >
            Resources
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
          >
            Contact Us
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex gap-4 items-center">
          <select className="text-gray-700 text-sm border-0 bg-transparent hover:text-pink-600">
            <option>English</option>
            <option>বাংলা</option>
          </select>
          <Link
            href="/login"
            className="text-gray-700 hover:text-pink-600 font-medium text-sm"
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
