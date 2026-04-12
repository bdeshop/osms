// components/TestimonialSlider.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { publicAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import { Loader } from "lucide-react";

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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader className="animate-spin text-pink-600" size={32} />
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Slider Card */}
          <div className="relative bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            {/* Testimonial Text */}
            <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-8 relative z-10">
              {current.quote}
            </blockquote>

            {/* Logo & Attribution */}
            <div className="flex flex-col items-center">
              <img
                src={`${API_BASE}${current.logoUrl}`}
                alt={current.attribution}
                className="h-12 object-contain mb-3"
              />
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                {current.attribution}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between mt-8 max-w-md mx-auto">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
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

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
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
