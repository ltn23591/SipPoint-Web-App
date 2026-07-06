import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Loader2, Lock, Mail, Smartphone, User } from "lucide-react";
import { toast } from "react-toastify";
import { AUTH_TEXT } from "@/constants/auth";
import { AuthCard } from "@/components/common/AuthCard";
import { authService } from "@/services/authService";
import { SocialButtons } from "@/components/common/SocialButtons"; // Import component chung

export default function Register() {
  const navigate = useNavigate();
  // Thêm email vào state
  const [formData, setFormData] = useState({ fullname: "", email: "", phone: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      toast.success(response.message || "Đăng ký thành công!");
      setTimeout(() => navigate("/verify-otp", { state: { email: formData.email } }), 1500); // Chuyển sang trang xác thực OTP
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="mb-8 flex w-full rounded-xl bg-zinc-100 dark:bg-surface-container p-1 transition-colors duration-300">
        <Link to="/login" className="flex-1 rounded-lg py-2 text-center text-sm font-semibold text-zinc-500 dark:text-on-surface-variant hover:text-zinc-700 dark:hover:text-on-surface transition-all">
          {AUTH_TEXT.TAB_LOGIN}
        </Link>
        <div className="flex-1 rounded-lg bg-secondary py-2 text-center text-sm font-semibold text-white shadow-sm">
          {AUTH_TEXT.TAB_REGISTER}
        </div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {/* Họ và tên */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1a1c1c] dark:text-on-surface">{AUTH_TEXT.LABEL_FULLNAME}</label>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-5 w-5 text-zinc-400 dark:text-on-surface-variant" />
            <input required disabled={isLoading} className="w-full rounded-xl bg-[#FDFBF7] dark:bg-surface-container dark:text-on-surface py-3 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary dark:focus:ring-primary disabled:opacity-50" placeholder={AUTH_TEXT.PLACEHOLDER_FULLNAME} onChange={(e) => setFormData({...formData, fullname: e.target.value})} />
          </div>
        </div>

        {/* Email mới thêm */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1a1c1c] dark:text-on-surface">{AUTH_TEXT.LABEL_EMAIL}</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-5 w-5 text-zinc-400 dark:text-on-surface-variant" />
            <input required type="email" disabled={isLoading} className="w-full rounded-xl bg-[#FDFBF7] dark:bg-surface-container dark:text-on-surface py-3 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary dark:focus:ring-primary disabled:opacity-50" placeholder={AUTH_TEXT.PLACEHOLDER_EMAIL} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1a1c1c] dark:text-on-surface">{AUTH_TEXT.LABEL_PHONE}</label>
          <div className="relative flex items-center">
            <Smartphone className="absolute left-3 h-5 w-5 text-zinc-400 dark:text-on-surface-variant" />
            <input required type="tel" disabled={isLoading} className="w-full rounded-xl bg-[#FDFBF7] dark:bg-surface-container dark:text-on-surface py-3 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary dark:focus:ring-primary disabled:opacity-50" placeholder={AUTH_TEXT.PLACEHOLDER_PHONE} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        {/* Mật khẩu */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1a1c1c] dark:text-on-surface">{AUTH_TEXT.LABEL_PASSWORD}</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-5 w-5 text-zinc-400 dark:text-on-surface-variant" />
            <input required type="password" disabled={isLoading} className="w-full rounded-xl bg-[#FDFBF7] dark:bg-surface-container dark:text-on-surface py-3 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary dark:focus:ring-primary disabled:opacity-50" placeholder={AUTH_TEXT.PLACEHOLDER_PASSWORD} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 disabled:bg-primary/70">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{AUTH_TEXT.TAB_REGISTER} <ArrowRight className="h-5 w-5" /></>}
        </button>
      </form>

      {/* Gọi Component chung ở đây */}
      <SocialButtons />
    </AuthCard>
  );
}