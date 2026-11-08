import { useEffect, useState } from "react";
import { customerService } from "@/services/customerService";

export default function PointHistorySheet({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, EARN, SPEND
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchHistories = async (reset = false) => {
    try {
      setIsLoading(true);
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 15,
        ...(activeTab !== "ALL" ? { type: activeTab } : {}),
      };

      const res = await customerService.getMyPointHistory(params);
      let list = [];
      let totalPages = 1;

      if (Array.isArray(res)) {
        list = res;
      } else if (res && res.pointHistories) {
        list = res.pointHistories;
        totalPages = res.pagination?.totalPages || 1;
      }

      if (reset) {
        setHistories(list);
        setPage(1);
      } else {
        setHistories((prev) => (currentPage === 1 ? list : [...prev, ...list]));
      }

      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Lỗi lấy lịch sử điểm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchHistories(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab]);

  const handleLoadMore = () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      fetchHistories(false);
      return nextPage;
    });
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
            <span
              className="material-symbols-outlined text-[#855300] dark:text-primary-container text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              history
            </span>
            <div>
              <h3 className="font-bold text-[18px] text-zinc-900 dark:text-on-surface leading-tight">
                Lịch sử giao dịch điểm
              </h3>
              <p className="text-[12px] text-zinc-500 dark:text-on-surface-variant">
                Toàn bộ biến động điểm tích lũy & đổi quà
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-surface-container-low">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "EARN", label: "Tích điểm (+)" },
            { key: "SPEND", label: "Dùng điểm (-)" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-[#613f27] text-white shadow-sm"
                  : "bg-zinc-200/60 dark:bg-surface-container-high text-zinc-600 dark:text-on-surface-variant hover:bg-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {isLoading && histories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#855300] dark:border-primary-container" />
              <span className="text-xs mt-2">Đang tải lịch sử điểm...</span>
            </div>
          ) : histories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 dark:text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-zinc-300 dark:text-zinc-600 mb-2">
                receipt_long
              </span>
              <p className="text-sm font-medium">Chưa có giao dịch điểm nào</p>
              <p className="text-xs text-zinc-400 mt-1">Lịch sử tích điểm từ đơn hàng hoặc đổi quà sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <>
              {histories.map((tx) => {
                const isPositive = tx.pointsChange > 0;
                return (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-surface-container border border-zinc-100 dark:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          isPositive
                            ? "bg-[#f59e0b]/15 dark:bg-primary-container/20"
                            : "bg-red-500/10 dark:bg-error-container/20"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            isPositive
                              ? "text-[#855300] dark:text-primary-container"
                              : "text-red-600 dark:text-error"
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {isPositive ? "add_circle" : "remove_circle"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-zinc-900 dark:text-on-surface leading-tight">
                          {tx.title}
                        </p>
                        {tx.description && (
                          <p className="text-[11px] text-zinc-500 dark:text-on-surface-variant mt-0.5">
                            {tx.description}
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {new Date(tx.createdAt).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold text-[18px] shrink-0 ${
                        isPositive
                          ? "text-[#855300] dark:text-primary-container"
                          : "text-red-600 dark:text-error"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {tx.pointsChange}đ
                    </span>
                  </div>
                );
              })}

              {hasMore && (
                <div className="pt-2 pb-1 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-surface-container-high text-xs font-semibold text-zinc-700 dark:text-on-surface hover:bg-zinc-200 transition-colors"
                  >
                    {isLoading ? "Đang tải thêm..." : "Tải thêm lịch sử"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
