// ContactFormSection.tsx
export default function ContactFormSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT – Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
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
                    placeholder="example@laaffic.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    *Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+65 1234 5678"
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
                    placeholder="Laaffic PTE. LTD."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="Marketing"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  *Area of Interest
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white">
                  <option>Please select</option>
                  <option>SMS Marketing</option>
                  <option>Voice Services</option>
                  <option>API Integration</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  *How can we help you?
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe your inquiry..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                />
              </div>

              <div className="text-sm text-gray-600">
                By completing and submitting this form, I agree to receive marketing emails from Laaffic and its affiliates.
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Submit
              </button>
            </form>
          </div>

          {/* RIGHT – Info Cards */}
          <div className="space-y-8">
            {/* Customer Service */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Service Center</h3>
              <p className="text-gray-600 mb-6">
                Our professional customer service team provides prompt and efficient support. If you have any pre-sales or post-sales inquiries, feel free to contact us via email or online.
              </p>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-gray-700">
                  <span className="text-pink-600">✉</span> service@laaffic.com
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <span className="text-pink-600">📞</span> +63 963 790 2308
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <span className="text-pink-600">@</span> @SMS1_service_all
                </p>
              </div>
            </div>

            {/* API Technical Support */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">API Technical Support</h3>
              <p className="text-gray-600 mb-6">
                Our product platform supports API integration, allowing you to seamlessly incorporate our high-quality SMS and voice services into your own company systems. Contact us for any questions regarding the API interface.
              </p>
              <p className="flex items-center gap-3 text-gray-700">
                <span className="text-pink-600">@</span> @API_Technical_Support
              </p>
            </div>

            {/* Business Collaboration */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Collaboration</h3>
              <p className="text-gray-600">
                If you are a media representative, event organizer, ecosystem partner, agent, or influencer interested in collaborating with Laaffic, please do not hesitate to contact us.
              </p>
              <p className="mt-4 flex items-center gap-3 text-gray-700">
                <span className="text-pink-600">✉</span> marketing@laaffic.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}