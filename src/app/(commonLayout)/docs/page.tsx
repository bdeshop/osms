"use client";

import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";
import PublicAPIDocumentation from "@/components/pages/PublicAPIDocumentation";

export const metadata = {
  title: "API Documentation",
  description:
    "o-sms API Documentation - Learn how to integrate with our SMS Gateway",
};

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PublicAPIDocumentation />
      </main>
      <Footer />
    </>
  );
}
