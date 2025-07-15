"use client";

import { useState, useEffect } from 'react';
import React from 'react';

// Import all the components for each section of the page
// Note: Header and Footer are now in layout.tsx, so they are not needed here.
import IntroSection from '@/components/IntroSection';
import MobileShowcaseSection from '@/components/MobileShowcaseSection';
import WhyWalloraSection from '@/components/WhyWalloraSection';
import DownloadSection from '@/components/DownloadSection';
import FeedbackSection from '@/components/FeedbackSection';
import ContributorsSection from '@/components/ContributorsSection';

// Define TypeScript interfaces (ideally in a separate file)
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

export default function HomePage() {
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
        const [repoResponse, contributorsResponse, releaseResponse] = await Promise.all([
          fetch('https://api.github.com/repos/HexaGhost-09/wallora-2'),
          fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/contributors'),
          fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/releases/latest')
        ]);

        if (!repoResponse.ok || !contributorsResponse.ok || !releaseResponse.ok) {
          throw new Error('One or more GitHub API requests failed');
        }

        const repoData = await repoResponse.json();
        const contributorsData = await contributorsResponse.json();
        const releaseData = await releaseResponse.json();

        setGithubData({
          stars: repoData.stargazers_count || null,
          contributorsCount: Array.isArray(contributorsData) ? contributorsData.length : null,
          latestRelease: releaseData.tag_name ? releaseData : null,
          loading: false,
          error: false
        });
      } catch (e) {
        console.error("Failed to fetch GitHub data:", e);
        setGithubData(prev => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <IntroSection
        stars={githubData.stars}
        contributorsCount={githubData.contributorsCount}
        latestRelease={githubData.latestRelease}
      />
      <MobileShowcaseSection />

      <ContributorsSection />

      <WhyWalloraSection />
      <DownloadSection
        latestRelease={githubData.latestRelease}
        loading={githubData.loading}
        error={githubData.error}
      />
      <FeedbackSection />
    </>
  );
}