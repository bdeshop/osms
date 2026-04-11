import type { ReactNode } from "react";
import Header from "@/components/commonLayout/home/Header";
import Footer from "@/components/commonLayout/home/Footer";
import ChatWidget from "@/components/common/ChatWidget";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ChatWidget />
      <main className="flex-1">{children}</main>

      {/* the purple/blue chat bubble you showed */}
    </div>
  );
}
