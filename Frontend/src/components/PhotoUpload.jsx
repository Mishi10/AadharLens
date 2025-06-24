import React, { useRef, useState } from "react";
import "./photoUpload.css"
function PhotoUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

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
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if(!res.ok){
          throw new Error("Server error");
        }
        return res.json();
      })
      .then((data) => {
            if (data.images && data.images.length > 0) {
            setUploadStatus(`✅ Uploaded to: ${data.images.join(", ")}`);
            } else {
            setUploadStatus("⚠️ Upload worked but no image returned.");
            }
        })
      .catch(() => setUploadStatus("❌ Upload failed"));
  };

  const isImage = selectedFile && selectedFile.type.startsWith("image");

  return (
    <div style={{textAlign:"center"}}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,application/pdf,.doc,.docx"
      />

      <button className="btn" onClick={handleButtonClick}>Choose File</button>

      {selectedFile && !showPreview && (
        <div style={{ marginTop: 10 , textAlign:"center"}}>
          <button onClick={handlePreviewClick}>📁 Click here for Preview</button>
        </div>
      )}

      {showPreview && selectedFile && (
        <div style={{ marginTop: 20 ,textAlign:"center"}}>
          <h4 style={{
            fontSize:"1.3rem",
            fontWeight:"500"
          }}>📁 Click here for Preview</h4>
          {isImage ? (
            <img
              src={previewURL}
              alt="Preview"
              style={{ width: "300px", borderRadius: "10px" , textAlign:"center"}}
            />
          ) : (
            <div>
              <p>📄 {selectedFile.name}</p>
              <a href={previewURL} target="_blank" rel="noopener noreferrer">
                Open File
              </a>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <button className="btn" onClick={handleUpload}>Submit</button>
          </div>
        </div>
      )}

      {uploadStatus && <p style={{ marginTop: 15 }}>{uploadStatus}</p>}
    </div>
  );
}

export default PhotoUpload;
