export const AUTH_TEXT = {
  APP_NAME: "SipPoint",
  SLOGAN: "TASTE THE MOMENT",
  TAB_LOGIN: "Đăng nhập",
  TAB_REGISTER: "Đăng ký",
  LABEL_PHONE: "Số điện thoại",
  LABEL_EMAIL: "Email", // Mới thêm
  LABEL_FULLNAME: "Họ và tên",
  LABEL_PASSWORD: "Mật khẩu",
  LABEL_GENDER: "Giới tính",
  PLACEHOLDER_PHONE: "090 123 4567",
  PLACEHOLDER_EMAIL: "example@gmail.com", // Mới thêm
  PLACEHOLDER_FULLNAME: "Nguyễn Văn A",
  PLACEHOLDER_PASSWORD: "••••••••",
  BTN_CONTINUE: "Tiếp tục",
  BTN_GOOGLE: " Google",
  DIVIDER_OR: "HOẶC ĐĂNG NHẬP BẰNG",
  GUEST_LOGIN: "Vào với tư cách Khách vãng lai",
  MOCK_SUCCESS: "Thao tác thành công!",
  MOCK_ERROR: "Email hoặc mật khẩu không hợp lệ." // Cập nhật lại thông báo lỗi
};

// Khớp enum GENDER ở backend (src/enums/index.js). Dùng cho form đăng ký / sửa hồ sơ.
export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export const GENDER_LABEL = {
  [GENDER.MALE]: "Nam",
  [GENDER.FEMALE]: "Nữ",
  [GENDER.OTHER]: "Khác",
};

export const GENDER_OPTIONS = Object.entries(GENDER_LABEL).map(([value, label]) => ({ value, label }));

// Mockdata giả lập
export const MOCK_USER = {
  phone: "0901234567",
  email: "nguyenvana@gmail.com", // Mới thêm email để test
};