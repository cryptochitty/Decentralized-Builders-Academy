'use client';

import React from 'react';
import { GithubIcon, TwitterIcon, DiscordIcon } from './icons';

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`
      text-gray-400 hover:text-lime-400 transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#050505] rounded-full p-1
    `}
  >
    <Icon className="w-6 h-6 transition-transform hover:scale-110" />
  </a>
);

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#050505] border-t border-gray-900"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Copyright & Tagline */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-gray-400 text-sm">
              &copy; {year} <span className="font-semibold">Decentralized Builders Academy</span>. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              An open-source, community-driven initiative.
            </p>
          </div>

          {/* Center: Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/privacy"
              className="text-gray-500 hover:text-lime-400 transition-colors focus:outline-none focus:underline"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-500 hover:text-lime-400 transition-colors focus:outline-none focus:underline"
            >
              Terms of Service
            </a>
            <a
              href="/code-of-conduct"
              className="text-gray-500 hover:text-lime-400 transition-colors focus:outline-none focus:underline"
            >
              Code of Conduct
            </a>
          </div>

          {/* Right: Social Icons */}
          <div className="flex space-x-6">
            <SocialLink
              href="https://twitter.com/gba_web3"
              icon={TwitterIcon}
              label="Follow DBA on X (Twitter)"
            />
            <SocialLink
              href="https://github.com/cryptochitty/global-builders-academy"
              icon={GithubIcon}
              label="View DBA on GitHub"
            />
            <SocialLink
              href="https://discord.gg/gba"
              icon={DiscordIcon}
              label="Join DBA on Discord"
            />
          </div>
        </div>

        {/* Optional: Decorative Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-lime-400/10 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;