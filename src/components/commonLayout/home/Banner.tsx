// components/Banner.tsx
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";

const Banner = () => {
  const { displayedText } = useTypingAnimation(
    ["Forward", "Upward", "Onward"],
    100,
  );

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16 py-12 sm:py-16 lg:py-20 min-h-[480px] lg:min-h-[600px]">
          {/* LEFT - Text Content */}
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Laaffic SMS & Voice
              <br className="hidden sm:block" />
              <span className="text-pink-600">
                Drives Your Brand{" "}
                <span className="inline-block min-w-[180px] sm:min-w-[200px]">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium max-w-xl mx-auto lg:mx-0">
              Trusted iGaming Marketing Solution Provider
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 pt-2 sm:pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] bg-pink-600 hover:bg-pink-700 text-white text-sm sm:text-base lg:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg"
              >
                Contact Experts
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] border-2 border-pink-600 text-pink-600 hover:bg-pink-50 hover:text-pink-700 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 rounded-lg"
              >
                Free Trial
              </Button>
            </div>

            {/* Icon Image */}
            <div className="flex justify-center lg:justify-start pt-2 sm:pt-4">
              <Image
                src="https://www.laaffic.com/public/images/index/icon.svg"
                alt="Laaffic Icon"
                width={100}
                height={100}
                className="w-20 sm:w-24 h-20 sm:h-24 object-contain"
              />
            </div>
          </div>

          {/* RIGHT - Image */}
          <div className="w-full lg:w-1/2 max-w-xl lg:max-w-2xl relative">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-sm">
              <Image
                src="https://www.laaffic.com/public/images/index/banner.png"
                alt="Laaffic SMS & Voice - iGaming marketing dashboard and communication tools"
                width={720}
                height={600}
                priority
                className="w-full h-auto object-cover"
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-xs sm:text-sm lg:text-base font-bold">
              Trusted by Top iGaming Brands
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
