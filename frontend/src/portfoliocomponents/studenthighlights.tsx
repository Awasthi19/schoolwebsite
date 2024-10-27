"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const newsItems = [
  {
    id: 1,
    title: "New AI Model Breaks Records",
    description:
      "A revolutionary AI model has surpassed human-level performance on various benchmarks.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "SpaceX Launches Starship",
    description:
      "SpaceX's Starship completed its first successful orbital flight and landing.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Quantum Computing Breakthrough",
    description:
      "Scientists achieve quantum supremacy, solving complex problems in record time.",
  },
  {
    id: 4,
    title: "Space Launches Starship",
    description:
      "SpaceX's Starship completed its first successful orbital flight and landing.",
    image: "/placeholder.svg?height=200&width=300",
  },
  // Add more items as needed
];

export default function StudentHighlights() {
  return (
    <div className="w-full p-4"
    style={{
        background: "linear-gradient(180deg, #f0f0f0 50%, #e0e0e0 50%)",
      }}
    >

        <div className="text-gray-400 text-center">To the Journey Ahead</div>
        <h2 className="text-lg mb-3 text-center">Highlights for Students</h2>
        <div className="my-3 text-center">
        <Link href="/highlights">
          <button className="text-black  font-semibold hover:underline hover:text-blue-500">
            View More
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-2 px-20 gap-4">
        {newsItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 flex flex-col transform transition duration-300 hover:scale-105 shadow-lg "
          >
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            {item.image && (
              <div className="relative w-full h-32 mb-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
            <p className="text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
