import React, { useState } from "react";
import PhotoUpload from "./PhotoUpload";
import SelfieCapture from "./SelfieCapture";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function VerificationPage() {
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [selfieData, setSelfieData] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [resetFlag, setResetFlag] = useState(null);
  const [confidence, setConfidence] = useState(null);

  function dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleSubmit = async () => {
    if (!aadhaarFile || !selfieData) {
      toast.warn("Please provide both Aadhaar and Selfie.");
      return;
    }

    const formData = new FormData();
    formData.append("aadhaar", aadhaarFile);
    const selfieBlob = dataURLtoBlob(selfieData);
    formData.append("selfie", selfieBlob, "selfie.jpg");

    try {
      const res = await fetch("http://localhost:5000/verify-face-match", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Face Match
      if (data.match === true) {
        toast.success("✅ Face matched successfully!");
        setMatchResult(true);
        if (data.confidence !== undefined) {
          setConfidence(data.confidence);
        }
      } else if (data.match === false) {
        toast.error("❌ Face did not match.");
        setMatchResult(false);
      } else {
        toast.error(data.error || "Unexpected error.");
        setMatchResult(null);
      }

      // OCR DOB Info
      if (data.ocr && data.ocr.dob) {
        const { dob, age, is_18_plus } = data.ocr;
        setOcrData({ dob, age, is_18_plus });

        if (is_18_plus) {
          toast.info("🎉 Congratulations! You are eligible to vote 🗳️");
        } else {
          toast.warning("⚠️ You are underage and not eligible to vote.");
        }
      } else {
        setOcrData(null);
        toast.warning("Could not extract DOB or age.");
      }

    } catch (err) {
      toast.error("⚠️ Failed to connect to the server.");
    }
  };

  const handleReset = () => {
    setAadhaarFile(null);
    setSelfieData(null);
    setOcrData(null);
    setMatchResult(null);
    setResetFlag(prev => !prev);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-gray-50 rounded-xl shadow">
      <ToastContainer position="top-center" autoClose={3000} />

      <h2 className="text-2xl font-bold text-center text-blue-800">🧾 Aadhaar & Selfie Verification</h2>

      <PhotoUpload onAadhaarChange={setAadhaarFile} resetTrigger={resetFlag}/>
      <SelfieCapture onSelfieCapture={setSelfieData} resetTrigger={resetFlag}/>

      <div className="text-center">
        <button className="btn hover:bg-blue-200" onClick={handleSubmit}>✅ Submit for Verification</button>
        <button className="btn ml-5 hover:bg-blue-300 text-black px-4 py-2 rounded-lg" onClick={handleReset}>
          🔄 Match Again
        </button>
      </div>

      {/* OCR Display */}
      {ocrData && (
        <div className="mt-6 p-4 rounded-2xl shadow-md bg-white border border-gray-200 text-gray-800">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📝 Extracted Information</h3>
          <p><strong>🎂 DOB:</strong> {ocrData.dob}</p>
          <p><strong>📅 Age:</strong> {ocrData.age}</p>
          <p className="mt-2 font-semibold">
            {ocrData.is_18_plus ? (
              <span className="text-green-600">✅ Eligible to Vote</span>
            ) : (
              <span className="text-red-600">❌ Underage</span>
            )}
          </p>
        </div>
      )}

      {/* Match Result */}
      {matchResult !== null && (
        <div className="mt-4 text-center font-bold text-lg">
          {matchResult ? (
            <span className="text-green-600">
              ✅ Face Match Successful
              {confidence !== null && ` with a confidence of ${confidence}%`}
            </span>
            ) : (
              <span className="text-red-600">❌ Face Match Failed</span>
            )}
        </div>
      )}
    </div>
  );
}

export default VerificationPage;
