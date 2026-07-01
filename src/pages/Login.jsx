import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react"; // Thay Smartphone bằng Mail
import { AUTH_TEXT } from "@/constants/auth";
import { AuthCard } from "@/components/common/AuthCard";
import { authService } from "@/services/authService";
import { SocialButtons } from "@/components/common/SocialButtons"; // Import component chung

export default function Login() {
  const navigate = useNavigate();
  // Đổi state sang email
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" }); 

    try {
      // Truyền email vào logic giả lập
      const response = await authService.login(formData.email);
      setMessage({ type: "success", text: response.message });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="mb-8 flex w-full rounded-xl bg-zinc-100 p-1">
        <div className="flex-1 rounded-lg bg-secondary py-2 text-center text-sm font-semibold text-white shadow-sm">
          {AUTH_TEXT.TAB_LOGIN}
        </div>
        <Link to="/register" className="flex-1 rounded-lg py-2 text-center text-sm font-semibold text-zinc-500 hover:text-zinc-700 transition-all">
          {AUTH_TEXT.TAB_REGISTER}
        </Link>
      </div>

      {message.text && (
        <div className={`mb-4 rounded-lg p-3 text-center text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Ô nhập Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-secondary">{AUTH_TEXT.LABEL_EMAIL}</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-5 w-5 text-zinc-400" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={AUTH_TEXT.PLACEHOLDER_EMAIL}
              disabled={isLoading}
              className="w-full rounded-xl bg-[#FDFBF7] py-3.5 pl-10 pr-4 text-sm font-medium text-zinc-900 outline-none ring-1 ring-transparent focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>

        {/* Ô nhập Mật khẩu */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-secondary">{AUTH_TEXT.LABEL_PASSWORD}</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-5 w-5 text-zinc-400" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={AUTH_TEXT.PLACEHOLDER_PASSWORD}
              disabled={isLoading}
              className="w-full rounded-xl bg-[#FDFBF7] py-3.5 pl-10 pr-4 text-sm font-medium text-zinc-900 outline-none ring-1 ring-transparent focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 disabled:bg-primary/70">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{AUTH_TEXT.TAB_LOGIN} <ArrowRight className="h-5 w-5" /></>}
        </button>
      </form>

      {/* Gọi Component chung ở đây */}
      <SocialButtons />
    </AuthCard>
  );
}