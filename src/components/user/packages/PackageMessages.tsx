"use client";

import { useState, useEffect } from "react";
import { packageAPI, messagingAPI } from "@/services/api";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Package,
  Loader,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Message {
  _id: string;
  recipient: string;
  message: string;
  status: "sent" | "failed" | "pending";
  createdAt: string;
  sentAt?: string;
}

interface PackageWithMessages {
  _id: string;
  name: string;
  description: string;
  messageCount: number;
  costPerMessage: number;
  totalPrice: number;
  isActive: boolean;
  messages: Message[];
}

export default function PackageMessages() {
  const [packages, setPackages] = useState<PackageWithMessages[]>([]);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await packageAPI.getAll()) as any;
      const packagesData = response.data || [];

      // Initialize packages with empty messages
      const packagesWithMessages: PackageWithMessages[] = packagesData.map(
        (pkg: any) => ({
          ...pkg,
          messages: [],
        }),
      );

      setPackages(packagesWithMessages);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setError("Failed to load packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesForPackage = async (packageId: string) => {
    try {
      setLoadingMessages((prev) => new Set(prev).add(packageId));
      const response = (await messagingAPI.getMessagesByPackage(
        packageId,
      )) as any;
      const messages = response.data || [];

      setPackages((prev) =>
        prev.map((pkg) => (pkg._id === packageId ? { ...pkg, messages } : pkg)),
      );
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages for this package.");
    } finally {
      setLoadingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(packageId);
        return newSet;
      });
    }
  };

  const togglePackage = (packageId: string) => {
    if (expandedPackage === packageId) {
      setExpandedPackage(null);
    } else {
      setExpandedPackage(packageId);
      // Fetch messages if not already loaded
      const pkg = packages.find((p) => p._id === packageId);
      if (pkg && pkg.messages.length === 0) {
        fetchMessagesForPackage(packageId);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="text-green-400" size={16} />;
      case "failed":
        return <XCircle className="text-red-400" size={16} />;
      case "pending":
        return <Clock className="text-yellow-400" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "failed":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "pending":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Packages & Messages
          </h1>
          <p className="text-gray-400">
            View your packages and all messages sent under each package
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400 shrink-0" size={20} />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Packages List */}
        {packages.length === 0 ? (
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-12 text-center">
            <Package className="mx-auto text-gray-500 mb-3" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">
              No Packages Found
            </h3>
            <p className="text-gray-400">
              You don't have any packages yet. Purchase a package to get
              started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* Package Header */}
                <button
                  onClick={() => togglePackage(pkg._id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                      <Package className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{pkg.description}</p>
                    </div>
                  </div>

                  {/* Package Stats */}
                  <div className="flex items-center gap-6 mr-4">
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Messages</p>
                      <p className="text-white font-bold text-lg">
                        {pkg.messageCount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Cost/Msg</p>
                      <p className="text-white font-bold text-lg">
                        ৳{pkg.costPerMessage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Total</p>
                      <p className="text-white font-bold text-lg">
                        ৳{pkg.totalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-gray-400">
                    {expandedPackage === pkg._id ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </button>

                {/* Messages Section */}
                {expandedPackage === pkg._id && (
                  <div className="border-t border-gray-700 bg-gray-900/50 p-6">
                    {loadingMessages.has(pkg._id) ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader className="animate-spin text-amber-500" />
                      </div>
                    ) : pkg.messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="mx-auto text-gray-500 mb-3" />
                        <p className="text-gray-400">
                          No messages sent with this package yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold mb-4">
                          Messages ({pkg.messages.length})
                        </h4>
                        <div className="max-h-96 overflow-y-auto space-y-3">
                          {pkg.messages.map((msg) => (
                            <div
                              key={msg._id}
                              className={`rounded-lg border p-4 ${getStatusColor(msg.status)}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(msg.status)}
                                  <span className="font-semibold capitalize">
                                    {msg.status}
                                  </span>
                                </div>
                                <span className="text-xs opacity-75">
                                  {formatDate(msg.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm mb-2 font-mono">
                                To: {msg.recipient}
                              </p>
                              <p className="text-sm break-words">
                                {msg.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
