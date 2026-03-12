"use client";

import { useState, useEffect } from "react";
import { packageAPI } from "@/services/api";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader } from "lucide-react";

interface Package {
  _id: string;
  name: string;
  description: string;
  messageCount: number;
  costPerMessage: number;
  totalPrice: number;
  features: string[];
  isActive: boolean;
  createdBy: any;
}

export default function PackagesManager() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    messageCount: "",
    costPerMessage: "",
    features: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState("");

  // Fetch packages
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageAPI.getAll();
      setPackages(data.data || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        messageCount: parseInt(formData.messageCount),
        costPerMessage: parseFloat(formData.costPerMessage),
        features: formData.features,
      };

      if (editingId) {
        await packageAPI.update(editingId, payload);
      } else {
        await packageAPI.create(payload);
      }

      setFormData({
        name: "",
        description: "",
        messageCount: "",
        costPerMessage: "",
        features: [],
      });
      setFeatureInput("");
      setEditingId(null);
      setShowForm(false);
      await fetchPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      description: pkg.description,
      messageCount: pkg.messageCount.toString(),
      costPerMessage: pkg.costPerMessage.toString(),
      features: pkg.features,
    });
    setFeatureInput("");
    setEditingId(pkg._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await packageAPI.delete(id);
      await fetchPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete package");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await packageAPI.toggleStatus(id);
      await fetchPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">SMS Packages</h1>
        <p className="text-gray-400">Manage SMS packages and pricing</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Create Button */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({
            name: "",
            description: "",
            messageCount: "",
            costPerMessage: "",
            features: [],
          });
          setFeatureInput("");
        }}
        className="mb-6 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-gray-900 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-amber-500/40"
      >
        <Plus size={20} />
        Create Package
      </button>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? "Edit Package" : "Create New Package"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Package Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Message Count"
              value={formData.messageCount}
              onChange={(e) =>
                setFormData({ ...formData, messageCount: e.target.value })
              }
              required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cost Per Message"
              value={formData.costPerMessage}
              onChange={(e) =>
                setFormData({ ...formData, costPerMessage: e.target.value })
              }
              required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (featureInput.trim()) {
                        setFormData({
                          ...formData,
                          features: [...formData.features, featureInput.trim()],
                        });
                        setFeatureInput("");
                      }
                    }
                  }}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (featureInput.trim()) {
                      setFormData({
                        ...formData,
                        features: [...formData.features, featureInput.trim()],
                      });
                      setFeatureInput("");
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded border border-amber-500/30 flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            features: formData.features.filter(
                              (_, i) => i !== idx,
                            ),
                          });
                        }}
                        className="text-amber-400 hover:text-amber-300 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Package"
                    : "Create Package"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Packages Grid */}
      {loading && !showForm ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-amber-500" size={40} />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No packages found. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm">{pkg.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pkg.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {pkg.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Messages:</span>
                  <span className="text-white font-semibold">
                    {pkg.messageCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cost/Message:</span>
                  <span className="text-amber-400 font-semibold">
                    ${pkg.costPerMessage.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="text-green-400 font-bold text-lg">
                    ${pkg.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Features */}
              {pkg.features.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded border border-amber-500/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(pkg._id)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                  title={pkg.isActive ? "Deactivate" : "Activate"}
                >
                  {pkg.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
