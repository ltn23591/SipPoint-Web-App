import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router";
import { ChatbotAI } from "@/components/common/ChatbotAI";

export function AppLayout() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tableId = searchParams.get("tableId");
    const zoneId = searchParams.get("zoneId");
    if (tableId) {
      localStorage.setItem("tableId", tableId);
    }
    if (zoneId) {
      localStorage.setItem("zoneId", zoneId);
    }
  }, [searchParams]);

  return (
    <>
      <Outlet />
      <ChatbotAI />
    </>
  );
}
