import React, { useState, useCallback } from 'react';
import { explainConcept } from '../services/geminiService';
import { SparklesIcon } from './icons';

const suggestionTopics = [
  "What is a Smart Contract?",
  "Explain Layer 2 Scaling",
  "What is Staking?",
  "What is a DAO?",
];

const GeminiExplainer = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async (currentTopic: string) => {
    if (!currentTopic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setExplanation('');
    try {
      const result = await explainConcept(currentTopic);
      setExplanation(result);
    } catch (err) {
      setError("Sorry, I couldn't fetch an explanation. Please check if the API key is configured and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExplanation(topic);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    fetchExplanation(suggestion);
  };
  
  // A simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-lime-300 px-1 rounded">$1</code>')
      .replace(/(\n)/g, '<br />');
  };

  return (
    <section className="py-20 md:py-32 bg-black pt-32">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <SparklesIcon className="w-12 h-12 text-lime-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Web3 Concept Explainer</h2>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
          Stuck on a Web3 term? Ask our AI assistant, powered by Gemini, for a simple explanation.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., What is a DAO?"
            className="w-full sm:w-1/2 px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-md font-semibold transition-all duration-300 ease-in-out text-lg bg-lime-400 text-black hover:bg-lime-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading && !explanation ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed border-black rounded-full animate-spin mr-2"></div>
                Explaining...
              </>
            ) : (
              'Explain'
            )}
          </button>
        </form>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {suggestionTopics.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm rounded-full border transition-colors bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {isLoading && !explanation && (
           <div className="mt-4 p-4 text-center">
              <div className="w-6 h-6 border-2 border-dashed border-lime-400 rounded-full animate-spin mx-auto"></div>
           </div>
        )}

        {error && <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md">{error}</div>}

        {explanation && (
          <div className="mt-8 p-6 bg-[#111] border border-gray-800 rounded-xl text-left prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(explanation) }} className="leading-relaxed" />
          </div>
        )}
      </div>
    </section>
  );
};

export default GeminiExplainer;
