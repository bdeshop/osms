"use client";

import Link from "next/link";
import Logo from "@/shared/Logo/Logo";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import footerData from "@/data/footerData.json";

const iconMap: Record<string, React.ReactNode> = {
  Facebook: (
    <Facebook className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
  ),
  Twitter: (
    <Twitter className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
  ),
  Linkedin: (
    <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
  ),
  Youtube: (
    <Youtube className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
  ),
};

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-r from-[#ff2d95] to-[#d946ef] text-white overflow-hidden">
      {/* Optional subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
        {/* Top section with logo + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16">
          {/* Logo + Tagline + Socials */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Logo />
            <p className="text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-6">
              {footerData.company.tagline}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 sm:gap-5">
              {footerData.socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  aria-label={social.name}
                >
                  {iconMap[social.icon]}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerData.sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/20 pt-6 sm:pt-8 mt-8 sm:mt-12">
          {/* Newsletter Input */}
          <div className="mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base"
              />
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm sm:text-base whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          <div className="text-center text-xs sm:text-sm opacity-90">
            {footerData.company.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
