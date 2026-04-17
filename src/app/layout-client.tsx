"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { ReactNode } from "react";

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
