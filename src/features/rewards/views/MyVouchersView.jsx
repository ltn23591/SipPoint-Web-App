import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";
import { customerService } from "@/services/customerService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function MyVouchers() {
  const [profile, setProfile] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [prof, vouchs] = await Promise.all([
          authService.getMe(),
          customerService.getMyVouchers()
        ]);
        setProfile(prof);
        setVouchers(vouchs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredVouchers = () => {
    if (filter === "USED") {
      return vouchers.filter((v) => v.isUsed);
    }
    if (filter === "EXPIRING") {
      const now = new Date();
      const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      return vouchers.filter((v) => !v.isUsed && new Date(v.expiryDate) <= in3Days);
    }
    return vouchers;
  };

  const filteredVouchers = getFilteredVouchers();

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-background flex justify-center transition-colors duration-300">
      <div className="bg-[#f9f9f9] dark:bg-surface-dim text-[#1a1c1c] dark:text-on-surface relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans transition-colors duration-300">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

          .ticket-cutout {
              position: relative;
          }
          .ticket-cutout::before,
          .ticket-cutout::after {
              content: '';
              position: absolute;
              width: 20px;
              height: 20px;
              background-color: #f9f9f9;
              border-radius: 50%;
              left: 33.33%;
              transform: translateX(-50%);
              z-index: 10;
          }
          .ticket-cutout::before { top: -10px; }
          .ticket-cutout::after { bottom: -10px; }
          
          /* Cập nhật màu đục lỗ cho Dark Mode */
          .dark .ticket-cutout::before,
          .dark .ticket-cutout::after {
              background-color: #131313;
          }
        ` }} />

        <header className="w-full top-0 sticky bg-white dark:bg-surface/90 shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none z-40 transition-colors duration-300">
          <div className="flex items-center justify-between px-5 h-16 w-full mx-auto">
            <div className="w-10 flex items-center">
              <Link to={ROUTE_PATH.REWARDS} className="text-[#1a1c1c] dark:text-on-surface hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors rounded-full p-2 active:scale-95 duration-200">
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
            </div>
            <div className="flex-1 flex justify-center items-center gap-2">
              <div className="flex items-center h-8">
                <h1 className="font-bold text-[24px] text-[#855300] dark:text-on-surface tracking-tight">SipPoint</h1>
              </div>
            </div>
            <div className="flex items-center justify-end w-10">
              <button className="hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors rounded-full p-0.5 active:scale-95 duration-200">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-[#d8c3ad] dark:border-outline-variant"
                  src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpiNJlAtfv9FqYN6wPjpI7s6hWQ7ePZmmLyZvQsrJk5id0Q7FbYJH7LrLRQ3ShKVYVxBV8ccc1hs8mZecBeReOrFdVAYySDzygTRVhbmjEaTc3Yy-VImRPyNUXFrt79LyXzdEc7YRAJPg5ceBdTp-D0OK-ExoJQCPXDQZWW7EWHgqdl1mqyqHmd0P-yN8nUrf_s41iaujJsifAEq-SBRDhuusl_QmQCSDRuacx4D2Gsn9xjWA4OVdBL8ZXABC-T5JpkUv38vEUcZg"}
                />
              </button>
            </div>
          </div>
        </header>

        <main className="w-full mx-auto px-5 pt-6 pb-[100px] flex-1">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="font-semibold text-[22px] md:text-[24px] text-[#855300] dark:text-primary">Voucher của tôi</h2>
            <p className="text-[14px] text-[#534434] dark:text-on-surface-variant">Sử dụng mã ưu đãi để thưởng thức cà phê với giá tốt nhất.</p>
          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setFilter("ALL")} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-[14px] active:scale-95 transition-transform ${filter === "ALL" ? "bg-[#f59e0b] text-[#613b00] dark:bg-primary-container dark:text-on-primary-container shadow-sm" : "border border-[#d8c3ad] dark:border-outline-variant text-[#534434] dark:text-on-surface-variant hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors"}`}>Tất cả</button>
            <button onClick={() => setFilter("EXPIRING")} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-[14px] active:scale-95 transition-transform ${filter === "EXPIRING" ? "bg-[#f59e0b] text-[#613b00] dark:bg-primary-container dark:text-on-primary-container shadow-sm" : "border border-[#d8c3ad] dark:border-outline-variant text-[#534434] dark:text-on-surface-variant hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors"}`}>Sắp hết hạn</button>
            <button onClick={() => setFilter("USED")} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-[14px] active:scale-95 transition-transform ${filter === "USED" ? "bg-[#f59e0b] text-[#613b00] dark:bg-primary-container dark:text-on-primary-container shadow-sm" : "border border-[#d8c3ad] dark:border-outline-variant text-[#534434] dark:text-on-surface-variant hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors"}`}>Đã dùng</button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f59e0b] dark:border-primary-container" />
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="text-center text-[#534434] dark:text-on-surface-variant mt-10 text-[14px]">Chưa có voucher nào.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredVouchers.map((v) => {
                const isPaused = !v.isUsed && (!v.voucherId || v.voucherId.isActive !== "active");
                const isDisabled = v.isUsed || isPaused;
                return (
                <div key={v._id} className={`bg-white dark:bg-surface-container-high rounded-lg shadow-sm overflow-hidden flex flex-row h-36 border border-[#e2e2e2] dark:border-outline-variant/10 ticket-cutout ${isDisabled ? "opacity-60 grayscale" : ""}`}>
                  <div className={`w-1/3 h-full relative border-r border-dashed border-[#d8c3ad] dark:border-outline-variant/20 flex items-center justify-center ${isDisabled ? "bg-[#dadada] dark:bg-surface-container" : "bg-[#bab189]/30 dark:bg-primary-container/10"}`}>
                    <div className={`w-16 h-16 flex items-center justify-center ${isDisabled ? "opacity-50" : ""}`}>
                      <img
                        className="w-full h-full object-contain"
                        src={isDisabled ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2WjJ8_v__Pl0NiOVMDoG2vwbajYzpefrVhFB91tACiuVtULiYaOeeZ6swbMdOJN-Sbu4sa7-IX3Iyf432dTemQeocPglWIxslDNxKGM7rAcqLqwhRVzH7bZVzSknQSSiPGJsnhJ3DmV0fU_P5OsvqXE949r5qN4rKm7MgQ78Mmz11_gyC0FgsLxn9COaVlgcgeTTNzQYEZI_yIaxBLJMYi0g3WuY5SGEPKMjbAaWI0GhnJX530J1U2dgI1qEDq_d3hmKSsqAxuk" : "https://lh3.googleusercontent.com/aida-public/AB6AXuDuFWXXoAovkTRtrhNshRTacV_kDIYM0gEvT33N-LBu3WyeZgF6UjZ-Mh2NiWYKXEbrC7uHYj5CyamN0skTxL7EtatG2bcQTc0VyBaEd8MviCovfFyKoigp_l0z11Zia8JhZqvYiUZFiALrOTW5CzPuh7g6KnbgQ2ZUS3RqdBQEHR8RBsjDG8tuniRmPfItZdxv5KUBRqHTBWRbk4_XJKddsPZ8HjNEMWsnB-3l3jjgLMBHoBmDgmtDlV2kNT44j2oWKn20YDN4NMI"}
                        alt="Voucher"
                      />
                    </div>
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[14px] text-[#1a1c1c] dark:text-on-surface line-clamp-1">{v.title}</h3>
                      <p className="font-normal text-[13px] text-[#534434] dark:text-on-surface-variant line-clamp-2 mt-1">{v.voucherId?.description || "Áp dụng cho đơn từ 100.000đ. Không áp dụng cùng CTKM khác."}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`font-semibold text-[12px] ${isDisabled ? "text-[#867461] dark:text-on-surface-variant font-normal" : "text-[#ba1a1a] dark:text-error"}`}>
                        {v.isUsed ? "Đã sử dụng" : isPaused ? "Tạm ngưng" : `HSD: ${new Date(v.expiryDate).toLocaleDateString("vi-VN")}`}
                      </span>
                      <button
                        disabled={isDisabled}
                        onClick={() => {
                          if (v._id) {
                            localStorage.setItem("applied_customer_voucher_id", v._id);
                          }
                          const codeToUse = v.voucherId?.code || v.code;
                          if (codeToUse) {
                            localStorage.setItem("applied_voucher_code", codeToUse);
                          }
                          window.location.href = ROUTE_PATH.CART;
                        }}
                        className={`px-4 py-1.5 rounded-full font-semibold text-[12px] shadow-md active:scale-95 transition-transform ${isDisabled ? "bg-[#e2e2e2] dark:bg-surface-container text-[#534434] dark:text-on-surface-variant cursor-not-allowed shadow-none" : "bg-[#f59e0b] dark:bg-primary-container text-[#613b00] dark:text-on-primary-container"}`}
                      >
                        {v.isUsed ? "Đã dùng" : isPaused ? "Tạm ngưng" : "Dùng ngay"}
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </main>

        <BottomNavBar activeTab="REWARDS" />
      </div>
    </div>
  );
}