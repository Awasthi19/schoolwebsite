import React from "react";

const AdmissionBanner = () => {
  return (
    <div className="relative flex flex-col items-center justify-center bg-orange-600 h-[300px] text-center text-white overflow-hidden">
      {/* Expanding Circle */}
      <div className="circle-animation absolute w-[500px] h-[500px] bg-orange-400 rounded-full opacity-30 animate-circle"></div>
      
      {/* Content */}
      <p className="text-sm tracking-wider mb-2 z-10">
        YOUR JOURNEY BEGINS HERE - STAY INFORMED WITH THE LATEST ADMISSION NOTICES AND UPDATES
      </p>
      <h1 className="text-4xl font-bold mb-8 z-10">
        ADMISSION - GATEWAY TO ACADEMIC EXCELLENCE
      </h1>
      <button className=" bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10">
        Explore
      </button>
    </div>
  );
};

export default AdmissionBanner;
