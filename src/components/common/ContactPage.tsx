// ContactFormSection.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import contactData from "@/data/contactData.json";
import { API_BASE_URL } from "@/services/api";

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
      // Request body structure
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessEmail: formData.businessEmail,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        areaOfInterest: formData.areaOfInterest,
        message: formData.message,
      };

      // Make POST request to the backend API endpoint
      const response = await axios.post(
        `${API_BASE_URL}/frontend/contact-us`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
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
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to send message. Please try again.",
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT – Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Get in Touch
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *Business Email
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    placeholder="example@o-sms.com"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+65 1234 5678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="o-sms PTE. LTD."
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Marketing"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  *Area of Interest
                </label>
                <select
                  name="areaOfInterest"
                  value={formData.areaOfInterest}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white"
                >
                  <option value="">Please select</option>
                  <option value="SMS Marketing">SMS Marketing</option>
                  <option value="Voice Services">Voice Services</option>
                  <option value="API Integration">API Integration</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  *How can we help you?
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Please describe your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                />
              </div>

              <div className="text-sm text-gray-600">
                By completing and submitting this form, I agree to receive
                marketing emails from o-sms and its affiliates.
              </div>

              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          {/* RIGHT – Info Cards */}
          <div className="space-y-8">
            {contactData.infoCards.map((card) => (
              <div key={card.id} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <div className="space-y-3">
                  {card.contacts.map((contact, idx) => (
                    <p
                      key={idx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-pink-600">{contact.icon}</span>
                      {contact.value}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
