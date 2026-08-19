# 📱 SipPoint - Customer Web App 

[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

Ứng dụng **Web App Đặt món & Chăm sóc Khách hàng** dành riêng cho khách hàng của chuỗi cà phê & trà sữa **SipPoint Coffee & Tea**. Đưa trải nghiệm đặt hàng, tích điểm và tương tác lên giao diện di động di động (Mobile-First) mượt mà và trực quan.

---

## 🌟 Tính năng Nổi bật

### 1. 📲 Mobile-First UX/UI & Đặt món Thông minh
- **Giao diện hiện đại**: Tối ưu hóa hoàn toàn cho màn hình di động, màu sắc hài hòa, animation mượt mà.
- **Thực đơn linh hoạt**: Tìm kiếm sản phẩm theo danh mục, chọn biến thể Size (M/L), chọn Toppings đi kèm và nhập ghi chú cá nhân hóa cho barista.
- **Giỏ hàng & Checkout mượt mà**: Quản lý giỏ hàng tức thì với state management tối ưu.

### 2. 💳 Thanh toán Đa dạng & VietQR Tự động
- **Thanh toán VietQR động**: Sinh mã QR chuẩn VietQR tự động có sẵn mã đơn hàng và số tiền.
- **Xác nhận thanh toán tự động**: Tích hợp cổng **SePay Webhook** ở Backend, tự động xác nhận đơn hàng `PAID` tức thì khi nhận tiền ngân hàng.
- **Thanh toán Tiền mặt**: Tùy chọn thanh toán tại quẹt thu ngân.

### 3. ⏱️ Theo dõi Đơn hàng Thời gian thực (Real-time Order Tracking)
- Tích hợp **Socket.io-client** kết nối trực tiếp với Server Backend.
- Theo dõi tiến trình pha chế qua các mốc trạng thái: `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`.

### 4. 🎁 CRM, Tích điểm & Gamification
- **Tích điểm SipPoints**: Tự động tích điểm sau mỗi đơn hàng hoàn tất dựa theo hạng hội viên.
- **Vòng quay May mắn (Lucky Wheel)**: Trò chơi quay thưởng nhận phần quà & voucher độc quyền.
- **Ví Voucher & Hạng thẻ**: Quản lý các mã giảm giá cá nhân và theo dõi tiến trình nâng hạng hội viên (Đồng, Bạc, Vàng, Kim Cương).

### 5. 🤖 Trợ lý AI Tư vấn Đồ uống (AI Drink Assistant)
- Tích hợp Chatbot AI thông minh (sử dụng **Google Gemini RAG**).
- Gợi ý món uống theo tâm trạng, sở thích, tư vấn khuyến mãi và giải đáp thắc mắc hệ thống.

---

## 🛠️ Công nghệ Sử dụng

- **Core Framework**: React 19, Vite 6 (JavaScript).
- **Styling**: TailwindCSS v4, Custom Vanilla CSS animations.
- **State Management & Data Fetching**:
  - **TanStack Query (React Query v5)**: Caching, auto-refetching API data.
  - **Zustand**: Quản lý global state giỏ hàng và thông tin người dùng.
- **Routing**: React Router v7 (Client-side routing).
- **Realtime**: Socket.io-client.
- **UI Components & Icons**: Lucide React, Radix UI, Sonner Toast notification.

---

## 📁 Cấu trúc Thư mục

```
SipPoint-Landing-Page/
├── public/           # Static assets, favicon, manifest
├── src/
│   ├── apis/         # Axios API service callers
│   ├── components/   # UI components dùng chung (Header, Navigation, Dialogs)
│   ├── constants/    # Enum, route paths, app constants
│   ├── contexts/     # React Context providers
│   ├── features/     # Feature-based modules (auth, cart, menu, orders, profile, rewards)
│   ├── helpers/      # Utilities & formatting functions
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Main view page components
│   ├── routes/       # React Router setup & Protected routes
│   ├── services/     # Socket.io connection service
│   ├── stores/       # Zustand state stores (cartStore, authStore)
│   ├── App.jsx       # Root App component
│   ├── index.css     # Global styles & Tailwind imports
│   └── main.jsx      # Entry point
├── .env              # Biến môi trường local/production
├── vercel.json       # Cấu hình rewrite SPA routing trên Vercel
├── vite.config.js    # Cấu hình Vite builder
└── package.json      # Project dependencies & scripts
```

---

## 💻 Hướng dẫn Cài đặt & Khởi chạy Local

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Biến môi trường (`.env`)
Tạo file `.env` ở thư mục gốc:

```env
# URL API Backend Server
VITE_APP_API_URL=http://localhost:5000/api/v1
```

### 3. Khởi chạy Môi trường Development
```bash
npm run dev
```
Trình duyệt sẽ tự động mở ứng dụng tại `http://localhost:5173`.

---

## 🚀 Triển khai Production (Vercel)

Dự án được cấu hình sẵn để triển khai mượt mà trên **Vercel**:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Cấu hình SPA Rewrite (`vercel.json`)**:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
  *(Cấu hình này khắc phục hoàn toàn lỗi `404: NOT_FOUND` khi reload/refresh trang trên Vercel).*
