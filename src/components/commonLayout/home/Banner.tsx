"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader } from "lucide-react";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useBannerConfig } from "@/hooks/useBannerConfig";
import themeConfig from "@/data/themeConfig.json";
import { API_BASE } from "@/services/api";

const Banner = () => {
  const { config, loading } = useBannerConfig();
  const { displayedText } = useTypingAnimation(config?.typingWords || [], 100);
  const theme = themeConfig;

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-20 min-h-[600px] flex items-center justify-center">
        <Loader className="animate-spin text-pink-600" size={40} />
      </section>
    );
  }

  if (!config) return null;

  // Helper to handle image paths
  const getImageUrl = (src: string) => {
    if (src.startsWith('http') || src.startsWith('/images')) {
      return src;
    }
    return `${API_BASE}${src}`;
  };

  return (
    <section
      className={`relative w-full overflow-hidden bg-${theme.colors.background.white}`}
    >
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      <div
        className={`relative ${theme.spacing.container.maxWidth} mx-auto ${theme.spacing.container.padding}`}
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16 pt-12 sm:pt-16 lg:pt-20 min-h-[480px] lg:min-h-[600px]">
          {/* LEFT - Text Content */}
          <div
            className={`w-full lg:w-1/2 max-w-2xl text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8`}
          >
            <h1
              className={`${theme.fonts.heading.size.md} sm:${theme.fonts.heading.size.lg} lg:${theme.fonts.heading.size.xl} xl:${theme.fonts.heading.size["2xl"]} ${theme.fonts.heading.weight} text-${theme.colors.text.primary} ${theme.fonts.heading.lineHeight} tracking-tight`}
            >
              {config.title}
              <br className="hidden sm:block" />
              <span className={`text-${theme.colors.primary}`}>
                {config.subtitle}{" "}
                <span className="inline-block min-w-[180px] sm:min-w-[200px]">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </span>
              </span>
            </h1>

            <p
              className={`${theme.fonts.body.size.base} sm:${theme.fonts.body.size.lg} lg:${theme.fonts.body.size.xl} text-${theme.colors.text.secondary} ${theme.fonts.body.weight} max-w-xl mx-auto lg:mx-0`}
            >
              {config.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 pt-2 sm:pt-4">
              {config.buttons?.map((btn, idx) => (
                <Link key={idx} href={btn.href || "#"}>
                  <Button
                    size="lg"
                    variant={btn.variant === "primary" ? "default" : "outline"}
                    className={`w-full sm:w-auto min-w-[160px] sm:min-w-[180px] ${theme.fonts.button.size} lg:text-lg ${theme.fonts.button.weight} shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg ${
                      btn.variant === "primary"
                        ? theme.components.button.primary
                        : theme.components.button.outline
                    }`}
                  >
                    {btn.label}
                    {btn.variant === "primary" && (
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Icon Image */}
            <div className="flex justify-center lg:justify-start pt-2 sm:pt-4">
              {config.images?.icon && (
                <Image
                  src={getImageUrl(config.images.icon.src)}
                  alt={config.images.icon.alt || ""}
                  width={config.images.icon.width || 100}
                  height={config.images.icon.height || 100}
                  className="w-20 sm:w-24 h-20 sm:h-24 object-contain"
                />
              )}
            </div>
          </div>

          {/* RIGHT - Image */}
          <div className="w-full lg:w-1/2 max-w-xl lg:max-w-2xl relative">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-sm">
              {config.images?.banner && (
                <Image
                  src={getImageUrl(config.images.banner.src)}
                  alt={config.images.banner.alt || ""}
                  width={config.images.banner.width || 720}
                  height={config.images.banner.height || 600}
                  priority
                  className="w-full h-auto object-cover"
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>

            {/* Floating Badge */}
            <div
              className={`absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 bg-${theme.colors.primary} text-${theme.colors.text.white} px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-xs sm:text-sm lg:text-base font-bold`}
            >
              {config.badge?.text}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
