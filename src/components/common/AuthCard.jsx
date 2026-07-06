import React from "react";
import { AUTH_TEXT } from "@/constants/auth";

export function AuthCard({ children }) {
  return (
    // Căn giữa màn hình và giới hạn chiều rộng max-w-md cho giao diện mobile/webapp trên PC
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-surface-dim flex justify-center transition-colors duration-300">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-white dark:bg-surface-dim shadow-xl dark:shadow-none transition-colors duration-300">
        
        {/* Phần ảnh nền trải rộng phía trên */}
        <div className="relative h-[35vh] w-full shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" 
            alt="SipPoint Background"
            className="h-full w-full object-cover"
          />
          
          {/* Lớp phủ gradient để làm nổi bật logo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-white" />
          
          <div className="absolute bottom-8 w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {AUTH_TEXT.APP_NAME}
            </h1>
            <p className="mb-3 mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              {AUTH_TEXT.SLOGAN}
            </p>
          </div>
        </div>

        {/* Phần form, bo góc phía trên */}
        <div className="-mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-white dark:bg-surface-container-high px-8 pt-8 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-none text-[#1a1c1c] dark:text-on-surface z-10">
          {children}
        </div>
      </div>
    </div>
  );
}