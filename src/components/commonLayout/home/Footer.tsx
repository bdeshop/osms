"use client";

import Link from "next/link";
import Logo from "@/shared/Logo/Logo"; // Assuming you have this component
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

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
            <Logo /> {/* Adjust size as needed */}
            <p className="text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-6">
              Drives your brand forward
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 sm:gap-5">
              <Link
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                aria-label="X / Twitter"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Messaging */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
              Messaging
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/messaging/sms" className="hover:underline">
                  SMS
                </Link>
              </li>
              <li>
                <Link href="/messaging/rcs" className="hover:underline">
                  RCS
                </Link>
              </li>
              <li>
                <Link href="/messaging/mms" className="hover:underline">
                  MMS
                </Link>
              </li>
              <li>
                <Link href="/messaging/two-way" className="hover:underline">
                  Two-way
                </Link>
              </li>
              <li>
                <Link href="/messaging/whatsapp" className="hover:underline">
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Voice */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
              Voice
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/voice/post-call-sms" className="hover:underline">
                  Post-call SMS
                </Link>
              </li>
              <li>
                <Link href="/voice/ai-group-call" className="hover:underline">
                  AI Group Call
                </Link>
              </li>
              <li>
                <Link href="/voice/group-call" className="hover:underline">
                  Group Call
                </Link>
              </li>
              <li>
                <Link href="/voice/call-center" className="hover:underline">
                  Call Center
                </Link>
              </li>
              <li>
                <Link href="/voice/sip-trunk" className="hover:underline">
                  SIP Trunk
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
              Solutions
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/solutions/verification"
                  className="hover:underline"
                >
                  Verification
                </Link>
              </li>
              <li>
                <Link href="/solutions/marketing" className="hover:underline">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/solutions/service" className="hover:underline">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/solutions/igaming" className="hover:underline">
                  iGaming
                </Link>
              </li>
              <li>
                <Link href="/solutions/fintech" className="hover:underline">
                  Fintech
                </Link>
              </li>
              <li>
                <Link href="/solutions/blockchain" className="hover:underline">
                  Blockchain
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
              Partners
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/partners/affiliate" className="hover:underline">
                  Affiliate
                </Link>
              </li>
              <li>
                <Link href="/partners/agent" className="hover:underline">
                  Agent
                </Link>
              </li>
            </ul>
          </div>
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
            Copyright © 2026 Laaffic Pte. Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
