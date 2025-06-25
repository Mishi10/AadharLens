import React, { useEffect, useState } from "react";

function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState([false, false, false]);
  const [hiding, setHiding] = useState(false);

  const triggerSteps = () => {
    setHiding(true); 
    setTimeout(() => {
      setVisibleSteps([false, false, false]); 
      setHiding(false); 

      [0, 1000, 2000].forEach((delay, index) => {
        setTimeout(() => {
          setVisibleSteps((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, delay);
      });
    }, 300); 
  };

  useEffect(() => {
    triggerSteps(); 
    window.triggerHowItWorksSteps = triggerSteps;
  }, []);

  return (
    <section id="how-it-works" className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          "Upload your Aadhar-like image or PDF document.",
          "Take a live selfie for face comparison.",
          "System checks if face matches and if you are 18+."
        ].map((text, index) => (
          <div
            key={index}
            className={`p-6 border rounded-xl shadow text-center transform transition-all duration-500 ease-in-out 
              ${hiding ? "opacity-0 scale-75" : visibleSteps[index] ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <h3 className="text-xl font-semibold mb-2">Step {index + 1}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
