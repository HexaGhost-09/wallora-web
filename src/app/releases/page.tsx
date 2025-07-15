"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { Download, Loader2, Calendar, Tag, FileText } from 'lucide-react';

// Define TypeScript interfaces for GitHub Release data
interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  body: string | null;
  html_url: string;
  assets: GitHubReleaseAsset[];
}

const ReleasesPage = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/releases');
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }
        const data: GitHubRelease[] = await response.json();
        setReleases(data);
      } catch (e) {
        console.error("Failed to fetch releases:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto py-24">
      <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-12 bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent text-center">
        All Releases
      </h2>
      {loading ? (
        <div className="flex justify-center items-center gap-3 text-neutral-400 text-lg">
          <Loader2 size={32} className="animate-spin" />
          <span>Loading releases...</span>
        </div>
      ) : error ? (
        <p className="text-red-400 text-center text-lg">
          Failed to load releases. Please try again later or check the GitHub repository directly.
        </p>
      ) : releases.length === 0 ? (
        <p className="text-neutral-400 text-center text-lg">No releases found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {releases.map((release) => (
            <div
              key={release.id}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <Tag size={24} className="text-cyan-400" />
                <h3 className="text-3xl font-bold text-white">{release.name || release.tag_name}</h3>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 mb-4">
                <Calendar size={18} />
                <span>Published: {new Date(release.published_at).toLocaleDateString()}</span>
              </div>
              {release.body && (
                <div className="text-neutral-300 leading-relaxed mb-6 prose prose-invert max-w-none">
                  <h4 className="text-xl font-semibold text-white mb-2 flex items-center gap-2"><FileText size={20} /> Release Notes:</h4>
                  {release.body.split('\n').map((line, index) => (
                    <p key={index} className="mb-1">{line}</p>
                  ))}
                </div>
              )}
              {release.assets.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xl font-semibold text-white mb-3">Download Assets:</h4>
                  <div className="flex flex-wrap gap-4">
                    {release.assets.map((asset) => (
                      <a
                        key={asset.name}
                        href={asset.browser_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors duration-300"
                      >
                        <Download size={18} />
                        <span>{asset.name}</span>
                        <span className="text-xs text-neutral-300">({formatFileSize(asset.size)})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 text-right">
                <a
                  href={release.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  View on GitHub &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReleasesPage;