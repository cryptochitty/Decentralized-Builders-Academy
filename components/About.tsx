'use client';

import React from 'react';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-[#050505] overflow-hidden"
      role="region"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-6">
        <div
          className="text-center max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <h2
            id="about-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight"
          >
            What is <span className="text-lime-400">DBA</span>?
          </h2>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed tracking-wide">
            Decentralized Builders Academy (DBA) is a global, decentralized ecosystem designed to empower the next generation of Web3 builders. We provide the resources, mentorship, and collaborative environment needed to turn innovative ideas into reality. Our platform is built on the principles of open-source collaboration, transparency, and community ownership.
          </p>
        </div>
      </div>

      {/* Optional: Decorative accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
    </section>
  );
};

export default About;