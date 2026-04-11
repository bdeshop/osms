/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { publicAPI } from "@/services/api";
import { API_BASE } from "@/services/api";

import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

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
        console.log("📥 Fetching news updates");
        const response = (await publicAPI.getNewsUpdates()) as any;
        console.log("✅ News updates fetched:", response.data);
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
        <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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
      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-10 tracking-tight drop-shadow-md">
          Latest Updates from o-sms
        </h2>

        {/* Navigation Arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous update"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next update"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
                {/* Image – Left on desktop */}
                <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-1">
                  <img
                    src={
                      slide.imageUrl.startsWith("http")
                        ? slide.imageUrl
                        : `${API_BASE}${slide.imageUrl}`
                    }
                    alt={slide.title}
                    className="max-w-xs sm:max-w-sm lg:max-w-md w-full object-contain rounded-lg sm:rounded-xl  transform transition duration-700 hover:scale-[1.02]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>

                {/* Text – Right on desktop */}
                <div
                  className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-2 animate-fade-in"
                  key={activeIndex}
                >
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3 sm:mb-4 tracking-tight drop-shadow-lg">
                    {slide.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {slide.description}
                  </p>

                  {/* Optional CTA */}
                  <div className="mt-6 sm:mt-8">
                    <Link
                      href="/"
                      className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-purple-700 font-semibold text-sm sm:text-base rounded-full shadow-lg hover:bg-purple-100 transition duration-300 transform hover:-translate-y-1"
                    >
                      Discover More →
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
        {updates.map((_, idx) => (
          <button
            key={idx}
            onClick={() => swiperRef.current?.slideToLoop(idx)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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
