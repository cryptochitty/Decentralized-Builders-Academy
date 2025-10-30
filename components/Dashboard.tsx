import React from 'react';
import { useEventData, Proposal } from '../hooks/useEventData';
import { useUserProfile } from '../hooks/useUserProfile';
import { MegaphoneIcon, TicketIcon, CalendarIcon } from './icons';

const Dashboard = () => {
  const { proposals, registrations } = useEventData();
  const { profile } = useUserProfile();

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Pending Review':
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {profile?.name || 'Builder'}!</h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12">Here's a summary of your recent activity in the academy.</p>

          <div className="grid lg:grid-cols-2 gap-12">
             {/* Proposals Section */}
             <div>
              <div className="flex items-center space-x-3 mb-6">
                <MegaphoneIcon className="w-8 h-8 text-lime-400" />
                <h3 className="text-2xl font-bold">My Event Proposals</h3>
              </div>
              <div className="space-y-4">
                {proposals.length > 0 ? (
                  <>
                    {proposals.slice(0, 3).map((p) => (
                      <div key={p.id} className="bg-[#111] border border-gray-800 p-5 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-white">{p.eventName}</h4>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(p.status)}`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-xs text-lime-300/80 font-semibold mt-2 flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1.5"/>
                            {new Date(p.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                    {proposals.length > 3 && (
                      <a href="#/my-proposals" className="text-lime-400 hover:underline text-sm font-semibold block text-right">View All Proposals →</a>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 bg-[#111] border border-dashed border-gray-800 rounded-lg">
                    <p className="text-gray-500">You haven't submitted any event proposals yet.</p>
                    <a href="#/events" className="text-lime-400 hover:underline mt-2 inline-block">Propose an event</a>
                  </div>
                )}
              </div>
            </div>

            {/* Registrations Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <TicketIcon className="w-8 h-8 text-lime-400" />
                <h3 className="text-2xl font-bold">My Registered Events</h3>
              </div>
              <div className="space-y-4">
                {registrations.length > 0 ? (
                  <>
                    {registrations.slice(0, 3).map((r) => (
                      <div key={r.id} className="bg-[#111] border border-gray-800 p-5 rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-lg text-white">{r.name}</h4>
                          <span className="text-gray-400 font-medium text-sm">{r.date}</span>
                        </div>
                      </div>
                    ))}
                    {registrations.length > 3 && (
                      <a href="#/my-registrations" className="text-lime-400 hover:underline text-sm font-semibold block text-right">View All Registrations →</a>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 bg-[#111] border border-dashed border-gray-800 rounded-lg">
                    <p className="text-gray-500">You haven't registered for any events yet.</p>
                     <a href="#/events" className="text-lime-400 hover:underline mt-2 inline-block">Browse events</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;