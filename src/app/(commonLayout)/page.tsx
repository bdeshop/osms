import Banner from "@/components/commonLayout/home/Banner";
import BoostChannelsSection from "@/components/commonLayout/home/BoostChannelsSection";
import BrandMarquee from "@/components/commonLayout/home/BrandMarquee";
import GlobalReachSection from "@/components/commonLayout/home/GlobalReachSection";
import LatestUpdatesSlider from "@/components/commonLayout/home/LatestUpdatesSlider";
import ServiceSlider from "@/components/commonLayout/home/ServiceSlider";
import { StartMessagingCTA } from "@/components/commonLayout/home/StartMessagingCTA";
import StatsCards from "@/components/commonLayout/home/StatsCards";
import TestimonialSlider from "@/components/commonLayout/home/TestimonialSlider";


export default function Home() {
  return (
    <main className="py-10">
      <Banner />
      <StatsCards/>
      <GlobalReachSection/>
      <BoostChannelsSection/>
      <ServiceSlider/>
      <BrandMarquee/>
      <TestimonialSlider/>
      <StartMessagingCTA/>
    </main>
  );
}