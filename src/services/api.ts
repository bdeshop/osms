export const API_BASE_URL = "http://localhost:9000/api";
export const API_BASE = "http://localhost:9000";

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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`📡 API Call: ${options.method || "GET"} ${endpoint}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`❌ API Error: ${endpoint}`, error);
    throw new Error(error.message || "API request failed");
  }

  const data = await response.json();
  console.log(`✅ API Success: ${endpoint}`, data);
  return data;
}

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

  requestManualRecharge: (amount: number, transactionId: string, bank?: string) =>
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
