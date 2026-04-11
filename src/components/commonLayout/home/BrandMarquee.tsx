"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import brandsData from "@/data/brandsData.json";

const BrandMarquee = () => {
  const uniqueBrands = Array.from(new Set(brandsData.brands));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-10 lg:mb-12">
          {brandsData.heading}
          <br className="sm:hidden" />
          <span className="text-base sm:text-lg lg:text-xl text-gray-600">
            {" "}
            {brandsData.subheading}
          </span>
        </h2>

        {/* Marquee Row 1 - Left */}
        <div className="relative mb-6 sm:mb-8">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            className="overflow-hidden"
          >
            {uniqueBrands.map((brand, idx) => (
              <div
                key={`row1-${brand}-${idx}`}
                className="mx-2 sm:mx-3 lg:mx-4 flex-shrink-0"
              >
                <div
                  className="group relative w-24 sm:w-28 lg:w-32 h-10 sm:h-12 lg:h-14 flex items-center justify-center 
                           bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-lg 
                           shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <span className="relative text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors duration-300 text-center px-2">
                    {brand}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Separator */}
        <div className="my-6 sm:my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

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
                className="mx-2 sm:mx-3 lg:mx-4 flex-shrink-0"
              >
                <div
                  className="group relative w-24 sm:w-28 lg:w-32 h-10 sm:h-12 lg:h-14 flex items-center justify-center 
                           bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-lg 
                           shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <span className="relative text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors duration-300 text-center px-2">
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
