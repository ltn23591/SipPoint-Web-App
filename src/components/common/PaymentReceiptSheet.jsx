import { useEffect, useState } from "react";
import { customerService } from "@/services/customerService";

export default function PaymentReceiptSheet({ open, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && orderId) {
      setIsLoading(true);
      customerService
        .getMyOrderById(orderId)
        .then((data) => setOrder(data))
        .catch((err) => console.error("Lỗi lấy chi tiết hóa đơn:", err))
        .finally(() => setIsLoading(false));
    } else {
      setOrder(null);
    }
  }, [open, orderId]);

  if (!open) return null;

  const isPaid = order?.isPaid || order?.status === "COMPLETED";
  const isTransfer = order?.paymentMethod === "TRANSFER";
  const qrUrl = order?.paymentQrUrl || (order ? `https://img.vietqr.io/image/VCB-1030501667-compact.png?amount=${order.total}&addInfo=${order.code}` : "");

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[80] transition-opacity duration-300 animate-fade-in"
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-[90] bg-white dark:bg-surface rounded-t-[28px] max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Handle bar */}
        <div className="w-full flex justify-center py-3">
          <div className="w-8 h-1.5 bg-zinc-200 dark:bg-outline-variant rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#855300] dark:text-primary-container text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              receipt_long
            </span>
            <div>
              <h3 className="font-bold text-[18px] text-zinc-900 dark:text-on-surface leading-tight">
                Hóa đơn thanh toán
              </h3>
              <p className="text-[12px] text-zinc-500 dark:text-on-surface-variant">
                Phiếu thanh toán & chi tiết hóa đơn tiền
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#855300] dark:border-primary-container" />
              <span className="text-xs mt-2">Đang tải hóa đơn...</span>
            </div>
          ) : !order ? (
            <div className="text-center py-10 text-zinc-500 text-sm">
              Không tìm thấy thông tin hóa đơn.
            </div>
          ) : (
            <>
              {/* Top Banner Status */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-surface-container border border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-zinc-400 uppercase">Mã đơn hàng</p>
                  <h4 className="font-bold text-[17px] text-[#855300] dark:text-primary mt-0.5">
                    #{order.code || order.orderNumber}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-on-surface-variant mt-0.5">
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}
                  >
                    {isPaid
                      ? "Đã thanh toán"
                      : order.status === "CANCELLED"
                      ? "Đã hủy"
                      : "Chờ thanh toán"}
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {order.tableId?.name ? `Bàn ${order.tableId.name}` : "Mang đi"}
                  </p>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-zinc-500 dark:text-on-surface-variant font-medium">
                  Hình thức thanh toán:
                </span>
                <span className="font-semibold text-zinc-800 dark:text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#855300]">
                    {isTransfer ? "qr_code" : "payments"}
                  </span>
                  {isTransfer ? "Chuyển khoản QR Ngân hàng" : "Tiền mặt"}
                </span>
              </div>

              {/* Items List */}
              <div className="border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-surface-container">
                <div className="px-4 py-2.5 bg-zinc-50 dark:bg-surface-container-high border-b border-zinc-100 dark:border-white/5 font-semibold text-xs text-zinc-600 dark:text-on-surface-variant flex justify-between">
                  <span>Món đặt ({order.items?.length || 0})</span>
                  <span>Thành tiền</span>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-white/5 px-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-zinc-800 dark:text-on-surface">
                          {item.name} <span className="text-zinc-400 font-normal">x{item.qty}</span>
                        </p>
                        {item.variants && item.variants.length > 0 && (
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {item.variants.map((v) => v.name).join(", ")}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 italic mt-0.5">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-800 dark:text-on-surface shrink-0">
                        {((item.subtotal || item.unitPrice * item.qty) ?? 0).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-surface-container border border-zinc-100 dark:border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Tạm tính tiền hàng:</span>
                  <span>{(order.subtotal || order.total).toLocaleString("vi-VN")}đ</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Giảm giá ưu đãi:</span>
                    <span>-{(order.discount).toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-200/60 dark:border-white/10 flex justify-between items-center text-sm">
                  <span className="font-bold text-zinc-900 dark:text-on-surface">
                    Tổng tiền thanh toán:
                  </span>
                  <span className="font-bold text-[18px] text-[#855300] dark:text-primary">
                    {(order.total ?? 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* VietQR section if unpaid transfer */}
              {isTransfer && !isPaid && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col items-center text-center gap-2">
                  <p className="font-bold text-xs text-amber-900 dark:text-amber-400">
                    Quét mã VietQR để thanh toán đơn hàng
                  </p>
                  <img
                    src={qrUrl}
                    alt="VietQR"
                    className="w-48 h-48 object-contain rounded-xl border bg-white p-2 shadow-sm"
                  />
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">
                    Nội dung chuyển khoản: <strong className="font-mono text-amber-900 dark:text-amber-200">{order.code}</strong>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
