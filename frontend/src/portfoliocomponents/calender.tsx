import React from 'react';
import Image from 'next/image';

const CalendarComponent: React.FC = () => {
  return (
    <div
      className="relative !h-[300px] flex items-center justify-center"
          
    >
    <Image
        src="/img/x.svg" // Path to the image
        alt="Calendar Background"
        layout="fill" // Ensures it covers the entire div
        objectFit="cover" // Maintains the cover effect
        quality={100} // Optional: image quality
    />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative text-center text-white z-10">
        <h2 className="text-lg mb-2 uppercase">
          Get instant information on events and programs of school
        </h2>
        <h1 className="text-4xl mb-4">School Calendar</h1>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded">
          View Calendar
        </button>
      </div>
    </div>
  );
};

export default CalendarComponent;
