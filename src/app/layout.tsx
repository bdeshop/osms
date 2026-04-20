import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const API_BASE = "https://o-sms.com/backend";

async function getNavbarConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/frontend/navbar-config`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const navbarConfig = await getNavbarConfig();
  const faviconUrl = navbarConfig?.favicon
    ? navbarConfig.favicon.startsWith("http")
      ? navbarConfig.favicon
      : `${API_BASE}${navbarConfig.favicon}`
    : "/favicon.ico";

  return {
    title: "o-sms - SMS Gateway",
    description: "o-sms - Trusted SMS & Voice Marketing Solution Provider",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
