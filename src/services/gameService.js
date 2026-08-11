import apiCall from "@/apis/config";
import { API_METHOD } from "@/constants/application";

// Trò chơi may mắn (Lucky Game) - endpoints khách hàng.
export const gameService = {
  // Danh sách trò chơi đang mở & áp dụng cho khách hiện tại (BE tự lọc theo
  // status=PUBLISHED, còn hạn, và khách có thuộc nhóm áp dụng hay không).
  getAvailableGames: async (params = {}) => {
    try {
      const response = await apiCall(API_METHOD.GET, "/games/available", null, {}, null, { params });
      if (response && response.data?.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.warn("Lỗi lấy danh sách trò chơi:", error);
      return [];
    }
  },

  // Chi tiết 1 trò chơi (kèm số lượt còn lại của khách, tự seed lần đầu xem).
  getGameDetail: async (gameId) => {
    try {
      const response = await apiCall(API_METHOD.GET, `/games/${gameId}/detail`);
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Lấy chi tiết trò chơi thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy chi tiết trò chơi");
    }
  },

  // Số lượt chơi hiện có của khách cho 1 trò chơi.
  getMyTurns: async (gameId) => {
    try {
      const response = await apiCall(API_METHOD.GET, `/games/${gameId}/turns`);
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Lấy số lượt chơi thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi lấy số lượt chơi");
    }
  },

  // Quay 1 lượt. Trả về { prize, remainingTurns }.
  drawGame: async (gameId) => {
    try {
      const response = await apiCall(API_METHOD.POST, `/games/${gameId}/draw`, {});
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Quay thưởng thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi quay thưởng");
    }
  },

  // Dùng điểm đổi thêm 1 lượt chơi (nếu game bật tính năng này).
  exchangeTurn: async (gameId) => {
    try {
      const response = await apiCall(API_METHOD.POST, `/games/${gameId}/exchange-turn`, {});
      if (response && response.data?.success) {
        return response.data.data;
      }
      throw new Error(response?.data?.message || "Đổi lượt chơi thất bại");
    } catch (error) {
      const apiErrorData = error?.response?.data || error;
      throw new Error(apiErrorData?.message || "Lỗi đổi lượt chơi");
    }
  },
};
