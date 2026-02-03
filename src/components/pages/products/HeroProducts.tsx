// components/Banner.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { ArrowRight } from "lucide-react"; // optional icon for CTA

const HeroProducts = () => {
  return (
    <section className="relative  overflow-hidden">


      <div className="relative container mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 min-h-[480px] lg:min-h-[600px]">
          {/* LEFT - Text Content */}
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left space-y-6 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Laaffic SMS & Voice
              <br className="hidden sm:block" />
              <span className="text-pink-600">Drives Your Brand Forward</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-xl mx-auto lg:mx-0">
              Trusted iGaming Marketing Solution Provider
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
              <Button
                size="lg"
                className="min-w-[180px] bg-pink-600 hover:bg-pink-700 text-white text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                Contact Experts
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="min-w-[180px] border-2 border-pink-600 text-pink-600 hover:bg-pink-50 hover:text-pink-700 text-base sm:text-lg font-semibold transition-all duration-300"
              >
                Free Trial
              </Button>
            </div>

            {/* Optional trust signals / small stats - uncomment if relevant */}
            {/* <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-gray-500">
              <div>99.9% Delivery Rate</div>
              <div>200+ Countries Covered</div>
              <div>24/7 Support</div>
            </div> */}
          </div>

          {/* RIGHT - Image */}
          <div className="w-full lg:w-1/2 max-w-xl lg:max-w-2xl relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-pink-200/30 border border-gray-100 bg-white/50 backdrop-blur-sm">
              <Image
                src="https://www.laaffic.com/public/images/index/banner.png"
                alt="Laaffic SMS & Voice - iGaming marketing dashboard and communication tools"
                width={720}
                height={600}
                priority
                className="w-full h-auto object-cover"
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Optional floating badge / accent - remove or customize */}
            <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg text-sm sm:text-base font-bold">
              Trusted by Top iGaming Brands
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default HeroProducts;