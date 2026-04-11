import ContactFormSection from "@/components/common/ContactPage";
import Image from "next/image";
import React from "react";
import Navbar from "@/components/commonLayout/Navbar";
import Footer from "@/components/commonLayout/home/Footer";

const page = () => {
  const locations = [
    {
      name: "Singapore",
      type: "Headquarters",
      address: "108 KENG LEE ROAD, #03-01, KENG LEE VIEW, SINGAPORE",
      image:
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Latvia",
      type: "European Division",
      address: "Skanstes iela, Riga, LV-1013, Latvia",
      image:
        "https://images.unsplash.com/photo-1564507592333-c0a5a2a0d6c0?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Armenia",
      type: "Regional Division",
      address: "Yerevan, Armenia",
      image:
        "https://images.unsplash.com/photo-1570158268183-d296b2892211?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Cyprus",
      type: "Regional Division",
      address: "Nicosia, Cyprus",
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Philippines",
      type: "Regional Division",
      address: "Manila, Philippines",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Banner Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16 py-12 sm:py-16 lg:py-20 min-h-[400px] lg:min-h-[500px]">
              {/* LEFT - Text Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Contact Us
                </h1>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Want to collaborate with us? Hear from us and the team, and we
                  will get in touch with you as soon as possible. or contact us
                </p>
              </div>

              {/* RIGHT - Image */}
              <div className="w-full lg:w-1/2 max-w-lg">
                <Image
                  src="https://www.laaffic.com/public/images/contact-us/banner.png"
                  alt="Contact Us - Team collaboration illustration"
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
                Based in Singapore, Reaching Globally
              </h2>
            </div>

            {/* Locations Grid */}
            <div className="space-y-6 lg:space-y-8">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3 lg:w-2/5">
                    <div className="relative rounded-xl overflow-hidden shadow-lg group h-48 md:h-56 lg:h-64">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold">
                          {location.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col justify-center">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {location.type}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {location.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default page;
