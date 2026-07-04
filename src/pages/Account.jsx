import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTE_PATH.LOGIN);
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased w-full min-h-screen flex justify-center">
      <div className="w-full max-w-md relative min-h-screen pb-[64px] bg-[#f9f9f9] shadow-[0px_4px_12px_rgba(59,31,10,0.06)] font-sans">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .toggle-checkbox:checked { right: 0; border-color: #f59e0b; }
          .toggle-checkbox:checked + .toggle-label { background-color: #f59e0b; }
        `}} />
        
        {/* TopAppBar */}
        <header className="sticky top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-white/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              coffee
            </span>
            <span className="font-bold text-[18px] leading-none text-[#855300] tracking-wide">
              SipPoint
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 text-[#7a553c] rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span className="font-semibold text-[13px]">Bàn B05</span>
          </div>

          <Link to={ROUTE_PATH.EDIT_PROFILE} className="w-8 h-8 rounded-full overflow-hidden bg-[#e8e8e8] border-2 border-[#f59e0b] hover:bg-[#f3f3f4] transition-colors active:scale-95 duration-200 cursor-pointer">
            <img alt="User Profile" className="w-full h-full object-cover" src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhcC1CkAjxTbgxRtdCVpolezg2wWxa2fIyWW9LtaDQycVmijepXf5-SAAMtxnEfzDuN8B1DiFnlGSh0fYbfTLnVYT6euR4pt1NpuQJMRRdalaA1BvYYn9-uk79bk5ClhYQMRQdkZAXE3aOhcQUB9C3ko4fT0lWZab7bpVTzmCte7oEjSn1VvduhrCEPPyknMB3FGQIlqeO_SUaoPsyOVut6Vczo71rBBnD46wsMaCkETu-WOA1P3P1duwFc9_l1B2uHyGe8is0j4"} />
          </Link>
        </header>

        {/* Main Content Canvas */}
        <main className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-[24px]">
          <div className="py-2 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[22px] leading-[28px] text-[#1a1c1c]">Cài đặt ứng dụng</h2>
              <p className="font-normal text-[14px] leading-[20px] text-[#534434] mt-1">Quản lý tuỳ chọn và bảo mật của {profile?.fullName || "bạn"}.</p>
            </div>
          </div>

          <section className="flex flex-col gap-[8px]">
            <h3 className="font-semibold text-[14px] leading-[20px] text-[#7c563d] px-1 uppercase tracking-wider">Hồ sơ cá nhân</h3>
            <div className="bg-[#ffffff] rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] overflow-hidden border border-[#d8c3ad]/30">
              <Link to={ROUTE_PATH.EDIT_PROFILE} className="flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors cursor-pointer active:bg-[#e8e8e8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] flex items-center justify-center text-[#7a553c]">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c]">Chỉnh sửa thông tin</span>
                </div>
                <span className="material-symbols-outlined text-[#534434] text-[20px]">chevron_right</span>
              </Link>
            </div>
          </section>

          {/* Section: Preferences */}
          <section className="flex flex-col gap-[8px]">
            <h3 className="font-semibold text-[14px] leading-[20px] text-[#7c563d] px-1 uppercase tracking-wider">Tuỳ chỉnh</h3>
            <div className="bg-[#ffffff] rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] overflow-hidden border border-[#d8c3ad]/30">
              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-4 border-b border-[#d8c3ad]/20 hover:bg-[#f3f3f4] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] flex items-center justify-center text-[#7a553c]">
                    <span className="material-symbols-outlined">notifications</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c]">Thông báo</span>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#dadada] transition-all duration-300 z-10" id="toggle" name="toggle" type="checkbox" />
                  <label className="toggle-label block overflow-hidden h-6 rounded-full bg-[#f59e0b] cursor-pointer transition-all duration-300" htmlFor="toggle"></label>
                </div>
              </div>
              {/* Language Selection */}
              <div className="flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors cursor-pointer active:bg-[#e8e8e8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] flex items-center justify-center text-[#7a553c]">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c]">Ngôn ngữ</span>
                </div>
                <div className="flex items-center gap-2 text-[#534434]">
                  <span className="font-normal text-[14px] leading-[20px]">Tiếng Việt</span>
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Security */}
          <section className="flex flex-col gap-[8px]">
            <h3 className="font-semibold text-[14px] leading-[20px] text-[#7c563d] px-1 uppercase tracking-wider">Bảo mật & Đăng nhập</h3>
            <div className="bg-[#ffffff] rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] overflow-hidden border border-[#d8c3ad]/30">
              {/* Change Password */}
              <div className="flex items-center justify-between p-4 hover:bg-[#f3f3f4] transition-colors cursor-pointer active:bg-[#e8e8e8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ede3b8] flex items-center justify-center text-[#4a4424]">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c]">Thay đổi mật khẩu</span>
                </div>
                <span className="material-symbols-outlined text-[#534434] text-[20px]">chevron_right</span>
              </div>
            </div>
          </section>


          {/* Logout Button */}
          <div className="mt-4">
            <button onClick={handleLogout} className="w-full py-3 px-4 bg-[#ffdad6] text-[#93000a] font-semibold text-[14px] leading-[20px] rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">logout</span>
              Đăng xuất
            </button>
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar activeTab="ACCOUNT" />
      </div>
    </div>
  );
}
