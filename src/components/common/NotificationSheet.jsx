import { useEffect, useState } from "react";
import { customerService } from "@/services/customerService";

export default function NotificationSheet({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      customerService
        .getNotifications()
        .then((data) => setNotifications(data || []))
        .catch(() => setNotifications([]))
        .finally(() => setIsLoading(false));
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[80] transition-opacity duration-300 animate-fade-in"
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-[90] bg-white dark:bg-surface rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Handle bar */}
        <div className="w-full flex justify-center py-3">
          <div className="w-8 h-1.5 bg-zinc-200 dark:bg-outline-variant rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] dark:text-primary-container text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              notifications
            </span>
            <h3 className="font-bold text-[18px] text-zinc-900 dark:text-on-surface">Thông báo</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#855300] dark:border-primary-container" />
              <span className="text-xs mt-2">Đang tải thông báo...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 dark:text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-zinc-300 dark:text-zinc-600 mb-2">
                notifications_off
              </span>
              <p className="text-sm font-medium">Chưa có thông báo nào</p>
              <p className="text-xs text-zinc-400 mt-1">Các chương trình ưu đãi và thông tin đơn hàng sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-surface-container border border-zinc-100 dark:border-white/5 flex items-start gap-3 hover:bg-zinc-100/80 dark:hover:bg-surface-container-high transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#ffcdae]/50 dark:bg-primary-container/20 flex items-center justify-center text-[#7a553c] dark:text-primary-container shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">
                    {item.type === "promotion" ? "campaign" : item.type === "order" ? "receipt_long" : "notifications"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-[14px] text-zinc-900 dark:text-on-surface truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 dark:text-on-surface-variant shrink-0">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-[13px] text-zinc-600 dark:text-on-surface-variant mt-1 leading-snug">
                    {item.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
