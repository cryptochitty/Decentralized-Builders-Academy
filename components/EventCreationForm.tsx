'use client';

import React, { useState, useEffect } from 'react';
import { useEventData } from '../hooks/useEventData';
import { CalendarIcon, ClockIcon, MegaphoneIcon } from './icons';

const EventCreationForm: React.FC = () => {
  const { addProposal } = useEventData();

  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validate = () => {
    if (!eventName.trim()) return 'Event name is required';
    if (eventName.length > 100) return 'Event name must be 100 characters or less';
    if (!eventDesc.trim()) return 'Description is required';
    if (eventDesc.length > 500) return 'Description must be 500 characters or less';
    if (!eventDate) return 'Date is required';
    const today = new Date();
    today.setHours(0,0,0,0);
    if (new Date(eventDate) < today) return 'Date cannot be in the past';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const newProposal = {
        eventName: eventName.trim(),
        eventDesc: eventDesc.trim(),
        eventDate: eventDate,
      };

      addProposal(newProposal);
      
      setSuccessMessage(`Proposal for "${newProposal.eventName}" submitted! It is now pending review.`);

      // Reset form
      setEventName('');
      setEventDesc('');
      setEventDate('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <a href="#/events" className="text-lime-400 hover:underline text-sm font-semibold mb-6 inline-block">
                &larr; Back to Events
          </a>
          <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-500/20">
            <MegaphoneIcon className="w-9 h-9 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Propose a New Event
          </h1>
          <p className="text-gray-400 text-lg">
            Share your idea with the Decentralized Builders Academy community.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            role="alert"
            className="mb-8 p-5 bg-green-900/30 border border-green-600 rounded-lg text-green-300 text-center animate-fade-in"
          >
            <p className="font-semibold">{successMessage}</p>
            <p className="text-sm mt-1">
              It will auto-approve in ~5 seconds. You can track its status on the "My Proposals" page.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="mb-8 p-5 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-center"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-gray-800 rounded-xl p-8 shadow-2xl">
          <div className="space-y-7">

            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                <CalendarIcon className="w-5 h-5 mr-2 text-lime-400" />
                Event Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                maxLength={100}
                placeholder="e.g. Web3 Hackathon 2025"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                required
              />
              <p className="mt-1 text-xs text-gray-500">{eventName.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="eventDesc" className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                <MegaphoneIcon className="w-5 h-5 mr-2 text-lime-400" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="eventDesc"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="What is this event about? Who should attend?"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all resize-none"
                required
              />
              <p className="mt-1 text-xs text-gray-500">{eventDesc.length}/500</p>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="eventDate" className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                <ClockIcon className="w-5 h-5 mr-2 text-lime-400" />
                Event Date <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2
                ${
                  isSubmitting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-lime-400 text-black hover:bg-lime-300 hover:shadow-xl hover:shadow-lime-500/30 transform hover:-translate-y-0.5'
                }
                focus:outline-none focus:ring-4 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#111111]
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-dashed border-black rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Proposal</span>
              )}
            </button>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 text-center mt-6">
              Proposals are reviewed and auto-approved in ~5 seconds for demo purposes.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EventCreationForm;