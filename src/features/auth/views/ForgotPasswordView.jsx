import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2, Mail, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { AuthCard } from "@/components/common/AuthCard";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activationToken, setActivationToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const inputRefs = useRef([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setActivationToken(res.activationToken);
      toast.success("Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn.");
      setStep(2);
      setSeconds(59);
    } catch (error) {
      toast.error(error.message || "Không thể yêu cầu khôi phục mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Input handler for OTP grid
  const handleOtpChange = (value, index) => {
    const val = value.replace(/[^0-9]/g, "");
    const newOtp = [...otpValues];
    newOtp[index] = val ? val[val.length - 1] : "";
    setOtpValues(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtp = [...otpValues];
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otpValues];
        newOtp[index] = "";
        setOtpValues(newOtp);
      }
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (otp.length < 6) {
      toast.warning("Vui lòng nhập đầy đủ mã OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await authService.verifyOtpForReset(activationToken, otp);
      setResetToken(res.resetToken);
      toast.success("Xác thực mã OTP thành công.");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Mã OTP không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (seconds > 0) return;
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setActivationToken(res.activationToken);
      setOtpValues(["", "", "", "", "", ""]);
      setSeconds(59);
      inputRefs.current[0]?.focus();
      toast.success("Mã OTP mới đã được gửi.");
    } catch (error) {
      toast.error(error.message || "Gửi lại OTP thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải tối thiểu 6 ký tự.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.message || "Đổi mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else navigate("/login");
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-zinc-600" />
        </button>
        <h2 className="ml-2 text-xl font-bold text-secondary">
          {step === 1 && "Quên mật khẩu"}
          {step === 2 && "Xác minh OTP"}
          {step === 3 && "Đặt lại mật khẩu"}
        </h2>
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
          <p className="text-sm text-zinc-500">
            Nhập email của bạn để chúng tôi gửi mã OTP xác nhận khôi phục mật khẩu.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a1c1c]">Email tài khoản</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#FDFBF7] py-3.5 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 disabled:bg-primary/70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Gửi mã xác nhận"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
          <p className="text-sm text-zinc-500">
            Mã OTP khôi phục đã được gửi đến email: <br />
            <span className="font-semibold text-secondary">{email}</span>
          </p>

          <div className="grid grid-cols-6 gap-2 w-full">
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                disabled={isLoading}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                className="w-full aspect-square text-center font-bold text-2xl bg-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
              />
            ))}
          </div>

          {seconds > 0 ? (
            <span className="text-xs text-zinc-400 text-center">
              Gửi lại mã sau {seconds} giây
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-xs font-bold text-primary text-center hover:underline"
            >
              Gửi lại mã OTP
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || otpValues.join("").length < 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 disabled:bg-primary/70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Xác nhận OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          <p className="text-sm text-zinc-500">
            Tạo mật khẩu mới cho tài khoản của bạn.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a1c1c]">Mật khẩu mới</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-5 w-5 text-zinc-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#FDFBF7] py-3.5 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a1c1c]">Xác nhận mật khẩu</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3 h-5 w-5 text-zinc-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#FDFBF7] py-3.5 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-transparent focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 disabled:bg-primary/70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Đặt lại mật khẩu"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
