import ChatWidget from "@/components/common/ChatWidget";
import Navbar from "@/components/commonLayout/Navbar";
// import Footer from "@/components/commonLayout/footer/Footer";
import Banner from "@/components/commonLayout/home/Banner";
import BoostChannelsSection from "@/components/commonLayout/home/BoostChannelsSection";
import BrandMarquee from "@/components/commonLayout/home/BrandMarquee";
import Footer from "@/components/commonLayout/home/Footer";
import GlobalReachSection from "@/components/commonLayout/home/GlobalReachSection";
import LatestUpdatesSlider from "@/components/commonLayout/home/LatestUpdatesSlider";
import ServiceSlider from "@/components/commonLayout/home/ServiceSlider";
import { StartMessagingCTA } from "@/components/commonLayout/home/StartMessagingCTA";
import StatsCards from "@/components/commonLayout/home/StatsCards";
import TestimonialSlider from "@/components/commonLayout/home/TestimonialSlider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="">
        <Banner />
        <StatsCards />
        <GlobalReachSection />
        <BoostChannelsSection />
        <ChatWidget />
        {/* <ServiceSlider /> */}
        <BrandMarquee />
        <TestimonialSlider />
        <LatestUpdatesSlider />
        <StartMessagingCTA />

        <Footer />
      </main>
    </>
  );
}
