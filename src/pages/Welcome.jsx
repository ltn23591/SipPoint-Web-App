import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";

export default function Welcome() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    navigate(ROUTE_PATH.LOGIN);
  };

  const handleGuestClick = () => {
    navigate(ROUTE_PATH.HOME);
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex justify-center selection:bg-[#f59e0b]/30">
      <div className="relative min-h-screen w-full max-w-md flex flex-col bg-white shadow-xl overflow-x-hidden font-sans text-[#1a1c1c]">
        {/* CSS Styles injection for custom animations, scrollbars and fonts */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
          }
          
          .coffee-glass {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          
          .active-scale {
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), edit 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          }
          
          .active-scale:active {
            transform: scale(0.96) !important;
          }
        `}} />

        {/* Hero Background Section */}
        <div className="relative h-[45vh] w-full overflow-hidden bg-gradient-to-b from-black/50 via-white/20 to-white">
          {/* Table Identifier Floating */}
          <div className="absolute inset-0 max-w-md mx-auto w-full pointer-events-none">
            <div className="absolute top-5 left-5 z-10 pointer-events-auto">
              <div className="bg-[#855300] px-4 py-2 rounded-full shadow-[0px_8px_24px_rgba(59,31,10,0.15)] flex items-center gap-2 border border-[#855300]/10">
                <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  table_restaurant
                </span>
                <span className="font-semibold text-[14px] leading-none text-white tracking-wide">
                  Bàn B05
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Canvas */}
        <main className="relative -mt-20 px-5 pb-8 z-20 flex-1 flex flex-col justify-between w-full">
          <div>
            {/* Welcome Card */}
            <div className="mb-6 transition-all duration-700 delay-100 transform ease-out">
              <div className="text-[32px] font-bold text-[#1a1c1c] leading-tight tracking-tight">
                Chào mừng bạn<br />đến với <span className="text-[#855300] italic font-serif">SipPoint</span>
              </div>
              <p className="mt-2 text-[16px] leading-[24px] text-[#534434] max-w-[85%] font-medium">
                Thưởng thức hương vị cà phê thủ công ngay tại chỗ ngồi của bạn.
              </p>
            </div>

            {/* Action Selection (Asymmetric Bento Style) */}
            <div className="grid grid-cols-1 gap-4">
              {/* Primary Action Card (Amber Filled) */}
              <button 
                onClick={handleLoginClick}
                className={`active-scale group relative overflow-hidden bg-[#f59e0b] p-6 rounded-[24px] shadow-[0px_8px_24px_rgba(245,158,11,0.25)] flex flex-col items-start text-left border-2 border-[#f59e0b] transition-all cursor-pointer ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ 
                  transitionDelay: '400ms',
                  transform: animate ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animate ? 1 : 0,
                  transitionProperty: 'all',
                  transitionDuration: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {/* Blur Circle design */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#613b00]/10 rounded-full -mr-12 -mt-12 blur-2xl transition-transform duration-500 group-hover:scale-110" />
                
                <div className="flex justify-between w-full items-start mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#613b00]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#613b00] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      person_add
                    </span>
                  </div>
                  <div className="bg-[#613b00] text-[#f59e0b] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Khuyên dùng
                  </div>
                </div>

                <div className="space-y-1 relative z-10">
                  <h2 className="text-[22px] leading-[28px] text-[#613b00] font-bold">
                    Đăng nhập / Đăng ký
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#613b00]/80 flex items-center gap-1 font-medium">
                    Tích điểm ngay hôm nay
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-[#613b00] group-hover:translate-x-1 transition-transform">
                  <span>Bắt đầu ngay</span>
                  <span className="material-symbols-outlined text-[16px] font-bold">
                    arrow_forward
                  </span>
                </div>
              </button>

              {/* Guest Action Card (Outlined) */}
              <button 
                onClick={handleGuestClick}
                className={`active-scale group p-6 rounded-[24px] border-2 border-[#d8c3ad] bg-[#f3f3f4] hover:bg-[#eeeeee] transition-all flex flex-col items-start text-left cursor-pointer ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ 
                  transitionDelay: '550ms',
                  transform: animate ? 'translateY(0)' : 'translateY(20px)',
                  opacity: animate ? 1 : 0,
                  transitionProperty: 'all',
                  transitionDuration: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                <div className="w-12 h-12 rounded-full bg-[#d8c3ad]/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#867461] text-[24px]">
                    no_accounts
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-[20px] leading-[28px] text-[#1a1c1c] font-semibold">
                    Tiếp tục không đăng nhập
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#534434] font-medium">
                    Xem thực đơn và gọi món trực tiếp dưới tên khách.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-[#534434] group-hover:translate-x-1 transition-transform">
                  <span>Tiếp tục</span>
                  <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Social Proof/Atmospheric Quote */}
          <div className="mt-12 text-center px-4 opacity-60">
            <span className="material-symbols-outlined text-[#855300] mb-2 text-[24px]">
              format_quote
            </span>
            <p className="text-[12px] leading-[16px] italic text-[#534434] font-medium">
              "Cà phê không chỉ là đồ uống, đó là một trải nghiệm tâm hồn."
            </p>
          </div>
        </main>

        {/* Subtle Grain Overlay for Texture */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_8ZnXmtSBkd3ONclTU0LJXhZwFtw6jT9r51QK3hrvPe8yqv8I8iOGDZjDCjdYoaLJHEkKqBWyP2-JcwiNPxNRdQ9cNtB6Qxql5AdTGIVpDAl1KosPYjTRSrTOsuF-6MCPWRhyB-jk21uTyZ4_494cAq6KKUEv8d5bAzjFL37cet5n-dgqfb9DS55qAjXKxS2DvOY9Dn5-neNtB5XQxUZH-O_L5xqBt38O1vljT6O-STBgfFI_pC5cOHtb3CXOUexCLnddt5aY')",
          }} 
        />
      </div>
    </div>
  );
}
