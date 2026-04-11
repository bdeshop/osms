"use client";

import { useState, useEffect, useRef } from "react";
import { adminAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import {
  Radio,
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
import * as LucideIcons from "lucide-react";

interface ServiceChannel {
  _id: string;
  name: string;
  nameBn: string;
  icon: string;
  iconType: "lucide" | "image" | "emoji";
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminServiceChannels() {
  const [serviceChannels, setServiceChannels] = useState<ServiceChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ServiceChannel | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    nameBn: "",
    icon: "",
    iconType: "lucide" as "lucide" | "image" | "emoji",
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchServiceChannels();
  }, []);

  const fetchServiceChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching service channels");
      const response = (await adminAPI.getServiceChannels()) as any;
      console.log("✅ Service channels fetched:", response.data);
      setServiceChannels(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch service channels:", err);
      setError("Failed to load service channels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, iconType: "image" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameBn: "",
      icon: "",
      iconType: "lucide",
      order: serviceChannels.length,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingChannel(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (channel: ServiceChannel) => {
    setFormData({
      name: channel.name,
      nameBn: channel.nameBn,
      icon: channel.iconType === "image" ? "" : channel.icon,
      iconType: channel.iconType,
      order: channel.order,
      isActive: channel.isActive,
    });
    if (channel.iconType === "image") {
      setImagePreview(`${API_BASE}${channel.icon}`);
    } else {
      setImagePreview("");
    }
    setEditingChannel(channel);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        setError("Name is required");
        return;
      }

      if (!editingChannel && formData.iconType === "image" && !imageFile) {
        setError("Image is required when icon type is 'image'");
        return;
      }

      if (
        !editingChannel &&
        formData.iconType !== "image" &&
        !formData.icon.trim()
      ) {
        setError("Icon is required for lucide/emoji types");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("nameBn", formData.nameBn);
      formDataToSend.append("iconType", formData.iconType);
      formDataToSend.append("order", formData.order.toString());
      formDataToSend.append("isActive", formData.isActive.toString());

      if (formData.iconType === "image" && imageFile) {
        formDataToSend.append("image", imageFile);
      } else if (formData.iconType !== "image") {
        formDataToSend.append("icon", formData.icon);
      }

      console.log("💾 Saving service channel", { editingChannel, formData });

      if (editingChannel) {
        const response = (await adminAPI.updateServiceChannel(
          editingChannel._id,
          formDataToSend,
        )) as any;
        console.log("✅ Service channel updated:", response.data);
        setSuccess("Service channel updated successfully!");
      } else {
        const response = (await adminAPI.createServiceChannel(
          formDataToSend,
        )) as any;
        console.log("✅ Service channel created:", response.data);
        setSuccess("Service channel created successfully!");
      }

      resetForm();
      await fetchServiceChannels();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to save service channel:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save service channel. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (channelId: string) => {
    if (!confirm("Are you sure you want to delete this service channel?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      console.log("🗑️ Deleting service channel");
      await adminAPI.deleteServiceChannel(channelId);

      console.log("✅ Service channel deleted");
      setSuccess("Service channel deleted successfully!");
      await fetchServiceChannels();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to delete service channel:", err);
      setError("Failed to delete service channel. Please try again.");
    }
  };

  const toggleActive = async (channel: ServiceChannel) => {
    try {
      setError(null);
      const formDataToSend = new FormData();
      formDataToSend.append("name", channel.name);
      formDataToSend.append("nameBn", channel.nameBn);
      formDataToSend.append("iconType", channel.iconType);
      if (channel.iconType !== "image") {
        formDataToSend.append("icon", channel.icon);
      }
      formDataToSend.append("order", channel.order.toString());
      formDataToSend.append("isActive", (!channel.isActive).toString());

      await adminAPI.updateServiceChannel(channel._id, formDataToSend);
      await fetchServiceChannels();
    } catch (err) {
      console.error("❌ Failed to toggle service channel:", err);
      setError("Failed to update service channel. Please try again.");
    }
  };

  const getIconPreview = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={24} />;
    }
    return null;
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
              <Radio className="text-amber-500" size={32} />
              <h1 className="text-4xl font-bold text-white">
                Service Channels
              </h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Service
            </button>
          </div>
          <p className="text-gray-400">
            Manage the service channels displayed on the homepage
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
                {editingChannel ? "Edit Service" : "Add Service Channel"}
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

              {/* Icon Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Icon Type
                </label>
                <select
                  name="iconType"
                  value={formData.iconType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="lucide">Lucide Icon</option>
                  <option value="emoji">Emoji</option>
                  <option value="image">Custom Image</option>
                </select>
              </div>

              {/* Icon Input (for lucide/emoji) */}
              {formData.iconType !== "image" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Icon{" "}
                    {formData.iconType === "lucide"
                      ? "(Lucide name, e.g., MessageSquare)"
                      : "(Emoji, e.g., ✉️)"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder={
                      formData.iconType === "lucide"
                        ? "e.g., MessageSquare"
                        : "e.g., ✉️"
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  {formData.icon && formData.iconType === "lucide" && (
                    <div className="mt-2 p-3 bg-gray-700 rounded-lg inline-flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Preview:</span>
                      {getIconPreview(formData.icon) || (
                        <span className="text-red-400 text-sm">
                          Icon not found
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Image Upload (for image type) */}
              {formData.iconType === "image" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Image {!editingChannel && "*"}{" "}
                    {editingChannel &&
                      "(Optional - Leave empty to keep current)"}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ImageIcon size={20} />
                      Choose Image
                    </button>
                    {imageFile && (
                      <span className="text-gray-400 text-sm">
                        {imageFile.name}
                      </span>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Name (English) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name (English) *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., SMS"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Name (Bangla) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name (Bangla)
                </label>
                <input
                  type="text"
                  name="nameBn"
                  value={formData.nameBn}
                  onChange={handleInputChange}
                  placeholder="e.g., এসএমএস"
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

        {/* Service Channels List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            All Service Channels
          </h2>

          {serviceChannels.length === 0 ? (
            <div className="text-center py-8">
              <Radio className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400">
                No service channels configured yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceChannels.map((channel) => (
                <div
                  key={channel._id}
                  className={`bg-gray-700/50 rounded-lg p-6 border border-gray-600 ${
                    !channel.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Icon/Image Preview */}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center overflow-hidden">
                        {channel.iconType === "image" ? (
                          <img
                            src={`${API_BASE}${channel.icon}`}
                            alt={channel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : channel.iconType === "lucide" ? (
                          getIconPreview(channel.icon) || channel.icon
                        ) : (
                          channel.icon
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {channel.name}
                        </h3>
                        {channel.nameBn && (
                          <p className="text-gray-400 text-sm">
                            {channel.nameBn}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(channel)}
                        className="text-gray-400 hover:text-amber-500 transition-colors p-1"
                        title={channel.isActive ? "Deactivate" : "Activate"}
                      >
                        {channel.isActive ? (
                          <CheckCircle size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(channel)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(channel._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-amber-500/20 border border-amber-500/30 rounded px-2 py-1 text-xs text-amber-400 font-semibold">
                      Order: {channel.order}
                    </span>
                    <span className="bg-gray-600/50 rounded px-2 py-1 text-xs">
                      {channel.iconType}
                      {channel.iconType === "image" ? "" : `: ${channel.icon}`}
                    </span>
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
