
import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useEventData, Proposal } from '../hooks/useEventData';
import { TicketIcon, CheckCircleIcon, CalendarIcon } from './icons';
import ConnectWalletModal from './ConnectWalletModal';

const Onboarding = () => {
  return (
    <section className="py-20 md:py-32 bg-black pt-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Events</h2>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            Browse upcoming events hosted by the community, or propose your own!
          </p>
        </div>

        <div className="text-center mb-12">
            <a href="#/create-event" className="px-6 py-3 rounded-md font-semibold transition-all duration-300 ease-in-out text-lg bg-lime-400 text-black hover:bg-lime-300">
                Propose a New Event
            </a>
        </div>

        <ParticipantFlow />
      </div>
    </section>
  );
};

const ParticipantFlow = () => {
    const { isConnected, signMessage } = useWallet();
    const { registrations, addRegistration, globalProposals } = useEventData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registeringId, setRegisteringId] = useState<string | null>(null);

    const availableEvents = globalProposals.filter(p => p.status === 'Approved');
    const registeredIds = registrations.map(r => r.id);

    const handleRegister = async (event: Proposal) => {
        if (!isConnected) {
            setIsModalOpen(true);
            return;
        }
        setRegisteringId(event.id);
        try {
            await signMessage(`Registering for event: ${event.eventName}`);
            addRegistration({ id: event.id, name: event.eventName, date: event.eventDate });
        } catch (error) {
            console.error('Failed to register', error);
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <div className="bg-[#111] border border-gray-800 p-8 rounded-xl">
             <h3 className="text-2xl font-bold mb-6 flex items-center"><TicketIcon className="w-6 h-6 mr-3 text-lime-400"/> Upcoming Events</h3>
             <div className="space-y-4">
                {availableEvents.length > 0 ? availableEvents.map(event => (
                    <div key={event.id} className="bg-gray-900 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="font-bold text-white">{event.eventName}</p>
                            <p className="text-sm text-gray-400 mt-1">{event.eventDesc}</p>
                            <div className="text-xs text-lime-300/80 font-semibold mt-2 flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1.5"/>
                                {new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <button
                            onClick={() => handleRegister(event)}
                            disabled={registeringId === event.id || registeredIds.includes(event.id)}
                            className="px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out text-sm disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 w-full sm:w-auto"
                            style={registeredIds.includes(event.id) ? { backgroundColor: '#3f6212', color: '#a3e635' } : { backgroundColor: '#a5fa52', color: 'black' }}
                        >
                           {registeringId === event.id ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-dashed border-black rounded-full animate-spin mr-2"></div>
                                    Signing...
                                </>
                           ) : registeredIds.includes(event.id) ? (
                                <>
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    Registered
                                </>
                           ) : (
                                'Register'
                           )}
                        </button>
                    </div>
                )) : (
                     <div className="text-center py-8">
                        <p className="text-gray-500">No upcoming events right now. Check back soon!</p>
                    </div>
                )}
             </div>
             {!isConnected && (
                <p className="text-center text-yellow-400 text-sm mt-6">Please <button type="button" onClick={() => setIsModalOpen(true)} className="underline hover:text-yellow-300">connect your wallet</button> to register for events.</p>
            )}
             <ConnectWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
};

export default Onboarding;
