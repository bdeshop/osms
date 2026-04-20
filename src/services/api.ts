// export const API_BASE_URL = "http://localhost:9000/api";
// export const API_BASE = "http://localhost:9000";
export const API_BASE_URL = "https://o-sms.com/backend/api";
export const API_BASE = "https://o-sms.com/backend";
// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Generic fetch wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  // Only set Content-Type to application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: "Could not parse error response" };
    }
    
    // In production, keep minimal error logging if needed, or remove completely
    // console.error(`❌ API Error: ${response.status} ${endpoint}`, errorData);
    
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`,
    );
  }

  const data = await response.json();
  return data;
}

// Public API calls (no auth required)
export const publicAPI = {
  getHomepageStats: () =>
    apiCall("/frontend/homepage-stats", { method: "GET" }),

  getNewsUpdates: () => apiCall("/frontend/news-updates", { method: "GET" }),

  getServiceChannels: () =>
    apiCall("/frontend/service-channels", { method: "GET" }),

  getTestimonials: () => apiCall("/frontend/testimonials", { method: "GET" }),

  submitContactForm: (data: any) =>
    apiCall("/frontend/contact-us", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNavbarConfig: () => apiCall("/frontend/navbar-config", { method: "GET" }),

  getFooterConfig: () => apiCall("/frontend/footer-config", { method: "GET" }),
  getContactPageConfig: () =>
    apiCall("/frontend/contact-page-config", { method: "GET" }),
  getBannerConfig: () => apiCall("/frontend/banner-config", { method: "GET" }),

  getChatWidgetConfig: () =>
    apiCall("/frontend/chat-widget-config", { method: "GET" }),
};

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string = "USER",
  ) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    }),

  getMe: () => apiCall("/auth/me", { method: "GET" }),

  getCurrentUser: () => apiCall("/auth/me", { method: "GET" }),
};

// Package APIs
export const packageAPI = {
  getAll: () => apiCall("/packages", { method: "GET" }),

  getActive: () => apiCall("/packages/active", { method: "GET" }),

  getById: (id: string) => apiCall(`/packages/${id}`, { method: "GET" }),

  create: (data: any) =>
    apiCall("/packages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/packages/${id}`, {
      method: "DELETE",
    }),
  toggleStatus: (id: string) =>
    apiCall(`/packages/${id}/toggle-status`, {
      method: "PATCH",
    }),

  select: (packageId: string, action: "selected" | "cancelled") =>
    apiCall("/packages/select", {
      method: "POST",
      body: JSON.stringify({ packageId, action }),
    }),

  getSelectionInfo: () =>
    apiCall("/packages/selection-info", { method: "GET" }),
};

// User APIs
export const userAPI = {
  getAll: () => apiCall("/users", { method: "GET" }),

  getById: (id: string) => apiCall(`/users/${id}`, { method: "GET" }),

  update: (id: string, data: any) =>
    apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/users/${id}`, {
      method: "DELETE",
    }),

  changeRole: (id: string, role: string) =>
    apiCall(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => apiCall("/admin/users", { method: "GET" }),

  getUsersPackagesMessages: () =>
    apiCall("/admin/users-packages-messages", { method: "GET" }),

  getAllPackages: () => apiCall("/admin/packages", { method: "GET" }),

  getPackageMessages: (packageId: string) =>
    apiCall(`/admin/packages/${packageId}/messages`, { method: "GET" }),

  trackPackageSelection: (
    userId: string,
    packageId: string,
    action: "selected" | "cancelled",
  ) =>
    apiCall("/admin/track-package-selection", {
      method: "POST",
      body: JSON.stringify({ userId, packageId, action }),
    }),

  getPackageSelections: (filters?: {
    userId?: string;
    packageId?: string;
    action?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.packageId) params.append("packageId", filters.packageId);
    if (filters?.action) params.append("action", filters.action);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/admin/package-selections${query}`, { method: "GET" });
  },

  getComprehensiveUsage: () =>
    apiCall("/admin/comprehensive-usage", { method: "GET" }),

  getAnalytics: () => apiCall("/admin/analytics", { method: "GET" }),

  getSettings: () => apiCall("/admin/settings", { method: "GET" }),

  updateSetting: (key: string, value: string) =>
    apiCall("/admin/settings", {
      method: "POST",
      body: JSON.stringify({ key, value }),
    }),

  getHomepageStats: () => apiCall("/admin/homepage-stats", { method: "GET" }),

  createHomepageStat: (data: any) =>
    apiCall("/admin/homepage-stats", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateHomepageStat: (statId: string, data: any) =>
    apiCall(`/admin/homepage-stats/${statId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteHomepageStat: (statId: string) =>
    apiCall(`/admin/homepage-stats/${statId}`, {
      method: "DELETE",
    }),

  getNewsUpdates: () => apiCall("/admin/news-updates", { method: "GET" }),

  createNewsUpdate: (formData: FormData) =>
    apiCall("/admin/news-updates", {
      method: "POST",
      body: formData,
    }),

  updateNewsUpdate: (newsId: string, formData: FormData) =>
    apiCall(`/admin/news-updates/${newsId}`, {
      method: "PATCH",
      body: formData,
    }),

  seedDashboardData: () => apiCall("/admin/seed-dashboard-data", { method: "POST" }),

  deleteNewsUpdate: (newsId: string) =>
    apiCall(`/admin/news-updates/${newsId}`, {
      method: "DELETE",
    }),

  getServiceChannels: () =>
    apiCall("/admin/service-channels", { method: "GET" }),

  createServiceChannel: (formData: FormData) =>
    apiCall("/admin/service-channels", {
      method: "POST",
      body: formData,
    }),

  updateServiceChannel: (channelId: string, formData: FormData) =>
    apiCall(`/admin/service-channels/${channelId}`, {
      method: "PATCH",
      body: formData,
    }),

  deleteServiceChannel: (channelId: string) =>
    apiCall(`/admin/service-channels/${channelId}`, {
      method: "DELETE",
    }),

  getTestimonials: () => apiCall("/admin/testimonials", { method: "GET" }),

  createTestimonial: (formData: FormData) =>
    apiCall("/admin/testimonials", {
      method: "POST",
      body: formData,
    }),

  updateTestimonial: (testimonialId: string, formData: FormData) =>
    apiCall(`/admin/testimonials/${testimonialId}`, {
      method: "PATCH",
      body: formData,
    }),

  deleteTestimonial: (testimonialId: string) =>
    apiCall(`/admin/testimonials/${testimonialId}`, {
      method: "DELETE",
    }),

  getContactForms: (status?: string, limit?: number, skip?: number) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (limit) params.append("limit", limit.toString());
    if (skip) params.append("skip", skip.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/admin/frontend/contact-us${query}`, { method: "GET" });
  },

  getContactFormById: (contactId: string) =>
    apiCall(`/admin/frontend/contact-us/${contactId}`, { method: "GET" }),

  markContactAsReplied: (contactId: string) =>
    apiCall(`/admin/frontend/contact-us/${contactId}/mark-replied`, {
      method: "PATCH",
    }),

  // Navbar Configuration
  getNavbarConfig: () => apiCall("/admin/navbar-config", { method: "GET" }),

  updateNavbarConfig: (data: any) =>
    apiCall("/admin/navbar-config", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  // Footer Configuration
  getFooterConfig: () => apiCall("/admin/footer-config", { method: "GET" }),

  updateFooterConfig: (data: any) =>
    apiCall("/admin/footer-config", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Contact Page Configuration
  getContactPageConfig: () =>
    apiCall("/admin/contact-page-config", { method: "GET" }),

  updateContactPageConfig: (data: any) =>
    apiCall("/admin/contact-page-config", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadLocationImage: (formData: FormData) =>
    apiCall("/admin/upload-location-image", {
      method: "POST",
      body: formData,
    }),

  // Banner Configuration
  getBannerConfig: () => apiCall("/admin/banner-config", { method: "GET" }),
  updateBannerConfig: (data: any) =>
    apiCall("/admin/banner-config", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Chat Widget Configuration
  getChatWidgetConfig: () =>
    apiCall("/admin/chat-widget-config", { method: "GET" }),
  updateChatWidgetConfig: (data: any) =>
    apiCall("/admin/chat-widget-config", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// User API (for logged-in users)
export const userDataAPI = {
  getMyPackages: () => apiCall("/user/packages", { method: "GET" }),

  getPackageWithMessages: (packageId: string) =>
    apiCall(`/user/packages/${packageId}`, { method: "GET" }),

  getPackagesWithMessages: () =>
    apiCall("/user/packages-messages", { method: "GET" }),

  getMyMessages: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiCall(`/user/messages${query}`, { method: "GET" });
  },

  getUsageDetails: () => apiCall("/user/usage-details", { method: "GET" }),

  selectPackage: (packageId: string) =>
    apiCall("/user/select-package", {
      method: "POST",
      body: JSON.stringify({ packageId }),
    }),

  getCurrentPackage: () => apiCall("/user/current-package", { method: "GET" }),

  getAnalytics: () => apiCall("/user/analytics", { method: "GET" }),
};

// Payment & Recharge APIs
export const paymentAPI = {
  initiatePurchase: (packageId: string, success_redirect_url: string) =>
    apiCall("/payment/initiate", {
      method: "POST",
      body: JSON.stringify({ packageId, success_redirect_url }),
    }),

  recharge: (amount: number, success_redirect_url: string) =>
    apiCall("/payment/recharge", {
      method: "POST",
      body: JSON.stringify({ amount, success_redirect_url }),
    }),

  requestManualRecharge: (
    amount: number,
    transactionId: string,
    bank?: string,
  ) =>
    apiCall("/payment/request-recharge", {
      method: "POST",
      body: JSON.stringify({ amount, transactionId, bank }),
    }),

  getAdminPayments: (type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/admin/payments${query}`, { method: "GET" });
  },

  approveRecharge: (paymentId: string) =>
    apiCall(`/admin/payments/${paymentId}/approve`, { method: "POST" }),

  rejectRecharge: (paymentId: string) =>
    apiCall(`/admin/payments/${paymentId}/reject`, { method: "POST" }),

  getMyPayments: () => apiCall("/payment/my-payments", { method: "GET" }),
};

// Messaging APIs
export const messagingAPI = {
  sendSMS: (recipient: string, message: string) =>
    apiCall("/messaging/send", {
      method: "POST",
      body: JSON.stringify({ recipient, message }),
    }),

  sendBulkSMS: (recipients: string[], message: string) =>
    apiCall("/messaging/send-bulk", {
      method: "POST",
      body: JSON.stringify({ recipients, message }),
    }),

  getMessagesByPackage: (packageId: string) =>
    apiCall(`/messaging/package/${packageId}`, { method: "GET" }),

  getAllMessages: () => apiCall("/messaging/messages", { method: "GET" }),
};
