'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { MetamaskIcon, ValoraIcon } from './icons';

// ---------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------
interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
}

type WalletType = 'MetaMask' | 'Valora';

// ---------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------
const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  ariaLabel = 'Connect your wallet',
}) => {
  const { connect, error: walletError, loading: walletLoading } = useWallet();
  const [connecting, setConnecting] = useState<WalletType | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Reset local error when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      setConnecting(null);
    }
  }, [isOpen]);

  // Focus trap + ESC close
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const focusTrap = (e: KeyboardEvent) => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('keydown', focusTrap);
    firstButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', focusTrap);
    };
  }, [isOpen, onClose]);

  const handleConnect = async (type: WalletType) => {
    setConnecting(type);
    setLocalError(null);

    try {
      await connect(type);
      onClose(); // Close on success
    } catch (err: any) {
      const message = err.message || `Failed to connect ${type}`;
      setLocalError(message);
      console.error(message, err);
    } finally {
      setConnecting(null);
    }
  };

  const errorMessage = localError || walletError;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-lime-500/10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400 rounded"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">Connect Wallet</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Choose your wallet to access Global Builders Academy
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-200 text-center">
            {errorMessage}
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          <WalletOption
            ref={firstButtonRef}
            name="MetaMask"
            Icon={MetamaskIcon}
            onClick={() => handleConnect('MetaMask')}
            loading={connecting === 'MetaMask' || (walletLoading && connecting === null)}
            disabled={!!connecting}
          />
          <WalletOption
            name="Valora"
            Icon={ValoraIcon}
            onClick={() => handleConnect('Valora')}
            loading={connecting === 'Valora' || (walletLoading && connecting === null)}
            disabled={!!connecting}
          />
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          By connecting, you agree to our{' '}
          <a href="/terms" className="underline hover:text-lime-400">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-lime-400">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// Wallet Option Subcomponent
// ---------------------------------------------------------------------
interface WalletOptionProps {
  name: string;
  Icon: React.ElementType;
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

const WalletOption = React.forwardRef<HTMLButtonElement, WalletOptionProps>(
  ({ name, Icon, onClick, loading, disabled }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200
        ${disabled || loading 
          ? 'bg-gray-900 border-gray-700 opacity-60 cursor-not-allowed' 
          : 'bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400'
        }
      `}
      aria-label={`Connect with ${name}`}
    >
      <div className="flex items-center space-x-4">
        <Icon className="w-8 h-8 text-white" />
        <span className="text-lg font-semibold text-white">{name}</span>
      </div>

      {loading && (
        <div className="w-6 h-6 border-2 border-dashed border-lime-400 rounded-full animate-spin" />
      )}
    </button>
  )
);

WalletOption.displayName = 'WalletOption';

export default ConnectWalletModal;