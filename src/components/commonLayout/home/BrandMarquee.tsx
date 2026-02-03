"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const BrandMarquee = () => {
  // You can later replace these with real logo URLs or components
  const brands = [
    "Kats",
    "Betfair",
    "ROBET.COM",
    "MetaSoft",
    "OWGAMING",
    "Play2OS",
    "X2 SYNDICATE",
    "ECLIVE",
    "ONEBET",
    "PizzaOs",
    "PayTrades",
    "CityAds",
    "UST Gaming",
    "help2my",
    "2J.COM",
    "Gecce",
  ];

  // Remove duplicates if you want cleaner list
  const uniqueBrands = Array.from(new Set(brands));

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-12">
          Thousands of Brands Rely on Laaffic
          <br className="sm:hidden" />
          to Power Potential Markets
        </h2>

        {/* Marquee Row 1 - Left */}
        <div className="relative">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            className="overflow-hidden"
          >
            {uniqueBrands.map((brand, idx) => (
              <div
                key={`row1-${brand}-${idx}`}
                className="mx-4 sm:mx-6 lg:mx-8 flex-shrink-0"
              >
                <div
                  className="group relative w-32 sm:w-36 h-14 flex items-center justify-center 
                           bg-white border border-gray-200 rounded-lg 
                           shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {brand}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Separator / subtle line */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

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
                className="mx-4 sm:mx-6 lg:mx-8 flex-shrink-0"
              >
                <div
                  className="group relative w-32 sm:w-36 h-14 flex items-center justify-center 
                           bg-white border border-gray-200 rounded-lg 
                           shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
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