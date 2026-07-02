import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";
import { customerService } from "@/services/customerService";

export default function MyVouchers() {
  const [profile, setProfile] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, EXPIRING, USED

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
      return vouchers.filter(v => v.isUsed);
    }
    if (filter === "EXPIRING") {
      const now = new Date();
      const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      return vouchers.filter(v => !v.isUsed && new Date(v.expiryDate) <= in3Days);
    }
    return vouchers;
  };

  const filteredVouchers = getFilteredVouchers();

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] w-full min-h-screen flex justify-center">
      <div className="w-full max-w-screen-xl relative min-h-screen pb-[80px] bg-[#f9f9f9] font-sans">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* TopAppBar */}
        <header className="w-full top-0 sticky bg-[#f9f9f9] shadow-[0px_4px_12px_rgba(59,31,10,0.06)] z-40">
          <div className="flex items-center justify-between px-[20px] h-16 w-full max-w-screen-xl mx-auto shadow-sm">
            <div className="flex items-center gap-4">
              <button className="text-[#855300] hover:bg-[#f3f3f4] transition-colors rounded-full p-2 active:scale-95 duration-200">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
              </button>
              <h1 className="font-bold text-[32px] leading-[40px] text-[#855300] tracking-tight">SipPoint</h1>
            </div>
            <div className="flex items-center">
              <Link to={ROUTE_PATH.ACCOUNT} className="hover:bg-[#f3f3f4] transition-colors rounded-full p-1 active:scale-95 duration-200">
                <img alt="User avatar" className="w-10 h-10 rounded-full object-cover" src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpiNJlAtfv9FqYN6wPjpI7s6hWQ7ePZmmLyZvQsrJk5id0Q7FbYJH7LrLRQ3ShKVYVxBV8ccc1hs8mZecBeReOrFdVAYySDzygTRVhbmjEaTc3Yy-VImRPyNUXFrt79LyXzdEc7YRAJPg5ceBdTp-D0OK-ExoJQCPXDQZWW7EWHgqdl1mqyqHmd0P-yN8nUrf_s41iaujJsifAEq-SBRDhuusl_QmQCSDRuacx4D2Gsn9xjWA4OVdBL8ZXABC-T5JpkUv38vEUcZg"} />
              </Link>
            </div>
          </div>
        </header>

        <main className="w-full max-w-screen-xl mx-auto px-[20px] pt-[24px] pb-[80px]">
          {/* Header Section */}
          <div className="mb-[24px] flex flex-col gap-2">
            <h2 className="font-semibold text-[22px] md:text-[24px] leading-[28px] text-[#855300]">Voucher của tôi</h2>
            <p className="font-normal text-[14px] leading-[20px] text-[#534434]">Sử dụng mã ưu đãi để thưởng thức cà phê với giá tốt nhất.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-[24px] overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setFilter("ALL")} className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-[14px] active:scale-95 transition-transform ${filter === "ALL" ? 'bg-[#f59e0b] text-[#613b00] shadow-[0px_4px_12px_rgba(59,31,10,0.06)]' : 'border border-[#d8c3ad] text-[#534434] hover:bg-[#f3f3f4]'}`}>Tất cả</button>
            <button onClick={() => setFilter("EXPIRING")} className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-[14px] active:scale-95 transition-transform ${filter === "EXPIRING" ? 'bg-[#f59e0b] text-[#613b00] shadow-[0px_4px_12px_rgba(59,31,10,0.06)]' : 'border border-[#d8c3ad] text-[#534434] hover:bg-[#f3f3f4]'}`}>Sắp hết hạn</button>
            <button onClick={() => setFilter("USED")} className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-[14px] active:scale-95 transition-transform ${filter === "USED" ? 'bg-[#f59e0b] text-[#613b00] shadow-[0px_4px_12px_rgba(59,31,10,0.06)]' : 'border border-[#d8c3ad] text-[#534434] hover:bg-[#f3f3f4]'}`}>Đã dùng</button>
          </div>

          {/* Voucher List */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#855300]" />
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="text-center text-[#534434] mt-10">Chưa có voucher nào.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {filteredVouchers.map((v) => (
                <div key={v._id} className={`bg-[#f9f9f9] rounded-[12px] shadow-[0px_4px_12px_rgba(59,31,10,0.06)] overflow-hidden flex flex-row h-32 border border-[#e2e2e2] relative ${v.isUsed ? 'opacity-60 grayscale-[50%]' : ''}`}>
                  <div className={`w-1/3 h-full relative border-r border-dashed border-[#d8c3ad] flex items-center justify-center ${v.isUsed ? 'bg-[#e8e8e8]' : 'bg-[#ffcdae]'}`}>
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f9f9f9] shadow-inner"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f9f9f9] shadow-inner"></div>
                    <span className="material-symbols-outlined text-[48px] text-[#855300]">confirmation_number</span>
                  </div>
                  <div className="w-2/3 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[14px] leading-[20px] text-[#1a1c1c] line-clamp-1">{v.title}</h3>
                      <p className="font-normal text-[12px] leading-[20px] text-[#534434] line-clamp-2 mt-1">{v.voucherId?.description || "Ưu đãi đặc biệt từ SipPoint"}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`font-medium text-[12px] ${v.isUsed ? 'text-[#867461]' : 'text-[#ba1a1a]'}`}>
                        {v.isUsed ? 'Đã sử dụng' : \`HSD: \${new Date(v.expiryDate).toLocaleDateString('vi-VN')}\`}
                      </span>
                      <button disabled={v.isUsed} className={`px-3 py-1.5 rounded-full font-medium text-[12px] shadow-[0px_4px_12px_rgba(59,31,10,0.06)] transition-transform ${v.isUsed ? 'bg-[#e2e2e2] text-[#534434] cursor-not-allowed' : 'bg-[#f59e0b] text-[#613b00] active:scale-95'}`}>
                        {v.isUsed ? 'Đã dùng' : 'Dùng ngay'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 max-w-screen-xl mx-auto left-0 right-0 w-full z-50 h-16 border-t border-[#d8c3ad] bg-[#f9f9f9] shadow-[0px_-4px_12px_rgba(59,31,10,0.04)] md:hidden">
          <div className="flex justify-around items-center w-full px-2 h-full">
            <Link to={ROUTE_PATH.MENU} className="flex flex-col items-center justify-center text-[#534434] px-3 py-1 hover:bg-[#e8e8e8] active:scale-90 transition-all duration-150 rounded-xl">
              <span className="material-symbols-outlined mb-1">restaurant_menu</span>
              <span className="font-medium text-[12px]">Thực đơn</span>
            </Link>
            <a className="flex flex-col items-center justify-center text-[#534434] px-3 py-1 hover:bg-[#e8e8e8] active:scale-90 transition-all duration-150 rounded-xl" href="#">
              <span className="material-symbols-outlined mb-1">receipt_long</span>
              <span className="font-medium text-[12px]">Đơn hàng</span>
            </a>
            <Link to={ROUTE_PATH.REWARDS} className="flex flex-col items-center justify-center bg-[#ffcdae] text-[#7a553c] rounded-xl px-3 py-1 active:scale-90 transition-all duration-150">
              <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>loyalty</span>
              <span className="font-medium text-[12px]">Điểm SipPoint</span>
            </Link>
            <Link to={ROUTE_PATH.ACCOUNT} className="flex flex-col items-center justify-center text-[#534434] px-3 py-1 hover:bg-[#e8e8e8] active:scale-90 transition-all duration-150 rounded-xl">
              <span className="material-symbols-outlined mb-1">person</span>
              <span className="font-medium text-[12px]">Tài khoản</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
