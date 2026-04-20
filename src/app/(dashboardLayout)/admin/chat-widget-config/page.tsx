"use client";

import ChatWidgetConfigManager from "@/components/admin/ChatWidgetConfigManager";

export default function ChatWidgetConfigPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Chat Widget Configuration
        </h1>
        <p className="text-gray-400">
          Manage the floating contact widget shown on your website — email,
          phone and WhatsApp links.
        </p>
      </div>

      <ChatWidgetConfigManager />
    </div>
  );
}
