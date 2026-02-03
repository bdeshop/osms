// components/SMSMarketingGains.tsx
import React from "react";

export default function SMSMarketingGains() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Main Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            SMS Marketing Gains{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Significant Commercial Value
            </span>
          </h2>
        </div>

        {/* Two Cards Grid */}
        <div className="grid   gap-8 lg:gap-10">
          {/* Card 1 – Ultra-low Cost */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  Ultra-low Marketing Cost,<br />Lightweight Launch
                </h3>
                <p className="text-base md:text-lg opacity-95">
                  Compared to other online marketing methods, Laafic's SMS marketing offers
                  a customer conversion cost as low as $4.
                </p>
              </div>

              {/* Illustration */}
              <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <img
                  src="https://thumbs.dreamstime.com/b/businessman-holding-growing-graph-success-future-businessman-confidently-holds-glowing-upward-arrow-symbolizing-growth-375212362.jpg"
                  alt="Businessman with rising growth arrow and success"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Card 2 – One-click Bulk Sending */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl">
            <div className="p-8 md:p-10 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  One-click Bulk Sending<br />of Marketing Texts
                </h3>
                <p className="text-base md:text-lg opacity-95">
                  The Laafic marketing platform can be integrated via API, and some products
                  have SDK components available for seamless integration.
                </p>
              </div>

              {/* Illustration */}
              <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <img
                  src="https://thumbs.dreamstime.com/b/laptop-chat-messaging-speech-bubbles-flat-design-online-conversation-concept-181673514.jpg"
                  alt="Laptop with chat messaging bubbles bulk SMS"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}