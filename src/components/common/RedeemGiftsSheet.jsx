import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { customerService } from "@/services/customerService";

export default function RedeemGiftsSheet({ open, onClose, currentPoints = 0, onRedeemSuccess }) {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const fetchRedeemable = () => {
    setIsLoading(true);
    customerService
      .getRedeemableVouchers()
      .then((data) => setVouchers(data || []))
      .catch(() => setVouchers([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (open) {
      setMessage(null);
      fetchRedeemable();
    }
  }, [open]);

  const handleRedeem = async (v) => {
    if (currentPoints < (v.pointsCost || 0)) return;

    setRedeemingId(v._id);
    setMessage(null);
    try {
      const res = await customerService.redeemVoucher(v._id);
      setMessage({
        type: "success",
        text: `Đổi thành công "${v.title}"! Voucher đã được thêm vào ví của bạn.`,
      });
      fetchRedeemable();
      if (onRedeemSuccess) onRedeemSuccess();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Đổi quà thất bại. Vui lòng thử lại.",
      });
    } finally {
      setRedeemingId(null);
    }
  };

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
            <span className="material-symbols-outlined text-[#f59e0b] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              card_giftcard
            </span>
            <div>
              <h3 className="font-bold text-[18px] text-zinc-900 dark:text-on-surface leading-tight">Đổi điểm lấy quà</h3>
              <p className="text-[12px] text-zinc-500 dark:text-on-surface-variant">Điểm hiện có: <strong className="text-[#855300] dark:text-primary-container font-bold">{currentPoints.toLocaleString("vi-VN")} điểm</strong> ⭐</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className={`mx-4 mt-3 p-3 rounded-xl text-xs font-medium flex items-center justify-between ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            <span>{message.text}</span>
            {message.type === "success" && (
              <Link
                to={ROUTE_PATH.VOUCHERS}
                onClick={onClose}
                className="ml-2 underline font-bold text-emerald-900 shrink-0"
              >
                Xem ví ngay
              </Link>
            )}
          </div>
        )}

        {/* List Content */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#855300] dark:border-primary-container" />
              <span className="text-xs mt-2">Đang tải danh sách quà đổi...</span>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 dark:text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-zinc-300 dark:text-zinc-600 mb-2">
                card_giftcard
              </span>
              <p className="text-sm font-medium">Chưa có quà đổi bằng điểm</p>
              <p className="text-xs text-zinc-400 mt-1">Các voucher ưu đãi bằng điểm sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            vouchers.map((item) => {
              const pointsNeeded = item.pointsCost || 0;
              const isEnoughPoints = currentPoints >= pointsNeeded;
              const isProcessing = redeemingId === item._id;

              return (
                <div
                  key={item._id}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-surface-container border border-zinc-100 dark:border-white/5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center text-[#855300] dark:text-primary-container shrink-0">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          confirmation_number
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[15px] text-zinc-900 dark:text-on-surface leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-zinc-500 dark:text-on-surface-variant mt-0.5">
                          {item.description || (item.minOrderValue ? `Đơn tối thiểu ${item.minOrderValue.toLocaleString("vi-VN")}đ` : "Áp dụng cho mọi đơn hàng")}
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#f59e0b]/20 text-[#855300] dark:text-primary-container px-2.5 py-1 rounded-full font-bold text-[12px] shrink-0">
                      {pointsNeeded} ⭐
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 dark:border-white/5">
                    <span className="text-[11px] text-zinc-400">
                      {item.endDate ? `HSD: ${new Date(item.endDate).toLocaleDateString("vi-VN")}` : "Hạn dùng theo quy định"}
                    </span>
                    <button
                      onClick={() => handleRedeem(item)}
                      disabled={!isEnoughPoints || isProcessing}
                      className={`px-4 py-1.5 rounded-full font-bold text-[12px] shadow-sm active:scale-95 transition-all ${
                        isEnoughPoints
                          ? "bg-[#f59e0b] text-[#613b00] hover:bg-[#d98206]"
                          : "bg-zinc-200 dark:bg-surface-container-high text-zinc-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {isProcessing ? "Đang đổi..." : isEnoughPoints ? `Đổi ngay (${pointsNeeded}đ)` : `Thiếu ${pointsNeeded - currentPoints}đ`}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
