"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";
import ChatWidget from "@/components/common/ChatWidget";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
