"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Loader, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { paymentAPI } from "@/services/api";
import { motion } from "framer-motion";

export default function RechargePage() {
  const [amount, setAmount] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
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
      } else {
        throw new Error("Could not generate payment link");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Integration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Wallet Management</p>
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Recharge <span className="text-amber-500">Wallet</span>
          </h1>
          <p className="text-gray-400 font-medium">
            Add funds to your account to purchase SMS packages.
          </p>
        </div>

        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Payment Completed!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your recharge has been received and is now pending administrator approval. 
              Funds will be added to your balance shortly.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-amber-500 font-bold text-[10px] uppercase tracking-widest hover:text-amber-400 transition-colors"
            >
              Add more funds
            </button>
          </motion.div>
        )}

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
          <div className="mb-8">
            <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-4">Select or Enter Amount (৳)</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[500, 1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`py-3 rounded-2xl font-bold transition-all border ${
                    amount === val 
                      ? "bg-amber-500 text-gray-900 border-amber-500 shadow-lg shadow-amber-500/20" 
                      : "bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  ৳{val}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter custom amount"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-xl focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm font-medium">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 mb-8">
            <p className="text-blue-400 text-[10px] font-black uppercase mb-1">Payment Information</p>
            <p className="text-blue-300/80 text-xs leading-relaxed">
              You will be redirected to the secure OraclePay payment gateway. After successful payment, an administrator will verify and approve your recharge within 24 hours.
            </p>
          </div>

          <button
            onClick={handleRecharge}
            disabled={loading || amount <= 0}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-900 font-black py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <CreditCard size={20} />
                <span>Initialize Recharge</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-gray-800/10 border border-gray-800 rounded-2xl p-6">
              <CheckCircle className="text-green-500 mb-3" size={24} />
              <h4 className="text-white font-bold mb-1">Instant Notification</h4>
              <p className="text-gray-500 text-xs">Get notified immediately after your payment is processed by OraclePay.</p>
           </div>
           <div className="bg-gray-800/10 border border-gray-800 rounded-2xl p-6">
              <Clock className="text-blue-500 mb-3" size={24} />
              <h4 className="text-white font-bold mb-1">Manual Approval</h4>
              <p className="text-gray-500 text-xs">Funds will be added to your balance once our team verifies the transaction.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Clock(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
