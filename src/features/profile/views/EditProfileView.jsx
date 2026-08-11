import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { GENDER_OPTIONS } from "@/constants/auth";
import { authService } from "@/services/authService";
import { customerService } from "@/services/customerService";
import { toast } from "sonner";

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    avatar: "",
    gender: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe();
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          email: data.email || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          avatar: data.avatar || "",
          gender: data.gender || ""
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading("Đang tải ảnh đại diện lên...");
    try {
      const uploadResult = await customerService.uploadAvatar(file);
      const url = uploadResult.secure_url || uploadResult.url;

      setFormData((prev) => ({ ...prev, avatar: url }));
      toast.success("Tải ảnh đại diện lên thành công!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Tải ảnh đại diện thất bại!", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      toast.warning("Vui lòng đợi ảnh tải lên hoàn tất!");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await customerService.updateMyProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        avatar: formData.avatar,
        gender: formData.gender || null
      });
      toast.success("Cập nhật thông tin thành công!");
      setTimeout(() => navigate(ROUTE_PATH.ACCOUNT), 1000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Cập nhật thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] dark:bg-surface-dim text-[#1a1c1c] dark:text-on-surface w-full min-h-screen flex flex-col items-center font-sans pb-[64px] transition-colors duration-300">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      <div className="w-full max-w-md relative min-h-screen bg-[#f9f9f9] dark:bg-background shadow-xl transition-colors duration-300">

        {/* Top Navigation */}
        <header className="w-full top-0 sticky bg-[#f9f9f9] dark:bg-surface-container shadow-sm dark:shadow-none dark:border-b dark:border-surface-variant z-40 transition-colors duration-300">
          <div className="flex items-center justify-between px-[20px] h-16 w-full">
            <button onClick={() => navigate(ROUTE_PATH.ACCOUNT)} aria-label="Go back" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors text-[#534434] dark:text-on-surface active:scale-95">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
            </button>
            <h1 className="font-semibold text-[22px] leading-[28px] text-[#1a1c1c] dark:text-on-surface">Chỉnh sửa thông tin</h1>
            <div className="w-10 h-10"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-[20px] py-[24px] flex flex-col gap-[24px]">
          {error && <div className="p-3 bg-[#ffdad6] dark:bg-error-container text-[#93000a] dark:text-on-error-container rounded-lg text-sm">{error}</div>}

          {/* Profile Picture Edit */}
          <section className="flex flex-col items-center justify-center gap-[8px]">
            <div
              onClick={handleAvatarClick}
              className="relative w-24 h-24 rounded-full bg-[#e2e2e2] dark:bg-surface-container-high shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-xl border-4 border-[#f9f9f9] dark:border-surface-container overflow-hidden group cursor-pointer transition-colors duration-300"
            >
              <img alt="Profile Picture" className="w-full h-full object-cover" src={formData.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAYpAeE9XgC3WiDAHrX9uWku-HPkl4NdL7T8qML3dZhr9Y1xj1_QB2WFXstqIzkMsM38UYq2uze4JPEnRTPmRfP8Istbn4Mk3ezl0b9fYg1ulr1NyH4AiNHB4WBySW5XwWWu8PN9Pw4anp5PGioFx56-Ddt4rnE3EJYBDAtHCDYv6xCnvOICZSMvNIjU8cVAaGO8y3Zs0UEK15xAaaA_9zJYL3JnM1rXJI23wcOF3FFjz6W2T0jtYulDTNXTYxFIBU6ifWQymNirw4"} />
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              </div>
            </div>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-[#855300] dark:text-primary font-semibold text-[14px] leading-[20px] hover:underline decoration-[#855300] dark:decoration-primary underline-offset-4"
            >
              Thay đổi ảnh đại diện
            </button>
          </section>

          {/* Form Fields */}
          <form className="flex flex-col gap-[16px] w-full" id="profileForm" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-on-surface-variant pl-1" htmlFor="fullName">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#867461] dark:text-outline">person</span>
                </div>
                <input required className="w-full h-12 pl-10 pr-4 bg-[#ede3b8]/50 dark:bg-surface-container-high border border-transparent dark:border-none rounded-xl text-[#1a1c1c] dark:text-on-surface font-normal text-[16px] focus:ring-2 focus:ring-[#f59e0b] dark:focus:ring-primary focus:bg-[#e2e2e2] dark:focus:bg-surface-container-highest transition-colors placeholder:text-[#d8c3ad] dark:placeholder:text-outline" id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-on-surface-variant pl-1" htmlFor="phone">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#867461] dark:text-outline">phone_iphone</span>
                </div>
                <input required className="w-full h-12 pl-10 pr-4 bg-[#ede3b8]/50 dark:bg-surface-container-high border border-transparent dark:border-none rounded-xl text-[#1a1c1c] dark:text-on-surface font-normal text-[16px] focus:ring-2 focus:ring-[#f59e0b] dark:focus:ring-primary focus:bg-[#e2e2e2] dark:focus:bg-surface-container-highest transition-colors placeholder:text-[#d8c3ad] dark:placeholder:text-outline" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-on-surface-variant pl-1" htmlFor="email">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#867461] dark:text-outline">mail</span>
                </div>
                <input required className="w-full h-12 pl-10 pr-4 bg-[#ede3b8]/50 dark:bg-surface-container-high border border-transparent dark:border-none rounded-xl text-[#1a1c1c] dark:text-on-surface font-normal text-[16px] focus:ring-2 focus:ring-[#f59e0b] dark:focus:ring-primary focus:bg-[#e2e2e2] dark:focus:bg-surface-container-highest transition-colors placeholder:text-[#d8c3ad] dark:placeholder:text-outline" id="email" name="email" placeholder="Nhập email của bạn" type="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-on-surface-variant pl-1" htmlFor="dob">Ngày sinh</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#867461] dark:text-outline">calendar_today</span>
                </div>
                <input className="w-full h-12 pl-10 pr-4 bg-[#ede3b8]/50 dark:bg-surface-container-high border border-transparent dark:border-none rounded-xl text-[#1a1c1c] dark:text-on-surface font-normal text-[16px] focus:ring-2 focus:ring-[#f59e0b] dark:focus:ring-primary focus:bg-[#e2e2e2] dark:focus:bg-surface-container-highest transition-colors text-[#534434] dark:text-on-surface" id="dob" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[14px] leading-[20px] text-[#7c563d] dark:text-on-surface-variant pl-1">Giới tính</label>
              <div className="flex w-full rounded-xl bg-[#ede3b8]/50 dark:bg-surface-container-high p-1">
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gender: opt.value }))}
                    className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
                      formData.gender === opt.value
                        ? "bg-[#f59e0b] dark:bg-primary text-[#613b00] dark:text-on-primary shadow-sm"
                        : "text-[#7c563d] dark:text-on-surface-variant hover:text-[#534434] dark:hover:text-on-surface"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </main>

        {/* Fixed Bottom Action Area */}
        <div className="fixed bottom-0 w-full bg-[#ffffff] dark:bg-surface-container border-t border-[#e2e2e2] dark:border-surface-variant p-[20px] z-50 flex gap-[16px] justify-end items-center max-w-md mx-auto transition-colors duration-300">
          <button onClick={() => navigate(ROUTE_PATH.ACCOUNT)} className="h-12 px-6 rounded-xl font-semibold text-[14px] text-[#7c563d] dark:text-on-surface border border-[#867461] dark:border-outline hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors active:scale-95" type="button">
            Hủy
          </button>
          <button disabled={isLoading} className="flex-1 h-12 rounded-xl bg-[#f59e0b] dark:bg-primary-container text-[#613b00] dark:text-on-primary-container font-semibold text-[14px] shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-lg hover:bg-[#ffb95f] dark:hover:bg-primary transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50" form="profileForm" type="submit">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isLoading ? 'hourglass_empty' : 'check_circle'}
            </span>
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>

      </div>
    </div>
  );
}