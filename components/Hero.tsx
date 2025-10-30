'use client';

import React from 'react';

interface HeroProps {
  onJoin: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoin }) => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-black"
      role="region"
      aria-labelledby="hero-heading"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-gray-900/40 [mask-image:linear-gradient(to_bottom,white_5%,transparent_95%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(165,250,82,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-5xl">
        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-tight"
        >
          <span className="block">Decentralized</span>
          <span className="text-lime-400 block">Builders Academy</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          An open-source, community-driven platform for builders to learn, connect, and create the future of the decentralized web.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            onClick={onJoin}
            className={`
              px-8 py-3.5 rounded-md font-bold text-lg transition-all duration-300 ease-out
              bg-lime-400 text-black hover:bg-lime-300 hover:shadow-xl hover:shadow-lime-500/30
              transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black
            `}
            aria-label="Join Global Builders Academy"
          >
            Join the Academy
          </button>

          <a
            href="https://github.com/cryptochitty/global-builders-academy"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              px-8 py-3.5 rounded-md font-bold text-lg transition-all duration-300 ease-out
              bg-gray-800 text-white hover:bg-gray-700 transform hover:-translate-y-1
              focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black
            `}
            aria-label="View project on GitHub (opens in new tab)"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;