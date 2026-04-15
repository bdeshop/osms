"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MessageSquare,
  Loader,
  AlertCircle,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  Clock,
  History,
  Globe,
  Monitor,
  Calendar,
  Search,
  ArrowRight,
  ExternalLink,
  Shield,
  Activity,
  DollarSign,
} from "lucide-react";

interface SelectionHistory {
  action: "selected" | "cancelled";
  date: string;
}

interface MessageDetail {
  _id: string;
  recipient: string;
  message: string;
  status: "sent" | "failed" | "pending";
  ipAddress?: string;
  platform?: string;
  senderUrl?: string;
  error?: string;
  createdAt: string;
}

interface PackageUsage {
  package: {
    _id: string;
    name: string;
    description: string;
    messageCount: number;
    costPerMessage: number;
    totalPrice: number;
    isActive: boolean;
  };
  currentStatus: "selected" | "cancelled" | "none";
  selectionHistory: SelectionHistory[];
  totalMessagesSent: number;
  messageStats: {
    totalSent: number;
    messages: MessageDetail[];
  };
}

interface UserReport {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    balance?: number;
  };
  usage: PackageUsage[];
}

export default function AdminUserPackagesMessages() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedUsage, setExpandedUsage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await adminAPI.getComprehensiveUsage()) as any;
      if (response.success) {
        setReports(response.data || []);
      } else {
        setError(response.message || "Failed to fetch comprehensive reports");
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load comprehensive usage data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <CheckCircle className="text-green-400" size={14} />;
      case "failed": return <XCircle className="text-red-400" size={14} />;
      case "pending": return <Clock className="text-yellow-400" size={14} />;
      default: return <AlertCircle className="text-gray-400" size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-500/10 border-green-500/30 text-green-400";
      case "failed": return "bg-red-500/10 border-red-500/30 text-red-400";
      case "pending": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default: return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const formatDate = (dateString: string, type: "full" | "date" = "full") => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (type === "date") return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReports = reports.filter(r => 
    r.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin text-amber-500" size={40} />
        <p className="text-gray-400 font-medium animate-pulse">Generating comprehensive reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30">
                <Shield className="text-blue-500" size={28} />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Usage Audits
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl">
              Comprehensive overview of user activities, package lifecycles, and detailed message security logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  placeholder="Search by user or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
             </div>
             <button 
              onClick={fetchReport}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-xl border border-gray-700 transition-colors"
             >
                <History size={20} />
             </button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-xs font-bold uppercase">Audited Users</p>
                <UsersIcon size={16} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">{reports.length}</p>
           </div>
           <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-xs font-bold uppercase">Active Packages</p>
                <Package size={16} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {reports.reduce((acc, r) => acc + r.usage.filter(u => u.currentStatus === 'selected').length, 0)}
              </p>
           </div>
           <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-xs font-bold uppercase">Total Messages</p>
                <MessageSquare size={16} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {reports.reduce((acc, r) => acc + r.usage.reduce((uAcc, u) => uAcc + u.messageStats.totalSent, 0), 0)}
              </p>
           </div>
           <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-xs font-bold uppercase">Failed Delivery</p>
                <AlertCircle size={16} className="text-red-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {reports.reduce((acc, r) => acc + r.usage.reduce((uAcc, u) => uAcc + u.messageStats.messages.filter(m => m.status === 'failed').length, 0), 0)}
              </p>
           </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <div className="bg-gray-800/30 rounded-3xl border border-dashed border-gray-700 p-20 text-center">
              <p className="text-gray-500">No matching reports found.</p>
            </div>
          ) : (
            filteredReports.map((report, rIdx) => (
              <div 
                key={report.user._id}
                className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden transition-all hover:border-gray-600 shadow-xl"
              >
                {/* User Header */}
                <div 
                  onClick={() => setExpandedUser(expandedUser === report.user._id ? null : report.user._id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg tracking-tight">
                      {report.user.firstName[0]}{report.user.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {report.user.firstName} {report.user.lastName}
                        {report.user.role === 'ADMIN' && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full border border-red-500/30">Super Admin</span>}
                      </h3>
                      <p className="text-gray-400 text-sm italic">{report.user.email}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                        <span className="flex items-center gap-1"><Calendar size={10}/> Joined {formatDate(report.user.createdAt, 'date')}</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span className="flex items-center gap-1 text-amber-500"><Package size={10}/> {report.usage.length} Package Interactions</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span className="flex items-center gap-1 text-green-500"><DollarSign size={10}/> ৳{report.user.balance || 0} Balance</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="flex gap-8">
                       <div className="text-center">
                          <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 tracking-tight">Total Interaction</p>
                          <p className="text-xl font-bold text-white tracking-tight">{report.usage.length}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-gray-500 text-[10px] font-bold uppercase mb-1 tracking-tight">Messages</p>
                          <p className="text-xl font-bold text-blue-500 tracking-tight">{report.usage.reduce((acc, u) => acc + u.messageStats.totalSent, 0)}</p>
                       </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      expandedUser === report.user._id ? "bg-blue-500 text-white rotate-180" : "bg-gray-700/50 text-gray-400"
                    }`}>
                      <ChevronDown size={22} />
                    </div>
                  </div>
                </div>

                {/* Usage Detail Section */}
                {expandedUser === report.user._id && (
                  <div className="border-t border-gray-700/50 bg-gray-900/40 p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                    {report.usage.length === 0 ? (
                      <p className="text-gray-500 text-center py-10 italic">This user hasn't selected any packages yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {report.usage.map((usage, uIdx) => {
                          const usageId = `${report.user._id}-${usage.package._id}-${uIdx}`;
                          const isExpanded = expandedUsage === usageId;
                          
                          return (
                            <div 
                              key={usageId}
                              className={`rounded-2xl border transition-all ${
                                isExpanded ? "border-amber-500/30 bg-gray-800/30" : "border-gray-700/50 bg-gray-800/10 hover:border-gray-600"
                              }`}
                            >
                              <div 
                                onClick={() => setExpandedUsage(isExpanded ? null : usageId)}
                                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="flex items-start gap-4 flex-1">
                                  <div className={`p-2.5 rounded-xl border ${
                                    usage.currentStatus === 'selected' ? "bg-amber-500/20 border-amber-500/30 text-amber-500" : "bg-gray-700/50 border-gray-600 text-gray-500"
                                  }`}>
                                    <Package size={20} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-white tracking-tight">{usage.package.name}</h4>
                                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border tracking-tight ${
                                        usage.currentStatus === 'selected' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                                      }`}>
                                        {usage.currentStatus}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase">
                                      <span>Cap: {usage.package.messageCount}</span>
                                      <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                                      <span>Sent: {usage.messageStats.totalSent}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 text-sm">
                                   <div className="flex items-center gap-1.5 text-gray-400">
                                      <Activity size={14} className="text-blue-500/60" />
                                      <span>Utilization: <b>{Math.round((usage.messageStats.totalSent / usage.package.messageCount) * 100)}%</b></span>
                                   </div>
                                   <ChevronDown size={18} className={`text-gray-500 transition-all ${isExpanded ? 'rotate-180 text-amber-500' : ''}`} />
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-5 pt-0 space-y-6 animate-in slide-in-from-top-2 duration-200">
                                  {/* Interaction Timeline */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                      <h5 className="text-[10px] font-bold uppercase tracking-tight text-gray-500 mb-4 flex items-center gap-2">
                                        <History size={12} className="text-amber-500" /> Lifecycle Timeline
                                      </h5>
                                      <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-700">
                                        {usage.selectionHistory.map((history, hIdx) => (
                                          <div key={hIdx} className="flex items-start gap-4 relative">
                                            <div className={`mt-1 w-4 h-4 rounded-full border-2 border-gray-900 z-10 ${
                                              history.action === 'selected' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                            <div>
                                              <p className="text-xs font-bold text-white capitalize">{history.action}</p>
                                              <p className="text-[10px] text-gray-500">{formatDate(history.date)}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                       <h5 className="text-[10px] font-bold uppercase tracking-tight text-gray-500 mb-4 flex items-center gap-2">
                                        <Activity size={12} className="text-blue-500" /> Usage Analysis
                                      </h5>
                                      <div className="space-y-4">
                                         <div>
                                            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                                               <span>CONUMPTION</span>
                                               <span>{usage.messageStats.totalSent} / {usage.package.messageCount}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                               <div 
                                                className="h-full bg-linear-to-r from-blue-500 to-amber-500 transition-all duration-500"
                                                style={{ width: `${Math.min(100, (usage.messageStats.totalSent / usage.package.messageCount) * 100)}%` }}
                                               />
                                            </div>
                                         </div>
                                         <div className="grid grid-cols-2 gap-3 text-center">
                                            <div className="bg-gray-800/50 py-2 rounded-lg border border-gray-700/50">
                                               <p className="text-[9px] text-gray-500 uppercase">Cost Per</p>
                                               <p className="text-xs font-bold text-white">৳{usage.package.costPerMessage}</p>
                                            </div>
                                            <div className="bg-gray-800/50 py-2 rounded-lg border border-gray-700/50">
                                               <p className="text-[9px] text-gray-500 uppercase">Revenue</p>
                                               <p className="text-xs font-bold text-green-500">৳{usage.messageStats.totalSent * usage.package.costPerMessage}</p>
                                            </div>
                                         </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Deep Logs */}
                                  <div className="space-y-4">
                                     <h5 className="text-[10px] font-bold uppercase tracking-tight text-gray-500 flex items-center gap-2">
                                        <Shield size={12} className="text-red-500" /> Deep Audit Logs (Anti-Fraud)
                                      </h5>
                                      {usage.messageStats.messages.length === 0 ? (
                                        <p className="text-gray-600 text-xs italic bg-gray-900/30 p-4 rounded-xl text-center">No messages sent under this lifecycle.</p>
                                      ) : (
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-premium">
                                          {usage.messageStats.messages.map((msg, mIdx) => (
                                            <div 
                                              key={msg._id || mIdx}
                                              className={`bg-gray-900/40 rounded-xl p-4 border transition-all ${
                                                msg.status === 'failed' ? 'border-red-500/10 group-hover:border-red-500/30' : 'border-gray-700/50 hover:border-gray-600'
                                              }`}
                                            >
                                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4 min-w-0">
                                                   <div className={`mt-0.5 p-1.5 rounded-lg ${getStatusColor(msg.status)}`}>
                                                      {getStatusIcon(msg.status)}
                                                   </div>
                                                   <div className="min-w-0">
                                                      <div className="flex items-center gap-2 mb-1">
                                                         <span className="text-white font-mono text-sm font-bold truncate">{msg.recipient}</span>
                                                         <span className="text-[9px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded border border-gray-700 font-mono">{msg._id}</span>
                                                      </div>
                                                      <p className="text-gray-400 text-xs mb-3 line-clamp-2 italic">"{msg.message}"</p>
                                                      
                                                      {/* Extra Audit Metadata */}
                                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium">
                                                         <div className="flex items-center gap-1.5 text-gray-500">
                                                            <Globe size={12} className="text-blue-500/60" />
                                                            <span>IP: <b className="text-gray-300">{msg.ipAddress || '0.0.0.0'}</b></span>
                                                         </div>
                                                         <div className="flex items-center gap-1.5 text-gray-500">
                                                            <Monitor size={12} className="text-amber-500/60" />
                                                            <span className="truncate max-w-[150px]">{msg.platform || 'System/API'}</span>
                                                         </div>
                                                         {msg.senderUrl && (
                                                           <div className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                                                              <ExternalLink size={12} />
                                                              <a href={msg.senderUrl} target="_blank" rel="noreferrer" className="truncate max-w-[200px]">{msg.senderUrl}</a>
                                                           </div>
                                                         )}
                                                      </div>
                                                   </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                   <p className="text-[10px] text-white font-bold tracking-tight">{formatDate(msg.createdAt, "date")}</p>
                                                   <p className="text-[10px] text-gray-500 tracking-tight">{formatDate(msg.createdAt, "time" as any)}</p>
                                                   {msg.status === 'failed' && (
                                                     <div className="mt-2 flex items-center justify-end gap-1 text-red-400 text-[10px] font-bold">
                                                        <AlertCircle size={10} />
                                                        <span>{msg.error || 'System Rejection'}</span>
                                                     </div>
                                                   )}
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
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-premium::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-premium::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.1);
          border-radius: 10px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
