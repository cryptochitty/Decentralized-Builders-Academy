
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from './useWallet';

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
export type Proposal = {
  id: string;
  eventName: string;
  eventDesc: string;
  eventDate: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
};

export type Registration = {
  id: string;
  name: string;
  date: string;
};

interface EventData {
  proposals: Proposal[];
  registrations: Registration[];
}

// ---------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------
const GLOBAL_PROPOSALS_KEY = 'gba-global-proposals';
const getUserKey = (address: string) => `gba-event-data-${address.toLowerCase()}`;

// ---------------------------------------------------------------------
// Safe JSON Parse
// ---------------------------------------------------------------------
const safeParse = <T>(item: string | null, fallback: T): T => {
  if (!item) return fallback;
  try {
    const parsed = JSON.parse(item);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (err) {
    console.error('Parse error:', err);
    return fallback;
  }
};

// ---------------------------------------------------------------------
// Safe Storage Write
// ---------------------------------------------------------------------
const safeSet = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Write error:', err);
  }
};

// ---------------------------------------------------------------------
// Global Proposals
// ---------------------------------------------------------------------
const seedGlobalProposals = (): Proposal[] => {
  const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
  const seed: Proposal[] = [
    {
      id: 'seed-1',
      eventName: 'Web3 Buidl Hackathon',
      eventDesc: 'A 48-hour virtual hackathon focused on decentralized applications.',
      eventDate: getFutureDate(14),
      status: 'Approved',
    },
    {
      id: 'seed-2',
      eventName: 'ZK & Privacy Workshop',
      eventDesc: 'An expert-led workshop on Zero-Knowledge proofs.',
      eventDate: getFutureDate(30),
      status: 'Approved',
    },
    {
      id: 'seed-3',
      eventName: 'DeFi Innovation Summit',
      eventDesc: 'A summit exploring the future of decentralized finance.',
      eventDate: getFutureDate(45),
      status: 'Approved',
    },
  ];
  safeSet(GLOBAL_PROPOSALS_KEY, seed);
  return seed;
};

const getGlobalProposals = (): Proposal[] => {
  const item = localStorage.getItem(GLOBAL_PROPOSALS_KEY);
  if (!item) return seedGlobalProposals();
  return safeParse<Proposal[]>(item, []);
};

const addGlobalProposal = (proposal: Proposal) => {
  const current = getGlobalProposals();
  const updated = [...current, proposal];
  safeSet(GLOBAL_PROPOSALS_KEY, updated);

  // Auto-approve after 5 seconds (demo)
  setTimeout(() => {
    const all = getGlobalProposals();
    const approved = all.map((p) =>
      p.id === proposal.id ? { ...p, status: 'Approved' as const } : p
    );
    safeSet(GLOBAL_PROPOSALS_KEY, approved);
    console.log(`Event '${proposal.eventName}' auto-approved.`);
  }, 5000);
};

// ---------------------------------------------------------------------
// User Data
// ---------------------------------------------------------------------
const getUserData = (address: string): EventData => {
  const key = getUserKey(address);
  const item = localStorage.getItem(key);
  return safeParse<EventData>(item, { proposals: [], registrations: [] });
};

const setUserData = (address: string, data: EventData) => {
  const key = getUserKey(address);
  safeSet(key, data);
};

// ---------------------------------------------------------------------
// Main Hook
// ---------------------------------------------------------------------
export const useEventData = () => {
  const { address, isConnected } = useWallet();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [globalProposals, setGlobalProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);

  // -----------------------------------------------------------------
  // Load user data
  // -----------------------------------------------------------------
  const loadAllData = useCallback(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    
    try {
      setGlobalProposals(getGlobalProposals());
      const data = getUserData(address!);
      setProposals(data.proposals);
      setRegistrations(data.registrations);
    } catch (err: any) {
      setError('Failed to load event data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  // -----------------------------------------------------------------
  // Poll global proposals for auto-approval updates
  // -----------------------------------------------------------------
  useEffect(() => {
    loadAllData();

    if (!isConnected) return;

    intervalRef.current = window.setInterval(() => {
      const globalFromStorage = getGlobalProposals();
      
      setGlobalProposals(currentGlobal => {
        if (JSON.stringify(currentGlobal) !== JSON.stringify(globalFromStorage)) {
            return globalFromStorage;
        }
        return currentGlobal;
      });
      
      const userData = getUserData(address!);
      const updatedProposals = userData.proposals.map((p) => {
        const globalMatch = globalFromStorage.find((g) => g.id === p.id);
        return globalMatch ? { ...p, status: globalMatch.status } : p;
      });

      if (
        JSON.stringify(updatedProposals) !== JSON.stringify(userData.proposals)
      ) {
        const newData = { ...userData, proposals: updatedProposals };
        setUserData(address!, newData);
        setProposals(updatedProposals);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [address, isConnected, loadAllData]);

  // -----------------------------------------------------------------
  // Add Proposal
  // -----------------------------------------------------------------
  const addProposal = useCallback(
    (proposal: Omit<Proposal, 'id' | 'status'>) => {
      if (!address) return;

      const newProposal: Proposal = {
        ...proposal,
        id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        status: 'Pending Review',
      };

      // Update user data
      const current = getUserData(address);
      const updated = {
        ...current,
        proposals: [...current.proposals, newProposal],
      };
      setUserData(address, updated);
      setProposals(updated.proposals);

      // Add to global
      addGlobalProposal(newProposal);
      setGlobalProposals(getGlobalProposals()); // Eagerly update state
    },
    [address]
  );

  // -----------------------------------------------------------------
  // Add Registration
  // -----------------------------------------------------------------
  const addRegistration = useCallback(
    (registration: Registration) => {
      if (!address) return;

      const current = getUserData(address);
      if (current.registrations.some((r) => r.id === registration.id)) return;

      const updated = {
        ...current,
        registrations: [...current.registrations, registration],
      };
      setUserData(address, updated);
      setRegistrations(updated.registrations);
    },
    [address]
  );

  // -----------------------------------------------------------------
  // Remove Registration
  // -----------------------------------------------------------------
  const removeRegistration = useCallback(
    (registrationId: string) => {
      if (!address) return;

      const current = getUserData(address);
      const updated = {
        ...current,
        registrations: current.registrations.filter((r) => r.id !== registrationId),
      };
      setUserData(address, updated);
      setRegistrations(updated.registrations);
    },
    [address]
  );

  // -----------------------------------------------------------------
  // Refresh (manual)
  // -----------------------------------------------------------------
  const refresh = useCallback(() => {
    setLoading(true);
    loadAllData();
  }, [loadAllData]);

  // -----------------------------------------------------------------
  // Return
  // -----------------------------------------------------------------
  return {
    proposals,
    registrations,
    globalProposals,
    loading,
    error,
    addProposal,
    addRegistration,
    removeRegistration,
    refresh,
  };
};
