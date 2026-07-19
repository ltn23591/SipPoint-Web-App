import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react"; // Thay Smartphone bằng Mail
import { toast } from "react-toastify";
import { AUTH_TEXT } from "@/constants/auth";
import { AuthCard } from "@/components/common/AuthCard";
import { authService } from "@/services/authService";
import { SocialButtons } from "@/components/common/SocialButtons"; // Import component chung

export default function Login() {
  const navigate = useNavigate();
  // Đổi state sang email
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      toast.success(response.message || "Đăng nhập thành công!");
      setTimeout(() => navigate("/menu"), 1000);
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="mb-8 flex w-full rounded-xl bg-zinc-100 dark:bg-surface-container p-1 transition-colors duration-300">
        <div className="flex-1 rounded-lg bg-secondary py-2 text-center text-sm font-semibold text-white shadow-sm">
          {AUTH_TEXT.TAB_LOGIN}
        </div>
        <Link to="/register" className="flex-1 rounded-lg py-2 text-center text-sm font-semibold text-zinc-500 dark:text-on-surface-variant hover:text-zinc-700 dark:hover:text-on-surface transition-all">
          {AUTH_TEXT.TAB_REGISTER}
        </Link>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Ô nhập Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1a1c1c] dark:text-on-surface">{AUTH_TEXT.LABEL_EMAIL}</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-5 w-5 text-zinc-400 dark:text-on-surface-variant" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={AUTH_TEXT.PLACEHOLDER_EMAIL}
              disabled={isLoading}
              className="w-full rounded-xl bg-[#FDFBF7] dark:bg-surface-container dark:text-on-surface py-3.5 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary dark:focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>

        {/* Ô nhập Mật khẩu */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1a1c1c] dark:text-on-surface">{AUTH_TEXT.LABEL_PASSWORD}</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-5 w-5 text-zinc-400 dark:text-on-surface-variant" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={AUTH_TEXT.PLACEHOLDER_PASSWORD}
              disabled={isLoading}
              className="w-full rounded-xl bg-[#FDFBF7] dark:bg-surface-container dark:text-on-surface py-3.5 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary dark:focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
              Quên mật khẩu?
            </Link>
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