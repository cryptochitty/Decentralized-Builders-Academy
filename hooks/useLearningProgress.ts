import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

const getStoredProgress = (address: string): string[] => {
  try {
    const item = window.localStorage.getItem(`gba-learning-progress-${address}`);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading learning progress from localStorage", error);
    return [];
  }
};

const setStoredProgress = (address: string, enrolledModules: string[]) => {
  try {
    window.localStorage.setItem(`gba-learning-progress-${address}`, JSON.stringify(enrolledModules));
  } catch (error) {
    console.error("Error writing learning progress to localStorage", error);
  }
};

export const useLearningProgress = () => {
  const { address } = useWallet();
  const [enrolledModules, setEnrolledModules] = useState<string[]>([]);

  useEffect(() => {
    if (address) {
        setEnrolledModules(getStoredProgress(address));
    } else {
        setEnrolledModules([]);
    }
  }, [address]);

  const enrollInModule = useCallback((moduleTitle: string) => {
    if (!address) return;
    const currentProgress = getStoredProgress(address);
    if (currentProgress.includes(moduleTitle)) return; // Already enrolled

    const updatedProgress = [...currentProgress, moduleTitle];
    setStoredProgress(address, updatedProgress);
    setEnrolledModules(updatedProgress);
  }, [address]);

  return { enrolledModules, enrollInModule };
};
