import React, { useRef, useState , useEffect} from "react";
import Webcam from "react-webcam";
import "./photoUpload.css"

function SelfieCapture({ onSelfieCapture, resetTrigger }) {
  const webcamRef = useRef(null);
  const [selfie, setSelfie] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setSelfie(image);
    onSelfieCapture(image);
  };

  const handleRetake = () => {
    setSelfie(null);
    setCameraOn(false);
    onSelfieCapture(null);
  };

  useEffect(() => {
    setSelfie(null);
    setCameraOn(false);
    onSelfieCapture(null);
  }, [resetTrigger]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-blue-800 mb-3">📸 Selfie Capture</h3>

      {!cameraOn && !selfie && (
        <div >
          <button
            className="btn px-4 py-2 hover:bg-blue-700 text-white rounded-lg transition"
            onClick={() => setCameraOn(true)}
          >
            Start Camera
          </button>
        </div>
      )}

      {cameraOn && !selfie && (
        <div className="flex flex-col items-center">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-lg border border-gray-300 shadow-sm w-full max-w-xs"
          />
          <button
            className="btn mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            onClick={capture}
          >
            📸 Capture Selfie
          </button>
        </div>
      )}

      {selfie && (
        <div className="flex flex-col items-center">
          <img
            src={selfie}
            alt="Captured Selfie"
            className="rounded-lg border border-gray-300 shadow-sm w-full max-w-xs"
          />
          <button
            className="btn mt-4 px-4 py-2 bg-blue-300 hover:bg-blue-200 text-white rounded-lg transition"
            onClick={handleRetake}
          >
            🔄 Retake
          </button>
        </div>
      )}
    </div>
  );
}

export default SelfieCapture;
