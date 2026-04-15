"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { useFooterConfig } from "@/hooks/useFooterConfig";
import { useState } from "react";
import themeConfig from "@/data/themeConfig.json";

const iconMap: Record<string, React.ReactNode> = {
  Facebook: (
    <Facebook className="h-5 w-5 hover:opacity-80 transition-opacity" />
  ),
  Twitter: <Twitter className="h-5 w-5 hover:opacity-80 transition-opacity" />,
  Linkedin: (
    <Linkedin className="h-5 w-5 hover:opacity-80 transition-opacity" />
  ),
  Youtube: <Youtube className="h-5 w-5 hover:opacity-80 transition-opacity" />,
  Instagram: (
    <Instagram className="h-5 w-5 hover:opacity-80 transition-opacity" />
  ),
};

const Footer = () => {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const { config, loading } = useFooterConfig();

  if (loading) {
    return (
      <footer className="relative w-full bg-slate-900 py-20">
        <div className="max-w-[1300px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-6 gap-12">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </footer>
    );
  }

  if (!config) return null;

  const companyName = language === "en" ? config.company.nameEn : config.company.nameBn;
  const tagline = language === "en" ? config.company.taglineEn : config.company.taglineBn;
  const copyright = language === "en" ? config.company.copyrightEn : config.company.copyrightBn;

  return (
    <footer className="relative w-full bg-[#0a0a0c] text-white pt-24 pb-12 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className={`relative ${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding}`}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 sm:gap-16 mb-20">
          {/* Left Section - Brand & Socials */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-12">
            <Link href="/" className="mb-6 group">
              <span className="text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent transition-all">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-xs font-medium italic">
              "{tagline}"
            </p>

            {/* Social Icons with custom styling */}
            <div className="flex items-center gap-3">
              {config.socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-pink-600 border border-white/5 hover:border-pink-500 text-gray-400 hover:text-white transition-all duration-500 hover:-translate-y-1 group/social"
                  aria-label={social.name}
                >
                  <div className="scale-90 group-hover/social:scale-110 transition-transform">
                    {iconMap[social.icon] || <span>{social.icon}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections - Dynamically mapped */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {config.sections.map((section) => (
              <div key={section.titleEn} className="space-y-6">
                <h3 className="text-xs font-black text-gray-200 uppercase tracking-[0.2em]">
                  {language === "en" ? section.titleEn : section.titleBn}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-gray-400 hover:text-pink-400 transition-all duration-300 flex items-center gap-2 group/link"
                      >
                        <span className="w-0 h-px bg-pink-500 group-hover/link:w-2 transition-all duration-300" />
                        {language === "en" ? link.labelEn : link.labelBn}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-[12px] font-medium text-gray-500 tracking-wide text-center md:text-left">
              {copyright}
            </div>
            
            <div className="flex items-center gap-8">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  ENGLISH
                </button>
                <button 
                  onClick={() => setLanguage("bn")}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'bn' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  বাংলা
                </button>
              </div>

              {/* Back to top hint */}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[10px] font-black text-gray-500 hover:text-pink-500 transition-colors tracking-widest uppercase"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
