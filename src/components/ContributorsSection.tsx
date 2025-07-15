"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { Github, Loader2 } from 'lucide-react';

// Define TypeScript interfaces
interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const ContributorsSection = () => {
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/contributors');
        if (!response.ok) {
          throw new Error('Failed to fetch contributors');
        }
        const data: GitHubContributor[] = await response.json();
        setContributors(data);
      } catch (e) {
        console.error("Failed to fetch contributors:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto text-center">
        <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Our Amazing Contributors</h3>
        <p className="max-w-2xl mx-auto text-neutral-400 mb-12">
          Wallora is an open-source project made possible by these wonderful individuals.
        </p>

        {loading ? (
          <div className="flex justify-center items-center gap-3 text-neutral-400">
            <Loader2 size={24} className="animate-spin" />
            <span>Loading contributors...</span>
          </div>
        ) : error ? (
          <p className="text-red-400">
            Couldn't load contributor data. Please check the GitHub repository directly.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map((contributor) => (
              <a
                key={contributor.login}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 transform hover:scale-105"
              >
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-white/20"
                />
                <span className="text-sm font-semibold text-white">{contributor.login}</span>
                <span className="text-xs text-neutral-400">({contributor.contributions} commits)</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContributorsSection;