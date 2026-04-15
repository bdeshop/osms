"use client";

import FooterConfigManager from "@/components/admin/FooterConfigManager";

export default function FooterConfigPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Footer Configuration
        </h1>
        <p className="text-gray-400">
          Manage your website footer company info, sections, and social media
          links. All changes support English and Bangla.
        </p>
      </div>

      <FooterConfigManager />
    </div>
  );
}
