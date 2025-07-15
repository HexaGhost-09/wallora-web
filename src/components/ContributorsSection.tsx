"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import the Image component
import { Star, Code, Github } from 'lucide-react'; // Keep this if you use the icon, remove if not.

interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

const ContributorCard = ({ contributor }: { contributor: Contributor }) => {
    return (
        <a
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 shadow-md hover:scale-105 transition-transform duration-300"
        >
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-white/20">
                <Image
                    src={contributor.avatar_url}
                    alt={`${contributor.login}'s avatar`}
                    width={80}
                    height={80}
                    className="object-cover"
                />
            </div>
            <h4 className="font-semibold text-sm text-neutral-200">{contributor.login}</h4>
            <span className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                <Code size={12} /> {contributor.contributions}
            </span>
        </a>
    );
};

const ContributorsSection = () => {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/contributors?per_page=6');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setContributors(data);
                }
            } catch (error) {
                console.error("Failed to fetch contributors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
    }, []);

    return (
        <section id="contributors" className="py-20 px-6 text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Community Contributions
            </h2>
            <p className="max-w-xl mx-auto text-neutral-400 mb-8">
                {/* Fixed the single quote here from "Don't" */}
                Our project is built by the community. It&apos;s all thanks to these amazing people!
            </p>

            {loading ? (
                <div className="text-neutral-400">Loading contributors...</div>
            ) : contributors.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                    {contributors.map(contributor => (
                        <ContributorCard key={contributor.login} contributor={contributor} />
                    ))}
                </div>
            ) : (
                <p className="text-neutral-400">No contributors found.</p>
            )}
        </section>
    );
};

export default ContributorsSection;