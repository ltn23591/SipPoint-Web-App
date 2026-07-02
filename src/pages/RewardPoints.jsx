import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";
import { customerService } from "@/services/customerService";

export default function RewardPoints() {
  const containerRef = useRef(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [pointHistories, setPointHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profile, history] = await Promise.all([
          authService.getMe(),
          customerService.getMyPointHistory()
        ]);
        setCustomerProfile(profile);
        setPointHistories(history);
      } catch (error) {
        console.error("Lỗi tải dữ liệu điểm:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Sparkle animation effect for the wallet section
    const container = containerRef.current;
    if (container) {
      const sparks = [];
      for (let i = 0; i < 5; i++) {
        const spark = document.createElement("div");
        spark.className = "absolute bg-[#f59e0b] rounded-full opacity-30 pointer-events-none";
        const size = Math.random() * 10 + 5;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(spark);
        
        const animation = spark.animate([
          { transform: 'translateY(0) scale(1)', opacity: 0.3 },
          { transform: `translateY(-${Math.random() * 50 + 20}px) scale(0)`, opacity: 0 }
        ], {
          duration: Math.random() * 2000 + 1000,
          iterations: Infinity,
          easing: 'ease-out'
        });
        
        sparks.push({ element: spark, animation });
      }

      return () => {
        sparks.forEach(({ element, animation }) => {
          animation.cancel();
          if (container.contains(element)) {
            container.removeChild(element);
          }
        });
      };
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex justify-center selection:bg-[#f59e0b]/30">
      <div className="relative min-h-screen w-full max-w-md flex flex-col bg-[#f9f9f9] shadow-xl overflow-x-hidden font-sans text-[#1a1c1c] pb-[64px]">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
          }
          .bento-card {
            box-shadow: 0px 4px 12px rgba(59, 31, 10, 0.06);
            transition: all 0.3s ease;
          }
          .bento-card:active {
            transform: scale(0.98);
          }
        `}} />

        {/* Top App Bar */}
        <header className="fixed max-w-md mx-auto top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-[16px] h-16 bg-[#f9f9f9]/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#855300]" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
            <h1 className="font-bold text-[22px] leading-[28px] text-[#855300]">SipPoint</h1>
          </div>
          <button className="active:scale-95 transition-all duration-200 p-2 rounded-full hover:bg-[#f3f3f4]">
            <span className="material-symbols-outlined text-[#534434]">shopping_bag</span>
          </button>
        </header>

        <main className="pt-20 px-[20px] flex flex-col gap-[24px]">
          {/* Hero Section: Wallet Balance */}
          <section ref={containerRef} className="relative overflow-hidden rounded-xl bg-[#613f27] p-6 text-white shadow-[0px_8px_24px_rgba(59,31,10,0.1)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#855300] opacity-20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-[14px] leading-[20px] opacity-80">Tổng số điểm</p>
                <span className="bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-full font-medium text-[12px] leading-[16px] flex items-center gap-1">
                  {customerProfile?.tierId?.name || "Thành viên"} ⭐
                </span>
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="font-bold text-[32px] leading-[40px] tracking-[-0.02em]">
                  {(customerProfile?.currentPoints || 0).toLocaleString("vi-VN")}
                </span>
                <span className="material-symbols-outlined text-[#f59e0b] pb-1" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-[12px] leading-[16px] text-[#f3f3f4]">Tiếp tục tích điểm để thăng hạng!</p>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#f59e0b] h-full w-[100%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions: Asymmetric Bento Grid */}
          <section className="grid grid-cols-2 gap-[16px]">
            <div className="bento-card bg-[#ffffff] rounded-xl p-4 flex flex-col justify-between h-32 border border-[#d8c3ad]/10">
              <span className="material-symbols-outlined text-[#855300] bg-[#ffddb8]/30 w-10 h-10 flex items-center justify-center rounded-lg">card_giftcard</span>
              <p className="font-semibold text-[14px] leading-[20px] text-[#1a1c1c]">Đổi quà</p>
            </div>
            <div className="grid grid-rows-2 gap-[16px]">
              <div className="bento-card bg-[#ffffff] rounded-xl p-3 flex items-center gap-3 border border-[#d8c3ad]/10">
                <span className="material-symbols-outlined text-[#7c563d]">toys</span>
                <p className="font-medium text-[12px] leading-[16px] text-[#1a1c1c]">Vòng quay</p>
              </div>
              <Link to={ROUTE_PATH.VOUCHERS} className="bento-card bg-[#ffffff] rounded-xl p-3 flex items-center gap-3 border border-[#d8c3ad]/10 cursor-pointer hover:bg-[#f3f3f4]">
                <span className="material-symbols-outlined text-[#7c563d]">confirmation_number</span>
                <p className="font-medium text-[12px] leading-[16px] text-[#1a1c1c]">Voucher của tôi</p>
              </Link>
            </div>
          </section>

          {/* Dynamic Offer Banner */}
          <section className="relative rounded-xl overflow-hidden h-28 flex items-center">
            <img className="absolute inset-0 w-full h-full object-cover" alt="Banner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAImyKbnfWPMenv7rz05P77FNtDyCFootwyRPMCIm4pAZx_9ud_-d_WCtJlG9au6jc4lvifVd9llc_oPNXXs4jgYCfiusK95P1ESKWOFVlawqNniEcrNS2fhQu7t4IlAW35b66RqKM33enJuZt1YmZHsccZtUd0nFZnkmYgFw_02V2YjwXXjLCzNfrTjZn-KVB8JBcPhG_tYa-20E6aSAbJUDXh4sZtAU-uTsakDY_5Dwn8Fv8QRNasN0qGvQ8X5D9wuDZe3NkZ" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffcdae]/90 via-[#ffcdae]/40 to-transparent"></div>
            <div className="relative z-10 px-6 max-w-[60%]">
              <p className="font-semibold text-[20px] leading-[28px] text-[#7a553c] leading-tight">Nhân đôi điểm thưởng tuần này!</p>
            </div>
          </section>

          {/* Transaction List */}
          <section className="flex flex-col gap-[16px] mb-8">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-[20px] leading-[28px] text-[#1a1c1c]">Lịch sử điểm</h2>
              <button className="text-[#855300] font-semibold text-[14px] leading-[20px] hover:underline transition-all">Xem tất cả</button>
            </div>
            <div className="space-y-[8px]">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300]" />
                </div>
              ) : pointHistories.length === 0 ? (
                <p className="text-center text-[#534434] text-sm py-4">Chưa có lịch sử điểm.</p>
              ) : (
                pointHistories.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-[#f3f3f4]/50 border border-[#d8c3ad]/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.pointsChange > 0 ? 'bg-[#f59e0b]/10' : 'bg-[#ffdad6]/20'}`}>
                        <span className={`material-symbols-outlined text-sm ${tx.pointsChange > 0 ? 'text-[#855300]' : 'text-[#ba1a1a]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {tx.pointsChange > 0 ? 'add_circle' : 'remove_circle'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] leading-[20px] text-[#1a1c1c]">{tx.title}</p>
                        <p className="font-medium text-[12px] leading-[16px] text-[#534434]">
                          {new Date(tx.createdAt).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold text-[20px] leading-[28px] ${tx.pointsChange > 0 ? 'text-[#855300]' : 'text-[#ba1a1a]'}`}>
                      {tx.pointsChange > 0 ? '+' : ''}{tx.pointsChange}đ
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 max-w-md mx-auto left-0 right-0 w-full z-10 flex justify-around items-center px-2 py-2 h-16 bg-white border-t border-zinc-100 shadow-[0px_-4px_12px_rgba(59,31,10,0.04)]">
          <Link to={ROUTE_PATH.MENU} className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150">
            <span className="material-symbols-outlined">local_cafe</span>
            <span className="text-[11px] font-semibold mt-0.5">Thực đơn</span>
          </Link>
          <a className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150" href="#">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[11px] font-semibold mt-0.5">Đơn hàng</span>
          </a>
          <Link to={ROUTE_PATH.REWARDS} className="flex flex-col items-center justify-center bg-[#ffcdae]/50 text-[#7a553c] rounded-xl px-4 py-1.5 active:scale-90 transition-transform duration-150">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
            <span className="text-[11px] font-semibold mt-0.5">Điểm thưởng</span>
          </Link>
          <a className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150" href="#">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[11px] font-semibold mt-0.5">Tài khoản</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
