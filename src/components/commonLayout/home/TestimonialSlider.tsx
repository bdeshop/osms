// components/TestimonialSlider.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      id: 1,
      quote:
        "Laaffic is an outstanding SMS marketing partner! Their technology is stable and efficient, and their customer service is attentive. Highly recommended!",
      logo: (
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          2J.COM
        </span>
      ),
      attribution: "Vera, 2J.com, Head of Business",
    },
    {
      id: 2,
      quote:
        "We’ve scaled our iGaming campaigns 3x using Laaffic’s AI-powered SMS. Delivery rates >99.8% and real-time analytics changed how we engage users.",
      logo: (
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          BETLIVE
        </span>
      ),
      attribution: "Raj, BetLive, CMO",
    },
    {
      id: 3,
      quote:
        "The Two-way AI SMS feature reduced our support tickets by 40% while increasing conversion on promo offers. Seamless integration and 24/7 support — truly enterprise-grade.",
      logo: (
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          PLAY2OS
        </span>
      ),
      attribution: "Sophia, Play2OS, Growth Lead",
    },
  ];

  // Auto-rotate every 5s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Slider Card */}
          <div className="relative bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            {/* Decorative quotes */}
         
            {/* Testimonial Text */}
            <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-8 relative z-10">

              {current.quote}   

            </blockquote>

            {/* Logo & Attribution */}
            <div className="flex flex-col items-center">
              {current.logo}
              <p className="mt-3 text-gray-600 text-sm md:text-base">{current.attribution}</p>
            </div>
            
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between mt-8 max-w-md mx-auto">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;