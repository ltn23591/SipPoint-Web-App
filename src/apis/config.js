import axios from "axios";
import { CODE_KEY } from "@/constants/application";

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL || "https://sippoint-be.onrender.com/api/v1";
const REQUEST_TIMEOUT = 15000;

// Create unified axios instance
const apiInstance = axios.create({
  baseURL: VITE_APP_API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach authorization token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally (e.g. 401 Unauthorized)
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local credentials on token expiration
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      
      // Redirect to login page
      window.location.href = "/login";
    }
    
    if (error.code === CODE_KEY.CANCEL) {
      console.warn("--------CANCEL--------", error);
      return Promise.resolve({
        data: {
          isSuccess: false,
          isCancel: true,
        },
      });
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const apiCall = async (
  method,
  endpoint,
  data = null,
  customHeaders = {},
  baseUrl = null,
  options = {}
) => {
  return apiInstance({
    method,
    url: endpoint,
    data,
    headers: customHeaders,
    ...(baseUrl ? { baseURL: baseUrl } : {}),
    ...options,
  });
};

export default apiCall;
