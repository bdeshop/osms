"use client";

import Link from "next/link";
import Logo from "@/shared/Logo/Logo"; // Assuming you have this component
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#ff2d95] to-[#d946ef] text-white overflow-hidden">
      {/* Optional subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      <div className="relative container mx-auto px-6 md:px-8 lg:px-12 pt-16 pb-12">
        {/* Top section with logo + columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
          {/* Logo + Tagline + Socials */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Logo  /> {/* Adjust size as needed */}

            <p className="text-lg md:text-xl font-medium mb-6">
              Drives your brand forward
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Facebook className="h-6 w-6 hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://x.com" target="_blank" aria-label="X / Twitter">
                <Twitter className="h-6 w-6 hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://youtube.com" target="_blank" aria-label="YouTube">
                <Youtube className="h-6 w-6 hover:opacity-80 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Messaging */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Messaging</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/messaging/sms" className="hover:underline">SMS</Link></li>
              <li><Link href="/messaging/rcs" className="hover:underline">RCS</Link></li>
              <li><Link href="/messaging/mms" className="hover:underline">MMS</Link></li>
              <li><Link href="/messaging/two-way" className="hover:underline">Two-way</Link></li>
              <li><Link href="/messaging/whatsapp" className="hover:underline">WhatsApp</Link></li>
            </ul>
          </div>

          {/* Voice */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Voice</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/voice/post-call-sms" className="hover:underline">Post-call SMS</Link></li>
              <li><Link href="/voice/ai-group-call" className="hover:underline">AI Group Call</Link></li>
              <li><Link href="/voice/group-call" className="hover:underline">Group Call</Link></li>
              <li><Link href="/voice/call-center" className="hover:underline">Call Center</Link></li>
              <li><Link href="/voice/sip-trunk" className="hover:underline">SIP Trunk</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/solutions/verification" className="hover:underline">Verification</Link></li>
              <li><Link href="/solutions/marketing" className="hover:underline">Marketing</Link></li>
              <li><Link href="/solutions/service" className="hover:underline">Service</Link></li>
              <li><Link href="/solutions/igaming" className="hover:underline">iGaming</Link></li>
              <li><Link href="/solutions/fintech" className="hover:underline">Fintech</Link></li>
              <li><Link href="/solutions/blockchain" className="hover:underline">Blockchain</Link></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Partners</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/partners/affiliate" className="hover:underline">Affiliate</Link></li>
              <li><Link href="/partners/agent" className="hover:underline">Agent</Link></li>
            </ul>
          </div>

          {/* About Us
          <div>
            <h3 className="text-lg font-semibold mb-5">About Us</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about/events" className="hover:underline">Events</Link></li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/about/company" className="hover:underline">Company</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/20 pt-8 mt-8 text-center text-sm opacity-90">
          Copyright © 2026 Laaffic Pte. Ltd.
        </div>
      </div>
    </footer>
  );
};

export default Footer;