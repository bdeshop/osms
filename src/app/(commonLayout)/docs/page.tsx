"use client";

import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";
import PublicAPIDocumentation from "@/components/pages/PublicAPIDocumentation";

export default function DocsPage() {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        <PublicAPIDocumentation />
      </main>
      {/* <Footer /> */}
    </>
  );
}
