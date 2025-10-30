import React from 'react';
import { useEventData } from '../hooks/useEventData';
import { TrashIcon } from './icons';

const MyRegistrationsPage = () => {
    const { registrations, removeRegistration } = useEventData();

    return (
        <section className="py-10 md:py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                 <div className="mb-10">
                    <a href="#/dashboard" className="text-lime-400 hover:underline text-sm font-semibold">
                        &larr; Back to Dashboard
                    </a>
                    <h1 className="text-4xl font-bold mt-2">My Registered Events</h1>
                </div>

                <div className="space-y-4">
                    {registrations.length > 0 ? (
                        registrations.map((r) => (
                            <div key={r.id} className="bg-[#111] border border-gray-800 p-5 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-lg text-white">{r.name}</h4>
                                    <span className="text-gray-400 font-medium text-sm">{r.date}</span>
                                </div>
                                <button
                                    onClick={() => removeRegistration(r.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                    aria-label={`Cancel registration for ${r.name}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-12 bg-[#111] border border-dashed border-gray-800 rounded-lg">
                            <p className="text-gray-500">You haven't registered for any events yet.</p>
                            <a href="#/events" className="text-lime-400 hover:underline mt-2 inline-block">Browse upcoming events</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MyRegistrationsPage;
