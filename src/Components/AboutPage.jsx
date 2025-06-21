import React from 'react'

function AboutPage() {
  return (
    <section className="min-h-screen py-16 px-6 md:px-24 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About Campass</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Campass is a smart campus event management platform designed for colleges and universities.
          Our mission is to ensure that campus events are secure, efficient, and engaging. 
          We provide colleges with tools to create events, verify attendees, and log attendance digitally.
        </p>
        <p className="text-lg text-gray-600 mt-4 leading-relaxed">
          With QR-based check-ins and real-time student verification, we help institutions eliminate manual
          work and fake entries while improving transparency and trust.
        </p>
      </div>
    </section>
  )
}

export default AboutPage
