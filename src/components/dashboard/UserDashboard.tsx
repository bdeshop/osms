"use client";

import { useState, useEffect } from "react";
import { userDataAPI } from "@/services/api";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  Loader,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface UserAnalytics {
  overview: {
    totalMessagesSent: number;
    messagesSentToday: number;
    currentBalance: number;
    activePackage: string;
    walletBalance: number;
  };
  recentMessages: {
    recipient: string;
    message: string;
    status: "sent" | "failed" | "pending";
    createdAt: string;
  }[];
  packageBreakdown: { name: string; count: number }[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  icon,
  subtitle,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 hover:border-${color}-500/30 transition-all hover:shadow-xl hover:shadow-${color}-500/5 group relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-${color}-500/5 -mr-8 sm:-mr-12 -mt-8 sm:-mt-12 rounded-full blur-2xl group-hover:bg-${color}-500/10 transition-colors`}
      ></div>
      <div className="flex flex-col h-full justify-between gap-4 sm:gap-6">
        <div
          className={`p-2 sm:p-2.5 w-fit rounded-lg sm:rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-500 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5 sm:mb-1">
            {title}
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase mb-0.5 sm:mb-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function UserDashboard() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await userDataAPI.getAnalytics()) as any;
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } catch (err) {
      console.error("User dashboard error:", err);
      setError("An error occurred while loading your profile.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center gap-4 p-4">
        <Loader className="animate-spin text-amber-500" size={40} />
        <p className="text-gray-400 font-medium animate-pulse tracking-widest uppercase text-[9px] sm:text-[10px] text-center">
          Loading Profile Data...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-white text-lg sm:text-xl font-bold mb-2">
          Sync Error
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          {error || "Could not load dashboard information."}
        </p>
        <button
          onClick={fetchAnalytics}
          className="bg-amber-500 text-gray-900 px-4 sm:px-6 py-2 rounded-lg font-bold hover:bg-amber-600 transition-colors text-sm"
        >
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Header */}
        <div className="mb-8 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-3 sm:mb-4"
            >
              <span className="w-6 sm:w-8 h-1 bg-amber-500 rounded-full"></span>
              <p className="text-amber-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-tight">
                Personal Usage Hub
              </p>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 sm:mb-3">
              My <span className="text-amber-500">Dashboard</span>
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed text-sm sm:text-base">
              Track your SMS campaigns and monitor your package balance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <a
              href="/user/recharge"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all text-[8px] sm:text-xs font-bold uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-amber-500/20 shrink-0"
            >
              <DollarSign size={14} className="sm:w-4 sm:h-4" /> Recharge
            </a>
            <a
              href="/user/packages"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-gray-700 transition-all text-[8px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2 shrink-0"
            >
              <Package size={14} className="sm:w-4 sm:h-4" /> Browse Packs
            </a>
            <a
              href="/user/messages"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-gray-700 transition-all text-[8px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2 shrink-0"
            >
              <MessageSquare size={14} className="sm:w-4 sm:h-4" /> Logs
            </a>
          </div>
        </div>

        {/* User Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10">
          <StatCard
            title="Wallet Balance"
            value={`৳${analytics.overview.walletBalance || 0}`}
            icon={<DollarSign size={18} />}
            subtitle="Account Funds"
            color="amber"
            delay={0.1}
          />
          <StatCard
            title="Total Delivery"
            value={analytics.overview.totalMessagesSent}
            icon={<Activity size={18} />}
            subtitle="Historical total"
            color="blue"
            delay={0.2}
          />
          <StatCard
            title="Today's Traffic"
            value={analytics.overview.messagesSentToday}
            icon={<TrendingUp size={18} />}
            subtitle="Last 24 hours"
            color="purple"
            delay={0.3}
          />
          <StatCard
            title="Remaining Power"
            value={analytics.overview.currentBalance}
            icon={<Zap size={18} />}
            subtitle="Messages available"
            color="green"
            delay={0.4}
          />
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Package Utilization */}
          <div className="lg:col-span-4 bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-8">
            <div className="mb-6 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 uppercase tracking-tight">
                Plan Analysis
              </h3>
              <p className="text-gray-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight">
                Message distribution per package
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {analytics.packageBreakdown.length === 0 ? (
                <p className="text-gray-600 text-xs italic py-8 sm:py-10 text-center">
                  No package history recorded.
                </p>
              ) : (
                analytics.packageBreakdown.map((pkg, i) => {
                  const total = analytics.packageBreakdown.reduce(
                    (acc, p) => acc + p.count,
                    0,
                  );
                  const percent = Math.round((pkg.count / total) * 100);
                  return (
                    <div key={i} className="group cursor-default">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-500/50 shrink-0"></div>
                          <span className="text-white font-bold text-xs sm:text-sm tracking-tight truncate">
                            {pkg.name}
                          </span>
                        </div>
                        <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold tracking-tight shrink-0">
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.6 }}
                          className="h-full bg-linear-to-r from-amber-500 to-amber-700"
                        />
                      </div>
                      <p className="text-[7px] sm:text-[9px] text-gray-600 font-bold mt-1 uppercase text-right">
                        {pkg.count} SMS
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {!analytics.overview.activePackage && (
              <div className="mt-6 sm:mt-10 pt-4 sm:pt-8 border-t border-gray-700/50 text-center">
                <p className="text-gray-500 text-[8px] sm:text-xs mb-3 sm:mb-4">
                  Ready to expand your reach?
                </p>
                <a
                  href="/user/packages"
                  className="inline-block text-amber-500 hover:text-amber-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Select New Package →
                </a>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-8 bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-8 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 uppercase tracking-tight">
                  Live Activity
                </h3>
                <p className="text-gray-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight">
                  Chronological stream of recent delivery logs
                </p>
              </div>
              <MessageSquare className="text-amber-500/40 shrink-0" size={28} />
            </div>

            {analytics.recentMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center border border-dashed border-gray-700 rounded-xl sm:rounded-2xl">
                <AlertCircle className="text-gray-600 mb-3" size={28} />
                <p className="text-gray-500 text-xs sm:text-sm italic">
                  No recent messages found.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto pr-2 scrollbar-premium">
                {analytics.recentMessages.map((msg, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/40 p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group cursor-default"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {getStatusIcon(msg.status)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-xs sm:text-sm tracking-tight mb-0.5 sm:mb-1 truncate">
                            {msg.recipient}
                          </p>
                          <p className="text-gray-400 text-[8px] sm:text-xs line-clamp-1 italic">
                            "{msg.message}"
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right shrink-0 flex items-center justify-between sm:flex-col gap-2 sm:gap-1">
                        <p className="text-white text-[8px] sm:text-[10px] font-black">
                          {formatDate(msg.createdAt)}
                        </p>
                        <span
                          className={`text-[7px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            msg.status === "sent"
                              ? "bg-green-500/5 border-green-500/20 text-green-400"
                              : msg.status === "failed"
                                ? "bg-red-500/5 border-red-500/20 text-red-400"
                                : "bg-yellow-500/5 border-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 sm:mt-6">
              <a
                href="/user/messages"
                className="w-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white py-2 sm:py-3 rounded-lg sm:rounded-2xl border border-gray-700/50 flex items-center justify-center gap-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight transition-all"
              >
                View Comprehensive Audit History{" "}
                <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-premium::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-premium::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.1);
          border-radius: 10px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
}
