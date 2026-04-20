"use client";

import { useState, useEffect } from "react";
import { paymentAPI } from "@/services/api";
import {
  CreditCard,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Payment {
  _id: string;
  amount: number;
  type: "RECHARGE" | "PACKAGE";
  status: "PENDING" | "COMPLETED" | "APPROVED" | "FAILED";
  invoiceNumber: string;
  transactionId?: string;
  bank?: string;
  packageId?: {
    name: string;
  };
  createdAt: string;
}

export default function TransactionHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await paymentAPI.getMyPayments()) as any;
      if (response.success) {
        setPayments(response.data || []);
      } else {
        setError("Failed to fetch transaction history.");
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError("Could not load your transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle className="text-green-400" size={16} />;
      case "FAILED":
        return <XCircle className="text-red-400" size={16} />;
      case "PENDING":
        return <Clock className="text-yellow-400" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "FAILED":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "PENDING":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredPayments = payments
    .filter((p) => {
      if (filterStatus === "ALL") return true;
      return p.status === filterStatus;
    })
    .filter(
      (p) =>
        p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.packageId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bank?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin text-amber-500" size={40} />
        <p className="text-gray-400 font-medium animate-pulse">Loading Transaction Vault...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
              <CreditCard className="text-amber-500" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Transaction History</h1>
          </div>
          <p className="text-gray-400 text-lg">Track your payment lifecycle and account top-ups.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search invoice or TXID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-8 text-white focus:outline-none focus:border-amber-500/50 appearance-none transition-colors font-medium text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6 rounded-3xl">
          <p className="text-green-500/60 text-[10px] font-black uppercase tracking-widest mb-1">Total Success</p>
          <p className="text-3xl font-bold text-white">
            ৳{payments.filter(p => p.status === 'COMPLETED' || p.status === 'APPROVED').reduce((acc, curr) => acc + curr.amount, 0)}
          </p>
        </div>
        <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 rounded-3xl">
          <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-widest mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-white">
            {payments.filter(p => p.status === 'PENDING').length} Items
          </p>
        </div>
        <div className="bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 p-6 rounded-3xl">
          <p className="text-blue-500/60 text-[10px] font-black uppercase tracking-widest mb-1">Last Transaction</p>
          <p className="text-3xl font-bold text-white">
            {payments.length > 0 ? formatDate(payments[0].createdAt).split(',')[0] : 'None'}
          </p>
        </div>
      </div>

      {/* Transactions Table/List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-gray-800/30 rounded-3xl border border-dashed border-gray-700 p-20 text-center">
          <CreditCard className="mx-auto text-gray-600 mb-4" size={40} />
          <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
          <p className="text-gray-500 italic">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPayments.map((payment, idx) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${
                      payment.type === 'RECHARGE' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {payment.type === 'RECHARGE' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold tracking-tight">
                          {payment.type === 'RECHARGE' ? 'Wallet Top-up' : payment.packageId?.name || 'Package Purchase'}
                        </h3>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[10px] font-mono mb-2">{payment.invoiceNumber}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase">
                          <Calendar size={12} className="text-amber-500/60" /> {formatDate(payment.createdAt)}
                        </div>
                        {payment.transactionId && (
                          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase">
                            <span className="text-blue-500/40">TXID:</span> <span className="font-mono">{payment.transactionId}</span>
                          </div>
                        )}
                        {payment.bank && (
                           <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase">
                            <span className="text-purple-500/40">Bank:</span> {payment.bank}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10 pt-4 md:pt-0 border-t md:border-t-0 border-gray-700/50">
                    <div className="text-right">
                       <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Amount</p>
                       <p className="text-2xl font-bold text-white tracking-tight">৳{payment.amount}</p>
                    </div>
                    <button className="p-2.5 rounded-xl bg-gray-700/50 text-gray-400 hover:bg-amber-500 hover:text-gray-900 transition-all border border-gray-600/50">
                       <Download size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
