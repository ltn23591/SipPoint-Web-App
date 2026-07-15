import apiCall from "@/apis/config";
import { API_METHOD } from "@/constants/application";

export const customerService = {
  getMyPointHistory: async () => {
    try {
      const response = await apiCall(API_METHOD.GET, "/customers/me/point-history");
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Lấy lịch sử điểm thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy lịch sử điểm");
    }
  },

  updateMyProfile: async (data) => {
    try {
      const response = await apiCall(API_METHOD.PUT, "/customers/me", data);
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Cập nhật thông tin thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi cập nhật thông tin");
    }
  },

  getMyVouchers: async () => {
    try {
      const response = await apiCall(API_METHOD.GET, "/customers/me/vouchers");
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Lấy danh sách voucher thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy danh sách voucher");
    }
  },

  getMyOrders: async () => {
    try {
      const response = await apiCall(API_METHOD.GET, "/customers/me/orders");
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Lấy danh sách đơn hàng thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy danh sách đơn hàng");
    }
  },

  getMyOrderById: async (orderId) => {
    try {
      const response = await apiCall(API_METHOD.GET, `/customers/me/orders/${orderId}`);
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Lấy chi tiết đơn hàng thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy chi tiết đơn hàng");
    }
  },

  createMyOrder: async (data) => {
    try {
      const response = await apiCall(API_METHOD.POST, "/customers/me/orders", data);
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Đặt đơn hàng thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi đặt đơn hàng");
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiCall(
        API_METHOD.POST,
        "/upload/cloudinary/file",
        formData,
        { "Content-Type": "multipart/form-data" }
      );
      if (response && response.data?.success) {
        return response.data.data; // Cloudinary result
      }
      throw new Error(response?.data?.message || "Upload Cloudinary thất bại");
    } catch (error) {
      console.warn("Cloudinary upload failed, attempting local upload...", error);
      // Fallback to local
      const formData = new FormData();
      formData.append("image", file);
      const response = await apiCall(
        API_METHOD.POST,
        "/upload/local",
        formData,
        { "Content-Type": "multipart/form-data" }
      );
      if (response && response.data?.success) {
        const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL || "https://sippoint-be.onrender.com/api/v1";
        const host = VITE_APP_API_URL.replace("/api/v1", "");
        return { secure_url: host + response.data.data.url };
      }
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi tải ảnh đại diện");
    }
  },

  createSepayPayment: async (data) => {
    try {
      // Gọi API /payment/sepay/create 
      const response = await apiCall(API_METHOD.POST, "/payment/sepay/create", data);
      if (response && response.data?.status === 'success') {
        return response.data.data; // trả về { checkoutURL, checkoutFormfields }
      }
      throw new Error(response?.data?.message || "Tạo giao dịch SePay thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi tạo giao dịch SePay");
    }
  }
};

