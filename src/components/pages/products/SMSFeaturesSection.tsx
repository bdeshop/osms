// components/SMSFeaturesSection.tsx
"use client";

import React, { useState } from "react";

type Feature = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function SMSFeaturesSection() {
  const features: Feature[] = [
    {
      title: "Marketing SMS",
      description:
        "Send out compelling promotional messages at strategic moments throughout the year to keep your customers engaged and boost sales through SMS.",
      imageUrl:
        "https://thumbs.dreamstime.com/b/chat-messages-computer-online-vector-illustration-flat-cartoon-workspace-working-desk-laptop-pc-chatting-bubble-152678570.jpg",
    },
    {
      title: "Verification SMS",
      description:
        "Protect your customers at any stage of their journey with convenient SMS authentication.",
      imageUrl:
        "https://thumbs.dreamstime.com/b/otp-authentication-secure-verification-one-time-password-transaction-digital-payment-vector-illustration-bank-details-257891893.jpg",
    },
    {
      title: "Reminders & Notifications SMS",
      description:
        "Send SMS reminders before scheduled appointments, helping reduce no-shows by keeping the appointment top-of-mind for your customers.",
      imageUrl:
        "https://thumbs.dreamstime.com/b/man-planning-adding-event-calendar-application-man-planning-day-scheduling-appointments-cell-phone-calendar-application-231382317.jpg",
    },
  ];

  const [activeFeature, setActiveFeature] = useState<Feature>(features[0]);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            SMS Does More Than You Think
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how SMS will help you deliver the fastest messages, offer fraud protection,
            personalize messaging and more.
          </p>
        </div>

        {/* Main Illustration + Features Grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Dynamic Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-lg aspect-square relative transition-opacity duration-500">
              <img
                key={activeFeature.title} // key forces re-mount for fade effect
                src={activeFeature.imageUrl}
                alt={`${activeFeature.title} illustration`}
                className="w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 opacity-100"
              />
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="space-y-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                onClick={() => setActiveFeature(feature)}
                className={`
                  group cursor-pointer rounded-2xl p-6 md:p-8 transition-all duration-300 border
                  ${
                    activeFeature.title === feature.title
                      ? "bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.02]"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/50"
                  }
                `}
              >
                <h3
                  className={`
                    text-2xl md:text-3xl font-bold mb-3
                    ${activeFeature.title === feature.title ? "text-white" : "text-gray-900 group-hover:text-blue-700"}
                  `}
                >
                  {feature.title}
                </h3>
                <p
                  className={`
                    text-base md:text-lg leading-relaxed
                    ${activeFeature.title === feature.title ? "text-blue-100" : "text-gray-600 group-hover:text-gray-800"}
                  `}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}