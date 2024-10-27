"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { FaChevronUp, FaChevronDown, FaQuoteLeft } from "react-icons/fa";

const items = [
  {
    id: 1,
    name: "xxxx xxxxx",
    title: "Principal",
    description:
      "As students are the future captain of the ship on which we are all sailing As students are the future captain of the ship on which we are all sailing...",
    imageUrl: "/img/project-img1.png", // Placeholder image URL
  },
  {
    id: 2,
    name: "xxxx xxxxx",
    title: "Chairman",
    description:
      "Considering this fact, I as the chairman of this institution believe that we have a huge responsibility Considering this fact, I as the chairman of this institution believe that we have a huge responsibility...",
    imageUrl: "/img/project-img2.png",
  },
  {
    id: 3,
    name: "xxxx xxxxx",
    title: "Managing Director",
    description:
      "The role of the managing director is to oversee and ensure smooth operations of the institution The role of the managing director is to oversee and ensure smooth operations of the institution...",
    imageUrl: "/img/project-img3.png",
  },
];

export default function ProfileCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    }
  };

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }
  };


  return (
    <div className="w-full h-[530px] mx-auto p-4">
        
      <div className="relative bg-white transition-opacity duration-500  p-6 flex h-[500px] items-center "
      >
        
        {/* Text Content */}
        <div className="w-[45%] pl-10 text-left ">
            <div className="text-3xl mb-4 ">Meet and Hear From Our Leadership and Administrators </div>
            <FaQuoteLeft/>
          <blockquote className="text-lg text-gray-700 italic mt-2 ">
            {items[currentIndex].description}
          </blockquote>
          <button className="  hover:text-blue-500 underline mb-4 " >Read more</button>
          <h3 className="text-4xl font-semibold text-purple-700 mb-1">
            {items[currentIndex].name}
          </h3>
          <p className="text-xl text-gray-500">{items[currentIndex].title}</p>
        </div>

        {/* Image Container */}
        <div className="w-[45%] h-full flex items-center justify-center">
          <Image
            src={items[currentIndex].imageUrl}
            alt={items[currentIndex].name}
            width={100}
            height={100}
            className="w-[60%] h-[60%] ml-[100px] rounded-full"
          />
        </div>

        {/* Vertical Pagination Buttons and Dots */}
        <div className="w-[10%] h-full flex flex-col items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            <FaChevronUp />
          </button>

          {/* Dots for Pagination */}
          <div className="flex flex-col items-center mt-2 space-y-10">
            {items.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-orange-500" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            <FaChevronDown />
          </button>
          
        </div>


        </div>
        </div>
  );
}
