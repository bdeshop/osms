/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

type UpdateSlide = {
  title: string;
  description: string;
  image: string;
};

const updates: UpdateSlide[] = [
  {
    title: "2025 G2E Asia – Laaffic Redefines Gaming Growth",
    description:
      "At the 2025 G2E Asia International Entertainment Expo in Manila, Philippines, Laaffic delivered a powerful keynote: 'SMS and Voice Driving Gaming Brand Growth'. Showcasing AI-powered communication solutions including Two-way AI SMS and AI Agent Call for smarter customer acquisition and retention.",
    image: "https://www.laaffic.com/public/images/index/banner.png", // ← replace with real event photo if available
  },
  {
    title: "AI + SMS/Voice: Next-Gen Gaming Engagement",
    description:
      "Our presentation highlighted how AI-enhanced SMS and voice deliver personalized interactions, precise intent recognition, and localized deployment — empowering global gaming brands to overcome acquisition and retention challenges with intelligent tools.",
    image: "https://www.laaffic.com/public/images/index/banner.png",
  },
  {
    title: "Global Reach, Instant Impact",
    description:
      "Enterprise-grade infrastructure meets cutting-edge communication. Scale worldwide with high-delivery SMS, reliable voice, and AI-driven solutions trusted by thousands of partners across 200+ regions.",
    image: "https://www.laaffic.com/public/images/index/banner.png",
  },
];

const GlobalReachSection = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative w-full overflow-hidden text-white">
      {/* Vibrant Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#d946ef] via-[#a21caf] to-[#ec4899] opacity-95"
      />

      {/* Content Container */}
      <div className="relative container mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-14 tracking-tight drop-shadow-md">
          Latest Updates from Laaffic
        </h2>

        {/* Navigation Arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous update"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next update"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={
            !isPaused
              ? { delay: 5000, disableOnInteraction: false }
              : false
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
            <SwiperSlide key={idx}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
                {/* Image – Left on desktop */}
                <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-1">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-w-lg w-full object-contain rounded-xl shadow-2xl transform transition duration-700 hover:scale-[1.02]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>

                {/* Text – Right on desktop */}
                <div
                  className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-2 animate-fade-in"
                  key={activeIndex} // re-mount for animation trigger
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-5 md:mb-6 tracking-tight drop-shadow-lg">
                    {slide.title}
                  </h3>
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {slide.description}
                  </p>

                  {/* Optional CTA */}
                  <div className="mt-8">
                    <a
                      href="https://www.laaffic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-purple-100 transition duration-300 transform hover:-translate-y-1"
                    >
                      Discover More →
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Optional: Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {updates.map((_, idx) => (
          <button
            key={idx}
            onClick={() => swiperRef.current?.slideToLoop(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
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