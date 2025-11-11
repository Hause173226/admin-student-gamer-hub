import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

interface RefreshTokenResponse {
  AccessToken: string;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ use env variable
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const noAuthPaths = ["/Auth/login", "/Auth/register", "/Auth/refresh"];
    if (token && !noAuthPaths.some((path) => config.url?.includes(path))) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

export const callRefreshToken = async (): Promise<string> => {
  const res = await axios.post<RefreshTokenResponse>(
    "/Auth/refresh",
    {},
    { withCredentials: true }
  );
  const newAccessToken = res.data.AccessToken;
  localStorage.setItem("token", newAccessToken);
  return newAccessToken;
};

let refreshIntervalId: NodeJS.Timeout | null = null;

export const scheduleTokenRefresh = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const expiresIn = decoded.exp * 1000 - Date.now();
    const refreshTime = expiresIn - 30_000;
    if (refreshIntervalId) clearTimeout(refreshIntervalId);
    refreshIntervalId = setTimeout(async () => {
      try {
        const newToken = await callRefreshToken();
        scheduleTokenRefresh(newToken);
        console.log("🔁 Token refreshed");
      } catch (err) {
        console.error("❌ Refresh failed:", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }, Math.max(refreshTime, 10_000));
  } catch (e) {
    console.error("Decode error:", e);
  }
};

export const clearTokenRefresh = () => {
  if (refreshIntervalId) clearTimeout(refreshIntervalId);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const newToken = await callRefreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
