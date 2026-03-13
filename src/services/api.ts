const API_BASE_URL = "http://localhost:9000/api";

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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
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
