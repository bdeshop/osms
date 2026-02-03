// components/ChallengeSection.tsx
import React from "react";

export default function ChallengeSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            With <span className="text-pink-600">Intense Competition</span>,{" "}
            <span className="text-pink-600">How to Stand Out?</span>
          </h2>
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1 - Orange */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-400 to-yellow-400 text-white">
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              {/* Illustration placeholder */}
              <div className="mb-6 w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                <svg
                  className="w-full h-full opacity-90"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simple ladder / competition illustration */}
                  <rect x="80" y="140" width="40" height="20" rx="4" fill="white" opacity="0.3" />
                  <rect x="60" y="100" width="80" height="20" rx="4" fill="white" opacity="0.5" />
                  <rect x="40" y="60" width="120" height="20" rx="4" fill="white" opacity="0.7" />
                  <rect x="20" y="20" width="160" height="20" rx="4" fill="white" />
                  <circle cx="100" cy="30" r="12" fill="#fefcbf" />
                  <path
                    d="M100 18 L106 26 L114 26 L108 32 L110 42 L100 36 L90 42 L92 32 L86 26 L94 26 Z"
                    fill="#facc15"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                Intense industry competition <br /> and high costs
              </h3>
              <p className="text-base md:text-lg opacity-95 max-w-md">
                Intense industry competition and high costs
              </p>
            </div>
          </div>

          {/* Card 2 - Purple */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              <div className="mb-6 w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                <svg
                  className="w-full h-full opacity-90"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Clock / long cycle illustration */}
                  <circle cx="100" cy="100" r="80" fill="white" fillOpacity="0.2" />
                  <circle cx="100" cy="100" r="65" fill="white" fillOpacity="0.15" />
                  <rect x="95" y="40" width="10" height="60" rx="5" fill="white" />
                  <circle cx="100" cy="100" r="8" fill="white" />
                  <path d="M100 100 L140 80" stroke="white" strokeWidth="10" strokeLinecap="round" />
                  <text
                    x="100"
                    y="140"
                    fontSize="40"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="white"
                    opacity="0.9"
                  >
                    3
                  </text>
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                Long preparation cycle for marketing <br /> content
              </h3>
              <p className="text-base md:text-lg opacity-95 max-w-md">
                Long preparation cycle for marketing content
              </p>
            </div>
          </div>

          {/* Card 3 - Red/Orange */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-red-400 to-orange-500 text-white">
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              <div className="mb-6 w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                <svg
                  className="w-full h-full opacity-90"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Audience / megaphone illustration */}
                  <path
                    d="M40 80 Q100 20 160 80 L160 140 Q100 180 40 140 Z"
                    fill="white"
                    fillOpacity="0.35"
                  />
                  <circle cx="100" cy="100" r="30" fill="white" />
                  <path
                    d="M100 70 L130 100 L100 130 L70 100 Z"
                    fill="#fecaca"
                    opacity="0.9"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                Broad audience, leading to <br /> ineffective marketing
              </h3>
              <p className="text-base md:text-lg opacity-95 max-w-md">
                Broad audience, leading to ineffective marketing
              </p>
            </div>
          </div>

          {/* Card 4 - Yellow/Orange */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <div className="p-8 md:p-10 h-full flex flex-col items-center text-center">
              <div className="mb-6 w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                <svg
                  className="w-full h-full opacity-90"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Dashboard / data lag illustration */}
                  <rect x="40" y="60" width="120" height="80" rx="8" fill="white" fillOpacity="0.25" />
                  <path
                    d="M50 100 Q80 70 110 110 Q140 90 160 120"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="80" cy="100" r="6" fill="#fde68a" />
                  <circle cx="110" cy="110" r="6" fill="#fde68a" />
                  <circle cx="140" cy="90" r="6" fill="#fde68a" />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                Data Lag, Slow Strategy <br /> Adjustments
              </h3>
              <p className="text-base md:text-lg opacity-95 max-w-md">
                Data Lag, Slow Strategy Adjustments
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}