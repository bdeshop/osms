"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  Loader,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ContactForm {
  _id: string;
  firstName: string;
  lastName: string;
  businessEmail: string;
  phoneNumber: string;
  companyName: string;
  jobTitle: string;
  areaOfInterest: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

export default function ContactUsPage() {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "new" | "read" | "replied"
  >("all");

  useEffect(() => {
    fetchContactForms();
  }, []);

  const fetchContactForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await adminAPI.getContactForms()) as {
        success: boolean;
        data: ContactForm[];
        message?: string;
      };
      if (response.success) {
        setContactForms(response.data || []);
      } else {
        setError(response.message || "Failed to fetch contact forms");
      }
    } catch (err) {
      console.error("Failed to fetch contact forms:", err);
      setError("Failed to load contact forms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReplied = async (contactId: string) => {
    try {
      const response = (await adminAPI.markContactAsReplied(contactId)) as {
        success: boolean;
      };
      if (response.success) {
        setContactForms(
          contactForms.map((form) =>
            form._id === contactId ? { ...form, status: "replied" } : form,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to mark as replied:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="text-yellow-400" size={16} />;
      case "read":
        return <CheckCircle className="text-blue-400" size={16} />;
      case "replied":
        return <CheckCircle className="text-green-400" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "read":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "replied":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const filteredForms = contactForms.filter((form) => {
    const matchesSearch =
      form.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.businessEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || form.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Contact Us Submissions
          </h1>
          <p className="text-gray-400">
            Manage and respond to customer inquiries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4">
            <p className="text-gray-400 text-sm mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-white">
              {contactForms.length}
            </p>
          </div>
          <div className="bg-linear-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg border border-yellow-500/30 p-4">
            <p className="text-yellow-400 text-sm mb-1">New</p>
            <p className="text-3xl font-bold text-yellow-400">
              {contactForms.filter((f) => f.status === "new").length}
            </p>
          </div>
          <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/30 p-4">
            <p className="text-blue-400 text-sm mb-1">Read</p>
            <p className="text-3xl font-bold text-blue-400">
              {contactForms.filter((f) => f.status === "read").length}
            </p>
          </div>
          <div className="bg-linear-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/30 p-4">
            <p className="text-green-400 text-sm mb-1">Replied</p>
            <p className="text-3xl font-bold text-green-400">
              {contactForms.filter((f) => f.status === "replied").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "new" | "read" | "replied",
                )
              }
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <button
              onClick={fetchContactForms}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-6 py-2 rounded-lg transition-all"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-amber-500 mr-3" size={24} />
            <span className="text-gray-300">Loading contact forms...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Contact Forms List */}
        {!loading && filteredForms.length > 0 && (
          <div className="space-y-4">
            {filteredForms.map((form) => (
              <div
                key={form._id}
                className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-amber-500/50 transition-all"
              >
                {/* Header */}
                <div
                  onClick={() =>
                    setExpandedId(expandedId === form._id ? null : form._id)
                  }
                  className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(form.status)}
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(form.status)}`}
                      >
                        {form.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {form.firstName} {form.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {form.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                    {expandedId === form._id ? (
                      <ChevronUp className="text-amber-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === form._id && (
                  <div className="border-t border-gray-700 p-4 space-y-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Mail className="text-amber-400 mt-1" size={18} />
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white break-all">
                            {form.businessEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="text-amber-400 mt-1" size={18} />
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white">{form.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="text-amber-400 mt-1" size={18} />
                        <div>
                          <p className="text-gray-400 text-sm">Company</p>
                          <p className="text-white">{form.companyName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Briefcase className="text-amber-400 mt-1" size={18} />
                        <div>
                          <p className="text-gray-400 text-sm">Job Title</p>
                          <p className="text-white">{form.jobTitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Area of Interest */}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">
                        Area of Interest
                      </p>
                      <div className="bg-gray-900/50 rounded px-3 py-2 border border-gray-700">
                        <p className="text-amber-400">{form.areaOfInterest}</p>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="text-amber-400" size={18} />
                        <p className="text-gray-400 text-sm">Message</p>
                      </div>
                      <div className="bg-gray-900/50 rounded p-3 border border-gray-700">
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {form.message}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={16} />
                      <span>
                        Submitted: {new Date(form.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Action Button */}
                    {form.status !== "replied" && (
                      <button
                        onClick={() => handleMarkAsReplied(form._id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all"
                      >
                        Mark as Replied
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredForms.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg">No contact forms found</p>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "No submissions yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
