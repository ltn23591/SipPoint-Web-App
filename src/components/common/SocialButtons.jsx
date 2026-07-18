// File: src/components/common/SocialButtons.jsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { AUTH_TEXT } from "@/constants/auth";

export function SocialButtons() {
  const navigate = useNavigate();

  return (
    <div className="mt-2 flex flex-col w-full">
      {/* Đường phân cách */}
      <div className="my-5 flex items-center justify-center gap-3">
        <div className="h-[1px] flex-1 bg-zinc-200"></div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          {AUTH_TEXT.DIVIDER_OR}
        </span>
        <div className="h-[1px] flex-1 bg-zinc-200"></div>
      </div>

      {/* 2 Nút Mạng xã hội */}
      <div className="flex gap-3">
        <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="h-4 w-4" alt="Google" />
          {AUTH_TEXT.BTN_GOOGLE}
        </button>
        <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" className="h-4 w-4" alt="Facebook" />
          {AUTH_TEXT.BTN_FACEBOOK}
        </button>
      </div>

      {/* Nút Khách vãng lai */}
      <div className="mt-8 flex justify-center">
        <button 
          type="button" 
          onClick={() => navigate("/menu")}
          className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
        >
          {AUTH_TEXT.GUEST_LOGIN}
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}