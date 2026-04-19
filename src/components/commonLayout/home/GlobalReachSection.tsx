/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { publicAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import themeConfig from "@/data/themeConfig.json";
import { useLanguage } from "@/context/LanguageContext";
import "swiper/css";
import "swiper/css/navigation";

type NewsUpdateItem = {
  _id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
};

const GlobalReachSection = () => {
  const { language } = useLanguage();
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [updates, setUpdates] = useState<NewsUpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsUpdates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await publicAPI.getNewsUpdates()) as any;
        setUpdates(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch news updates:", err);
        setError("Failed to load news updates");
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsUpdates();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d946ef] via-[#a21caf] to-[#ec4899] opacity-95" />
        <div
          className={`relative ${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding} flex items-center justify-center`}
        >
          <Loader className="animate-spin text-white" size={40} />
        </div>
      </section>
    );
  }

  if (error || updates.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden text-white">
      {/* Vibrant Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d946ef] via-[#a21caf] to-[#ec4899] opacity-95" />

      {/* Content Container */}
      <div
        className={`relative ${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding} py-8 sm:py-12 md:py-16 lg:py-20`}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 tracking-tight drop-shadow-md">
          Latest Updates from o-sms
        </h2>

        {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous update"
          className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg items-center justify-center"
        >
          <ChevronLeft className="w-4 sm:w-5 md:w-6" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next update"
          className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg items-center justify-center"
        >
          <ChevronRight className="w-4 sm:w-5 md:w-6" />
        </button>

        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={
            !isPaused ? { delay: 5000, disableOnInteraction: false } : false
          }
          loop
          speed={700}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {updates.map((slide, idx) => (
            <SwiperSlide key={slide._id || idx}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12 py-4 sm:py-6 md:py-8">
                {/* Image – Left on desktop */}
                <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-1">
                  <img
                    src={
                      slide.imageUrl.startsWith("http")
                        ? slide.imageUrl
                        : slide.imageUrl.startsWith("/images")
                          ? slide.imageUrl
                          : `${API_BASE}${slide.imageUrl}`
                    }
                    alt={slide.title}
                    className="max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md w-full object-contain rounded-lg sm:rounded-xl transform transition duration-700 hover:scale-[1.02]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>

                {/* Text – Right on desktop */}
                <div
                  className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-2 animate-fade-in px-2 sm:px-0"
                  key={activeIndex}
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold mb-2 sm:mb-3 md:mb-4 tracking-tight drop-shadow-lg line-clamp-2">
                    {language === "en" ? slide.title : slide.titleBn}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-3 sm:line-clamp-none">
                    {language === "en"
                      ? slide.description
                      : slide.descriptionBn}
                  </p>

                  {/* Optional CTA */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 md:gap-3 z-10">
        {updates.map((_, idx) => (
          <button
            key={idx}
            onClick={() => swiperRef.current?.slideToLoop(idx)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default GlobalReachSection;
