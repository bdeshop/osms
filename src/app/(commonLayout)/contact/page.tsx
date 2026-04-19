"use client";

import ContactFormSection from "@/components/common/ContactPage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { publicAPI, API_BASE } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";
import { Loader } from "lucide-react";
import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";

interface Location {
  name: string;
  type: string;
  address: string;
  image: string;
}

interface ContactPageConfig {
  titleEn: string;
  titleBn: string;
  locations: Location[];
}

const ContactPage = () => {
  const [config, setConfig] = useState<ContactPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = (await publicAPI.getContactPageConfig()) as any;
      if (response.success) {
        setConfig(response.data);
      }
    } catch (err) {
      console.error("Failed to load contact page config", err);
    } finally {
      setLoading(false);
    }
  };

  const title = language === "en" ? config?.titleEn : config?.titleBn;
  const locations = config?.locations || [];

  return (
    <>
      <main>
        {/* Banner Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16 py-12 sm:py-16 lg:py-20 min-h-[400px] lg:min-h-[500px]">
              {/* LEFT - Text Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                </h1>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {language === "en"
                    ? "Want to collaborate with us? Hear from us and the team, and we will get in touch with you as soon as possible."
                    : "আমাদের সাথে কাজ করতে চান? আমাদের এবং টিমের কাছ থেকে শুনুন, এবং আমরা যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করব।"}
                </p>
              </div>

              {/* RIGHT - Image */}
              <div className="w-full lg:w-1/2 max-w-lg">
                <Image
                  src="https://www.laaffic.com/public/images/contact-us/banner.png"
                  alt="Contact Us"
                  width={500}
                  height={400}
                  priority
                  className="w-full h-auto object-contain"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <ContactFormSection />

        {/* Locations Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {title ||
                  (language === "en"
                    ? "Based in Singapore, Reaching Globally"
                    : "সিঙ্গাপুর ভিত্তিক, বিশ্বব্যাপী পৌঁছানো")}
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <Loader className="animate-spin text-pink-500 mb-4" size={32} />
                <p className="text-sm font-medium text-gray-400">
                  Loading locations...
                </p>
              </div>
            ) : (
              <div className="space-y-6 lg:space-y-12">
                {locations.map((location, index) => {
                  const imageSrc = location.image.startsWith("http")
                    ? location.image
                    : location.image.startsWith("/images")
                      ? location.image
                      : `${API_BASE}${location.image.startsWith("/") ? "" : "/"}${location.image}`;

                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center group"
                    >
                      {/* Image Container */}
                      <div className="w-full md:w-1/2 lg:w-2/5">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 group-hover:shadow-pink-100/50 transition-all duration-500">
                          <img
                            src={imageSrc}
                            alt={location.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute bottom-6 left-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">
                              {location.name}
                            </h3>
                            <div className="h-1 w-12 bg-pink-500 rounded-full mt-2 group-hover:w-24 transition-all duration-500" />
                          </div>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="w-full md:w-1/2 lg:w-3/5 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {location.type}
                          </span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors tracking-tight">
                          {location.name} Office
                        </h4>
                        <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:bg-white group-hover:border-pink-50 group-hover:shadow-xl group-hover:shadow-gray-200/40 transition-all duration-500">
                          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                            {location.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
