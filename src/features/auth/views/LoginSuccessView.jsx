import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const id = searchParams.get("id");

    if (token) {
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email || "",
          fullName: name || "",
          _id: id || "",
        })
      );

      // Kích hoạt sự kiện để các component khác cập nhật trạng thái
      window.dispatchEvent(new Event("authChange"));

      toast.success("Đăng nhập thành công!");
      
      // Chuyển hướng về trang Menu
      navigate("/menu");
    } else {
      toast.error("Đăng nhập thất bại hoặc liên kết hết hiệu lực!");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm font-medium text-zinc-500">Đang xử lý đăng nhập...</p>
    </div>
  );
}
