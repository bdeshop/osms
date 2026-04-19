// components/TestimonialSlider.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { publicAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import { Loader } from "lucide-react";
import themeConfig from "@/data/themeConfig.json";

interface Testimonial {
  _id: string;
  quote: string;
  logoUrl: string;
  attribution: string;
  order: number;
  isActive: boolean;
}

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📥 Fetching testimonials");
        const response = (await publicAPI.getTestimonials()) as any;
        console.log("✅ Testimonials fetched:", response.data);
        setTestimonials(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch testimonials:", err);
        setError("Failed to load testimonials");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate every 5s
  useEffect(() => {
    if (testimonials.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  if (loading) {
    return (
      <section
        className={`py-12 sm:py-16 md:py-20 lg:py-24 bg-${themeConfig.colors.background.white}`}
      >
        <div
          className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding} flex items-center justify-center`}
        >
          <Loader
            className={`animate-spin text-${themeConfig.colors.primary}`}
            size={32}
          />
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section
      className={`py-12 sm:py-16 md:py-20 lg:py-24 bg-${themeConfig.colors.background.white}`}
    >
      <div
        className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Slider Card */}
          <div
            className={`relative bg-${themeConfig.colors.background.light} rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-sm border border-${themeConfig.colors.border}`}
          >
            {/* Testimonial Text */}
            <blockquote
              className={`text-sm sm:text-base md:text-lg lg:text-xl text-${themeConfig.colors.text.primary} leading-relaxed italic mb-4 sm:mb-6 md:mb-8 relative z-10 line-clamp-4 sm:line-clamp-none`}
            >
              "{current.quote}"
            </blockquote>

            {/* Logo & Attribution */}
            <div className="flex flex-col items-center">
              <img
                src={
                  current.logoUrl?.startsWith("http")
                    ? current.logoUrl
                    : current.logoUrl?.startsWith("/images")
                      ? current.logoUrl
                      : `${API_BASE}${current.logoUrl}`
                }
                alt={current.attribution}
                className="h-8 sm:h-10 md:h-12 object-contain mb-2 sm:mb-3"
              />
              <p
                className={`mt-2 sm:mt-3 text-${themeConfig.colors.text.secondary} text-xs sm:text-sm md:text-base`}
              >
                {current.attribution}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-6 sm:mt-8 md:mt-10 max-w-md mx-auto gap-2 sm:gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-${themeConfig.colors.background.lighter} hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? `bg-${themeConfig.colors.text.primary}`
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-${themeConfig.colors.background.lighter} hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
