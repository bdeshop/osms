"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import {
  Activity,
  MessageSquare,
  TrendingUp,
  Package,
  Globe,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalPackages: number;
    totalMessages: number;
    messagesToday: number;
    totalRevenue: number;
    revenueToday: number;
    successRate: number;
    failureRate: number;
  };
  topPackages: { name: string; count: number }[];
  topLocations: { _id: string; count: number }[];
  messageTrends: { date: string; count: number; revenue?: number }[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-gray-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-[8px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2 group-hover:text-gray-400 transition-colors">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight break-words">
            {value}
          </p>
          {trend && (
            <div
              className={`flex items-center gap-1 text-[8px] sm:text-[10px] font-bold mt-2 sm:mt-3 px-2 py-0.5 rounded-full w-fit ${trendUp ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
            >
              {trendUp ? <TrendingUp size={10} /> : <Activity size={10} />}{" "}
              {trend}
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 bg-gray-900/50 rounded-lg sm:rounded-xl border border-gray-700 text-amber-500 group-hover:scale-110 transition-transform shrink-0">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await adminAPI.getAnalytics()) as any;
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError("Failed to fetch analytics data.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("An error occurred while loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center gap-4 p-4">
        <Loader className="animate-spin text-amber-500" size={40} />
        <p className="text-gray-400 font-medium animate-pulse tracking-widest uppercase text-[9px] sm:text-[10px] text-center">
          Synchronizing Analytics...
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

  const maxTrend = Math.max(...analytics.messageTrends.map((t) => t.count), 1);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="mb-8 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-3 sm:mb-4"
            >
              <span className="w-6 sm:w-8 h-1 bg-amber-500 rounded-full"></span>
              <p className="text-amber-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-tight">
                System Intelligence
              </p>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 sm:mb-3">
              Admin <span className="text-amber-500">Core</span>
            </h1>
            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed">
                Global traffic overview and delivery lifecycle monitoring.
                Real-time insights from across the system.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 p-2 rounded-xl sm:rounded-2xl flex items-center gap-2 w-full lg:w-auto">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-[8px] sm:text-[10px] text-gray-300 font-bold`}
                >
                  U
                </div>
              ))}
            </div>
            <div className="pr-2 sm:pr-4 pl-1 sm:pl-2">
              <p className="text-white text-xs sm:text-sm font-bold leading-none">
                {analytics.overview.totalUsers}
              </p>
              <p className="text-gray-500 text-[8px] sm:text-[9px] font-bold uppercase">
                Users
              </p>
            </div>
          </div>
        </div>

        {/* Global Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10">
          <StatCard
            title="Total Revenue"
            value={`${(analytics.overview.totalRevenue || 0).toLocaleString()}`}
            icon={<TrendingUp size={18} />}
            trend={`+${(analytics.overview.revenueToday || 0).toLocaleString()} Today`}
            trendUp={true}
            delay={0.1}
          />
          <StatCard
            title="Total Delivery"
            value={analytics.overview.totalMessages.toLocaleString()}
            icon={<MessageSquare size={18} />}
            trend={`${analytics.overview.successRate}% Success Rate`}
            trendUp={analytics.overview.successRate > 90}
            delay={0.2}
          />
          <StatCard
            title="Active Packages"
            value={analytics.overview.totalPackages}
            icon={<Package size={18} />}
            trend="Monitored Units"
            trendUp={true}
            delay={0.3}
          />
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* Message Growth Trend */}
          <div className="lg:col-span-8 bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-8 flex flex-col h-[300px] sm:h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Growth Index
                </h3>
                <p className="text-gray-500 text-[8px] sm:text-xs font-medium uppercase tracking-widest">
                  Global delivery trends over last 7 days
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-[8px] sm:text-[10px] text-white font-bold uppercase tracking-tight">
                    Traffic
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 relative px-1 sm:px-2">
              <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-px bg-white"></div>
                ))}
              </div>

              {analytics.messageTrends.map((trend, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group relative cursor-pointer pt-8 sm:pt-12 min-w-0"
                >
                  <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-amber-500 text-gray-900 text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded mb-2 z-10 shadow-lg tracking-tight">
                    {trend.count} SMS
                  </div>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(trend.count / maxTrend) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 + 0.5 }}
                    className="w-full bg-linear-to-t from-amber-500/10 via-amber-500/40 to-amber-500 rounded-t-lg sm:rounded-t-xl group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                  />

                  <p className="text-[7px] sm:text-[9px] text-gray-500 font-bold mt-2 sm:mt-4 uppercase group-hover:text-amber-500 transition-colors text-center">
                    {new Date(trend.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Breakdown */}
          <div className="lg:col-span-4 bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-8">
            <div className="mb-6 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                Geographics
              </h3>
              <p className="text-gray-500 text-[8px] sm:text-xs font-medium uppercase tracking-widest">
                Message origin analysis
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {analytics.topLocations.map((loc, i) => {
                const total = analytics.topLocations.reduce(
                  (acc, l) => acc + l.count,
                  0,
                );
                const percent = Math.round((loc.count / total) * 100);
                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe
                          size={14}
                          className="text-blue-500/60 shrink-0"
                        />
                        <span className="text-white font-bold text-sm tracking-tight truncate">
                          {loc._id}
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
                        transition={{ duration: 1, delay: i * 0.1 + 0.8 }}
                        className="h-full bg-linear-to-r from-blue-600 to-indigo-500"
                      />
                    </div>
                    <p className="text-[7px] sm:text-[9px] text-gray-600 font-bold mt-1 uppercase text-right">
                      {loc.count.toLocaleString()} messages
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700/50">
              <div className="bg-blue-500/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-500/10">
                <p className="text-blue-400 text-[8px] sm:text-[10px] font-bold uppercase mb-1 tracking-tight">
                  Top Coverage
                </p>
                <p className="text-white text-[8px] sm:text-xs leading-relaxed italic font-medium">
                  {analytics.topLocations[0]?._id} remains your primary hub for
                  SMS traffic this month.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Performance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Popular Packages */}
          <div className="bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-8 overflow-hidden group">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Market Adoption
                </h3>
                <p className="text-gray-500 text-[8px] sm:text-xs font-medium uppercase tracking-widest">
                  Top performing user packages
                </p>
              </div>
              <Package className="text-amber-500/40 shrink-0" size={32} />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-700/50 hidden sm:block"></div>
              <div className="space-y-3 sm:space-y-4">
                {analytics.topPackages.map((pkg, i) => (
                  <div key={i} className="relative sm:pl-10 group/item">
                    <div className="absolute left-2 top-3 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-900 border-2 border-amber-500/50 z-10 hidden sm:block group-hover/item:scale-125 transition-transform"></div>
                    <div className="bg-gray-900/40 p-3 sm:p-5 rounded-lg sm:rounded-2xl border border-transparent hover:border-amber-500/30 transition-all cursor-default">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[7px] sm:text-xs text-gray-500 font-bold uppercase mb-0.5 sm:mb-1 group-hover/item:text-amber-500 transition-colors tracking-widest">
                            Active Plan
                          </p>
                          <h4 className="text-white font-bold uppercase text-sm sm:text-lg tracking-tight truncate">
                            {pkg.name}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base sm:text-lg font-bold text-white">
                            {pkg.count.toLocaleString()}
                          </p>
                          <p className="text-[7px] sm:text-[9px] text-gray-500 uppercase font-bold">
                            Subs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Utilization */}
          <div className="bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                Quality Assurance
              </h3>
              <p className="text-gray-500 text-[8px] sm:text-xs font-medium uppercase tracking-widest">
                System delivery performance analysis
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
              <div className="relative w-32 sm:w-48 h-32 sm:h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    className="stroke-gray-900 fill-none"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    className="stroke-amber-500 fill-none"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: analytics.overview.successRate / 100,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    {analytics.overview.successRate}%
                  </p>
                  <p className="text-gray-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight">
                    Reliability
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-green-500/10 rounded-lg sm:rounded-2xl p-3 sm:p-4 border border-green-500/20 flex flex-col items-center text-center">
                <CheckCircle
                  size={14}
                  className="text-green-500 mb-1 sm:mb-2"
                />
                <p className="text-white font-bold text-xs sm:text-sm tracking-tight">
                  {analytics.overview.successRate}% Success
                </p>
                <p className="text-[7px] sm:text-[9px] text-gray-500 font-bold uppercase">
                  Optimal
                </p>
              </div>
              <div className="bg-red-500/10 rounded-lg sm:rounded-2xl p-3 sm:p-4 border border-red-500/20 flex flex-col items-center text-center">
                <XCircle size={14} className="text-red-500 mb-1 sm:mb-2" />
                <p className="text-white font-bold text-xs sm:text-sm tracking-tight">
                  {analytics.overview.failureRate}% Failure
                </p>
                <p className="text-[7px] sm:text-[9px] text-gray-500 font-bold uppercase">
                  Critical
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
