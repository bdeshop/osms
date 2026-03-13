"use client";

import { useState, useEffect } from "react";
import { packageAPI } from "@/services/api";
import {
  Package,
  Copy,
  Check,
  Zap,
  MessageCircle,
  DollarSign,
  Loader,
  X,
  AlertCircle,
} from "lucide-react";

interface PackageData {
  _id: string;
  name: string;
  description: string;
  messageCount: number;
  costPerMessage: number;
  totalPrice: number;
  features: string[];
  isActive: boolean;
  packageToken: string;
}

export default function UserDashboard() {
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchCurrentSelection();
  }, []);

  const fetchCurrentSelection = async () => {
    try {
      setLoading(true);
      const response = (await packageAPI.getSelectionInfo()) as any;
      if (response.success && response.data) {
        setSelectedPackage(response.data.packageId);
      } else {
        setSelectedPackage(null);
      }
    } catch (err) {
      console.error("Failed to fetch selection:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCancelPackage = async () => {
    if (!selectedPackage) return;
    try {
      setLoading(true);
      await packageAPI.select(selectedPackage._id, "cancelled");
      setSelectedPackage(null);
      setShowCancelModal(false);
    } catch (err) {
      console.error("Failed to cancel package:", err);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Dashboard</h1>
          <p className="text-gray-400">
            Select a package and get started with sending SMS
          </p>
        </div>

        {/* Main Content */}
        <div>
          {selectedPackage ? (
            <div className="space-y-6">
              {/* Package Info Card */}
              <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-white font-bold text-2xl mb-2">
                      {selectedPackage.name}
                    </h2>
                    <p className="text-gray-400">
                      {selectedPackage.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="shrink-0 text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    title="Cancel package"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Messages */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="text-blue-400" size={18} />
                      <p className="text-gray-400 text-sm">Messages</p>
                    </div>
                    <p className="text-white font-bold text-2xl">
                      {selectedPackage.messageCount}
                    </p>
                  </div>

                  {/* Cost Per Message */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="text-green-400" size={18} />
                      <p className="text-gray-400 text-sm">Cost/Message</p>
                    </div>
                    <p className="text-white font-bold text-2xl">
                      ৳{selectedPackage.costPerMessage}
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="text-amber-400" size={18} />
                      <p className="text-gray-400 text-sm">Total Price</p>
                    </div>
                    <p className="text-white font-bold text-2xl">
                      ৳{selectedPackage.totalPrice}
                    </p>
                  </div>
                </div>

                {/* Features */}
                {selectedPackage.features.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Features</h3>
                    <ul className="space-y-2">
                      {selectedPackage.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-gray-300 text-sm"
                        >
                          <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Package Token */}
              <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                <h3 className="text-white font-bold text-lg mb-3">
                  Package Token
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Use this token to send SMS with this package:
                </p>
                {selectedPackage.packageToken ? (
                  <div className="bg-gray-900 rounded p-4 border border-gray-700 flex items-center justify-between group">
                    <code className="text-amber-400 text-xs break-all">
                      {selectedPackage.packageToken}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedPackage.packageToken,
                          "package-token",
                        )
                      }
                      className="ml-4 shrink-0 hover:bg-gray-800 p-2 rounded transition-colors"
                    >
                      {copied === "package-token" ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy
                          size={18}
                          className="text-gray-400 hover:text-amber-400"
                        />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
                    <p className="text-red-400 text-sm">
                      Token not available. Please contact support or refresh the
                      page.
                    </p>
                  </div>
                )}
              </div>

              {/* API Usage Example */}
              <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                <h3 className="text-white font-bold text-lg mb-3">
                  How to Use
                </h3>
                {selectedPackage.packageToken ? (
                  <div className="space-y-3 text-gray-300 text-sm">
                    <p>1. Copy the package token above</p>
                    <p>
                      2. Make a POST request to{" "}
                      <code className="bg-gray-900 px-2 py-1 rounded text-amber-400">
                        /api/messaging/send
                      </code>
                    </p>
                    <p>3. Include the token in your request body</p>
                    <div className="bg-gray-900 rounded p-3 border border-gray-700 mt-3">
                      <pre className="text-xs text-gray-300 overflow-x-auto">
                        {`{
  "recipient": "8801772411171",
  "message": "Hello SMS",
  "packageToken": "${selectedPackage.packageToken}"
}`}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
                    <p className="text-yellow-400 text-sm">
                      Token is being generated. Please refresh the page in a
                      moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-12 text-center">
              <div className="mb-4">
                <Package className="mx-auto text-gray-500 mb-3" size={48} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                No Package Selected
              </h3>
              <p className="text-gray-400 mb-6">
                You haven't selected a package yet. Go to the packages page to
                choose one and start sending SMS.
              </p>
              <a
                href="/user/packages"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-8 rounded-lg transition-all"
              >
                Select a Package
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Package Modal */}
      {showCancelModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 border border-red-500/30 rounded-full p-3">
                <AlertCircle className="text-red-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Cancel Package?</h2>
            </div>

            {/* Message */}
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel your selected package{" "}
              <strong className="text-amber-400">{selectedPackage.name}</strong>
              ? You can select a different package anytime.
            </p>

            {/* Warning */}
            <div className="bg-red-500/10 border border-red-500/30 rounded p-4 mb-6">
              <p className="text-red-400 text-sm">
                <strong>Note:</strong> Any ongoing SMS operations with this
                package will be affected.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Keep Package
              </button>
              <button
                onClick={handleCancelPackage}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Cancel Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
