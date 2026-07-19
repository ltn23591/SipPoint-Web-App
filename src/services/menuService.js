import apiCall from "@/apis/config";
import { API_METHOD } from "@/constants/application";

export const menuService = {
  getCategories: async () => {
    try {
      const response = await apiCall(API_METHOD.GET, "/categories");
      if (response && response.data?.success) {
        return response.data;
      }
      throw new Error(response?.data?.message || "Lấy danh mục thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy danh mục");
    }
  },

  getProducts: async () => {
    try {
      const response = await apiCall(API_METHOD.GET, "/products");
      if (response && response.data?.success) {
        return response.data;
      }
      throw new Error(response?.data?.message || "Lấy món ăn thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy danh sách món ăn");
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiCall(API_METHOD.GET, `/products/${id}`);
      if (response && response.data?.success) {
        return response.data;
      }
      throw new Error(response?.data?.message || "Lấy chi tiết món ăn thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy chi tiết món ăn");
    }
  }
};
