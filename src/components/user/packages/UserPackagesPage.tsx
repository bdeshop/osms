"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packageAPI, authAPI } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  Info,
  Wallet,
  ShieldCheck,
  PackageCheck,
  Key,
  ShieldAlert,
} from "lucide-react";

interface PackageData {
  _id: string;
  name: string;
  description: string;
  costPerMessage: number;
  totalPrice: number;
  messageCount: number; // Remaining for active, Total for others
  totalMessages: number;
  features: string[];
  isActive: boolean;
  packageToken?: string | null;
  expiresAt?: string;
  isSelected?: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
}

export default function UserPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log(`🔄 [UI] fetchData requested...`);
    try {
      setLoading(true);
      const [pkgRes, userRes] = await Promise.all([
        packageAPI.getActive() as any,
        authAPI.getMe() as any
      ]);

      console.log(`📊 [UI] fetchData Success:`, { 
        packagesFound: pkgRes.data?.length, 
        currentBalance: userRes.data?.balance,
        remainingMessages: userRes.data?.remainingMessages 
      });

      setPackages(pkgRes.data || []);
      setUserProfile(userRes.data || null);
      setError("");
    } catch (err) {
      console.error(`❌ [UI] fetchData Failed:`, err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleActivatePackage = async (packageId: string) => {
    console.log(`🌐 [UI] handleActivatePackage called for Package ID: ${packageId}`);
    try {
      setActionLoading(packageId);
      setError("");
      
      const response = await packageAPI.select(packageId, "selected") as any;
      console.log(`📡 [UI] Server Response for selection:`, response);

      if (response.success) {
        console.log(`✨ [UI] Activation success! Syncing profile and packages...`);
        setShowSuccess(true);
        fetchData();
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        console.warn(`⚠️ [UI] Server returned success:false but no error thrown:`, response);
        setError(response.message || "Failed to activate protocol");
      }
    } catch (err) {
      console.error(`❌ [UI] Activation error:`, err);
      setError(err instanceof Error ? err.message : "Failed to activate plan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelPackage = async (packageId: string) => {
    if (!confirm("Are you sure you want to deactivate this plan? Your token will be invalidated immediately.")) return;
    try {
      setActionLoading(packageId);
      await packageAPI.select(packageId, "cancelled");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel plan");
    } finally {
      setActionLoading(null);
    }
  };

  const calculateExpiry = (dateString?: string) => {
    if (!dateString) return "No Expiry Set";
    const expiry = new Date(dateString);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Expires Today" : `${days} days remaining`;
  };

  if (loading && !packages.length) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin text-amber-500" size={40} />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Synchronizing Global Rates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 px-2">
           <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mb-4"
              >
                 <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
                 <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Protocol Selection</p>
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                Service <span className="text-amber-500">Architecture</span>
              </h1>
              <p className="text-gray-500 font-bold max-w-xl leading-relaxed uppercase text-[10px] tracking-widest">
                Select your prepaid messaging protocol. Purchase a bundle of messages using your unified wallet balance. Protocal remains active until messages are exhausted or cycle expires.
              </p>
           </div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="relative group cursor-pointer"
             onClick={() => router.push('/user/recharge')}
           >
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl group-hover:bg-amber-500/30 transition-all opacity-0 group-hover:opacity-100" />
              <div className="relative bg-gray-900 border border-white/10 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                 <div className="bg-amber-500 text-gray-950 p-4 rounded-2xl shadow-xl shadow-amber-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                    <Wallet size={28} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Unified Balance</p>
                    <p className="text-3xl font-black text-white tracking-tighter font-mono">
                      ৳{userProfile?.balance.toFixed(2) || "0.00"}
                    </p>
                 </div>
                 <div className="ml-4 h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-gray-900 transition-all">
                    <ArrowRight size={20} />
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Global Feedback Loop */}
        <AnimatePresence>
          {(error || showSuccess) && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className={`overflow-hidden rounded-3xl border p-6 flex items-center justify-between gap-4 ${
                error ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"
              }`}
            >
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${error ? "bg-red-500/20" : "bg-green-500/20"}`}>
                     {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">{error || "System synchronization successful. Protocol live."}</p>
               </div>
               <button onClick={() => { setError(""); setShowSuccess(false); }} className="hover:rotate-90 transition-transform">
                  <X size={20} />
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {packages.map((pkg, i) => (
             <motion.div
               key={pkg._id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`relative flex flex-col group rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                  pkg.isSelected 
                    ? "bg-linear-to-b from-gray-900 to-amber-950/20 border-amber-500/50 shadow-2xl shadow-amber-500/10" 
                    : "bg-gray-900 border-white/5 hover:border-white/10"
               }`}
             >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none ${pkg.isSelected && "opacity-20 text-amber-500"}`}>
                  <ShieldCheck size={120} />
                </div>

                <div className="p-10 flex-1 flex flex-col">
                   <div className="mb-8 flex items-start justify-between">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{pkg.name}</h3>
                            {pkg.isSelected && (
                              <span className="bg-amber-500 text-gray-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
                            )}
                         </div>
                         <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest line-clamp-2">{pkg.description}</p>
                      </div>
                   </div>

                   <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Package Volume</p>
                          <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-black text-white tracking-tighter">
                               {pkg.isSelected ? pkg.messageCount : pkg.totalMessages}
                             </span>
                             <span className="text-[10px] text-gray-600 font-bold uppercase">Messages</span>
                          </div>
                          {pkg.isSelected && (
                            <p className="text-[8px] text-amber-500/60 font-bold uppercase mt-1">Of {pkg.totalMessages} Total</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Package Price</p>
                          <span className="text-xl font-black text-white tracking-tighter">৳{pkg.totalPrice}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Effective Rate</p>
                        <div className="flex items-baseline gap-1">
                           <span className="text-amber-500 text-sm font-black tracking-tighter">৳{pkg.costPerMessage.toFixed(2)}</span>
                           <span className="text-[8px] text-gray-600 font-bold uppercase">/ Segment</span>
                        </div>
                      </div>
                   </div>

                   <ul className="space-y-4 mb-10 flex-1">
                      {pkg.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 group-hover:scale-125 transition-transform" />
                           <span className="text-[10px] font-bold uppercase tracking-tight">{feature}</span>
                        </li>
                      ))}
                   </ul>

                   <AnimatePresence mode="wait">
                      {pkg.isSelected ? (
                        <motion.div 
                          key="selected"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                           {/* Token Section */}
                           <div className="p-4 bg-gray-950/80 rounded-2xl border border-amber-500/20 relative group/token shadow-inner">
                              <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Key size={10} className="text-amber-500" /> API Token
                              </p>
                              <div className="flex items-center justify-between gap-3">
                                 <code className="text-[10px] font-mono font-bold text-amber-500 truncate select-all">{pkg.packageToken}</code>
                                 <button 
                                   onClick={() => copyToClipboard(pkg.packageToken || "", pkg._id)}
                                   className="text-gray-600 hover:text-white transition-colors p-1"
                                 >
                                    {copied === pkg._id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                 </button>
                              </div>
                           </div>

                           <div className="flex items-center justify-between px-2">
                              <div className="flex items-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                                 <Clock size={12} className="text-amber-500" /> {calculateExpiry(pkg.expiresAt)}
                              </div>
                              <button 
                                onClick={() => handleCancelPackage(pkg._id)}
                                disabled={actionLoading === pkg._id}
                                className="text-red-500/40 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                              >
                                {actionLoading === pkg._id ? "Processing..." : "Terminate"}
                              </button>
                           </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="activate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleActivatePackage(pkg._id)}
                          disabled={!!actionLoading}
                          className="w-full bg-white text-gray-950 font-black py-4 rounded-[1.5rem] hover:bg-amber-500 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest shadow-2xl disabled:opacity-50"
                        >
                           {actionLoading === pkg._id ? (
                             <Loader className="animate-spin" size={16} />
                           ) : (
                             <>
                                Activate Protocol
                                <ArrowRight size={14} className="translate-y-[1px]" />
                             </>
                           )}
                        </motion.button>
                      )}
                   </AnimatePresence>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Informational Footer Logic */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
           {[
             { title: "Real-time Billing", desc: "No prepaid bundles. Every SMS is billed directly from your wallet.", icon: Wallet, color: "text-blue-500" },
             { title: "30-Day Cycle", desc: "Protocols remain active for 30 days once selected. Balance never expires.", icon: Clock, color: "text-amber-500" },
             { title: "Segment Aware", desc: "Encoded using high-efficiency GSM-7 or UCS-2 logic for local characters.", icon: MessageCircle, color: "text-green-500" },
             { title: "Secure Handshake", desc: "Encrypted tokens ensure only authenticated endpoints can dispatch.", icon: Key, color: "text-purple-500" }
           ].map((item, i) => (
             <div key={i} className="space-y-3">
                <div className={`flex items-center gap-3 ${item.color}`}>
                   <item.icon size={20} />
                   <h4 className="text-white font-black uppercase text-[10px] tracking-widest">{item.title}</h4>
                </div>
                <p className="text-gray-500 text-[10px] font-bold leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Security Warning */}
        <div className="mt-20 p-8 bg-red-500/5 border border-red-500/10 rounded-3xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
           <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl">
              <ShieldAlert size={32} />
           </div>
           <div className="flex-1">
              <h5 className="text-white font-black text-xs uppercase mb-1">Security Protocol Directive</h5>
              <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider">
                Do not share, publish, or commit your Package Tokens to public repositories. Anyone with access to the token can deplete your wallet balance.
              </p>
           </div>
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
