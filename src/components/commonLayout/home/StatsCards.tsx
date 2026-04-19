// components/StatsCards.tsx
"use client";

import { useState, useEffect } from "react";
import { publicAPI } from "@/services/api";
import { Loader } from "lucide-react";
import themeConfig from "@/data/themeConfig.json";
import { useLanguage } from "@/context/LanguageContext";

interface Stat {
  _id: string;
  key: string;
  value: string;
  valueBn: string;
  label: string;
  labelBn: string;
  order: number;
  isActive: boolean;
}

const StatsCards = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await publicAPI.getHomepageStats()) as any;
        setStats(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch stats:", err);
        setError("Failed to load stats");
        // Fallback to empty array
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section
        className={`w-full py-8 sm:py-12 lg:py-16 bg-${themeConfig.colors.background.white}`}
      >
        <div
          className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding}`}
        >
          <div className="flex items-center justify-center">
            <Loader
              className={`animate-spin text-${themeConfig.colors.primary}`}
              size={32}
            />
          </div>
        </div>
      </section>
    );
  }

  if (error || stats.length === 0) {
    return null;
  }

  return (
    <section
      className={`w-full py-8 sm:py-12 lg:py-16 bg-${themeConfig.colors.background.white}`}
    >
      <div
        className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat._id || index}
              className={`relative p-2 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-pink-200 bg-${themeConfig.colors.background.white} shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Gradient border effect via pseudo-element */}
              <div
                className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${themeConfig.colors.gradient.primary} opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
              ></div>
              <div className="relative z-10">
                <h3
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.colors.gradient.primaryReverse}`}
                >
                  {language === "en" ? stat.value : stat.valueBn}
                </h3>
                <p
                  className={`mt-2 sm:mt-3 text-${themeConfig.colors.text.secondary} text-xs sm:text-sm lg:text-base leading-relaxed`}
                >
                  {language === "en" ? stat.label : stat.labelBn}
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
