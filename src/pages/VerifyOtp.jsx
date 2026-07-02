import { CiClock1 } from 'react-icons/ci';
import { FaUnlock } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Coffee, Leaf, Smile } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '@/services/authService';

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [seconds, setSeconds] = useState(59);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const inputRefs = useRef([]);

    // Countdown timer logic
    useEffect(() => {
        if (seconds <= 0) return;
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    // Input change handler
    const handleInputChange = (value, index) => {
        const val = value.replace(/[^0-9]/g, '');
        const newOtpValues = [...otpValues];
        newOtpValues[index] = val ? val[val.length - 1] : ''; // only take last char
        setOtpValues(newOtpValues);

        // Auto-focus next input
        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Backspace key handler
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otpValues[index] && index > 0) {
                const newOtpValues = [...otpValues];
                newOtpValues[index - 1] = '';
                setOtpValues(newOtpValues);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtpValues = [...otpValues];
                newOtpValues[index] = '';
                setOtpValues(newOtpValues);
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otp = otpValues.join('');
        if (otp.length < 6) return;

        setIsLoading(true);

        try {
            const response = await authService.verifyOtp({ email, otp });
            toast.success(response.message || 'Xác thực thành công!');
            setIsSuccess(true);
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            toast.error(error.message || 'Mã OTP không hợp lệ!');
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (seconds > 0) return;
        toast.info('Mã mới đã được gửi!');
        setSeconds(59);
        setOtpValues(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const displaySec = seconds < 10 ? `0${seconds}` : seconds;

    return (
        <div className="bg-[#f9f9f9] text-[#1a1c1c] font-sans min-h-screen flex flex-col items-center">
            {/* TopAppBar */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f9f9f9]/95 backdrop-blur-md shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f4] transition-colors active:scale-95 duration-200"
                >
                    <ArrowLeft className="h-5 w-5 text-[#1a1c1c]" />
                </button>
                <h1 className="text-[22px] leading-[28px] font-semibold text-[#855300]">
                    Xác nhận OTP
                </h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </header>

            <main className="w-full max-w-md px-5 pt-24 pb-12 flex flex-col items-center">
                {/* Hero Section: Verification Illustration */}
                <div className="w-full flex justify-center mb-6">
                    <div className="relative w-32 h-32 bg-[#ffcdae]/30 rounded-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#855300]/5 rounded-full animate-pulse"></div>
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] flex items-center justify-center transform -rotate-3">
                            <span
                                className="material-symbols-outlined text-[48px] text-[#855300]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                <FaUnlock />
                            </span>
                        </div>
                        {/* Decorative coffee bean floaties */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 text-[#7c563d]/40 flex items-center justify-center">
                            <Coffee className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Header & Subtext */}
                <div className="text-center space-y-2 mb-6">
                    <h2 className="text-2xl font-bold text-[#1a1c1c]">
                        Nhập mã xác minh
                    </h2>
                    <p className="text-sm text-[#534434] px-4">
                        Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email <br />
                        <span className="font-semibold text-[#855300]">
                            {email || 'của bạn'}
                        </span>
                    </p>
                </div>

                {/* OTP Input Grid */}
                <div
                    className="grid grid-cols-6 gap-2 w-full mb-6"
                    id="otp-container"
                >
                    {otpValues.map((val, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            disabled={isLoading || isSuccess}
                            onChange={(e) =>
                                handleInputChange(e.target.value, idx)
                            }
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            className="otp-input w-full aspect-square text-center font-bold text-2xl bg-[#ede3b8]/35 border-none rounded-xl text-[#855300] focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-all outline-none"
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                {/* Timer */}
                {seconds > 0 && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-sm text-[#534434]">
                            <CiClock1 />
                        </span>
                        <span className="text-sm font-semibold text-[#534434]">
                            Gửi lại mã sau 00:{displaySec}
                        </span>
                    </div>
                )}

                {/* Primary Action */}
                <button
                    onClick={handleVerify}
                    disabled={
                        isLoading || isSuccess || otpValues.join('').length < 6
                    }
                    className={`w-full h-[48px] font-semibold text-sm rounded-full shadow-[0px_4px_12px_rgba(59,31,10,0.06)] active:scale-95 transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-2 ${
                        isSuccess
                            ? 'bg-green-600 text-white'
                            : 'bg-[#f59e0b] text-[#613b00] hover:bg-[#f59e0b]/90 disabled:opacity-50'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#613b00]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Đang xác thực...
                        </>
                    ) : isSuccess ? (
                        'Thành công!'
                    ) : (
                        'Xác nhận'
                    )}
                </button>

                {/* Secondary Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-[#534434]">
                        Bạn không nhận được mã?{' '}
                        <button
                            onClick={handleResend}
                            disabled={seconds > 0}
                            className={`font-semibold ml-1 transition-all ${
                                seconds > 0
                                    ? 'text-[#855300]/50 cursor-not-allowed'
                                    : 'text-[#855300] hover:underline'
                            }`}
                        >
                            Gửi lại
                        </button>
                    </p>
                </div>

                {/* Visual Flourish */}
                <div className="mt-20 opacity-10 flex gap-4 text-[#1a1c1c]">
                    <Coffee className="w-8 h-8" />
                    <Leaf className="w-8 h-8" />
                    <Smile className="w-8 h-8" />
                </div>
            </main>
        </div>
    );
}
