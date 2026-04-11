"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import {
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";

interface HomepageStat {
  _id: string;
  key: string;
  value: string;
  valueBn: string;
  label: string;
  labelBn: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHomepageStats() {
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStat, setEditingStat] = useState<HomepageStat | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    valueBn: "",
    label: "",
    labelBn: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching homepage stats");
      const response = (await adminAPI.getHomepageStats()) as any;
      console.log("✅ Stats fetched:", response.data);
      setStats(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch stats:", err);
      setError("Failed to load stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    });
  };

  const resetForm = () => {
    setFormData({
      key: "",
      value: "",
      valueBn: "",
      label: "",
      labelBn: "",
      order: stats.length,
      isActive: true,
    });
    setEditingStat(null);
    setShowForm(false);
  };

  const handleEdit = (stat: HomepageStat) => {
    setFormData({
      key: stat.key,
      value: stat.value,
      valueBn: stat.valueBn,
      label: stat.label,
      labelBn: stat.labelBn,
      order: stat.order,
      isActive: stat.isActive,
    });
    setEditingStat(stat);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (
        !formData.key.trim() ||
        !formData.value.trim() ||
        !formData.label.trim()
      ) {
        setError("Key, value, and label are required");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      console.log("💾 Saving homepage stat", { editingStat, formData });

      if (editingStat) {
        // Update existing stat using PATCH with _id
        const response = (await adminAPI.updateHomepageStat(
          editingStat._id,
          formData,
        )) as any;
        console.log("✅ Stat updated successfully:", response.data);
        setSuccess("Stat updated successfully!");
      } else {
        // Create new stat using POST
        const response = (await adminAPI.createHomepageStat(formData)) as any;
        console.log("✅ Stat created successfully:", response.data);
        setSuccess("Stat created successfully!");
      }

      // Reset form and refresh
      resetForm();
      await fetchStats();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to save stat:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save stat. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (statId: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      console.log("🗑️ Deleting stat");
      await adminAPI.deleteHomepageStat(statId);

      console.log("✅ Stat deleted");
      setSuccess("Stat deleted successfully!");
      await fetchStats();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to delete stat:", err);
      setError("Failed to delete stat. Please try again.");
    }
  };

  const toggleActive = async (stat: HomepageStat) => {
    try {
      setError(null);
      await adminAPI.updateHomepageStat(stat._id, {
        key: stat.key,
        value: stat.value,
        valueBn: stat.valueBn,
        label: stat.label,
        labelBn: stat.labelBn,
        order: stat.order,
        isActive: !stat.isActive,
      });
      await fetchStats();
    } catch (err) {
      console.error("❌ Failed to toggle stat:", err);
      setError("Failed to update stat. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-amber-500" size={32} />
              <h1 className="text-4xl font-bold text-white">Homepage Stats</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Stat
            </button>
          </div>
          <p className="text-gray-400">
            Manage the statistics displayed on the homepage
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400 shrink-0" size={20} />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-400 shrink-0" size={20} />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingStat ? "Edit Stat" : "Add New Stat"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Key */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Key *
                </label>
                <input
                  type="text"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  placeholder="e.g., years_experience"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Value (English) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Value (English) *
                </label>
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="e.g., 17+"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Value (Bangla) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Value (Bangla)
                </label>
                <input
                  type="text"
                  name="valueBn"
                  value={formData.valueBn}
                  onChange={handleInputChange}
                  placeholder="e.g., ১৭+"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Label (English) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Label (English) *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="e.g., years of trusted industry experience"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Label (Bangla) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Label (Bangla)
                </label>
                <input
                  type="text"
                  name="labelBn"
                  value={formData.labelBn}
                  onChange={handleInputChange}
                  placeholder="e.g., বিশ্বস্ত শিল্প অভিজ্ঞতার বছর"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Is Active */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                />
                <label className="text-sm font-semibold text-gray-300">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            All Homepage Stats
          </h2>

          {stats.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400">No stats configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat._id}
                  className={`bg-gray-700/50 rounded-lg p-6 border border-gray-600 ${
                    !stat.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                          {stat.value}
                        </h3>
                        <span className="bg-amber-500/20 border border-amber-500/30 rounded px-2 py-1 text-xs text-amber-400 font-semibold">
                          Order: {stat.order}
                        </span>
                        {stat.isActive ? (
                          <span className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-xs text-green-400 font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-500/20 border border-red-500/30 rounded px-2 py-1 text-xs text-red-400 font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-white font-semibold mb-1">
                        {stat.label}
                      </p>
                      {stat.valueBn && (
                        <p className="text-gray-400 text-sm">
                          বাংলা: {stat.valueBn} - {stat.labelBn}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        Key: {stat.key} | Updated:{" "}
                        {new Date(stat.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(stat)}
                        className="text-gray-400 hover:text-amber-500 transition-colors p-2"
                        title={stat.isActive ? "Deactivate" : "Activate"}
                      >
                        {stat.isActive ? (
                          <CheckCircle size={18} />
                        ) : (
                          <X size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(stat)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(stat._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
