import { useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";

// Popup nhắc đăng nhập khi khách vãng lai bấm vào tính năng cần tài khoản (điểm
// thưởng, đổi quà, trò chơi may mắn, ví voucher...). Dùng chung cho mọi nơi thay vì
// để trang tải xong rồi mới hiện dữ liệu rỗng/hỏng không rõ lý do.
export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-surface-container-high rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border border-zinc-100 dark:border-white/5">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f59e0b]/15 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#855300] dark:text-primary-container text-[32px]">
            lock
          </span>
        </div>
        <h3 className="font-bold text-[18px] text-zinc-900 dark:text-on-surface mb-2">
          Cần đăng nhập
        </h3>
        <p className="text-[14px] text-zinc-500 dark:text-on-surface-variant mb-6">
          Vui lòng đăng nhập để sử dụng tính năng này.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-outline-variant text-zinc-600 dark:text-on-surface-variant font-semibold text-[14px] active:scale-95 transition-transform"
          >
            Để sau
          </button>
          <button
            onClick={() => navigate(ROUTE_PATH.LOGIN)}
            className="flex-1 py-2.5 rounded-xl bg-[#f59e0b] text-[#613b00] font-bold text-[14px] shadow-md active:scale-95 transition-transform"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
