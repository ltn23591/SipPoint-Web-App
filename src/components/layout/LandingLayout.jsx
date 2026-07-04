import { Outlet } from "react-router";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatbotAI } from "../common/ChatbotAI";

export function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotAI />
    </div>
  );
}

