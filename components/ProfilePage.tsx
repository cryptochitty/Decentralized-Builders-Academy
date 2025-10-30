import React, { useState, useEffect } from 'react';
import { useUserProfile, UserProfile } from '../hooks/useUserProfile';
import { useWallet } from '../hooks/useWallet';

const ALL_SKILLS = ['Developer', 'Designer', 'Community Manager', 'Content Creator', 'Project Manager', 'Memelord'];

const ProfilePage = () => {
    const { profile, saveProfile } = useUserProfile();
    const { address } = useWallet();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formState, setFormState] = useState<UserProfile>({
        name: '', bio: '', skills: []
    });

    useEffect(() => {
        if (profile) {
            setFormState(profile);
        }
    }, [profile]);
    
    const formatAddress = (addr: string | null) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    const toggleSkill = (skill: string) => {
        setFormState(prev => ({
            ...prev,
            skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            saveProfile(formState);
            setIsSaving(false);
            setIsEditing(false);
        }, 1000);
    };

    return (
        <section className="py-10 md:py-16">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold">My Profile</h1>
                        <p className="text-gray-400">{formatAddress(address)}</p>
                    </div>
                     <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out text-sm bg-gray-800 text-white hover:bg-gray-700"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <div className="bg-[#111] border border-gray-800 rounded-xl p-8">
                    {!isEditing ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-400">Display Name</h3>
                                <p className="text-lg text-white">{profile?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-400">Bio</h3>
                                <p className="text-white">{profile?.bio || 'No bio provided.'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-400">Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {profile?.skills && profile.skills.length > 0 ? (
                                        profile.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1.5 text-sm rounded-full bg-lime-400/10 text-lime-300 border border-lime-400/20">
                                                {skill}
                                            </span>
                                        ))
                                    ) : <p className="text-gray-500 text-sm">No skills listed.</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-6">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                <input type="text" id="name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} required className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all text-white" />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">Short Bio</label>
                                <textarea id="bio" value={formState.bio} onChange={e => setFormState({...formState, bio: e.target.value})} rows={3} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Skills / Interests</label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_SKILLS.map(skill => (
                                        <button type="button" key={skill} onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formState.skills.includes(skill) ? 'bg-lime-400 text-black border-lime-400' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'}`}>
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" disabled={!formState.name || isSaving} className="w-full px-8 py-3 rounded-md font-semibold transition-all duration-300 ease-in-out text-lg bg-lime-400 text-black hover:bg-lime-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
