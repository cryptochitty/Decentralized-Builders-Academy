
'use client';

import React, { useEffect, useMemo } from 'react';
import { useEventData, Proposal } from '../hooks/useEventData';
import { useUserProfile } from '../hooks/useUserProfile';
import { MegaphoneIcon, ClockIcon, CheckCircleIcon } from './icons';

const StatusBadge: React.FC<{ status: Proposal['status'] }> = ({ status }) => {
  const styles = {
    'Approved': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Pending Review': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  }[status];

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

const MyProposalsPage: React.FC = () => {
  const { profile } = useUserProfile();
  const {
    proposals,
    globalProposals,
    loading,
    error,
    refresh,
  } = useEventData();

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Merge user proposals with global status
  const enrichedProposals = useMemo(() => {
    return proposals.map((p) => {
      const globalMatch = globalProposals.find((g) => g.id === p.id);
      return globalMatch ? { ...p, status: globalMatch.status } : p;
    });
  }, [proposals, globalProposals]);

  if (loading) {
    return (
      <section className="py-16 bg-black min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="h-10 bg-gray-800 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#111111] border border-gray-800 p-6 rounded-xl animate-pulse">
                <div className="h-6 bg-gray-800 rounded mb-3"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-2 bg-lime-400 text-black rounded-lg font-semibold hover:bg-lime-300"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-500/20">
            <MegaphoneIcon className="w-9 h-9 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            My Event Proposals
          </h1>
          <p className="text-gray-400 text-lg">
            Track the status of events you’ve proposed to the academy.
          </p>
        </header>

        {/* Proposals Grid */}
        {enrichedProposals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {enrichedProposals.map((p) => (
              <article
                key={p.id}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-lime-400/40 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white line-clamp-2">
                    {p.eventName}
                  </h3>
                  <StatusBadge status={p.status} />
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                  {p.eventDesc}
                </p>

                {/* Auto-approve timer */}
                {p.status === 'Pending Review' && (
                  <div className="flex items-center text-xs text-yellow-400">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>Auto-approving in ~5s...</span>
                  </div>
                )}

                {p.status === 'Approved' && (
                  <div className="flex items-center text-xs text-green-400">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    <span>Approved! Ready to promote.</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#111111] border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500 text-lg mb-4">
              You haven’t submitted any event proposals yet.
            </p>
            <a
              href="#/create-event"
              className="inline-flex items-center px-6 py-3 bg-lime-400 text-black rounded-lg font-bold hover:bg-lime-300 transition-all"
            >
              <MegaphoneIcon className="w-5 h-5 mr-2" />
              Propose Your First Event
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#/events"
            className="text-lime-400 hover:underline font-semibold"
          >
            ← Back to Events List
          </a>
        </div>
      </div>
    </section>
  );
};

export default MyProposalsPage;
