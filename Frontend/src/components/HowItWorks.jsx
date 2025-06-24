import React from "react";

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="p-6 border rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Step 1</h3>
          <p>Upload your Aadhar-like image or PDF document.</p>
        </div>
        <div className="p-6 border rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Step 2</h3>
          <p>Take a live selfie for face comparison.</p>
        </div>
        <div className="p-6 border rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Step 3</h3>
          <p>System checks if face matches and if you are 18+.</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
