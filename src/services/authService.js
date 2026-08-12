import apiCall from "@/apis/config";
import { API_METHOD } from "@/constants/application";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiCall(API_METHOD.POST, "/auth/customer/login", {
        loginIdentifier: email,
        password,
      });

      if (response && response.status === 200 && response.data?.success) {
        const userData = response.data.data; 
        const token = response.data.token;
        localStorage.setItem("user", JSON.stringify(userData || { email }));
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("authChange"));
        return {
          success: true,
          message: response.data.message || "Đăng nhập thành công!",
          data: response.data
        };
      } else {
        const err = new Error(response?.data?.message || "Đăng nhập thất bại!");
        err.cause = response?.data;
        throw err;
      }
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      const err = new Error(apiErrorData?.message || error.message || "Đăng nhập thất bại!");
      err.cause = apiErrorData;
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const payload = {
        fullName: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        gender: userData.gender || undefined,
      };

      const response = await apiCall(API_METHOD.POST, "/auth/customer/register", payload);

      if (response && (response.status === 200 || response.status === 210 || response.status === 201) && response.data?.success) {
        return {
          success: true,
          message: response.data.message || "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
          data: response.data
        };
      } else {
        const err = new Error(response?.data?.message || "Đăng ký thất bại!");
        err.cause = response?.data;
        throw err;
      }
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      const err = new Error(apiErrorData?.message || error.message || "Đăng ký thất bại!");
      err.cause = apiErrorData;
      throw err;
    }
  },

  verifyOtp: async ({ email, otp }) => {
    try {
      const response = await apiCall(API_METHOD.POST, "/auth/customer/verify-email", {
        email,
        otp,
      });

      if (response && response.status === 200 && response.data?.success) {
        const userData = response.data.data;
        const token = response.data.token;
        localStorage.setItem("user", JSON.stringify(userData || { email }));
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("authChange"));
        return {
          success: true,
          message: response.data.message || "Xác thực tài khoản thành công!",
          data: response.data
        };
      } else {
        const err = new Error(response?.data?.message || "Xác thực OTP thất bại!");
        err.cause = response?.data;
        throw err;
      }
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      const err = new Error(apiErrorData?.message || error.message || "Xác thực OTP thất bại!");
      err.cause = apiErrorData;
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
  },

  isLoggedIn: () => !!(localStorage.getItem("token") || localStorage.getItem("accessToken")),

  getMe: async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) return null;

      const response = await apiCall(API_METHOD.GET, "/auth/me");
      if (response && response.status === 200 && response.data?.success) {
        return response.data.user || response.data.data || response.data;
      }
      throw new Error(response?.data?.message || "Lấy thông tin người dùng thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy thông tin");
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiCall(API_METHOD.POST, "/auth/forgot-password", { email });
      if (response && response.status === 200 && response.data?.success) {
        return response.data; // Includes activationToken
      }
      throw new Error(response?.data?.message || "Yêu cầu khôi phục mật khẩu thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      throw new Error(apiErrorData?.message || "Yêu cầu thất bại");
    }
  },

  verifyOtpForReset: async (activationToken, otp) => {
    try {
      const response = await apiCall(API_METHOD.POST, "/auth/verify-otp", {
        activation_token: activationToken,
        activation_code: otp,
      });
      if (response && response.status === 200 && response.data?.success) {
        return response.data; // Includes resetToken
      }
      throw new Error(response?.data?.message || "Xác thực OTP thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      throw new Error(apiErrorData?.message || "Xác thực OTP thất bại");
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await apiCall(API_METHOD.POST, "/auth/reset-password", {
        resetToken,
        newPassword,
      });
      if (response && response.status === 200 && response.data?.success) {
        return response.data;
      }
      throw new Error(response?.data?.message || "Đặt lại mật khẩu thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error?.cause || error;
      throw new Error(apiErrorData?.message || "Đặt lại mật khẩu thất bại");
    }
  }
};