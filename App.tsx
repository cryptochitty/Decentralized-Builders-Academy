// src/App.tsx
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useWallet } from './hooks/useWallet';
import { useUserProfile } from './hooks/useUserProfile';
import LandingPage from './components/LandingPage';
import ProfileSetupPage from './components/ProfileSetupPage';
import DashboardLayout from './components/DashboardLayout';
import ConnectWalletModal from './components/ConnectWalletModal';

const APP_ROOT_CLASSES =
  'bg-black text-white font-sans antialiased overflow-x-hidden min-h-screen';

function AppRoutes() {
  const { isConnected } = useWallet();
  const { profile, saveProfile, loading: profileLoading, error: profileError } = useUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsModalOpen(false);
    }
  }, [isConnected]);

  const handleJoin = () => {
    if (!isConnected) {
      setIsModalOpen(true);
    }
  };

  const Spinner = () => (
    <div role="status" className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="w-12 h-12 border-4 border-dashed border-lime-400 rounded-full animate-spin" />
    </div>
  );

  const ErrorScreen = ({ message }: { message: string }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-4 z-50">
      <div className="max-w-md w-full p-6 bg-red-900/50 border border-red-700 rounded-lg text-center space-y-4">
        <h2 className="text-xl font-bold">An Error Occurred</h2>
        <p className="text-sm opacity-90">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-lime-400 text-black font-medium rounded hover:bg-lime-300 transition"
        >
          Reload Page
        </button>
      </div>
    </div>
  );

  if (profileError) {
    return <ErrorScreen message={profileError} />;
  }

  if (isConnected && profileLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Routes>
        {!isConnected ? (
          <Route path="/*" element={<LandingPage onJoin={handleJoin} />} />
        ) : !profile ? (
          <Route path="/*" element={<ProfileSetupPage onProfileSave={saveProfile} />} />
        ) : (
          <Route path="/*" element={<DashboardLayout />} />
        )}
      </Routes>
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ariaLabel="Connect your wallet to continue"
      />
    </>
  );
}

export default function App() {
  return (
    <div className={APP_ROOT_CLASSES}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </div>
  );
}