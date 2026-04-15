"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import footerData from "@/data/footerData.json";
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
};

const Footer = () => {
  return (
    <footer
      className={`relative w-full bg-gradient-to-r ${themeConfig.colors.gradient.primary} text-white overflow-hidden`}
    >
      <div
        className={`relative ${themeConfig.spacing.container.maxWidth} mx-auto ${themeConfig.spacing.container.padding} pt-12 sm:pt-16 lg:pt-20 pb-3`}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Left Section - Logo & Tagline & Socials */}
          <div className="lg:col-span-1 flex flex-col items-start">
            {/* o-sms Logo */}
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              o-sms
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mb-6 leading-relaxed">
              {footerData.company.tagline}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {footerData.socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-white/80 hover:text-white transition-colors duration-300"
                >
                  {iconMap[social.icon]}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections - 5 columns */}
          {footerData.sections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Divider & Copyright */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <div className="text-center text-xs sm:text-sm text-white/80">
            {footerData.company.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
