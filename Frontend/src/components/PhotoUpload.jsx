import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./photoUpload.css";

function PhotoUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const resetForm=()=>{
    setSelectedFile(null);
    setPreviewURL(null);
    setShowPreview(false);
    setUploadStatus("");
    fileInputRef.current.value = null;
  }

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
      toast.warn("⚠️ Please select a file before uploading");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server error");
        }
        return res.json();
      })
      .then((data) => {
        if (data.images && data.images.length > 0) {
          toast.success("File uploaded successfully!");

          if (data.ocr && data.ocr.dob) {
            const { dob, age, is_18_plus } = data.ocr;
            toast.success(`🎂 DOB: ${dob}\n📅 Age: ${age}\n${is_18_plus ? "✅ Person is 18+" : "❌ Underage"}`);
          } else {
            toast.warning("⚠️ Could not extract DOB or age.");
          }
        } else {
          toast.warning("Upload worked but no file returned.");
        }
      })
      .catch(() => toast.error("Upload failed! Please try again."));
  };

  const isImage = selectedFile && selectedFile.type.startsWith("image");

  return (
    <div style={{ textAlign: "center" }}>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,application/pdf,.doc,.docx"
      />

      <button className="btn" onClick={handleButtonClick}>Choose File</button>

      {selectedFile && !showPreview && (
        <div style={{ marginTop: 10 }}>
          <button onClick={handlePreviewClick}>📁 Click for Preview</button>
        </div>
      )}

      {showPreview && selectedFile && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: "1.3rem", fontWeight: "500" }}>📁 Preview</h4>
          {isImage ? (
            <img
              src={previewURL}
              alt="Preview"
              style={{ width: "300px", borderRadius: "10px" }}
            />
          ) : (
            <div>
              <p>📄 {selectedFile.name}</p>
              <a href={previewURL} style={{color:"#203cbc", fontWeight:"500"}} target="_blank" rel="noopener noreferrer">
                Open File
              </a>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <button className="btn" onClick={handleUpload}>Submit</button>
            <button className="btn" style={{ marginLeft: "10px", color: "#000" }} onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;