"use client";

import { useState, useEffect, useRef } from "react";
import { adminAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import {
  Newspaper,
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

interface NewsUpdate {
  _id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsUpdates() {
  const [newsUpdates, setNewsUpdates] = useState<NewsUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsUpdate | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    description: "",
    descriptionBn: "",
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNewsUpdates();
  }, []);

  const fetchNewsUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching news updates");
      const response = (await adminAPI.getNewsUpdates()) as any;
      console.log("✅ News updates fetched:", response.data);
      console.log("🖼️ API_BASE value:", API_BASE);

      // Log image URLs
      if (response.data && response.data.length > 0) {
        response.data.forEach((news: NewsUpdate, idx: number) => {
          console.log(`📷 News[${idx}] imageUrl:`, news.imageUrl);
          const fullUrl = news.imageUrl.startsWith("http")
            ? news.imageUrl
            : `${API_BASE}${news.imageUrl}`;
          console.log(`📷 News[${idx}] fullUrl:`, fullUrl);
        });
      }

      setNewsUpdates(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch news updates:", err);
      setError("Failed to load news updates. Please try again.");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleBn: "",
      description: "",
      descriptionBn: "",
      order: newsUpdates.length,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingNews(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (news: NewsUpdate) => {
    setFormData({
      title: news.title,
      titleBn: news.titleBn,
      description: news.description,
      descriptionBn: news.descriptionBn,
      order: news.order,
      isActive: news.isActive,
    });
    setImagePreview(news.imageUrl ? `${API_BASE}${news.imageUrl}` : "");
    setEditingNews(news);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Title and description are required");
        return;
      }

      if (!editingNews && !imageFile) {
        setError("Image is required for new news updates");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("titleBn", formData.titleBn);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("descriptionBn", formData.descriptionBn);
      formDataToSend.append("order", formData.order.toString());
      formDataToSend.append("isActive", formData.isActive.toString());

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("💾 Saving news update", { editingNews, formData });

      if (editingNews) {
        // Update existing news
        const response = (await adminAPI.updateNewsUpdate(
          editingNews._id,
          formDataToSend,
        )) as any;
        console.log("✅ News updated successfully:", response.data);
        setSuccess("News update updated successfully!");
      } else {
        // Create new news
        const response = (await adminAPI.createNewsUpdate(
          formDataToSend,
        )) as any;
        console.log("✅ News created successfully:", response.data);
        setSuccess("News update created successfully!");
      }

      resetForm();
      await fetchNewsUpdates();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to save news:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save news. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm("Are you sure you want to delete this news update?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      console.log("🗑️ Deleting news update");
      await adminAPI.deleteNewsUpdate(newsId);

      console.log("✅ News deleted");
      setSuccess("News update deleted successfully!");
      await fetchNewsUpdates();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Failed to delete news:", err);
      setError("Failed to delete news. Please try again.");
    }
  };

  const toggleActive = async (news: NewsUpdate) => {
    try {
      setError(null);
      const formDataToSend = new FormData();
      formDataToSend.append("title", news.title);
      formDataToSend.append("titleBn", news.titleBn);
      formDataToSend.append("description", news.description);
      formDataToSend.append("descriptionBn", news.descriptionBn);
      formDataToSend.append("order", news.order.toString());
      formDataToSend.append("isActive", (!news.isActive).toString());

      await adminAPI.updateNewsUpdate(news._id, formDataToSend);
      await fetchNewsUpdates();
    } catch (err) {
      console.error("❌ Failed to toggle news:", err);
      setError("Failed to update news. Please try again.");
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
              <Newspaper className="text-amber-500" size={32} />
              <h1 className="text-4xl font-bold text-white">News Updates</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add News
            </button>
          </div>
          <p className="text-gray-400">
            Manage the news updates displayed on the homepage
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
                {editingNews ? "Edit News" : "Add News Update"}
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

              {/* Title (English) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 2025 G2E Asia – Laaffic Redefines Gaming Growth"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Title (Bangla) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title (Bangla)
                </label>
                <input
                  type="text"
                  name="titleBn"
                  value={formData.titleBn}
                  onChange={handleInputChange}
                  placeholder="e.g., ২০২৫ G2E এশিয়া – লাফিক গেমিং গ্রোথ পুনর্নির্ধারণ করে"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Description (English) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description (English) *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="News description in English"
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Description (Bangla) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description (Bangla)
                </label>
                <textarea
                  name="descriptionBn"
                  value={formData.descriptionBn}
                  onChange={handleInputChange}
                  placeholder="বাংলায় নিউজ বিবরণ"
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Image{" "}
                  {editingNews
                    ? "(Optional - Leave empty to keep current)"
                    : "*"}
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
                      className="max-w-md rounded-lg border border-gray-600"
                    />
                  </div>
                )}
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

        {/* News List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            All News Updates
          </h2>

          {newsUpdates.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400">No news updates configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsUpdates.map((news) => (
                <div
                  key={news._id}
                  className={`bg-gray-700/50 rounded-lg p-6 border border-gray-600 ${
                    !news.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 flex gap-6">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {(() => {
                          const imageUrl = news.imageUrl.startsWith("http")
                            ? news.imageUrl
                            : `${API_BASE}${news.imageUrl}`;
                          console.log(
                            `🖼️ Rendering image for "${news.title}":`,
                            imageUrl,
                          );
                          return (
                            <img
                              src={imageUrl}
                              alt={news.title}
                              className="w-32 h-24 object-cover rounded-lg border border-gray-600"
                              onError={(e) => {
                                console.error(
                                  `❌ Failed to load image:`,
                                  imageUrl,
                                );
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                              onLoad={() => {
                                console.log(
                                  `✅ Image loaded successfully:`,
                                  imageUrl,
                                );
                              }}
                            />
                          );
                        })()}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-amber-500/20 border border-amber-500/30 rounded px-2 py-1 text-xs text-amber-400 font-semibold">
                            Order: {news.order}
                          </span>
                          {news.isActive ? (
                            <span className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-xs text-green-400 font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-500/20 border border-red-500/30 rounded px-2 py-1 text-xs text-red-400 font-semibold">
                              Inactive
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {news.title}
                        </h3>
                        {news.titleBn && (
                          <p className="text-gray-400 text-sm mb-2">
                            বাংলা: {news.titleBn}
                          </p>
                        )}
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {news.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Updated: {new Date(news.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(news)}
                        className="text-gray-400 hover:text-amber-500 transition-colors p-2"
                        title={news.isActive ? "Deactivate" : "Activate"}
                      >
                        {news.isActive ? (
                          <CheckCircle size={18} />
                        ) : (
                          <X size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(news)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(news._id)}
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
