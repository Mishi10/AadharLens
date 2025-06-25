import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./photoUpload.css";

function PhotoUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [ocrData, setOcrData] = useState(null);

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setShowPreview(false);
    setOcrData(null);
    fileInputRef.current.value = null;
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setShowPreview(false);
  };

  const handlePreviewClick = () => {
    if (previewURL) {
      setShowPreview(true);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.warn("Please select a file before uploading");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data.images && data.images.length > 0) {
          toast.success("File uploaded successfully!");

          if (data.ocr && data.ocr.dob) {
            const { dob, age, is_18_plus } = data.ocr;
            toast.info("🎉 Congratulations! You are eligible to vote 🗳️");
            setOcrData({ dob, age, is_18_plus });
          } else {
            toast.warning("Could not extract DOB or age.");
            setOcrData(null);
          }
        } else {
          toast.warning("Upload worked but no file returned.");
          setOcrData(null);
        }
      })
      .catch(() => toast.error("Upload failed! Please try again."));
  };

  const isImage = selectedFile && selectedFile.type.startsWith("image");

  return (
    <div className="text-center p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,application/pdf,.doc,.docx"
      />

      <button className="btn" onClick={handleButtonClick}>Choose File</button>

      {selectedFile && (
        <div className="mt-4">
          {!showPreview && (
            <button onClick={handlePreviewClick} className="mr-2 text-blue-600 underline">
              📁 Click for Preview
            </button>
          )}

          <div className="mt-2">
            <button className="btn" onClick={handleUpload}>Submit</button>
            <button className="btn ml-2 text-black" onClick={resetForm}>Reset</button>
          </div>
        </div>
      )}

      {showPreview && selectedFile && (
        <div className="mt-6">
          <h4 className="text-lg font-medium">📁 Preview</h4>
          {isImage ? (
            <img
              src={previewURL}
              alt="Preview"
              className="w-72 rounded-lg mt-2 mx-auto"
            />
          ) : (
            <div className="mt-2">
              <p>📄 {selectedFile.name}</p>
              <a href={previewURL} className="text-blue-700 font-medium" target="_blank" rel="noopener noreferrer">
                Open File
              </a>
            </div>
          )}
        </div>
      )}

      {ocrData && (
        <div className="mt-6 p-4 rounded-2xl shadow-md bg-white border border-gray-200 w-full max-w-md mx-auto text-gray-800">
          <h2 className="text-lg font-semibold mb-3 text-blue-800">📝 Extracted Information</h2>
          <p className="mb-2"><strong>🎂 DOB:</strong> {ocrData.dob}</p>
          <p className="mb-2"><strong>📅 Age:</strong> {ocrData.age}</p>
          <p className="font-semibold">
            {ocrData.is_18_plus ? (
              <span className="text-green-600">✅ Person is 18+</span>
            ) : (
              <span className="text-red-600">❌ Underage</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;
