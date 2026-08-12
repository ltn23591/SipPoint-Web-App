import { useEffect, useState } from "react";
import { customerService } from "@/services/customerService";

const isVoucherPaused = (v) => !v.isUsed && (!v.voucherId || v.voucherId.isActive !== "active");
const isVoucherExpired = (v) => new Date(v.expiryDate) < new Date();

const discountText = (voucher) => {
  if (!voucher) return "";
  if (voucher.discountType === "PERCENT") {
    const max = voucher.maxDiscountLimit ? ` (tối đa ${voucher.maxDiscountLimit.toLocaleString("vi-VN")}đ)` : "";
    return `Giảm ${voucher.discountValue}%${max}`;
  }
  return `Giảm ${(voucher.discountValue || 0).toLocaleString("vi-VN")}đ`;
};

// Sheet chọn voucher từ ví để áp vào đơn hàng đang đặt. Chỉ liệt kê voucher CHƯA dùng,
// CHƯA hết hạn và chương trình gốc còn hoạt động; voucher chưa đủ điều kiện (đơn tối
// thiểu) vẫn hiển thị nhưng bị khoá kèm lý do, để khách biết cần mua thêm bao nhiêu.
export default function SelectVoucherSheet({ open, onClose, subtotal = 0, onSelect }) {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    customerService
      .getMyVouchers()
      .then((data) => setVouchers(data || []))
      .catch(() => setVouchers([]))
      .finally(() => setIsLoading(false));
  }, [open]);

  if (!open) return null;

  const usableVouchers = vouchers.filter((v) => !v.isUsed && !isVoucherExpired(v) && !isVoucherPaused(v));

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[80] transition-opacity duration-300 animate-fade-in"
      />

      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-[90] bg-white dark:bg-surface rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
        <div className="w-full flex justify-center py-3">
          <div className="w-8 h-1.5 bg-zinc-200 dark:bg-outline-variant rounded-full" />
        </div>

        <div className="px-5 pb-3 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f59e0b] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              confirmation_number
            </span>
            <h3 className="font-bold text-[18px] text-zinc-900 dark:text-on-surface leading-tight">Chọn voucher trong ví</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#855300] dark:border-primary-container" />
              <span className="text-xs mt-2">Đang tải ví voucher...</span>
            </div>
          ) : usableVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 dark:text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-zinc-300 dark:text-zinc-600 mb-2">
                confirmation_number
              </span>
              <p className="text-sm font-medium">Chưa có voucher nào dùng được</p>
              <p className="text-xs text-zinc-400 mt-1">Voucher trong ví (chưa dùng, chưa hết hạn) sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            usableVouchers.map((v) => {
              const minOrderValue = v.voucherId?.minOrderValue || 0;
              const isEligible = subtotal >= minOrderValue;
              const missing = Math.max(0, minOrderValue - subtotal);

              return (
                <div
                  key={v._id}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-surface-container border border-zinc-100 dark:border-white/5 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center text-[#855300] dark:text-primary-container shrink-0">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        confirmation_number
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[15px] text-zinc-900 dark:text-on-surface leading-tight">{v.title}</h4>
                      <p className="text-[12px] text-zinc-500 dark:text-on-surface-variant mt-0.5">
                        {discountText(v.voucherId)}
                        {minOrderValue > 0 ? ` · Đơn tối thiểu ${minOrderValue.toLocaleString("vi-VN")}đ` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 dark:border-white/5">
                    <span className="text-[11px] text-zinc-400">
                      HSD: {new Date(v.expiryDate).toLocaleDateString("vi-VN")}
                    </span>
                    <button
                      onClick={() => {
                        if (!isEligible) return;
                        onSelect(v);
                        onClose();
                      }}
                      disabled={!isEligible}
                      className={`px-4 py-1.5 rounded-full font-bold text-[12px] shadow-sm active:scale-95 transition-all ${
                        isEligible
                          ? "bg-[#f59e0b] text-[#613b00] hover:bg-[#d98206]"
                          : "bg-zinc-200 dark:bg-surface-container-high text-zinc-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {isEligible ? "Áp dụng" : `Thiếu ${missing.toLocaleString("vi-VN")}đ`}
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
