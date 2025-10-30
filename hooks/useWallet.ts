
import { useState, useCallback, useEffect } from 'react';

// Fix: Add global type definitions for browser-injected wallet providers
declare global {
  interface Window {
    ethereum?: any;
    valora?: any;
  }
}

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
type WalletType = 'MetaMask' | 'Valora';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  loading: boolean;
  error: string | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
}

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------
const STORAGE_KEY = 'gba-wallet-connection';

// ---------------------------------------------------------------------
// Helper: Detect injected providers
// ---------------------------------------------------------------------
const detectProvider = (type: WalletType): any | null => {
  if (typeof window === 'undefined' || !window.ethereum) return null;

  const eth = window.ethereum;

  if (type === 'MetaMask') {
    // MetaMask injects as `ethereum` and has `isMetaMask`
    if (eth.isMetaMask) return eth;
    // Some wallets (e.g. Coinbase) also set `isMetaMask: false`
    return null;
  }

  if (type === 'Valora') {
    // Valora (Celo mobile) injects `valora` object
    if (window.valora) return window.valora;
    return null;
  }

  return null;
};

// ---------------------------------------------------------------------
// Main Hook
// ---------------------------------------------------------------------
export const useWallet = (): WalletState => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // Load persisted connection
  // -----------------------------------------------------------------
  useEffect(() => {
    const loadPersisted = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setLoading(false);
          return;
        }

        const { address: storedAddress, walletType: storedType } = JSON.parse(stored);
        if (!storedAddress || !storedType) throw new Error('Invalid stored data');

        const provider = detectProvider(storedType);
        if (!provider) throw new Error(`${storedType} not detected`);

        // Verify account still matches
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts[0]?.toLowerCase() !== storedAddress.toLowerCase()) {
          throw new Error('Stored address not active');
        }

        setAddress(storedAddress);
        setWalletType(storedType);
        setIsConnected(true);
      } catch (err: any) {
        console.warn('Failed to restore wallet connection:', err.message);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadPersisted();
  }, []);

  // -----------------------------------------------------------------
  // Connect Wallet
  // -----------------------------------------------------------------
  const connect = useCallback(async (type: WalletType): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const provider = detectProvider(type);
      if (!provider) {
        throw new Error(`${type} is not installed or not detected.`);
      }

      // Request accounts
      const accounts: string[] = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned.');
      }

      const userAddress = accounts[0].toLowerCase();

      // Store connection
      const connectionData = { address: userAddress, walletType: type };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connectionData));

      setAddress(userAddress);
      setWalletType(type);
      setIsConnected(true);
    } catch (err: any) {
      const message = err.message || 'Failed to connect wallet';
      setError(message);
      console.error(message, err);
      throw err; // Let caller handle UI
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------------------------------
  // Disconnect
  // -----------------------------------------------------------------
  const disconnect = useCallback(() => {
    const currentAddress = address || (() => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data).address : null;
      } catch {
        return null;
      }
    })();

    // Clear wallet state
    setIsConnected(false);
    setAddress(null);
    setWalletType(null);
    setError(null);

    // Clear all user data tied to this address
    if (currentAddress) {
      [
        `gba-user-profile-${currentAddress}`,
        `gba-event-data-${currentAddress}`,
        `gba-learning-progress-${currentAddress}`,
      ].forEach((key) => localStorage.removeItem(key));
    }

    localStorage.removeItem(STORAGE_KEY);

    // Optional: Reload to reset UI (safe fallback)
    window.location.reload();
  }, [address]);

  // -----------------------------------------------------------------
  // Sign Message (simulated for Valora, real for MetaMask)
  // -----------------------------------------------------------------
  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!isConnected || !address || !walletType) {
        throw new Error('Wallet not connected');
      }

      const provider = detectProvider(walletType);
      if (!provider) {
        throw new Error(`${walletType} provider not available`);
      }

      try {
        // Use EIP-191 personal_sign
        const signature: string = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });

        console.log(`Signed message: ${signature}`);
        return signature;
      } catch (err: any) {
        // Fallback: simulate for demo (remove in prod)
        if (process.env.NODE_ENV === 'development') {
          const fakeSig = `0x-dev-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
          console.warn('Using fake signature (dev only):', fakeSig);
          return fakeSig;
        }
        throw new Error(err.message || 'Signing failed');
      }
    },
    [isConnected, address, walletType]
  );

  // -----------------------------------------------------------------
  // Return
  // -----------------------------------------------------------------
  return {
    isConnected,
    address,
    walletType,
    loading,
    error,
    connect,
    disconnect,
    signMessage,
  };
};
