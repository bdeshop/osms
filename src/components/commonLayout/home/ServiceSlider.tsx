"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
// Optional: if you want fade effect
import "swiper/css/effect-fade";

type Slide = {
  title: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Service Solution",
    description:
      "AI Group Call with Post-call SMS and Call Center products intelligently routes calls to human customer service based on user responses, greatly enhancing marketing effectiveness and service efficiency.",
    image: "https://www.laaffic.com/public/images/index/i_31.png",
  },
  {
    title: "Powerful Analytics",
    description:
      "Monitor your campaign performance in real-time with detailed insights and analytics for informed decision making.",
    image: "https://www.laaffic.com/public/images/index/i_33.png",
  },
  {
    title: "Global Reach",
    description:
      "Scale effortlessly with enterprise-grade infrastructure supporting global traffic and instant customer connections.",
    image: "https://www.laaffic.com/public/images/index/i_32.png",
  },
];

const ServiceSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Optional: pause autoplay when user interacts / focuses
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  return (
    <section className="relative w-full py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          {/* Left – Text + Controls */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div
              className="transition-all duration-500 ease-out min-h-[180px] sm:min-h-[220px]"
              aria-live="polite"
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4 md:mb-5">
                {slides[activeIndex].title}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {slides[activeIndex].description}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                ref={prevRef}
                aria-label="Previous slide"
                onClick={() => swiper?.slidePrev()}
                onMouseEnter={() => setAutoplayEnabled(false)}
                onMouseLeave={() => setAutoplayEnabled(true)}
                onFocus={() => setAutoplayEnabled(false)}
                onBlur={() => setAutoplayEnabled(true)}
                className="p-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                ref={nextRef}
                aria-label="Next slide"
                onClick={() => swiper?.slideNext()}
                onMouseEnter={() => setAutoplayEnabled(false)}
                onMouseLeave={() => setAutoplayEnabled(true)}
                onFocus={() => setAutoplayEnabled(false)}
                onBlur={() => setAutoplayEnabled(true)}
                className="p-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Counter */}
              <div className="ml-3 text-sm font-medium text-gray-500 tabular-nums">
                <span className="text-gray-900">{`0${activeIndex + 1}`}</span>
                <span className="mx-1.5 text-gray-400">/</span>
                <span className="text-gray-500">{`0${slides.length}`}</span>
              </div>
            </div>
          </div>

          {/* Right – Image */}
          <div className="lg:w-1/2 order-1 lg:order-2 mb-10 lg:mb-0">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-auto max-w-[520px] mx-auto lg:mx-0">
              <img
                src={slides[activeIndex].image}
                alt={slides[activeIndex].title}
                className="w-full h-full object-contain transition-opacity duration-500"
                loading="eager" // or "lazy" if below the fold
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invisible Swiper – controls timing & swipe */}
      <Swiper
        modules={[Autoplay, Controller]}
        autoplay={
          autoplayEnabled
            ? { delay: 6800, disableOnInteraction: false }
            : false
        }
        loop
        speed={700}
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        controller={{ control: undefined }} // optional
        className="!hidden"
      >
        {slides.map((_, idx) => (
          <SwiperSlide key={idx} />
        ))}
      </Swiper>
    </section>
  );
};

export default ServiceSlider;