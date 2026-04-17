// components/common/ChatWidget.tsx
"use client";

import { Send, Phone } from "lucide-react";

export default function ChatWidget() {
  return (
    <div className="fixed bottom-72 shadow right-1 z-50 flex flex-col items-end gap-4 bg-white">
      {/* Expanded options (can be toggled) */}
      <div className="flex flex-col gap-3">
        <div className="p-2  border-b">
          <Send className="h-6 w-6" />
        </div>
        <div className="p-2 border-b">
          <Phone className="h-6 w-6" />
        </div>
        <div className="p-2">
          <Phone className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
