"use client";

import Link from "next/link";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Globe, 
  Zap, 
  MessageSquare, 
  Phone, 
  Shield, 
  BarChart, 
  Users, 
  Settings,
  Package,
  Mail,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Link as LinkIcon,
  Layers,
  Box,
  Target,
  Cpu
} from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE } from "@/services/api";
import { useNavbarConfig } from "@/hooks/useNavbarConfig";
import { motion, AnimatePresence } from "framer-motion";

// Icon Mapper
const IconMapper = ({ iconName, className }: { iconName: string; className?: string }) => {
  const icons: Record<string, any> = {
    Zap,
    MessageSquare,
    Phone,
    Globe,
    Shield,
    BarChart,
    Users,
    Settings,
    Package,
    Mail,
    Smartphone,
    Link: LinkIcon,
    Layers,
    Box,
    Target,
    Cpu
  };
  const IconComponent = icons[iconName] || Zap;
  return <IconComponent className={className} />;
};

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const { config, loading } = useNavbarConfig();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-100/50 rounded-lg animate-pulse" />
          <div className="hidden lg:flex gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-20 bg-gray-100/50 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-32 bg-gray-100/50 rounded-full animate-pulse" />
        </div>
      </nav>
    );
  }

  const logoText = language === "en" ? config?.logoTextEn : config?.logoTextBn;
  const menuItems = config?.menu || [];
  const getImageUrl = (src: string) => {
    if (!src) return "";
    if (src.startsWith('http')) return src;
    if (src.startsWith('/images')) return src;
    return `${API_BASE}${src}`;
  };

  const logoSrc = config?.logoImage ? getImageUrl(config.logoImage) : null;

  const toggleLanguage = () => setLanguage(l => l === "en" ? "bn" : "en");

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group relative z-50">
            {logoSrc ? (
              <div className="relative">
                <img src={logoSrc} alt={logoText} className="h-10 w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-1" />
                <div className="absolute -inset-2 bg-pink-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                {logoText || "o-sms"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, idx) => {
              const itemType = item.type || (item.items && item.items.length > 0 ? 'dropdown' : 'link');
              return (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => itemType === 'dropdown' && setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {itemType === 'link' ? (
                  <Link
                    href={item.href || "#"}
                    className="px-5 py-2.5 rounded-full text-[14px] font-bold text-gray-600 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50/50"
                  >
                    {language === "en" ? item.titleEn : item.titleBn}
                  </Link>
                ) : (
                  <button
                    className={`px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-1.5 transition-all duration-500 ${
                      activeDropdown === idx ? "text-pink-600 bg-pink-50" : "text-gray-600 hover:text-pink-600 hover:bg-pink-50/50"
                    }`}
                  >
                    {language === "en" ? item.titleEn : item.titleBn}
                    <ChevronDown size={14} className={`transition-transform duration-500 ${activeDropdown === idx ? "rotate-180" : ""}`} />
                  </button>
                )}

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {itemType === 'dropdown' && activeDropdown === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 p-4 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50/30">
                        {item.items?.map((sub, sidx) => (
                          <Link
                            key={sidx}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group/item flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-pink-100"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 text-pink-500 group-hover/item:bg-gradient-to-br group-hover/item:from-pink-500 group-hover/item:to-rose-600 group-hover/item:text-white transition-all duration-500 shadow-sm">
                              <IconMapper iconName={sub.icon} className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-bold text-gray-900 group-hover/item:text-pink-600 transition-colors">
                                  {language === "en" ? sub.nameEn : sub.nameBn}
                                </span>
                                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-pink-600" />
                              </div>
                              <p className="text-[12px] leading-relaxed text-gray-500 group-hover/item:text-gray-600 line-clamp-2">
                                {language === "en" ? sub.descriptionEn : sub.descriptionBn}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {/* Dropdown Footer Area */}
                      <div className="bg-gray-50/80 p-5 px-8 flex justify-between items-center border-t border-gray-100">
                        <p className="text-[12px] text-gray-500 font-medium">
                          {language === "en" ? "Explore our comprehensive suite of messaging tools." : "আমাদের সব মেসেজিং টুলসগুলো দেখুন।"}
                        </p>
                        <Link href="/contact" className="group/link text-[12px] font-black text-pink-600 flex items-center gap-1 hover:gap-2 transition-all">
                          {language === "en" ? "Contact Sales" : "বিক্রয়ের জন্য যোগাযোগ করুন"}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );})}

            {/* Static Links */}
            <Link
              href="/packages"
              className="px-5 py-2.5 rounded-full text-[14px] font-bold text-gray-600 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50/50"
            >
              {language === "en" ? "Packages" : "প্যাকেজ"}
            </Link>
            <Link
              href="/docs"
              className="px-5 py-2.5 rounded-full text-[14px] font-bold text-gray-600 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50/50"
            >
              {language === "en" ? "Docs" : "ডকুমেন্টেশন"}
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full text-[14px] font-bold text-gray-600 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50/50"
            >
              {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
            </Link>
          </div>

          {/* Right Section: Language, Login & Mobile Toggle */}
          <div className="flex items-center gap-2 group relative z-50">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors group/lang"
            >
              <Globe size={16} className="text-gray-400 group-hover/lang:text-pink-500 transition-colors" />
              <span className="text-[13px] font-black text-gray-600">{language.toUpperCase()}</span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />

            <Link
              href="/login"
              className="hidden sm:block px-5 py-2 rounded-full text-[14px] font-black text-gray-600 hover:text-pink-600 transition-all"
            >
              {language === "en" ? "Sign In" : "লগইন"}
            </Link>
            
            <Link
              href="/user-register"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black transition-all shadow-xl shadow-pink-200/50 active:scale-95 text-[14px]"
            >
              {language === "en" ? "Free Trial" : "বিনামূল্যে ট্রায়াল"}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all ml-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {menuItems.map((item, idx) => {
                const itemType = item.type || (item.items && item.items.length > 0 ? 'dropdown' : 'link');
                return (
                <div key={idx} className="border-b border-gray-50 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-black text-gray-900">
                      {language === "en" ? item.titleEn : item.titleBn}
                    </p>
                    {itemType === 'link' && (
                      <Link href={item.href || "#"} onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-pink-50 text-pink-600">
                        <ArrowRight size={18} />
                      </Link>
                    )}
                  </div>
                  
                  {itemType === 'dropdown' && (
                    <div className="grid grid-cols-1 gap-2 pl-2">
                      {item.items?.map((sub, sidx) => (
                        <Link
                          key={sidx}
                          href={sub.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-pink-500">
                            <IconMapper iconName={sub.icon} className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{language === "en" ? sub.nameEn : sub.nameBn}</p>
                            <p className="text-[11px] text-gray-500">{language === "en" ? sub.descriptionEn : sub.descriptionBn}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );})}

              {/* Static Links Mobile */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                {[
                  { href: "/packages", labelEn: "Packages", labelBn: "প্যাকেজ" },
                  { href: "/docs", labelEn: "Docs", labelBn: "ডকুমেন্টেশন" },
                  { href: "/contact", labelEn: "Contact Us", labelBn: "যোগাযোগ করুন" },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg font-bold text-gray-700 group-hover:text-pink-600">{language === "en" ? link.labelEn : link.labelBn}</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                 <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-4 rounded-2xl bg-gray-50 text-gray-900 font-black text-sm"
                >
                  {language === "en" ? "Sign In" : "লগইন"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
