// components/ServicesGrid.tsx
"use client";

import React from "react";

const ServicesGrid = () => {
  const services = [
    { id: "sms", label: "SMS", icon: "✉️" },
    { id: "rcs", label: "RCS", icon: "💬" },
    { id: "mms", label: "MMS", icon: "📤" },
    { id: "two-way-sms", label: "Two-way SMS", icon: "🔄" },
    { id: "whatsapp", label: "WhatsApp", icon: "📱" },
    { id: "post-call-sms", label: "Post-call SMS", icon: "📞→✉️" },
    { id: "ai-group-call", label: "AI Group Call", icon: "🤖👥" },
    { id: "call-center", label: "Call Center", icon: "🎧" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Boosts the Global iGaming Business<br />
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Beyond Your Imagination
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative p-6 rounded-2xl border border-gradient-to-r from-pink-500 to-purple-500 bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center mb-4 text-xl">
                  {service.icon}
 </div>
                <h3 className="font-semibold text-gray-900">{service.label}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;