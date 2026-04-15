"use client";

import NavbarConfigManager from "@/components/admin/NavbarConfigManager";

export default function NavbarConfigPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Navbar Configuration
        </h1>
        <p className="text-gray-400">
          Manage your website navbar logo, text, and products menu. All changes
          support English and Bangla.
        </p>
      </div>

      <NavbarConfigManager />
    </div>
  );
}
