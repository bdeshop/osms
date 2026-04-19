"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";
import themeConfig from "@/data/themeConfig.json";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <AlertCircle size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {language === 'en' ? '404 - Page Not Found' : '৪০৪ - পৃষ্ঠাটি পাওয়া যায়নি'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
            {language === 'en' 
              ? "Oops! The page you are looking for doesn't exist or has been moved." 
              : "দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন তার অস্তিত্ব নেই বা সরানো হয়েছে।"}
          </p>
          
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-rose-700 transition duration-300 shadow-lg shadow-pink-200/50 hover:shadow-pink-300/60 transform hover:-translate-y-0.5"
          >
            {language === 'en' ? 'Return Home' : 'হোমে ফিরে যান'}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
