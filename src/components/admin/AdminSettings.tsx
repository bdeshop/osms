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
  const [oraclePayToken, setOraclePayToken] = useState("");
  const [showToken, setShowToken] = useState(false);

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

      // Find OraclePay token
      const tokenSetting = response.data?.find(
        (s: Setting) => s.key === "ORACLEPAY_BUSINESS_TOKEN",
      );
      if (tokenSetting) {
        setOraclePayToken(tokenSetting.value);
      }
    } catch (err) {
      console.error("❌ Failed to fetch settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOraclePayToken = async () => {
    try {
      if (!oraclePayToken.trim()) {
        setError("OraclePay Business Token cannot be empty");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      console.log("💾 Saving OraclePay token");
      const response = (await adminAPI.updateSetting(
        "ORACLEPAY_BUSINESS_TOKEN",
        oraclePayToken,
      )) as any;

      console.log("✅ Token saved successfully:", response.data);
      setSuccess("OraclePay Business Token saved successfully!");

      // Refresh settings
      await fetchSettings();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to save token:", err);
      setError("Failed to save OraclePay token. Please try again.");
    } finally {
      setSaving(false);
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
          <p className="text-gray-400">
            Configure system settings and payment integrations
          </p>
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

        {/* OraclePay Settings Card */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              OraclePay Configuration
            </h2>
            <p className="text-gray-400 text-sm">
              Add your OraclePay Business Token to enable payment processing
            </p>
          </div>

          <div className="space-y-4">
            {/* Token Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                OraclePay Business Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={oraclePayToken}
                  onChange={(e) => setOraclePayToken(e.target.value)}
                  placeholder="Paste your OraclePay Business Token here"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-12"
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Get your token from your OraclePay dashboard. Keep it secure!
              </p>
            </div>

            {/* Current Status */}
            {oraclePayToken && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 text-sm">
                  ✓ OraclePay is configured and ready to use
                </p>
              </div>
            )}

            {!oraclePayToken && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠ OraclePay is not configured. Users cannot make payments.
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveOraclePayToken}
              disabled={saving || !oraclePayToken.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save OraclePay Token
                </>
              )}
            </button>
          </div>
        </div>

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
                        {setting.key === "ORACLEPAY_BUSINESS_TOKEN"
                          ? "••••••••" + setting.value.slice(-8)
                          : setting.value}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Updated: {new Date(setting.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {setting.key === "ORACLEPAY_BUSINESS_TOKEN" && (
                      <div className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1">
                        <p className="text-green-400 text-xs font-semibold">
                          Active
                        </p>
                      </div>
                    )}
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
