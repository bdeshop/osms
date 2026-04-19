"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import themeConfig from "@/data/themeConfig.json";

// Update data (keep your structure)
const updates = [
  {
    id: 1,
    title:
      '2025 G2E Asia Laaffic Redefines Gaming Growth with "AI + SMS/Voice"',
    excerpt:
      'At the 2025 G2E Asia International Entertainment Expo, leading SMS and voice service provider Laaffic made a grand appearance in Manila, Philippines, delivering a keynote speech titled "SMS and Voice Driving Gaming Brand Growth" on the main stage. The presentation showcased its AI-powered communication solutions to global industry leaders....',
    image:
      "https://www.laaffic.com/d/file/p/2026/01-06/a545b6caf62f9ae4e8a2638a4d33795e.png", // ✅ Replace with your actual event photo
  },
  {
    id: 2,
    title: "Laaffic Launches Real-Time Delivery Analytics Dashboard",
    excerpt:
      "New dashboard gives enterprise clients live visibility into message delivery status, carrier routing, and regional performance — all in one unified interface.",
    image:
      "https://www.laaffic.com/d/file/p/2025/12-11/94a61f29af26ef0c711e67e8ed5e55bc.jpg",
  },
  {
    id: 3,
    title:
      "Partnership with Global Telecom Operator Expands Coverage to 195 Countries",
    excerpt:
      "Laaffic now supports SMS delivery in 195+ countries with 99.99% uptime SLA — the largest coverage footprint in the gaming vertical.",
    image:
      "https://www.laaffic.com/d/file/p/2026/01-21/9f628671bf6a8c2ea58293ea571b8f29.jpg",
  },
];

export default function LatestUpdatesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return;

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isAutoPlaying, updates.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % updates.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + updates.length) % updates.length);
    setIsAutoPlaying(false);
  };

  const current = updates[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-[#F5257D]">
      {/* Content */}
      <div
        className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding} py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24`}
      >
        {/* Headline */}
        <h2
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center`}
        >
          Latest updates from o-sms
        </h2>

        {/* Slider Container */}
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {/* LEFT: Text */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">
                {current.title}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
                {current.excerpt}
              </p>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 gap-1.5 sm:gap-2">
              {updates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to update ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <img
                src={current.image}
                alt={current.title}
                className="rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl object-cover w-full h-auto"
              />
              {/* Optional: subtle overlay for contrast */}
              <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-10 hidden lg:block">
          <button
            onClick={prevSlide}
            className="w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all group"
            aria-label="Previous update"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 text-white group-hover:scale-110" />
          </button>
        </div>
        <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-10 hidden lg:block">
          <button
            onClick={nextSlide}
            className="w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all group"
            aria-label="Next update"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 text-white group-hover:scale-110" />
          </button>
        </div>

        {/* Mobile Arrows (bottom center) */}
        <div className="lg:hidden flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          <button
            onClick={prevSlide}
            className="w-8 sm:w-10 h-8 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 sm:w-10 h-8 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Subtle floating elements for depth */}
      <div className="absolute top-20 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-bounce" />
    </section>
  );
}
