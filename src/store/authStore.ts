import { create } from "zustand";
import { authAPI, setAccessToken, getAccessToken } from "@/lib/api";

interface User {
  id: string;
  email: string;

  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { accessToken } = response;

      // Store token in memory only
      setAccessToken(accessToken);

      // Get user profile
      const profileResponse = await authAPI.getProfile();

      set({
        user: profileResponse.user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(email, password, name);
      const { accessToken } = response;

      // Store token in memory only
      setAccessToken(accessToken);

      // Get user profile
      const profileResponse = await authAPI.getProfile();

      set({
        user: profileResponse.user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error);
    }

    setAccessToken(null);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  refreshAuth: async () => {
    try {
      const response = await authAPI.refresh();
      const { accessToken } = response;

      setAccessToken(accessToken);

      // Get user profile
      const profileResponse = await authAPI.getProfile();

      set({
        user: profileResponse.user,
        accessToken,
        isAuthenticated: true,
      });
    } catch (error) {
      // Refresh failed, clear auth
      setAccessToken(null);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  clearAuth: () => {
    setAccessToken(null);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      // Try to refresh token on app start
      await get().refreshAuth();
    } catch (error) {
      // No valid refresh token, user needs to login
      console.log("No valid refresh token found");
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
