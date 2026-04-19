import PackagesPage from "@/components/public/PackagesPage";
import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";

export const metadata = {
  title: "SMS Packages - SMS Gateway",
  description: "Browse and select from our SMS messaging packages",
};

export default function PackagesPageRoute() {
  return (
    <>
      <Navbar />
      <PackagesPage />
      <Footer />
    </>
  );
}
