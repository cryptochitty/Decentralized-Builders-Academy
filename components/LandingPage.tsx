'use client';

import React from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Mission from './Mission';
import GetInvolved from './GetInvolved';
import Footer from './Footer';

interface LandingPageProps {
  onJoin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoin }) => {
  // Optional: Smooth scroll helper (can be moved to utils if reused)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Semantic Header */}
      <Header onJoin={onJoin} />

      {/* Main Content */}
      <main id="main-content" className="flex flex-col">
        <Hero onJoin={onJoin} />

        {/* Sections */}
        <section id="about" aria-labelledby="about-heading">
          <About />
        </section>

        <section id="mission" aria-labelledby="mission-heading">
          <Mission />
        </section>

        <section id="get-involved" aria-labelledby="get-involved-heading">
          <GetInvolved onJoin={onJoin} />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Optional: Back-to-top button (uncomment if needed) */}
      {/* <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-lime-400 text-black rounded-full shadow-lg hover:bg-lime-300 transition opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto"
        aria-label="Back to top"
        title="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button> */}
    </>
  );
};

export default LandingPage;