import React from "react";
import PhotoUpload from "./PhotoUpload";
import SelfieCapture from "./SelfieCapture";

function VerificationPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4 bg-gray-50">
      <div className="w-full lg:w-1/2 shadow-md rounded-md p-4" style={{backgroundColor:"#F5F9FF"}}>
        <PhotoUpload />
      </div>
      <div className="w-full lg:w-1/2 shadow-md rounded-md p-4" style={{backgroundColor:"#F5F9FF"}}>
        <SelfieCapture />
      </div>
    </div>
  );
}

export default VerificationPage;
