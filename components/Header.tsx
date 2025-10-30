// src/components/Header.tsx
import React from 'react';
import { GbaLogo } from './icons';

interface HeaderProps {
  onJoin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onJoin }) => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-lime-400/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="flex items-center space-x-2 hover:opacity-80 transition"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <GbaLogo className="h-9 w-auto" />
          </a>

          <button
            onClick={onJoin}
            className="px-5 py-2 text-sm rounded-md font-semibold transition-all bg-lime-400 text-black hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Join Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;