import React from 'react';
import { useLearningProgress } from '../hooks/useLearningProgress';

type LearningModule = {
    title: string,
    description: string,
    tags: string[],
    status: 'Start Learning' | 'Coming Soon'
};

// FIX: Use React.FC to correctly type the component props, which allows for React-specific props like `key`.
const LearningModuleCard: React.FC<LearningModule> = ({ title, description, tags, status }) => {
    const { enrolledModules, enrollInModule } = useLearningProgress();
    const isEnrolled = enrolledModules.includes(title);

    const currentStatus = isEnrolled ? 'In Progress' : status;

    return (
        <div className="bg-[#111] border border-gray-800 p-6 rounded-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded bg-lime-400/10 text-lime-300 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
            <button
                onClick={() => enrollInModule(title)}
                disabled={status === 'Coming Soon' || isEnrolled}
                className={`w-full mt-6 px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out text-sm ${
                    status === 'Coming Soon'
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : isEnrolled
                        ? 'bg-lime-900/80 text-lime-300 border border-lime-700/50 cursor-default'
                        : 'bg-lime-400 text-black hover:bg-lime-300'
                }`}
            >
                {currentStatus}
            </button>
        </div>
    );
}

const learningModules: LearningModule[] = [
    {
        title: 'Web3 Fundamentals',
        description: 'Understand the core concepts of blockchain, decentralization, cryptocurrencies, and the history of the web.',
        tags: ['Beginner', 'Core Concepts'],
        status: 'Start Learning',
    },
    {
        title: 'Smart Contract Development with Solidity',
        description: 'A deep dive into writing, testing, and deploying smart contracts on the Ethereum blockchain using Solidity.',
        tags: ['Intermediate', 'Development', 'Solidity'],
        status: 'Start Learning',
    },
    {
        title: 'Introduction to DeFi',
        description: 'Explore the world of Decentralized Finance. Learn about lending, borrowing, decentralized exchanges, and yield farming.',
        tags: ['Intermediate', 'DeFi'],
        status: 'Start Learning',
    },
    {
        title: 'Building a Full-Stack dApp',
        description: 'From smart contract to frontend. Learn how to connect a React application to the blockchain using ethers.js.',
        tags: ['Advanced', 'Full-Stack', 'React'],
        status: 'Coming Soon',
    },
    {
        title: 'NFTs and the Metaverse',
        description: 'Learn about non-fungible tokens (NFTs), their standards, marketplaces, and their role in the emerging metaverse.',
        tags: ['Beginner', 'NFTs'],
        status: 'Coming Soon',
    },
    {
        title: 'Zero-Knowledge Proofs Explained',
        description: 'An introduction to the revolutionary privacy technology powering the next generation of scalable and private applications.',
        tags: ['Advanced', 'ZK', 'Privacy'],
        status: 'Coming Soon',
    }
];

const LearnPage = () => {
    return (
        <section className="py-10 md:py-16">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-bold mb-2">Learning Tracks</h1>
                     <p className="text-gray-400 text-lg md:text-xl">
                        Curated courses and workshops to level up your Web3 skills, from beginner to advanced.
                     </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {learningModules.map(module => (
                        <LearningModuleCard key={module.title} {...module} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LearnPage;