"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader, 
  AlertCircle, 
  Search, 
  Filter,
  DollarSign,
  User,
  Calendar,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { paymentAPI } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface Payment {
  _id: string;
  userId: {
    email: string;
    firstName: string;
    lastName: string;
  };
  amount: number;
  type: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("COMPLETED"); // Show pending approvals by default

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      // COMPLETED means paid but not yet approved in our logic for Recharges
      const response = (await paymentAPI.getAdminPayments("RECHARGE", filter as any)) as any;
      if (response.success) {
        setPayments(response.data);
      } else {
        setError("Failed to fetch payments.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this recharge? The user's balance will be updated immediately.")) return;
    
    try {
      setActionLoading(id);
      await paymentAPI.approveRecharge(id);
      fetchPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this recharge?")) return;
    
    try {
      setActionLoading(id);
      await paymentAPI.rejectRecharge(id);
      fetchPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-3"
            >
              <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
              <p className="text-amber-500 text-[10px] font-bold uppercase tracking-tight">Financial Operations</p>
            </motion.div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Payment <span className="text-amber-500">Approvals</span>
            </h1>
            <p className="text-gray-400 font-medium">
              Verify and approve user wallet recharge requests.
            </p>
          </div>

          <div className="flex gap-2 bg-gray-900/50 p-1 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            {["COMPLETED", "APPROVED", "REJECTED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${
                  filter === f 
                    ? "bg-amber-500 text-gray-900" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f === 'COMPLETED' ? 'Pending' : f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-3xl p-6 flex items-center gap-4 text-red-400">
            <AlertCircle size={24} />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 bg-gray-800/20 rounded-3xl border border-gray-700/30">
            <Loader className="animate-spin text-amber-500 mb-4" size={32} />
            <p className="text-gray-500 font-bold uppercase tracking-tight text-[10px]">Loading Records...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700/30 text-center">
             <CreditCard className="text-gray-700 mb-4" size={48} />
             <h3 className="text-white font-bold text-xl mb-2">No Payments Found</h3>
             <p className="text-gray-500 text-sm italic">There are no {filter.toLowerCase()} payments in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {payments.map((payment, i) => (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="p-4 bg-gray-900/80 rounded-2xl border border-gray-700 text-amber-500 group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-white font-bold text-lg tracking-tight">
                            {payment.userId.firstName} {payment.userId.lastName}
                          </p>
                          <span className="text-[10px] bg-gray-900 border border-gray-700 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">
                            {payment.userId.email}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase">
                            <Calendar size={12} />
                            {formatDate(payment.createdAt)}
                          </div>
                          {payment.transactionId && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase font-mono bg-gray-900/50 px-2 py-0.5 rounded border border-gray-800">
                              TX: {payment.transactionId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 lg:text-right">
                      <div>
                        <p className="text-gray-500 text-[9px] font-bold uppercase tracking-tight mb-1">Recharge Amount</p>
                        <p className="text-3xl font-bold text-white tracking-tight">
                          <span className="text-amber-500">৳</span>{payment.amount}
                        </p>
                      </div>

                      {filter === "COMPLETED" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(payment._id)}
                            disabled={!!actionLoading}
                            className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            title="Reject Payment"
                          >
                            <XCircle size={20} />
                          </button>
                          <button
                            onClick={() => handleApprove(payment._id)}
                            disabled={!!actionLoading}
                            className="px-6 py-3 rounded-2xl bg-green-500 text-gray-900 hover:bg-green-600 transition-all font-bold uppercase text-[10px] tracking-tight flex items-center gap-2 shadow-lg shadow-green-500/20"
                          >
                            {actionLoading === payment._id ? (
                              <Loader className="animate-spin" size={16} />
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Approve
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {filter !== "COMPLETED" && (
                        <div className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 border ${
                          payment.status === 'APPROVED' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {payment.status === 'APPROVED' ? <ShieldCheck size={14} /> : <XCircle size={14} />}
                          {payment.status}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
