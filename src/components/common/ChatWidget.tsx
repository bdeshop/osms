// components/common/ChatWidget.tsx
"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { publicAPI } from "@/services/api";

interface ChatWidgetConfig {
  email: string;
  phone: string;
  whatsapp: string;
  isActive: boolean;
}

export default function ChatWidget() {
  const [config, setConfig] = useState<ChatWidgetConfig | null>(null);

  useEffect(() => {
    publicAPI
      .getChatWidgetConfig()
      .then((res: any) => {
        if (res?.success && res?.data) {
          setConfig(res.data);
        }
      })
      .catch(() => {
        // silently fail — widget just won't render
      });
  }, []);

  // Don't render until loaded, or if disabled
  if (!config || !config.isActive) return null;

  const hasAny = config.email || config.phone || config.whatsapp;
  if (!hasAny) return null;

  return (
    <div className="fixed bottom-72 shadow right-1 z-50 flex flex-col items-end gap-4 bg-white">
      <div className="flex flex-col gap-3">
        {/* Email */}
        {config.email && (
          <a
            href={`mailto:${config.email}`}
            className="p-3 border-b hover:bg-gray-100 transition cursor-pointer"
            title={config.email}
          >
            <Mail className="h-6 w-6 text-blue-600" />
          </a>
        )}

        {/* Phone */}
        {config.phone && (
          <a
            href={`tel:${config.phone}`}
            className="p-3 border-b hover:bg-gray-100 transition cursor-pointer"
            title={config.phone}
          >
            <Phone className="h-6 w-6 text-green-600" />
          </a>
        )}

        {/* WhatsApp */}
        {config.whatsapp && (
          <a
            href={`https://wa.me/${config.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 hover:bg-gray-100 transition cursor-pointer"
            title={config.whatsapp}
          >
            <MessageCircle className="h-6 w-6 text-green-500" />
          </a>
        )}
      </div>
    </div>
  );
}
