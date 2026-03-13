"use client";

import { useState, useEffect } from "react";
import { userDataAPI } from "@/services/api";
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
  Calendar,
  History,
  TrendingUp,
  Hash,
  Copy,
  Check,
  Tag,
} from "lucide-react";

interface UsageDetail {
  package: {
    _id: string;
    name: string;
    description: string;
    messageCount: number;
    costPerMessage: number;
    totalPrice: number;
    features: string[];
    isActive: boolean;
    packageToken: string;
  };
  selectionStatus: "selected" | "cancelled" | "none";
  lastActionDate: string;
  totalMessagesSent: number;
  messages: {
    _id?: string;
    recipient: string;
    message: string;
    status: "sent" | "failed" | "pending";
    error?: string;
    createdAt: string;
    updatedAt?: string;
  }[];
}

export default function PackageMessages() {
  const [usageData, setUsageData] = useState<UsageDetail[]>([]);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageDetails();
  }, []);

  const fetchUsageDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await userDataAPI.getUsageDetails()) as any;
      if (response.success) {
        setUsageData(response.data || []);
      } else {
        setError(response.message || "Failed to fetch usage details");
      }
    } catch (err) {
      console.error("Failed to fetch usage details:", err);
      setError("Failed to load your usage history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="text-green-400" size={14} />;
      case "failed":
        return <XCircle className="text-red-400" size={14} />;
      case "pending":
        return <Clock className="text-yellow-400" size={14} />;
      default:
        return <AlertCircle className="text-gray-400" size={14} />;
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

  const getSelectionBadge = (status: string) => {
    switch (status) {
      case "selected":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            Active
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string, type: "full" | "date" | "time" = "full") => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (type === "date") return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (type === "time") return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
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
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin text-amber-500" size={24} />
        <p className="text-gray-400 text-sm font-medium">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
              <History className="text-amber-500" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Usage History</h1>
              <p className="text-gray-400 text-xs text-wrap">Track your package utilization and message records</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl px-3 py-2">
              <p className="text-gray-500 text-[9px] font-bold uppercase">Sent</p>
              <p className="text-lg font-bold text-amber-500">
                {usageData.reduce((acc, curr) => acc + curr.totalMessagesSent, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Usage List */}
        {usageData.length === 0 ? (
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-12 text-center">
            <Package className="mx-auto text-gray-500 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">No history</h3>
            <p className="text-gray-400 text-sm mb-6">Select a package to start sending messages.</p>
            <a href="/user/packages" className="inline-block bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg text-sm transition-all shadow-lg">
              Browse Packages
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {usageData.map((item) => (
              <div
                key={item.package._id}
                className={`bg-gray-800/20 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
                  item.selectionStatus === "selected" ? "border-amber-500/40 bg-amber-500/5" : "border-gray-700/50 hover:border-gray-600"
                } overflow-hidden`}
              >
                {/* Compact Header */}
                <div
                  onClick={() => setExpandedPackage(expandedPackage === item.package._id ? null : item.package._id)}
                  className="w-full p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${
                      item.selectionStatus === "selected" ? "bg-amber-500/20 border-amber-500/30 text-amber-500" : "bg-gray-700/50 border-gray-600 text-gray-400"
                    }`}>
                      <Package size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-amber-500 transition-colors">
                          {item.package.name}
                        </h3>
                        {getSelectionBadge(item.selectionStatus)}
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-1 italic mb-2">
                        {item.package.description}
                      </p>
                      
                      {/* Secondary Info Dots */}
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-amber-500/60" /> {formatDate(item.lastActionDate, "date")}
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Hash size={10} className="text-blue-500/60" /> {item.package.messageCount} Capacity
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <TrendingUp size={10} className="text-green-500/60" /> {item.totalMessagesSent} Sent
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-700/50">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-0.5">Progress</p>
                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 transition-all duration-500" 
                            style={{ width: `${Math.min(100, (item.totalMessagesSent / item.package.messageCount) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-0.5">Utilized</p>
                        <p className="text-sm font-bold text-white">
                          {Math.round((item.totalMessagesSent / item.package.messageCount) * 100)}%
                        </p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      expandedPackage === item.package._id ? "bg-amber-500 text-gray-900 rotate-180 shadow-lg" : "bg-gray-700/50 text-gray-400"
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {expandedPackage === item.package._id && (
                  <div className="border-t border-gray-700/30 bg-gray-900/40 p-4 md:p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    
                    {/* Detailed Package Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                        <p className="text-gray-500 text-[9px] font-bold uppercase mb-2">Package Token</p>
                        <div className="flex items-center justify-between gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-700/50">
                          <code className="text-amber-500/80 text-[10px] font-mono truncate max-w-[150px]">
                            {item.package.packageToken}
                          </code>
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.package.packageToken, item.package._id); }}
                            className="text-gray-500 hover:text-amber-400 p-1 transition-colors shrink-0"
                          >
                            {copiedToken === item.package._id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                        <p className="text-gray-500 text-[9px] font-bold uppercase mb-2">Pricing</p>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[8px] text-gray-500">Per Msg</p>
                            <p className="text-xs font-bold text-white">৳{item.package.costPerMessage}</p>
                          </div>
                          <div className="w-px h-6 bg-gray-700/50 mt-1"></div>
                          <div>
                            <p className="text-[8px] text-gray-500">Total Price</p>
                            <p className="text-xs font-bold text-white">৳{item.package.totalPrice}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                        <p className="text-gray-500 text-[9px] font-bold uppercase mb-2 flex items-center gap-1"><Tag size={8} /> Features</p>
                        <div className="flex flex-wrap gap-1">
                          {item.package.features.map((f, i) => (
                            <span key={i} className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Messages Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <MessageSquare size={14} className="text-amber-500" /> Message Logs
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                          {item.messages.length} logs
                        </span>
                      </div>

                      {item.messages.length === 0 ? (
                        <div className="text-center py-6 bg-gray-800/20 rounded-xl border border-dashed border-gray-700/50">
                          <p className="text-gray-500 text-xs italic">No messages sent yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {item.messages.map((msg, idx) => (
                            <div
                              key={msg._id || idx}
                              className={`group/msg rounded-xl p-3 border transition-colors ${
                                msg.status === "sent" ? "bg-green-500/5 border-green-500/10 hover:border-green-500/20" 
                                : msg.status === "failed" ? "bg-red-500/5 border-red-500/10 hover:border-red-500/20"
                                : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className={`mt-0.5 p-1 rounded-md ${getStatusColor(msg.status)} shrink-0`}>
                                    {getStatusIcon(msg.status)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-white font-mono text-xs font-bold">{msg.recipient}</span>
                                      <span className="text-[9px] text-gray-500">•</span>
                                      <span className="text-[9px] text-gray-500">{formatDate(msg.createdAt, "time")}</span>
                                    </div>
                                    <p className="text-gray-300 text-xs leading-relaxed break-words">
                                      {msg.message}
                                    </p>
                                    {msg.status === "failed" && msg.error && (
                                      <div className="mt-1.5 flex items-start gap-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <AlertCircle size={10} className="text-red-400 mt-0.5 shrink-0" />
                                        <p className="text-red-400 text-[10px] leading-tight font-medium italic">
                                          {msg.error}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">
                                    {formatDate(msg.createdAt, "date").split(',')[0]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
}
