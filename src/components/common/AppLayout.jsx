import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router";
import { ChatbotAI } from "@/components/common/ChatbotAI";
import { customerService } from "@/services/customerService";
import { SocketProvider } from "@/contexts/SocketContext";

export function AppLayout() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tableId = searchParams.get("tableId") || localStorage.getItem("tableId");
    const zoneId = searchParams.get("zoneId") || localStorage.getItem("zoneId");
    
    const queryTableId = searchParams.get("tableId");
    const queryZoneId = searchParams.get("zoneId");
    
    if (queryTableId) {
      localStorage.setItem("tableId", queryTableId);
    }
    if (queryZoneId) {
      localStorage.setItem("zoneId", queryZoneId);
    }

    if (tableId) {
      customerService.getTableInfo(tableId)
        .then((table) => {
          if (table && table.name) {
            localStorage.setItem("tableName", table.name);
            window.dispatchEvent(new Event("tableNameUpdated"));
          }
        })
        .catch((err) => console.error("Error fetching table info:", err));
    }
  }, [searchParams]);

  return (
    <SocketProvider>
      <Outlet />
      <ChatbotAI />
    </SocketProvider>
  );
}
