import React from "react";

function About() {
  return (
    <section id="about" className="py-16 px-6 bg-[#F5F9FF] text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">About</h2>
      <p className="max-w-2xl mx-auto text-gray-600">
        This is a proof-of-concept identity verification tool. It uses OCR and facial recognition
        to simulate a basic age verification system based on uploaded ID documents and selfies.
      </p>
    </section>
  );
}

export default About;
