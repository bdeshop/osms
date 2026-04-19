"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import brandsData from "@/data/brandsData.json";
import themeConfig from "@/data/themeConfig.json";

const BrandMarquee = () => {
  const uniqueBrands = Array.from(new Set(brandsData.brands));

  return (
    <section
      className={`py-12 sm:py-16 lg:py-20 bg-${themeConfig.colors.background.white}`}
    >
      <div
        className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding}`}
      >
        {/* Heading */}
        <h2
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-${themeConfig.colors.text.primary} mb-6 sm:mb-8 md:mb-10 lg:mb-12`}
        >
          {brandsData.heading}
          <br className="sm:hidden" />
          <span
            className={`text-sm sm:text-base md:text-lg lg:text-xl text-${themeConfig.colors.text.secondary}`}
          >
            {" "}
            {brandsData.subheading}
          </span>
        </h2>

        {/* Marquee Row 1 - Left */}
        <div className="relative mb-4 sm:mb-6 md:mb-8">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            className="overflow-hidden"
          >
            {uniqueBrands.map((brand, idx) => (
              <div
                key={`row1-${brand}-${idx}`}
                className="mx-1.5 sm:mx-2 md:mx-3 lg:mx-4 flex-shrink-0"
              >
                <div
                  className={`group relative w-20 sm:w-24 md:w-28 lg:w-32 h-12 sm:h-14 md:h-16 lg:h-16 flex items-center justify-center 
                           bg-gradient-to-br from-${themeConfig.colors.background.light} to-${themeConfig.colors.background.white} border-2 border-${themeConfig.colors.background.lighter} rounded-lg 
                           shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 overflow-hidden`}
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <span
                    className={`relative text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 group-hover:text-${themeConfig.colors.primary} transition-colors duration-300 text-center px-2 line-clamp-2`}
                  >
                    {brand}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Separator */}
        <div className="my-4 sm:my-6 md:my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Marquee Row 2 - Right */}
        <div className="relative">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            direction="right"
            className="overflow-hidden"
          >
            {uniqueBrands.map((brand, idx) => (
              <div
                key={`row2-${brand}-${idx}`}
                className="mx-1.5 sm:mx-2 md:mx-3 lg:mx-4 flex-shrink-0"
              >
                <div
                  className={`group relative w-20 sm:w-24 md:w-28 lg:w-32 h-12 sm:h-14 md:h-16 lg:h-16 flex items-center justify-center 
                           bg-gradient-to-br from-${themeConfig.colors.background.light} to-${themeConfig.colors.background.white} border-2 border-${themeConfig.colors.background.lighter} rounded-lg 
                           shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 overflow-hidden`}
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <span
                    className={`relative text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 group-hover:text-${themeConfig.colors.primary} transition-colors duration-300 text-center px-2 line-clamp-2`}
                  >
                    {brand}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
