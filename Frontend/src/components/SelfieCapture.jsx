import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

function SelfieCapture() {
  const webcamRef = useRef(null);
  const [selfie, setSelfie] = useState(null);
  const [cameraOn, setCameraOn] = useState(false); // 🔹 controls camera visibility

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelfie(imageSrc);
  };

  const handleStartCamera = () => {
    setCameraOn(true);
  };

  const handleRetake = () => {
    setSelfie(null);
    setCameraOn(false); // Optionally turn off camera after capture
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-xl font-semibold mb-2">📸 Capture Selfie</h2>

      {!cameraOn && !selfie && (
        <button onClick={handleStartCamera} className="btn mb-4">
          Start Camera
        </button>
      )}

      {cameraOn && !selfie && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-md w-full max-w-md mb-4"
          />
          <button onClick={capture} className="btn">Capture</button>
        </>
      )}

      {selfie && (
        <>
          <img src={selfie} alt="Selfie" className="rounded-md w-full max-w-md mb-4" />
          <button onClick={handleRetake} className="btn">Retake</button>
        </>
      )}
    </div>
  );
}

export default SelfieCapture;
