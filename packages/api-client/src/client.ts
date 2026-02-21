import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@flockloop/auth-store";

// Module-level singleton (init guard pattern)
let baseURL = "http://localhost:8000";

/**
 * Rewrite internal Docker hostnames in S3 URLs to browser-accessible ones.
 * The backend generates URLs using its internal S3 endpoint (e.g. http://minio:9000)
 * but the browser needs to reach it via localhost.
 */
export function toBrowserUrl(url: string): string {
  return url.replace(/^http:\/\/minio:9000/, "http://localhost:9000");
}

export function fixThumbnailUrl<T extends { thumbnail_url?: string | null }>(
  obj: T,
): T {
  if (obj.thumbnail_url) {
    return { ...obj, thumbnail_url: toBrowserUrl(obj.thumbnail_url) };
  }
  return obj;
}

export function setApiBaseUrl(url: string) {
  baseURL = url;
  apiClient.defaults.baseURL = url;
}

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach JWT access token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Token refresh logic ---
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processPendingQueue(token: string | null, error: unknown) {
  for (const p of pendingQueue) {
    if (token) {
      p.resolve(token);
    } else {
      p.reject(error);
    }
  }
  pendingQueue = [];
}

// Response interceptor: on 401, attempt token refresh before giving up
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401 responses that haven't been retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request was itself a refresh or login
    const url = originalRequest.url ?? "";
    if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        originalRequest._retry = true;
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const { data } = await axios.post<{
        access_token: string;
        refresh_token: string;
        token_type: string;
      }>(`${apiClient.defaults.baseURL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
      processPendingQueue(data.access_token, null);

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processPendingQueue(null, refreshError);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
