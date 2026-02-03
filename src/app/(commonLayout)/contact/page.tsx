import ContactFormSection from '@/components/common/ContactPage'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div>
            <section className="relative  overflow-hidden">


      <div className="relative container mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 min-h-[480px] lg:min-h-[600px]">
          {/* LEFT - Text Content */}
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left space-y-6 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Laaffic SMS & Voice
              <br className="hidden sm:block" />
              <span className="text-pink-600">Drives Your Brand Forward</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-xl mx-auto lg:mx-0">
              Trusted iGaming Marketing Solution Provider
            </p>

       

            {/* Optional trust signals / small stats - uncomment if relevant */}
            {/* <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-gray-500">
              <div>99.9% Delivery Rate</div>
              <div>200+ Countries Covered</div>
              <div>24/7 Support</div>
            </div> */}
          </div>

          {/* RIGHT - Image */}
          <div className="w-full lg:w-1/2 max-w-xl lg:max-w-2xl relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-pink-200/30 border border-gray-100 bg-white/50 backdrop-blur-sm">
              <Image
                src="https://www.laaffic.com/public/images/index/banner.png"
                alt="Laaffic SMS & Voice - iGaming marketing dashboard and communication tools"
                width={720}
                height={600}
                priority
                className="w-full h-auto object-cover"
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

          </div>
        </div>
      </div>

      
    </section>
    <ContactFormSection/>
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8 ">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Based in Singapore, Reaching Globally
          </h2>
        </div>

        {/* Two Locations Grid */}
        <div className="grid  gap-8 lg:gap-12">
          {/* Singapore HQ */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=800"
                alt="Singapore skyline with Marina Bay Sands"
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold">Singapore</h3>
                <p className="text-lg opacity-90">Headquarters</p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold text-gray-900">Headquarters</h4>
              <p className="text-gray-600 mt-2">
                108 KENG LEE ROAD, #03-01, KENG LEE VIEW, SINGAPORE
              </p>
            </div>
          </div>

          {/* Latvia European Division */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c0a5a2a0d6c0?auto=format&fit=crop&q=80&w=800"
                alt="Riga Old Town architecture in Latvia"
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold">Latvia</h3>
                <p className="text-lg opacity-90">European Division</p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold text-gray-900">European Division</h4>
              <p className="text-gray-600 mt-2">
                Skanstes iela, Riga, LV-1013, Latvia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default page