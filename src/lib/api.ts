import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Global token storage (in memory)
let accessToken: string | null = null;

// Token management functions
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

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
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response: AxiosResponse = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response: AxiosResponse = await apiClient.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  refresh: async () => {
    const response: AxiosResponse = await apiClient.post("/auth/refresh");
    return response.data;
  },

  logout: async () => {
    const response: AxiosResponse = await apiClient.post("/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response: AxiosResponse = await apiClient.get("/auth/me");
    return response.data;
  },
};

// Items API
export const itemsAPI = {
  getItems: async (params?: any) => {
    const response: AxiosResponse = await apiClient.get("/items", { params });
    return response.data;
  },

  getItem: async (id: string) => {
    const response: AxiosResponse = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (data: FormData) => {
    const response: AxiosResponse = await apiClient.post("/items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateItem: async (id: string, data: any) => {
    const response: AxiosResponse = await apiClient.patch(`/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response: AxiosResponse = await apiClient.delete(`/items/${id}`);
    return response.data;
  },
};

export default apiClient;
