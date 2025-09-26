import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TokenManager } from "./token-manager";

// API Configuration - Now using local Next.js API routes
const API_BASE_URL = "";

// Token management functions
export const setAccessToken = (token: string | null) => {
  TokenManager.setAccessToken(token);
};

export const getAccessToken = () => TokenManager.getAccessToken();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh endpoint to avoid infinite loops
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use the token manager to handle refresh
        const newAccessToken = await TokenManager.refreshToken();

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        TokenManager.clearTokens();

        // Only redirect if we're in the browser
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response: AxiosResponse = await apiClient.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response: AxiosResponse = await apiClient.post("/api/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  refresh: async () => {
    const response: AxiosResponse = await apiClient.post("/api/auth/refresh");
    return response.data;
  },

  logout: async () => {
    const response: AxiosResponse = await apiClient.post("/api/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response: AxiosResponse = await apiClient.get("/api/auth/me");
    return response.data;
  },
};

// Items API
export const itemsAPI = {
  getItems: async (params?: Record<string, any>) => {
    const response: AxiosResponse = await apiClient.get("/api/items", {
      params,
    });
    return response.data;
  },

  getItem: async (id: string) => {
    const response: AxiosResponse = await apiClient.get(`/api/items/${id}`);
    return response.data;
  },

  createItem: async (data: FormData) => {
    const response: AxiosResponse = await apiClient.post("/api/items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateItem: async (id: string, data: FormData) => {
    const response: AxiosResponse = await apiClient.patch(
      `/api/items/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response: AxiosResponse = await apiClient.delete(`/api/items/${id}`);
    return response.data;
  },

  getItemsByCategory: async (category: string) => {
    const response: AxiosResponse = await apiClient.get(
      `/api/items/category/${category}`
    );
    return response.data;
  },
};

export default apiClient;
