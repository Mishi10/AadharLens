import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // General scroll handler
  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });

      // Wait for homepage to render before scrolling
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If already on home page, just scroll
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-blue-800 text-white shadow-md sticky top-0 z-50">
      <div className="text-2xl font-bold flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
        <span role="img" aria-label="ID icon">🛂</span>
        <span>AadharLens</span>
      </div>

      <div className="space-x-6 flex items-center text-lg">
        <button onClick={() => handleNavClick("how-it-works")} className="hover:underline">How It Works</button>
        <button onClick={() => handleNavClick("about")} className="hover:underline">About</button>
        <button
          onClick={() => navigate("/verify")}
          className="bg-cyan-400 text-black px-4 py-2 rounded-md hover:bg-cyan-300 transition-all"
        >
          Start Verification
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
