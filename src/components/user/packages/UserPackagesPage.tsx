"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "@/services/api";
import {
  Copy,
  Check,
  MessageCircle,
  DollarSign,
  Zap,
  Loader,
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
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
  packageToken?: string;
}

export default function UserPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    null,
  );
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedId = localStorage.getItem("selectedPackageId");
    setActivePackageId(storedId);
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = (await packageAPI.getActive()) as any;
      setPackages(response.data || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSelectPackage = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleCancelPackage = () => {
    localStorage.removeItem("selectedPackageId");
    setActivePackageId(null);
  };

  const handleConfirmSelection = () => {
    if (selectedPackage) {
      // Only store the package ID, not the full package with token
      localStorage.setItem("selectedPackageId", selectedPackage._id);
      setActivePackageId(selectedPackage._id);
      setShowModal(false);
      setShowSuccess(true);

      // Redirect to user overview after 2 seconds
      setTimeout(() => {
        router.push("/user/overview");
      }, 2000);
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
          <h1 className="text-4xl font-bold text-white mb-2">My Packages</h1>
          <p className="text-gray-400">
            Browse and select packages to send SMS
          </p>
        </div>

        {/* Currently Selected Package */}
        {(() => {
          if (activePackageId) {
            const pkg = packages.find((p) => p._id === activePackageId);
            if (pkg) {
              return (
                <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 font-semibold text-sm">
                      Currently Selected
                    </p>
                    <p className="text-white font-bold">{pkg.name}</p>
                  </div>
                  <button
                    onClick={handleCancelPackage}
                    className="text-amber-400 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
                  >
                    Cancel Package
                  </button>
                </div>
              );
            }
          }
          return null;
        })()}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-12 text-center">
            <p className="text-gray-400 text-lg">No packages available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 hover:border-amber-500/50 transition-all"
              >
                {/* Package Name */}
                <h3 className="text-white font-bold text-xl mb-2">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  {/* Messages */}
                  <div className="flex items-center gap-2">
                    <MessageCircle className="text-blue-400" size={16} />
                    <span className="text-gray-300 text-sm">
                      {pkg.messageCount} messages
                    </span>
                  </div>

                  {/* Cost */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-green-400" size={16} />
                    <span className="text-gray-300 text-sm">
                      ৳{pkg.costPerMessage} per message
                    </span>
                  </div>

                  {/* Total Price */}
                  <div className="flex items-center gap-2">
                    <Zap className="text-amber-400" size={16} />
                    <span className="text-gray-300 text-sm font-semibold">
                      Total: ৳{pkg.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <p className="text-gray-400 text-xs font-semibold mb-2">
                      FEATURES
                    </p>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-gray-400 text-xs flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Select/Cancel Button */}
                {activePackageId === pkg._id ? (
                  <button
                    onClick={handleCancelPackage}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Cancel Package
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={!!activePackageId}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-all ${
                      activePackageId
                        ? "bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-gray-900"
                    }`}
                  >
                    Select Package
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selection Modal */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Package Selected
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Package Details */}
            <div className="bg-gray-800 rounded p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Package Name:</span>
                <span className="text-white font-semibold">
                  {selectedPackage.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Messages:</span>
                <span className="text-white font-semibold">
                  {selectedPackage.messageCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Cost per Message:</span>
                <span className="text-white font-semibold">
                  ৳{selectedPackage.costPerMessage}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                <span className="text-gray-400 font-semibold">Total Cost:</span>
                <span className="text-amber-400 font-bold text-lg">
                  ৳{selectedPackage.totalPrice}
                </span>
              </div>
            </div>

            {/* Token Section */}
            {selectedPackage.packageToken && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-4 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle
                    className="text-red-400 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-red-400 font-semibold text-sm">
                      Important
                    </p>
                    <p className="text-red-300 text-xs mt-1">
                      Never share this token with anyone. Keep it private and
                      secure.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded p-3 border border-gray-700">
                  <p className="text-gray-400 text-xs mb-2">
                    Your Package Token
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-amber-400 text-xs break-all">
                      {selectedPackage.packageToken}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedPackage.packageToken || "",
                          "selected-token",
                        )
                      }
                      className="shrink-0 hover:bg-gray-800 p-1 rounded transition-colors"
                      title="Copy token"
                    >
                      {copied === "selected-token" ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy
                          size={16}
                          className="text-gray-400 hover:text-amber-400"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-blue-400 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="text-blue-400 font-semibold text-sm">
                    Ready to Send SMS
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    Use this token in your API requests to send SMS messages.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all"
              >
                Confirm & Use
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full p-6 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-full p-4">
                <CheckCircle className="text-green-400" size={48} />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Package Selected!
            </h2>
            <p className="text-gray-400 mb-6">
              Your package{" "}
              <strong className="text-amber-400">{selectedPackage.name}</strong>{" "}
              is ready to use.
            </p>

            {/* Token Display */}
            <div className="bg-gray-800 rounded p-4 mb-6 border border-gray-700">
              <p className="text-gray-400 text-xs mb-2">Your Package Token</p>
              <code className="text-amber-400 text-sm break-all font-mono">
                {selectedPackage.packageToken}
              </code>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mb-6">
              <p className="text-blue-300 text-xs">
                Redirecting to dashboard in 2 seconds...
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => router.push("/user/overview")}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
