"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import {
  Settings,
  Save,
  AlertCircle,
  CheckCircle,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";

interface Setting {
  _id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching admin settings");
      const response = (await adminAPI.getSettings()) as any;
      console.log("✅ Settings fetched:", response.data);
      setSettings(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-amber-500" size={32} />
            <h1 className="text-4xl font-bold text-white">Admin Settings</h1>
          </div>
          <p className="text-gray-400">Configure system settings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400 shrink-0" size={20} />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-400 shrink-0" size={20} />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* All Settings Display */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            All System Settings
          </h2>

          {settings.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400">No settings configured yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.map((setting) => (
                <div
                  key={setting._id}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">
                        {setting.key}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {setting.value}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Updated: {new Date(setting.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
