// src/components/DashboardLayout.tsx
import React, { useState, Fragment } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useUserProfile } from '../hooks/useUserProfile';
import { GbaLogo, HomeIcon, BriefcaseIcon, TicketIcon, BookOpenIcon, UserCircleIcon, SparklesIcon, MegaphoneIcon } from './icons';

// Page Components
import Dashboard from './Dashboard';
import GetInvolved from './GetInvolved';
import Onboarding from './Onboarding';
import LearnPage from './LearnPage';
import ProfilePage from './ProfilePage';
import GeminiExplainer from './GeminiExplainer';
import EventCreationForm from './EventCreationForm';
import MyProposalsPage from './MyProposalsPage';
import MyRegistrationsPage from './MyRegistrationsPage';

const navigation = [
  { name: 'Dashboard', href: '#/', icon: HomeIcon },
  { name: 'Opportunities', href: '#/opportunities', icon: BriefcaseIcon },
  { name: 'Events', href: '#/events', icon: TicketIcon },
  { name: 'Learn', href: '#/learn', icon: BookOpenIcon },
  { name: 'AI Explainer', href: '#/ai-explainer', icon: SparklesIcon },
  { name: 'Profile', href: '#/profile', icon: UserCircleIcon },
];

const NavItem: React.FC<{ item: typeof navigation[0], isMobile?: boolean }> = ({ item, isMobile = false }) => (
    <NavLink
      to={item.href.substring(1)}
      end={item.href === '#/'}
      className={({ isActive }) =>
        `group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
        ${ isMobile ? 'flex-col justify-center text-xs h-16' : ''}
        ${
          isActive
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`
      }
    >
      <item.icon
        className={`h-6 w-6 shrink-0 ${isMobile ? 'h-5 w-5 mb-1' : ''}`}
        aria-hidden="true"
      />
      {item.name}
    </NavLink>
);

const UserDropdown: React.FC = () => {
    const { profile } = useUserProfile();
    const { disconnect } = useWallet();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                 <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-lime-400">
                    {profile?.name.charAt(0).toUpperCase()}
                 </div>
                 <span className="hidden md:inline text-sm font-semibold">{profile?.name}</span>
            </button>
            {isOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-gray-700 rounded-md shadow-lg z-10">
                     <a href="#/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800" onClick={() => setIsOpen(false)}>My Profile</a>
                     <button onClick={disconnect} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800">
                         Disconnect
                     </button>
                 </div>
            )}
        </div>
    );
}

const DashboardLayout: React.FC = () => {
  return (
    <div>
       {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4 border-r border-gray-800">
          <Link to="/" className="flex h-16 shrink-0 items-center">
            <GbaLogo className="h-10 w-auto" />
          </Link>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                        <NavItem item={item} />
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Sticky Header for mobile/tablet */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-black/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                 <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <UserDropdown />
                </div>
            </div>
        </div>
        
        <main className="py-10">
           <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/opportunities" element={<GetInvolved />} />
              <Route path="/events" element={<Onboarding />} />
              <Route path="/create-event" element={<EventCreationForm />} />
              <Route path="/my-proposals" element={<MyProposalsPage />} />
              <Route path="/my-registrations" element={<MyRegistrationsPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/ai-explainer" element={<GeminiExplainer />} />
              <Route path="*" element={<Dashboard />} /> {/* Fallback to dashboard */}
            </Routes>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <nav className="grid grid-cols-6">
             {navigation.map((item) => (
                <NavItem key={item.name} item={item} isMobile={true} />
            ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;