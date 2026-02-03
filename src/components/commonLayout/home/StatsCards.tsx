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
    <section className="py-16  bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl border border-gradient-to-r from-pink-500 to-purple-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Gradient border effect via pseudo-element */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  {stat.value}
                </h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
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