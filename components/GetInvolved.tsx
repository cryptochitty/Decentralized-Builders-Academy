'use client';

import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { CodeIcon, GraduationCapIcon, HandshakeIcon, RocketIcon, LightbulbIcon, GlobeIcon } from './icons';

interface GetInvolvedProps {
  onJoin?: () => void;
}

interface CardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  isInternal?: boolean;
}

const Card: React.FC<CardProps> = ({ icon: Icon, title, description, link, isInternal = false }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isInternal && link.startsWith('#')) {
      e.preventDefault();
      const id = link.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <a
      href={link}
      onClick={handleClick}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className={`
        group block bg-[#111111] border border-gray-800 p-8 rounded-xl
        transition-all duration-300 hover:border-lime-400/60 hover:-translate-y-2
        focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#050505]
      `}
      aria-label={`Learn more about ${title}`}
    >
      <Icon className="w-8 h-8 text-lime-400 mb-4 transition-transform group-hover:scale-110" />
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4 text-sm md:text-base leading-relaxed">{description}</p>
      <span className="text-lime-400 font-semibold group-hover:underline inline-flex items-center">
        Learn More
        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  );
};

const GetInvolved: React.FC<GetInvolvedProps> = ({ onJoin }) => {
  const { profile } = useUserProfile();

  return (
    <section
      id="get-involved-preview"
      className="py-20 md:py-32 bg-[#050505] overflow-hidden"
      role="region"
      aria-labelledby="get-involved-heading"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="get-involved-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight"
          >
            {profile ? `Welcome, ${profile.name}!` : 'How to Get Involved'}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {profile
              ? `Explore personalized opportunities to contribute and grow within the DBA ecosystem.`
              : `Whether you're a developer, designer, or enthusiast, there are many ways to contribute.`}
          </p>
        </div>

        {/* CTA for non-connected users */}
        {!profile && onJoin && (
          <div className="text-center mb-12">
            <button
              onClick={onJoin}
              className={`
                px-8 py-3.5 rounded-md font-bold text-lg bg-lime-400 text-black
                hover:bg-lime-300 hover:shadow-xl hover:shadow-lime-500/30
                transform hover:-translate-y-1 transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#050505]
              `}
              aria-label="Join Decentralized Builders Academy to get involved"
            >
              Join Now to Get Started
            </button>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={CodeIcon}
            title="Build with Us"
            description="Contribute to open-source projects, start initiatives, or join a build team. Let's create together."
            link="https://github.com/cryptochitty/global-builders-academy"
          />
          <Card
            icon={GraduationCapIcon}
            title="Learn & Grow"
            description="Access curated resources, workshops, and mentorship from Web3 experts."
            link="#/learn"
            isInternal
          />
          <Card
            icon={HandshakeIcon}
            title="Connect with Peers"
            description="Join Discord, attend events, and network with builders worldwide."
            link="https://discord.com"
          />
          <Card
            icon={RocketIcon}
            title="Launch a Project"
            description="Get funding, marketing, and strategy support for your idea."
            link="#/events"
            isInternal
          />
          <Card
            icon={LightbulbIcon}
            title="Propose an Idea"
            description="Shape DBA's future via governance and community proposals."
            link="#/events"
            isInternal
          />
          <Card
            icon={GlobeIcon}
            title="Become an Ambassador"
            description="Organize local meetups and grow DBA in your region."
            link="#"
            isInternal
          />
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="mt-16 h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
    </section>
  );
};

export default GetInvolved;