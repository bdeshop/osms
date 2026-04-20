"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  Power,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatWidgetConfig {
  email: string;
  phone: string;
  whatsapp: string;
  isActive: boolean;
}

export default function ChatWidgetConfigManager() {
  const [config, setConfig] = useState<ChatWidgetConfig>({
    email: "",
    phone: "",
    whatsapp: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = (await adminAPI.getChatWidgetConfig()) as any;
      if (response.success) {
        setConfig(response.data);
      } else {
        setError(response.message || "Failed to load configuration");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const response = (await adminAPI.updateChatWidgetConfig(config)) as any;
      if (response.success) {
        setConfig(response.data);
        setSuccess("Chat widget configuration saved successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Failed to save configuration");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader className="animate-spin text-amber-500 mr-3" size={24} />
        <span className="text-gray-400 font-medium">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border backdrop-blur-md ${
              error
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span className="text-sm font-semibold">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Config Form */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle size={18} className="text-amber-500" />
                Contact Details
              </CardTitle>
              <CardDescription>
                Set the email, phone and WhatsApp number shown in the floating chat widget.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={12} className="text-blue-400" /> Email Address
                </label>
                <Input
                  type="email"
                  placeholder="service@example.com"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  className="bg-black/20 border-white/5 text-white placeholder:text-gray-600"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={12} className="text-green-400" /> Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={config.phone}
                  onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                  className="bg-black/20 border-white/5 text-white placeholder:text-gray-600"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageCircle size={12} className="text-green-500" /> WhatsApp Number
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  value={config.whatsapp}
                  onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                  className="bg-black/20 border-white/5 text-white placeholder:text-gray-600"
                />
                <p className="text-[11px] text-gray-500">
                  Enter the full number including country code (e.g. +63xxxxxxxxxx)
                </p>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Power size={16} className={config.isActive ? "text-amber-500" : "text-gray-500"} />
                  <div>
                    <p className="text-sm font-bold text-white">Widget Visibility</p>
                    <p className="text-xs text-gray-500">
                      {config.isActive ? "Chat widget is visible on the website" : "Chat widget is hidden"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    config.isActive ? "bg-amber-500" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      config.isActive ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold"
              >
                {saving ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-1">
          <Card className="bg-gray-900 border-white/5 sticky top-6">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <MessageCircle size={14} className="text-amber-500" />
                Live Preview
              </CardTitle>
              <CardDescription className="text-xs">
                How the widget appears on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-800 rounded-xl h-64 border border-white/5 overflow-hidden">
                {/* Simulated website background */}
                <div className="absolute inset-0 p-4 space-y-2 opacity-20">
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-1/2" />
                  <div className="h-3 bg-white/20 rounded w-2/3" />
                </div>

                {/* Widget preview */}
                <div
                  className={`absolute bottom-4 right-2 flex flex-col items-end gap-1 transition-opacity ${
                    config.isActive ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div className="bg-white shadow-lg rounded flex flex-col">
                    {config.email && (
                      <div className="p-2.5 border-b border-gray-100 flex items-center gap-2">
                        <Mail size={14} className="text-blue-600" />
                        <span className="text-[9px] text-gray-500 max-w-[100px] truncate">
                          {config.email}
                        </span>
                      </div>
                    )}
                    {config.phone && (
                      <div className="p-2.5 border-b border-gray-100 flex items-center gap-2">
                        <Phone size={14} className="text-green-600" />
                        <span className="text-[9px] text-gray-500 max-w-[100px] truncate">
                          {config.phone}
                        </span>
                      </div>
                    )}
                    {config.whatsapp && (
                      <div className="p-2.5 flex items-center gap-2">
                        <MessageCircle size={14} className="text-green-500" />
                        <span className="text-[9px] text-gray-500 max-w-[100px] truncate">
                          {config.whatsapp}
                        </span>
                      </div>
                    )}
                    {!config.email && !config.phone && !config.whatsapp && (
                      <div className="p-3 text-[9px] text-gray-400 italic">
                        No contacts configured
                      </div>
                    )}
                  </div>
                </div>

                {!config.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500 bg-black/40 px-3 py-1 rounded-full">
                      Widget Hidden
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
