
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUserProfile, UserProfile } from '../hooks/useUserProfile';

interface ProfileSetupPageProps {
  onProfileSave: (profile: UserProfile) => void;
}

const ALL_SKILLS = [
  'Developer',
  'Designer',
  'Community Manager',
  'Content Creator',
  'Project Manager',
  'Memelord',
] as const;

type Skill = (typeof ALL_SKILLS)[number];

const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({ onProfileSave }) => {
  const { profile: existingProfile, saveProfile } = useUserProfile();

  // Initialize from existing profile
  const [name, setName] = useState(existingProfile?.name || '');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  // Fix: Changed state type to string[] to align with UserProfile interface
  const [skills, setSkills] = useState<string[]>(existingProfile?.skills || []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Validation
  const validate = (): string | null => {
    if (!name.trim()) return 'Name is required';
    if (name.length > 50) return 'Name must be 50 characters or less';
    if (bio.length > 280) return 'Bio must be 280 characters or less';
    if (skills.length === 0) return 'Select at least one skill';
    return null;
  };

  const toggleSkill = (skill: Skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const profileData: UserProfile = { name: name.trim(), bio: bio.trim(), skills };
      // Use saveProfile from hook (persists to localStorage)
      saveProfile(profileData);
      // Also notify parent (for navigation)
      onProfileSave(profileData);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-lime-400 rounded-full flex items-center justify-center text-black font-mono font-extrabold text-3xl mx-auto mb-4 shadow-lg shadow-lime-500/20">
            D
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Welcome to the Academy
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Let’s set up your builder profile.</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 shadow-2xl">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-7" noValidate>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
                placeholder="Your Name or Pseudonym"
                className={`
                  w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                  transition-all duration-200
                  ${name && name.length > 50 ? 'border-red-500' : 'border-gray-700'}
                `}
                aria-describedby="name-error"
              />
              <p className="mt-1 text-xs text-gray-500">
                {name.length}/50 characters
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Short Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={280}
                placeholder="What are you passionate about building in Web3?"
                className={`
                  w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                  transition-all duration-200 resize-none
                  ${bio.length > 280 ? 'border-red-500' : 'border-gray-700'}
                `}
                aria-describedby="bio-error"
              />
              <p className="mt-1 text-xs text-gray-500">
                {bio.length}/280 characters
              </p>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Skills / Interests <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#111111]
                      ${
                        skills.includes(skill)
                          ? 'bg-lime-400 text-black border-lime-400 shadow-md'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500 hover:bg-gray-700'
                      }
                    `}
                    aria-pressed={skills.includes(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {skills.length === 0 && (
                <p className="mt-2 text-xs text-red-400">Select at least one skill</p>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-200 text-center"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving || !name.trim() || skills.length === 0}
              className={`
                w-full py-3.5 rounded-lg font-bold text-lg transition-all duration-300
                flex items-center justify-center space-x-2
                ${
                  isSaving || !name.trim() || skills.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-lime-400 text-black hover:bg-lime-300 hover:shadow-xl hover:shadow-lime-500/30 transform hover:-translate-y-0.5'
                }
                focus:outline-none focus:ring-4 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#111111]
              `}
              aria-label={isSaving ? 'Saving profile...' : 'Complete profile setup'}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-dashed border-black rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <span>Complete Profile</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;