import React from 'react'

function ContactPage() {
  return (
     <section className="min-h-screen py-16 px-6 md:px-24 bg-[#F9FAFB] text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-center text-gray-600 mb-10">
          Have a question, feedback, or need help? We'd love to hear from you.
        </p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              placeholder="Your message..."
              rows="4"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6b21a8]"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactPage
