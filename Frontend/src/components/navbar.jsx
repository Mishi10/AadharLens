import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const startRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    window.highlightStartBtn = () => {
      setShowArrow(true);
      startRef.current?.classList.add("highlight-verify");

      setTimeout(() => {
        startRef.current?.classList.remove("highlight-verify");
        setShowArrow(false);
      }, 3000);
    };
  }, []);

  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="relative w-full flex items-center justify-between px-6 py-4 bg-blue-800 text-white shadow-md sticky top-0 z-50">
      <div className="text-2xl font-bold flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
        <span role="img" aria-label="ID icon">🛂</span>
        <span>AadharLens</span>
      </div>

      <div className="space-x-6 flex items-center text-lg relative">
        <button onClick={() => handleNavClick("how-it-works")} className="hover:underline">How It Works</button>
        <button onClick={() => handleNavClick("about")} className="hover:underline">About</button>
        <div className="relative">
          <button
            ref={startRef}
            onClick={() => navigate("/verify")}
            className="bg-cyan-400 text-black px-4 py-2 rounded-md hover:bg-cyan-300 transition-all"
          >
            Start Verification
          </button>
          {showArrow && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
              ➰
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
