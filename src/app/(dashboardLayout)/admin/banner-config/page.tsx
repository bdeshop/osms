"use client";

import BannerConfigManager from "@/components/admin/BannerConfigManager";

export default function AdminBannerConfigPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black p-4 md:p-8">
      <BannerConfigManager />
    </div>
  );
}
