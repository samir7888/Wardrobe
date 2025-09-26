// Token management with refresh prevention
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export class TokenManager {
  private static accessToken: string | null = null;

  static setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  static getAccessToken() {
    return this.accessToken;
  }

  static async refreshToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    // Set refreshing flag and create promise
    isRefreshing = true;
    refreshPromise = this.performRefresh();

    try {
      const newToken = await refreshPromise;
      return newToken;
    } finally {
      // Reset flags
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  private static async performRefresh(): Promise<string> {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    this.setAccessToken(newAccessToken);
    return newAccessToken;
  }

  static clearTokens() {
    this.accessToken = null;
    isRefreshing = false;
    refreshPromise = null;
  }
}
