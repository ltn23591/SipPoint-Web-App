import { MOCK_AUTH_DATA } from "@/data/mockAuth";
import { MOCK_USER } from "@/constants/auth"; // Lấy thông tin email từ constants

export const authService = {
  // Thay đổi tham số phone thành email
  login: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Chuyển tất cả về chữ thường để so sánh cho chính xác
        if (email.toLowerCase() === MOCK_USER.email.toLowerCase()) {
          const mockUser = { 
            fullname: "Nguyễn Văn A", 
            email: MOCK_USER.email 
          };
          
          // Giả lập lưu phiên đăng nhập
          localStorage.setItem("user", JSON.stringify(mockUser));
          localStorage.setItem("token", MOCK_AUTH_DATA.successResponse.data.token);
          
          resolve(MOCK_AUTH_DATA.successResponse);
        } else {
          reject(MOCK_AUTH_DATA.errorResponse);
        }
      }, 1000);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Giả lập lưu phiên đăng nhập sau khi tạo tài khoản
        localStorage.setItem("user", JSON.stringify(userData));
        
        resolve({
          success: true,
          message: "Tạo tài khoản thành công!",
          data: MOCK_AUTH_DATA.successResponse.data
        });
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
};