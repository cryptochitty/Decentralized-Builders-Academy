// src/components/Mission.tsx
'use client';

import React from 'react';
import { CheckCircleIcon } from './icons';

const missionPoints = [
  'To provide accessible, high-quality Web3 education for all.',
  'To foster a global community of passionate builders and innovators.',
  'To accelerate the development of impactful decentralized applications.',
  'To champion open-source principles and collaborative development.',
];

// A custom SVG illustration to replace the placeholder image
const CollaborationSvg = () => (
    <svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
        <rect width="800" height="600" fill="url(#bg-pattern-mission)" />
        <defs>
            <pattern id="bg-pattern-mission" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M10 0V20M0 10H20" stroke="#1e1e1e" strokeWidth="0.5"/>
            </pattern>
            <filter id="glow-filter-mission" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g opacity="0.5" filter="url(#glow-filter-mission)">
            <path d="M400 120L260 230" stroke="#a5fa52" strokeWidth="2" />
            <path d="M400 120L540 230" stroke="#a5fa52" strokeWidth="2" />
            <path d="M260 230L330 450" stroke="#a5fa52" strokeWidth="2" />
            <path d="M540 230L470 450" stroke="#a5fa52" strokeWidth="2" />
            <path d="M330 450L470 450" stroke="#a5fa52" strokeWidth="2" />
            <path d="M400 300L260 230" stroke="#a5fa52" strokeWidth="1.5" />
            <path d="M400 300L540 230" stroke="#a5fa52" strokeWidth="1.5" />
            <path d="M400 300L330 450" stroke="#a5fa52" strokeWidth="1.5" />
            <path d="M400 300L470 450" stroke="#a5fa52" strokeWidth="1.5" />
        </g>
        <circle cx="400" cy="120" r="12" fill="#a5fa52" stroke="#111" strokeWidth="3" />
        <circle cx="260" cy="230" r="12" fill="#a5fa52" stroke="#111" strokeWidth="3" />
        <circle cx="540" cy="230" r="12" fill="#a5fa52" stroke="#111" strokeWidth="3" />
        <circle cx="330" cy="450" r="12" fill="#a5fa52" stroke="#111" strokeWidth="3" />
        <circle cx="470" cy="450" r="12" fill="#a5fa52" stroke="#111" strokeWidth="3" />
        <circle cx="400" cy="300" r="16" fill="#fff" stroke="#111" strokeWidth="3" />
    </svg>
);


const Mission: React.FC = () => {
  return (
    <section
      id="mission"
      className="py-20 md:py-32 bg-black overflow-hidden"
      role="region"
      aria-labelledby="mission-heading"
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image with Decorative Glow */}
          <div className="relative order-2 md:order-1 aspect-[4/3] bg-[#111] rounded-xl shadow-2xl">
            <div className="absolute -inset-2 bg-gradient-to-r from-lime-500 to-green-600 rounded-xl blur-xl opacity-20 pointer-events-none" />
            <div 
              className="relative w-full h-full rounded-xl overflow-hidden" 
              role="img" 
              aria-label="An abstract visualization of a collaborative network, with glowing nodes connected by lines, representing the global community of builders."
            >
              <CollaborationSvg />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 md:order-2">
            <h2
              id="mission-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight"
            >
              Our Mission
            </h2>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              We are dedicated to building a future where anyone, anywhere can contribute to and benefit from the decentralized web. Our mission is to break down barriers to entry and empower builders with the knowledge and tools they need to succeed.
            </p>

            <ul className="space-y-5" role="list">
              {missionPoints.map((point, index) => (
                <li key={index} className="flex items-start group">
                  <CheckCircleIcon
                    className="w-6 h-6 text-lime-400 mr-3 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="text-gray-200 text-base md:text-lg leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="mt-16 h-px bg-gradient-to-r from-transparent via-lime-400/30 to-transparent" />
    </section>
  );
};

export default Mission;