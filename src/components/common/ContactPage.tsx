// ContactFormSection.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { publicAPI, API_BASE_URL } from "@/services/api";
import { Loader, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  firstName: string;
  lastName: string;
  businessEmail: string;
  phoneNumber: string;
  companyName: string;
  jobTitle: string;
  areaOfInterest: string;
  message: string;
}

interface Contact {
  type: string;
  icon: string;
  value: string;
}

interface InfoCard {
  id: string;
  title: string;
  description: string;
  contacts: Contact[];
}

export default function ContactFormSection() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    businessEmail: "",
    phoneNumber: "",
    companyName: "",
    jobTitle: "",
    areaOfInterest: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    fetchContactConfig();
  }, []);

  const fetchContactConfig = async () => {
    try {
      setCardsLoading(true);
      const response = (await publicAPI.getContactPageConfig()) as any;
      if (response.success && response.data.infoCards) {
        setInfoCards(response.data.infoCards);
      }
    } catch (err) {
      console.error("Failed to fetch contact cards", err);
    } finally {
      setCardsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = (await publicAPI.submitContactForm(formData)) as any;

      if (response.success) {
        setSuccessMessage(
          "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        );
        setFormData({
          firstName: "",
          lastName: "",
          businessEmail: "",
          phoneNumber: "",
          companyName: "",
          jobTitle: "",
          areaOfInterest: "",
          message: "",
        });
      }
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-100/50 blur-3xl rounded-full opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100/50 blur-3xl rounded-full opacity-50" />
      
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
          {/* LEFT – Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100"
          >
            <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Write to Us
                </h2>
                <div className="h-1.5 w-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="E.g. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all placeholder:text-gray-300 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="E.g. Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all placeholder:text-gray-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    placeholder="john@company.com"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all placeholder:text-gray-300 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+65 1234 5678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all placeholder:text-gray-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Your Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all placeholder:text-gray-300 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Area of Interest
                  </label>
                   <select
                    name="areaOfInterest"
                    value={formData.areaOfInterest}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all font-medium appearance-none"
                    >
                    <option value="">Select Service</option>
                    <option value="SMS Marketing">SMS Marketing</option>
                    <option value="Voice Services">Voice Services</option>
                    <option value="API Integration">API Integration</option>
                    <option value="Partnership">Partnership</option>
                    </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  How can we help?
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Describe your inquiry in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all resize-none placeholder:text-gray-300 font-medium"
                />
              </div>

              <AnimatePresence>
                {successMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100">
                    <CheckCircle2 size={18} />
                    {successMessage}
                  </motion.div>
                )}
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100">
                    <AlertCircle size={18} />
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-5 px-6 bg-gray-900 text-white font-black rounded-2xl overflow-hidden transition-all hover:bg-pink-600 active:scale-95 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Discovering..." : "Send Message"}
                    {!loading && <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </span>
              </button>
            </form>
          </motion.div>

          {/* RIGHT – Info Cards */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {cardsLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                     <Loader className="animate-spin text-pink-500 mb-2" size={32} />
                     <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Fetching Support Info</span>
                </div>
              ) : (
                <>
                  {infoCards.map((card, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        key={card.id} 
                        className="group bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 hover:border-pink-500/20 transition-all duration-500"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed mb-6 font-medium tracking-tight">
                        {card.description}
                      </p>
                      <div className="space-y-3">
                        {card.contacts.map((contact, cidx) => (
                          <div
                            key={cidx}
                            className="flex items-center gap-4 text-gray-700 bg-gray-50 p-3 rounded-2xl group-hover:bg-pink-50/30 transition-colors"
                          >
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-pink-500 shadow-sm border border-gray-100 text-lg">
                                {contact.icon}
                            </span>
                            <span className="text-sm font-black tracking-tight">{contact.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
