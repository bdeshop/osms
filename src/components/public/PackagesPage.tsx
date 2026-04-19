"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Banknote,
  Zap,
  Loader,
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  ShieldCheck,
  Package,
  RefreshCw,
} from "lucide-react";

interface PackageData {
  _id: string;
  name: string;
  description: string;
  costPerMessage: number;
  totalPrice: number;
  messageCount: number;
  features: string[];
  isActive: boolean;
  packageToken: string;
  createdBy: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = (await packageAPI.getAll()) as any;

      if (response.success) {
        setPackages(response.data || []);
      } else {
        setError(response.message || "Failed to fetch packages");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin text-pink-600" size={40} />
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
          Loading Packages...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16 px-0 sm:px-2">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-3 sm:mb-4"
            >
              <span className="w-6 sm:w-8 h-1 bg-pink-600 rounded-full"></span>
              <p className="text-pink-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Available Packages
              </p>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-3 sm:mb-4 uppercase leading-tight">
              SMS <span className="text-pink-600">Packages</span>
            </h1>
            <p className="text-gray-600 font-bold max-w-xl leading-relaxed text-[9px] sm:text-[10px] tracking-widest">
              Choose the perfect messaging package for your business needs. All
              packages include API access and real-time analytics.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="relative group cursor-pointer w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-pink-600/20 blur-2xl group-hover:bg-pink-600/30 transition-all opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white border border-pink-200 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-pink-600/20 rotate-3 group-hover:rotate-0 transition-transform flex-shrink-0">
                <ArrowRight size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-0.5 sm:mb-1">
                  Get Started
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight uppercase">
                  Login to Activate
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Feedback Loop */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden rounded-2xl sm:rounded-3xl border bg-red-50 border-red-200 text-red-700 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-red-100 flex-shrink-0">
                  <AlertCircle size={18} className="sm:w-5 sm:h-5" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest break-words">
                  {error}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={fetchPackages}
                  className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
                  Retry
                </button>
                <button
                  onClick={() => setError("")}
                  className="hover:rotate-90 transition-transform p-1"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Package Cards */}
        {packages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-20 md:py-24"
          >
            <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <Package
                size={32}
                className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400"
              />
            </div>
            <p className="text-gray-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              No packages available at the moment
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col group rounded-2xl sm:rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                  pkg.isActive
                    ? "bg-white border-pink-200 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-pink-600">
                  <ShieldCheck
                    size={80}
                    className="sm:w-[120px] sm:h-[120px]"
                  />
                </div>

                <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="mb-6 sm:mb-8 flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tight break-words">
                          {pkg.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>
                    {!pkg.isActive && (
                      <span className="bg-gray-200 text-gray-600 text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Pricing Card */}
                  <div className="bg-pink-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 border border-pink-100 group-hover:border-pink-200 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6 mb-4">
                      <div>
                        <p className="text-gray-600 text-[7px] sm:text-[8px] font-black uppercase tracking-widest mb-1">
                          Message Volume
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                            {pkg.messageCount.toLocaleString()}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-gray-600 font-bold uppercase">
                            Messages
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-gray-600 text-[7px] sm:text-[8px] font-black uppercase tracking-widest mb-1">
                          Total Price
                        </p>
                        <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                          ৳{pkg.totalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-pink-200">
                      <p className="text-gray-600 text-[7px] sm:text-[8px] font-black uppercase tracking-widest mb-1">
                        Cost Per Message
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-pink-600 text-sm font-bold tracking-tight">
                          ৳{pkg.costPerMessage.toFixed(2)}
                        </span>
                        <span className="text-[7px] sm:text-[8px] text-gray-600 font-bold uppercase">
                          / Segment
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 flex-1">
                      {pkg.features.map((feature, fidx) => (
                        <li
                          key={fidx}
                          className="flex items-start gap-2 sm:gap-3 text-gray-700 group-hover:text-gray-900 transition-colors"
                        >
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-pink-400 group-hover:scale-125 transition-transform flex-shrink-0 mt-1.5 sm:mt-2" />
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight break-words">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Footer Info */}
                  <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[8px] sm:text-[9px] text-gray-600 font-black uppercase tracking-widest">
                      <span className="break-words">
                        By {pkg.createdBy.firstName} {pkg.createdBy.lastName}
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <Clock size={10} className="sm:w-3 sm:h-3" />
                        {new Date(pkg.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Informational Footer */}
        <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-0 sm:px-4">
          {[
            {
              title: "Real-time Billing",
              desc: "No prepaid bundles. Every SMS is billed directly from your wallet.",
              icon: Banknote,
              color: "text-blue-600",
            },
            {
              title: "30-Day Cycle",
              desc: "Protocols remain active for 30 days once selected. Balance never expires.",
              icon: Clock,
              color: "text-pink-600",
            },
            {
              title: "Segment Aware",
              desc: "Encoded using high-efficiency GSM-7 or UCS-2 logic for local characters.",
              icon: MessageCircle,
              color: "text-green-600",
            },
            {
              title: "API Access",
              desc: "Full REST API with encrypted tokens ensures only authenticated endpoints can dispatch.",
              icon: Zap,
              color: "text-purple-600",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-2 sm:space-y-3">
              <div className={`flex items-center gap-2 sm:gap-3 ${item.color}`}>
                <item.icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <h4 className="text-gray-900 font-bold uppercase text-[9px] sm:text-[10px] tracking-tight">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-600 text-[8px] sm:text-[10px] font-bold leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
