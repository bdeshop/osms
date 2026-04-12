"use client";

import { useState, useEffect, useRef } from "react";
import { adminAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import {
  MessageSquareQuote,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Image as ImageIcon,
} from "lucide-react";

interface Testimonial {
  _id: string;
  quote: string;
  logoUrl: string;
  attribution: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    quote: "",
    attribution: "",
    order: 0,
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching testimonials");
      const response = (await adminAPI.getTestimonials()) as any;
      console.log("✅ Testimonials fetched:", response.data);
      setTestimonials(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch testimonials:", err);
      setError("Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      quote: "",
      attribution: "",
      order: testimonials.length,
      isActive: true,
    });
    setLogoFile(null);
    setLogoPreview("");
    setEditingTestimonial(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      quote: testimonial.quote,
      attribution: testimonial.attribution,
      order: testimonial.order,
      isActive: testimonial.isActive,
    });
    setLogoPreview(`${API_BASE}${testimonial.logoUrl}`);
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.quote.trim() || !formData.attribution.trim()) {
        setError("Quote and attribution are required");
        return;
      }

      if (!editingTestimonial && !logoFile) {
        setError("Logo is required for new testimonials");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append("quote", formData.quote);
      formDataToSend.append("attribution", formData.attribution);
      formDataToSend.append("order", formData.order.toString());
      formDataToSend.append("isActive", formData.isActive.toString());

      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      console.log("💾 Saving testimonial", { editingTestimonial, formData });

      if (editingTestimonial) {
        const response = (await adminAPI.updateTestimonial(
          editingTestimonial._id,
          formDataToSend
        )) as any;
        console.log("✅ Testimonial updated:", response.data);
        setSuccess("Testimonial updated successfully!");
      } else {
        const response = (await adminAPI.createTestimonial(
          formDataToSend
        )) as any;
        console.log("✅ Testimonial created:", response.data);
        setSuccess("Testimonial created successfully!");
      }

      resetForm();
      await fetchTestimonials();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to save testimonial:", err);
      setError(err instanceof Error ? err.message : "Failed to save testimonial. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      console.log("🗑️ Deleting testimonial");
      await adminAPI.deleteTestimonial(testimonialId);

      console.log("✅ Testimonial deleted");
      setSuccess("Testimonial deleted successfully!");
      await fetchTestimonials();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to delete testimonial:", err);
      setError("Failed to delete testimonial. Please try again.");
    }
  };

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      setError(null);
      const formDataToSend = new FormData();
      formDataToSend.append("quote", testimonial.quote);
      formDataToSend.append("attribution", testimonial.attribution);
      formDataToSend.append("order", testimonial.order.toString());
      formDataToSend.append("isActive", (!testimonial.isActive).toString());

      await adminAPI.updateTestimonial(testimonial._id, formDataToSend);
      await fetchTestimonials();
    } catch (err) {
      console.error("❌ Failed to toggle testimonial:", err);
      setError("Failed to update testimonial. Please try again.");
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
              <MessageSquareQuote className="text-amber-500" size={32} />
              <h1 className="text-4xl font-bold text-white">Testimonials</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Testimonial
            </button>
          </div>
          <p className="text-gray-400">
            Manage the testimonials displayed on the homepage
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

        {/* Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

              {/* Is Active */}
              <div className="flex items-end pb-3">
                <div className="flex items-center gap-3">
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

              {/* Logo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Logo {editingTestimonial ? "(Optional - Leave empty to keep current)" : "*"}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ImageIcon size={20} />
                    Choose Logo
                  </button>
                  {logoFile && (
                    <span className="text-gray-400 text-sm">{logoFile.name}</span>
                  )}
                </div>

                {/* Logo Preview */}
                {logoPreview && (
                  <div className="mt-4">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="max-w-xs h-16 object-contain rounded-lg border border-gray-600 bg-white p-2"
                    />
                  </div>
                )}
              </div>

              {/* Quote */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Quote *
                </label>
                <textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  placeholder="Customer testimonial quote"
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Attribution */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Attribution *
                </label>
                <input
                  type="text"
                  name="attribution"
                  value={formData.attribution}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe, CEO at Company"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
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

        {/* Testimonials List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            All Testimonials
          </h2>

          {testimonials.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquareQuote className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400">No testimonials configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className={`bg-gray-700/50 rounded-lg p-6 border border-gray-600 ${
                    !testimonial.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 flex gap-6">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src={`${API_BASE}${testimonial.logoUrl}`}
                          alt={testimonial.attribution}
                          className="w-32 h-16 object-contain rounded-lg border border-gray-600 bg-white p-2"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-amber-500/20 border border-amber-500/30 rounded px-2 py-1 text-xs text-amber-400 font-semibold">
                            Order: {testimonial.order}
                          </span>
                          {testimonial.isActive ? (
                            <span className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-xs text-green-400 font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-500/20 border border-red-500/30 rounded px-2 py-1 text-xs text-red-400 font-semibold">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <p className="text-gray-400 text-sm font-semibold">
                          — {testimonial.attribution}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Updated: {new Date(testimonial.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(testimonial)}
                        className="text-gray-400 hover:text-amber-500 transition-colors p-2"
                        title={testimonial.isActive ? "Deactivate" : "Activate"}
                      >
                        {testimonial.isActive ? (
                          <CheckCircle size={18} />
                        ) : (
                          <X size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
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
