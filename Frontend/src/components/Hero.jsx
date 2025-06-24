import React from "react";

function Hero() {
  return (
    <header className="bg-[#F5F9FF] text-center py-20 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Age & Identity Verification System
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Upload your Aadhar-like document and verify your identity using a live selfie.
      </p>
      <button 
      onClick={() => {
        const section = document.getElementById("how-it-works");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-500 transition">
        Get Started
      </button>
    </header>
  );
}

export default Hero;
