"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { publicAPI } from "@/services/api";
import { API_BASE } from "@/services/api";
import { Loader } from "lucide-react";
import * as LucideIcons from "lucide-react";
import themeConfig from "@/data/themeConfig.json";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceChannel {
  _id: string;
  name: string;
  nameBn: string;
  icon: string;
  iconType: "lucide" | "image" | "emoji";
  order: number;
  isActive: boolean;
}

const ServicesGrid = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState<ServiceChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📥 Fetching service channels");
        const response = (await publicAPI.getServiceChannels()) as any;
        console.log("✅ Service channels fetched:", response.data);
        setServices(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch service channels:", err);
        setError("Failed to load services");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={20} />;
    }
    return iconName;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  if (loading) {
    return (
      <section
        className={`py-12 sm:py-16 lg:py-20 bg-${themeConfig.colors.background.white}`}
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

  if (error || services.length === 0) {
    return null;
  }

  return (
    <section
      className={`py-12 sm:py-16 lg:py-20 bg-${themeConfig.colors.background.white}`}
    >
      <div
        className={`${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding}`}
      >
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-${themeConfig.colors.text.primary} mb-2 sm:mb-3`}
          >
            Boosts the Global iGaming Business
          </h2>
          <p
            className={`text-lg sm:text-xl lg:text-2xl bg-gradient-to-r ${themeConfig.colors.gradient.primary} bg-clip-text text-transparent font-bold`}
          >
            Beyond Your Imagination
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        >
          {services.map((service, idx) => (
            <motion.div
              key={service._id || idx}
              variants={itemVariants}
              className="group relative"
            >
              {/* Gradient background blur effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10"></div>

              {/* Card */}
              <div
                className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-${themeConfig.colors.border} bg-${themeConfig.colors.background.white} shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-transparent overflow-hidden h-full flex flex-col items-center justify-center`}
              >
                {/* Animated gradient border on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${themeConfig.colors.gradient.primary} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center mb-2 sm:mb-3 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {service.iconType === "image" ? (
                      <img
                        src={
                          service.icon.startsWith("http")
                            ? service.icon
                            : service.icon.startsWith("/images")
                              ? service.icon
                              : `${API_BASE}${service.icon.startsWith("/") ? "" : "/"}${service.icon}`
                        }
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : service.iconType === "lucide" ? (
                      getIconComponent(service.icon)
                    ) : (
                      service.icon
                    )}
                  </div>
                  <h3
                    className={`font-semibold text-sm sm:text-base text-${themeConfig.colors.text.primary} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}
                  >
                    {language === "en" ? service.name : service.nameBn}
                  </h3>
                </div>

                {/* Shine effect */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;
