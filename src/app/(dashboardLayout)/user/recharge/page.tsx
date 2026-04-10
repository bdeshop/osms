"use client";

import { useState, useEffect } from "react";
import { Loader, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { paymentAPI } from "@/services/api";
import { motion } from "framer-motion";

export default function RechargePage() {
  const [amount, setAmount] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("status") === "success") {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRecharge = async () => {
    if (amount < 10) {
      setError("Minimum recharge amount is ৳10");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const successUrl = `${window.location.origin}/user/recharge?status=success`;
      const response = (await paymentAPI.recharge(amount, successUrl)) as any;
      if (response.payment_page_url) {
        window.location.href = response.payment_page_url;
        return;
      }
      throw new Error("Could not generate payment link");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Integration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Capital Management
            </p>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 uppercase">
            Wallet <span className="text-amber-500">Refinement</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            Fuel your campaigns with verified account credits
          </p>
        </div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-10 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-500 text-gray-950 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/40 rotate-12 group-hover:rotate-0 transition-transform">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                PAYMENT INITIATED
              </h2>
              <p className="text-gray-400 text-sm max-w-md mb-8 font-medium">
                Transaction verified. Your balance will be updated momentarily.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl border border-white/10 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 md:p-10 shadow-2xl">
              <div className="mb-10">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-6">
                  Select Amount (BDT)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-4 rounded-2xl font-black text-xs transition-all border ${
                        amount === val
                          ? "bg-white/10 text-amber-500 border-amber-500/50 shadow-lg shadow-amber-500/10"
                          : "bg-gray-900/50 text-gray-500 border-white/5 hover:border-white/10"
                      }`}
                    >
                      ৳{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 ml-4">
                    Custom Amount
                  </div>
                  <div className="flex items-center bg-gray-900/50 border border-white/5 rounded-3xl px-6 py-4 focus-within:border-amber-500/50 transition-all">
                    <span className="text-gray-600 mr-4 text-lg">৳</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-transparent w-full text-white font-black text-2xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleRecharge}
                disabled={loading || amount <= 0}
                className="w-full mt-10 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-950 font-black py-5 rounded-[2rem] transition-all shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Proceed to Payment Gateway</span>
                    <ArrowRight size={18} className="translate-y-[1px]" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h4 className="text-white font-black uppercase text-xs tracking-tighter mb-2">
                Secure Payment
              </h4>
              <p className="text-gray-500 text-[10px] font-bold leading-relaxed">
                All transactions are processed through a secure payment gateway
                with industry-standard encryption and fraud protection.
              </p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors pointer-events-none" />
              <h4 className="text-amber-500 font-black uppercase text-xs tracking-tighter mb-4 relative z-10">
                Payment Methods
              </h4>
              <div className="space-y-3 relative z-10 text-[10px] text-gray-400 font-bold">
                <p>✓ Credit Card</p>
                <p>✓ Debit Card</p>
                <p>✓ Mobile Banking</p>
                <p>✓ Bank Transfer</p>
              </div>
            </div>

            <div className="bg-gray-900/40 rounded-3xl p-6 border border-white/5 flex items-center justify-center text-center">
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                Available 24/7 • Instant Processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
