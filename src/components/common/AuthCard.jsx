import React from "react";
import { AUTH_TEXT } from "@/constants/auth";

export function AuthCard({ children }) {
  return (
    // Bỏ center, chuyển sang flex-col để chiếm toàn bộ màn hình
    <div className="flex h-screen w-full flex-col bg-white">
      
      {/* Phần ảnh nền trải rộng phía trên */}
      <div className="relative h-[40%] w-full shrink-0">
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
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            {AUTH_TEXT.SLOGAN}
          </p>
        </div>
      </div>

      {/* Phần form chiếm 60% còn lại, bo góc phía trên */}
      <div className="-mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-white px-8 pt-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {children}
      </div>
    </div>
  );
}