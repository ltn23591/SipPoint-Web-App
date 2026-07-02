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
};
