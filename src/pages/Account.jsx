import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [tableName, setTableName] = useState(() => localStorage.getItem("tableName") || "");
  
  // State quản lý trạng thái của nút Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setTableName(localStorage.getItem("tableName") || "");
    };
    window.addEventListener("tableNameUpdated", handleUpdate);
    return () => window.removeEventListener("tableNameUpdated", handleUpdate);
  }, []);

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

    // Kiểm tra xem trình duyệt hiện tại đang ở chế độ dark hay sáng để hiển thị nút cho đúng
    setTimeout(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }, 0);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTE_PATH.LOGIN);
  };

  // Hàm xử lý khi bấm nút chuyển đổi Giao diện
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light"); // Lưu lựa chọn vào bộ nhớ máy
      setIsDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Lưu lựa chọn vào bộ nhớ máy
      setIsDarkMode(true);
    }
  };

  return (
    <div className="bg-[#f9f9f9] dark:bg-surface-dim text-[#1a1c1c] dark:text-on-surface antialiased w-full min-h-screen flex justify-center selection:bg-[#f59e0b]/30 transition-colors duration-300">
      <div className="w-full max-w-md relative min-h-screen pb-[64px] bg-[#f9f9f9] dark:bg-background shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none font-sans transition-colors duration-300">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .toggle-checkbox:checked { right: 0; border-color: #f59e0b; }
          .toggle-checkbox:checked + .toggle-label { background-color: #f59e0b; }
          
          /* Dark mode toggle overrides */
          .dark .toggle-checkbox { border-color: #534434; background-color: #1c1b1b; }
          .dark .toggle-checkbox:checked { border-color: #f59e0b; }
        `}} />

        {/* TopAppBar */}
        <header className="sticky top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-white/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] dark:text-brand-cream text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              coffee
            </span>
            <span className="font-bold text-[18px] leading-none text-[#855300] dark:text-brand-cream tracking-wide">
              SipPoint
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 dark:bg-secondary-container text-[#7a553c] dark:text-on-secondary-container rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span className="font-semibold text-[13px]">{tableName ? `Bàn ${tableName}` : "Mang đi"}</span>
          </div>
          <Link to={ROUTE_PATH.EDIT_PROFILE} className="w-8 h-8 rounded-full overflow-hidden bg-[#e8e8e8] dark:bg-surface-container-high border-2 border-[#f59e0b] dark:border-primary-container hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-200 cursor-pointer">
            <img alt="User Profile" className="w-full h-full object-cover" src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhcC1CkAjxTbgxRtdCVpolezg2wWxa2fIyWW9LtaDQycVmijepXf5-SAAMtxnEfzDuN8B1DiFnlGSh0fYbfTLnVYT6euR4pt1NpuQJMRRdalaA1BvYYn9-uk79bk5ClhYQMRQdkZAXE3aOhcQUB9C3ko4fT0lWZab7bpVTzmCte7oEjSn1VvduhrCEPPyknMB3FGQIlqeO_SUaoPsyOVut6Vczo71rBBnD46wsMaCkETu-WOA1P3P1duwFc9_l1B2uHyGe8is0j4"} />
          </Link>
        </header>

        {/* Main Content Canvas */}
        <main className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-[24px]">
          <div className="py-2 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[22px] leading-[28px] text-[#1a1c1c] dark:text-on-surface">Cài đặt ứng dụng</h2>
              <p className="font-normal text-[14px] leading-[20px] text-[#534434] dark:text-on-surface-variant mt-1">
                Quản lý tuỳ chọn và bảo mật của {profile?.fullName || "Khách vãng lai"}.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-[8px]">
            <h3 className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-primary-container px-1 uppercase tracking-wider">Hồ sơ cá nhân</h3>
            <div className="bg-[#ffffff] dark:bg-surface-container-high rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none overflow-hidden border border-[#d8c3ad]/30 dark:border-outline-variant/10">
              <Link to={profile ? ROUTE_PATH.EDIT_PROFILE : ROUTE_PATH.LOGIN} className="flex items-center justify-between p-4 hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:bg-[#e8e8e8] dark:active:bg-surface-bright">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] dark:bg-primary-container/20 flex items-center justify-center text-[#7a553c] dark:text-primary-container">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c] dark:text-on-surface">Chỉnh sửa thông tin</span>
                </div>
                <span className="material-symbols-outlined text-[#534434] dark:text-on-surface-variant text-[20px]">chevron_right</span>
              </Link>
            </div>
          </section>

          {/* Section: Preferences */}
          <section className="flex flex-col gap-[8px]">
            <h3 className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-primary-container px-1 uppercase tracking-wider">Tuỳ chỉnh</h3>
            <div className="bg-[#ffffff] dark:bg-surface-container-high rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none overflow-hidden border border-[#d8c3ad]/30 dark:border-outline-variant/10">
              
              {/* Theme Toggle (Nút Giao diện Sáng/Tối) */}
              <div className="flex items-center justify-between p-4 border-b border-[#d8c3ad]/20 dark:border-outline-variant/10 hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] dark:bg-primary-container/20 flex items-center justify-center text-[#7a553c] dark:text-primary-container">
                    <span className="material-symbols-outlined">
                      {isDarkMode ? "dark_mode" : "light_mode"}
                    </span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c] dark:text-on-surface">
                    Giao diện tối
                  </span>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input 
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    className="peer sr-only" 
                    id="theme-toggle" 
                    type="checkbox" 
                  />
                  <label 
                    className="block w-12 h-6 rounded-full bg-[#e8e8e8] dark:bg-surface-container cursor-pointer transition-colors duration-300 peer-checked:bg-[#f59e0b] dark:peer-checked:bg-[#f59e0b]" 
                    htmlFor="theme-toggle"
                  ></label>
                  <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-6 shadow-sm border border-zinc-200 dark:border-zinc-700 pointer-events-none"></span>
                </div>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-4 border-b border-[#d8c3ad]/20 dark:border-outline-variant/10 hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] dark:bg-primary-container/20 flex items-center justify-center text-[#7a553c] dark:text-primary-container">
                    <span className="material-symbols-outlined">notifications</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c] dark:text-on-surface">Thông báo</span>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input 
                    defaultChecked 
                    className="peer sr-only" 
                    id="noti-toggle" 
                    type="checkbox" 
                  />
                  <label 
                    className="block w-12 h-6 rounded-full bg-[#e8e8e8] dark:bg-surface-container cursor-pointer transition-colors duration-300 peer-checked:bg-[#f59e0b] dark:peer-checked:bg-[#f59e0b]" 
                    htmlFor="noti-toggle"
                  ></label>
                  <span className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-6 shadow-sm border border-zinc-200 dark:border-zinc-700 pointer-events-none"></span>
                </div>
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between p-4 hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:bg-[#e8e8e8] dark:active:bg-surface-bright">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffcdae] dark:bg-primary-container/20 flex items-center justify-center text-[#7a553c] dark:text-primary-container">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c] dark:text-on-surface">Ngôn ngữ</span>
                </div>
                <div className="flex items-center gap-2 text-[#534434] dark:text-on-surface-variant">
                  <span className="font-normal text-[14px] leading-[20px]">Tiếng Việt</span>
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Security */}
          {profile && (
            <section className="flex flex-col gap-[8px]">
              <h3 className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-primary-container px-1 uppercase tracking-wider">Bảo mật & Đăng nhập</h3>
              <div className="bg-[#ffffff] dark:bg-surface-container-high rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none overflow-hidden border border-[#d8c3ad]/30 dark:border-outline-variant/10">
                {/* Change Password */}
                <div className="flex items-center justify-between p-4 hover:bg-[#f3f3f4] dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:bg-[#e8e8e8] dark:active:bg-surface-bright">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ede3b8] dark:bg-secondary-container/30 flex items-center justify-center text-[#4a4424] dark:text-secondary-brand">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <span className="font-normal text-[16px] leading-[24px] text-[#1a1c1c] dark:text-on-surface">Thay đổi mật khẩu</span>
                  </div>
                  <span className="material-symbols-outlined text-[#534434] dark:text-on-surface-variant text-[20px]">chevron_right</span>
                </div>
              </div>
            </section>
          )}

          {/* Authentication Button */}
          <div className="mt-4">
            {profile ? (
              <button onClick={handleLogout} className="w-full py-3 px-4 bg-[#ffdad6] dark:bg-error-container/20 text-[#93000a] dark:text-error font-semibold text-[14px] leading-[20px] rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border dark:border-error-container/50 dark:hover:bg-error-container/30">
                <span className="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            ) : (
              <button onClick={() => navigate(ROUTE_PATH.LOGIN)} className="w-full py-3 px-4 bg-[#855300] dark:bg-primary text-white font-semibold text-[14px] leading-[20px] rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">login</span>
                Đăng nhập
              </button>
            )}
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar activeTab="ACCOUNT" />
      </div>
    </div>
  );
}