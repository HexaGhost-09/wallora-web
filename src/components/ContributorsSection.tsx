"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Code, Github, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

const ContributorCard = ({ contributor, index }: { contributor: Contributor, index: number }) => {
    return (
        <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, scale: 1.05 }}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center p-6 rounded-[24px] bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-all duration-300"
        >
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/20 group-hover:border-cyan-500/50 transition-colors">
                <Image
                    src={contributor.avatar_url}
                    alt={`${contributor.login}'s avatar`}
                    width={96}
                    height={96}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{contributor.login}</h4>
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <Code size={14} className="text-neutral-400" />
                <span className="text-sm font-bold text-neutral-300">{contributor.contributions} tasks</span>
            </div>
            
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10 rounded-[24px]" />
        </motion.a>
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
        <section id="contributors" className="py-20 md:py-32 px-6 overflow-hidden">
            <div className="container mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-bold uppercase tracking-widest mb-2 md:mb-4">
                        <Users size={16} /> Community
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent uppercase">
                        THE ARTISTS BEHIND WALLORA
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 font-medium italic">
                        Our project is built by the community. It&apos;s all thanks to these amazing creators!
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-40 h-56 bg-white/5 rounded-[24px] animate-pulse" />
                        ))}
                    </div>
                ) : contributors.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
                        {contributors.map((contributor, idx) => (
                            <ContributorCard key={contributor.login} contributor={contributor} index={idx} />
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 text-center text-xl">The legend begins with you. Be the first contributor!</p>
                )}
            </div>
        </section>
    );
};

export default ContributorsSection;