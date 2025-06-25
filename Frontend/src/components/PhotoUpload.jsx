import React, { useRef, useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import "./photoUpload.css";

function PhotoUpload({ onAadhaarChange, resetTrigger }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onAadhaarChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    setPreview(null);
    onAadhaarChange(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }, [resetTrigger]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-blue-800 mb-3">
        📎 Aadhaar Upload
      </h3>

      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={triggerFileInput}
        className="btn px-4 py-2 hover:bg-blue-300 text-white rounded-lg transition"
      >
        Choose Aadhaar File
      </button>

      {preview && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-1">📄 Preview:</p>
          <img
            src={preview}
            alt="Aadhaar Preview"
            className="w-60 h-auto rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;
