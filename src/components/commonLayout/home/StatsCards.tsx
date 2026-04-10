// components/StatsCards.tsx
"use client";

const StatsCards = () => {
  const stats = [
    { value: "17+", label: "years of trusted industry experience" },
    { value: "1.5 billion+", label: "messages delivered monthly" },
    { value: "$4", label: "cost per lead" },
    { value: "5000+", label: "global businesses trust us" },
  ];

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-pink-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Gradient border effect via pseudo-element */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  {stat.value}
                </h3>
                <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCards;
