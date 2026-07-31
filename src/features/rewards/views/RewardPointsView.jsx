import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";
import { customerService } from "@/services/customerService";
import BottomNavBar from "@/components/layout/BottomNavBar";
import RedeemGiftsSheet from "@/components/common/RedeemGiftsSheet";

export default function RewardPoints() {
  const containerRef = useRef(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [pointHistories, setPointHistories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [tableName, setTableName] = useState(() => localStorage.getItem("tableName") || "");

  useEffect(() => {
    const handleUpdate = () => {
      setTableName(localStorage.getItem("tableName") || "");
    };
    window.addEventListener("tableNameUpdated", handleUpdate);
    return () => window.removeEventListener("tableNameUpdated", handleUpdate);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [profile, history, bannerList] = await Promise.all([
        authService.getMe(),
        customerService.getMyPointHistory(),
        customerService.getBanners(),
      ]);
      setCustomerProfile(profile);
      setPointHistories(history);
      setBanners(bannerList || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu điểm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-surface-dim flex justify-center selection:bg-[#f59e0b]/30 transition-colors duration-300">
      <div className="relative min-h-screen w-full max-w-md flex flex-col bg-[#f9f9f9] dark:bg-surface-dim shadow-xl dark:shadow-none overflow-x-hidden font-sans text-[#1a1c1c] dark:text-on-surface pb-[64px] transition-colors duration-300">
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
        <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] dark:text-primary-container text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              coffee
            </span>
            <span className="font-bold text-[18px] leading-none text-[#855300] dark:text-on-surface tracking-wide">
              SipPoint
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 dark:bg-secondary-container text-[#7a553c] dark:text-on-secondary-container rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span className="font-semibold text-[13px]">{tableName ? `Bàn ${tableName}` : "Mang đi"}</span>
          </div>

          <Link to={ROUTE_PATH.CART} className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[#534434] dark:text-on-surface">shopping_bag</span>
          </Link>
        </header>

        <main className="pt-4 px-[20px] flex flex-col gap-[24px]">
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
            <div
              onClick={() => setIsRedeemOpen(true)}
              className="bento-card bg-[#ffffff] dark:bg-surface-container-high rounded-xl p-4 flex flex-col justify-between h-32 border border-[#d8c3ad]/10 dark:border-outline-variant/10 cursor-pointer hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffddb8]/30 dark:bg-secondary-container/30 shrink-0">
                <span className="material-symbols-outlined text-[#855300] dark:text-primary-container">card_giftcard</span>
              </div>
              <p className="font-semibold text-[14px] leading-[20px] text-[#1a1c1c] dark:text-on-surface">Đổi quà</p>
            </div>
            <div className="grid grid-rows-2 gap-[16px]">
              <Link to={ROUTE_PATH.LUCKY_WHEEL} className="bento-card bg-[#ffffff] dark:bg-surface-container-high rounded-xl p-3 flex items-center gap-3 border border-[#d8c3ad]/10 dark:border-outline-variant/10 cursor-pointer hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest">
                <span className="material-symbols-outlined text-[#7c563d] dark:text-primary-container">toys</span>
                <p className="font-medium text-[12px] leading-[16px] text-[#1a1c1c] dark:text-on-surface">Vòng quay</p>
              </Link>
              <Link to={ROUTE_PATH.VOUCHERS} className="bento-card bg-[#ffffff] dark:bg-surface-container-high rounded-xl p-3 flex items-center gap-3 border border-[#d8c3ad]/10 dark:border-outline-variant/10 cursor-pointer hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest">
                <span className="material-symbols-outlined text-[#7c563d] dark:text-primary-container">confirmation_number</span>
                <p className="font-medium text-[12px] leading-[16px] text-[#1a1c1c] dark:text-on-surface">Voucher của tôi</p>
              </Link>
            </div>
          </section>

          {/* Dynamic Offer Banner */}
          <section className="space-y-3">
            {(banners.length > 0
              ? banners
              : [
                  {
                    _id: "default_b",
                    title: "Nhân đôi điểm thưởng tuần này!",
                    image:
                      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
                  },
                ]
            ).map((b) => (
              <div
                key={b._id}
                className="relative rounded-xl overflow-hidden h-28 flex items-center shadow-sm border border-zinc-100 dark:border-white/5 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => {
                  if (b.link) {
                    if (b.link.startsWith("http")) window.open(b.link, "_blank");
                    else window.location.href = b.link;
                  }
                }}
              >
                <img className="absolute inset-0 w-full h-full object-cover" alt={b.title} src={b.image} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>
                <div className="relative z-10 px-5 max-w-[80%] text-white">
                  <p className="font-bold text-[17px] leading-snug drop-shadow-md">{b.title}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Transaction List */}
          <section className="flex flex-col gap-[16px] mb-8">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-[20px] leading-[28px] text-[#1a1c1c] dark:text-on-surface">Lịch sử điểm</h2>
              <button className="text-[#855300] dark:text-primary-container font-semibold text-[14px] leading-[20px] hover:underline transition-all">Xem tất cả</button>
            </div>
            <div className="space-y-[8px]">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300] dark:border-primary-container" />
                </div>
              ) : pointHistories.length === 0 ? (
                <p className="text-center text-[#534434] dark:text-on-surface-variant text-sm py-4">Chưa có lịch sử điểm.</p>
              ) : (
                pointHistories.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-[#f3f3f4]/50 dark:bg-surface-container border border-[#d8c3ad]/10 dark:border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.pointsChange > 0 ? 'bg-[#f59e0b]/10 dark:bg-primary-container/20' : 'bg-[#ffdad6]/20 dark:bg-error-container/20'}`}>
                        <span className={`material-symbols-outlined text-sm ${tx.pointsChange > 0 ? 'text-[#855300] dark:text-primary-container' : 'text-[#ba1a1a] dark:text-error'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {tx.pointsChange > 0 ? 'add_circle' : 'remove_circle'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] leading-[20px] text-[#1a1c1c] dark:text-on-surface">{tx.title}</p>
                        <p className="font-medium text-[12px] leading-[16px] text-[#534434] dark:text-on-surface-variant">
                          {new Date(tx.createdAt).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold text-[20px] leading-[28px] ${tx.pointsChange > 0 ? 'text-[#855300] dark:text-primary-container' : 'text-[#ba1a1a] dark:text-error'}`}>
                      {tx.pointsChange > 0 ? '+' : ''}{tx.pointsChange}đ
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar activeTab="REWARDS" />

        {/* Redeem Gifts Bottom Sheet */}
        <RedeemGiftsSheet
          open={isRedeemOpen}
          onClose={() => setIsRedeemOpen(false)}
          currentPoints={customerProfile?.currentPoints || 0}
          onRedeemSuccess={fetchData}
        />
      </div>
    </div>
  );
}
