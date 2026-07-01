export const MOCK_AUTH_DATA = {
  successResponse: {
    success: true,
    message: "Đăng nhập thành công!",
    data: {
      token: "sip-point-token-mock-2026",
      user: {
        fullname: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com", // Đã bổ sung email
        phone: "0901234567"
      }
    }
  },
  errorResponse: {
    success: false,
    message: "Email không tồn tại hoặc sai mật khẩu!", // Đã cập nhật lỗi
    data: null
  }
};