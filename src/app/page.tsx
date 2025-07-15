"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroSection from '@/components/IntroSection';
import MobileShowcaseSection from '@/components/MobileShowcaseSection';
import WhyWalloraSection from '@/components/WhyWalloraSection';
import DownloadSection from '@/components/DownloadSection';
import FeedbackSection from '@/components/FeedbackSection';

// Define TypeScript interfaces
interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}

interface GitHubData {
  stars: number | null;
  contributorsCount: number | null;
  latestRelease: GitHubRelease | null;
  loading: boolean;
  error: boolean;
}

export default function WalloraLandingPageV2() {
  const [githubData, setGithubData] = useState<GitHubData>({
    stars: null,
    contributorsCount: null,
    latestRelease: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repoData, contributorsData, releaseData] = await Promise.all([
          fetch('https://api.github.com/repos/HexaGhost-09/wallora-2').then(res => res.json()),
          fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/contributors').then(res => res.json()),
          fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/releases/latest').then(res => res.json())
        ]);

        setGithubData({
          stars: repoData.stargazers_count || null,
          contributorsCount: Array.isArray(contributorsData) ? contributorsData.length : null,
          latestRelease: releaseData.tag_name ? releaseData : null,
          loading: false,
          error: false
        });
      } catch (e) {
        console.error("Failed to fetch GitHub data", e);
        setGithubData(prev => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
        <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vh] bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vh] bg-cyan-600/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <Header />

      <main className="pt-24">
        <IntroSection stars={githubData.stars} contributorsCount={githubData.contributorsCount} />
        <MobileShowcaseSection />
        <WhyWalloraSection />
        <DownloadSection
          latestRelease={githubData.latestRelease}
          loading={githubData.loading}
          error={githubData.error}
        />
        <FeedbackSection />
      </main>

      <Footer />
    </div>
  );
}