'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

export interface UserProfile {
  name: string;
  bio: string;
  skills: string[];
}

// ---------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------
const getStorageKey = (address: string) => `gba-user-profile-${address.toLowerCase()}`;

// ---------------------------------------------------------------------
// Safe JSON Parse
// ---------------------------------------------------------------------
const safeParse = (item: string | null): UserProfile | null => {
  if (!item) return null;
  try {
    const parsed = JSON.parse(item);
    // Basic schema validation
    if (
      typeof parsed === 'object' &&
      typeof parsed.name === 'string' &&
      typeof parsed.bio === 'string' &&
      Array.isArray(parsed.skills) &&
      parsed.skills.every((s: any) => typeof s === 'string')
    ) {
      return parsed as UserProfile;
    }
    console.warn('Invalid profile schema in localStorage');
    return null;
  } catch (err) {
    console.error('Failed to parse profile from localStorage', err);
    return null;
  }
};

// ---------------------------------------------------------------------
// Safe Storage Write
// ---------------------------------------------------------------------
const safeSet = (key: string, data: UserProfile) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to write profile to localStorage', err);
  }
};

// ---------------------------------------------------------------------
// Main Hook
// ---------------------------------------------------------------------
export const useUserProfile = () => {
  const { address, isConnected } = useWallet();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // Load profile when wallet address changes
  // -----------------------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      if (!isConnected || !address) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const key = getStorageKey(address);
        const stored = localStorage.getItem(key);
        const parsed = safeParse(stored);

        if (parsed) {
          setProfile(parsed);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        const msg = 'Failed to load profile';
        console.error(msg, err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [address, isConnected]);

  // -----------------------------------------------------------------
  // Save profile
  // -----------------------------------------------------------------
  const saveProfile = useCallback(
    (profileData: UserProfile) => {
      if (!address) {
        console.warn('Cannot save profile: no wallet address');
        return;
      }

      try {
        const key = getStorageKey(address);
        safeSet(key, profileData);
        setProfile(profileData);
      } catch (err: any) {
        const msg = 'Failed to save profile';
        console.error(msg, err);
        setError(msg);
        throw err;
      }
    },
    [address]
  );

  // -----------------------------------------------------------------
  // Clear profile (e.g. on disconnect or reset)
  // -----------------------------------------------------------------
  const clearProfile = useCallback(() => {
    if (!address) return;

    try {
      const key = getStorageKey(address);
      localStorage.removeItem(key);
      setProfile(null);
    } catch (err) {
      console.error('Failed to clear profile', err);
    }
  }, [address]);

  return {
    profile,
    saveProfile,
    clearProfile,
    loading,
    error,
  };
};