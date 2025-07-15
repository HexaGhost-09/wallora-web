import { Star, Github, Users, Download, Package } from 'lucide-react';
import React from 'react';

// Define TypeScript interfaces (ensure these are consistent with WalloraLandingPageV2.tsx)
interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}

const formatStars = (num: number | null) => {
  if (num === null) return '...'; // Displays "..." if data is null (e.g., while loading or on error)
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};

interface IntroSectionProps {
  stars: number | null;
  contributorsCount: number | null;
  latestRelease: GitHubRelease | null;
}

const IntroSection = ({ stars, contributorsCount, latestRelease }: IntroSectionProps) => {
  return (
    <section className="relative text-center py-28 md:py-40 px-6">
      <div className="relative z-10 container mx-auto flex flex-col items-center">
        {/* Badges container */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
          {/* GitHub Star Badge */}
          <a
            href="https://github.com/HexaGhost-09/wallora-2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30"
          >
            <Github size={18} className="text-white" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Star us on GitHub</span>
              <div className="h-5 w-px bg-white/30"></div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400" />
                <span className="font-bold text-white">{formatStars(stars)}</span>
              </div>
            </div>
          </a>

          {/* Contributors Badge */}
          <a
            href="https://github.com/HexaGhost-09/wallora-2/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30"
          >
            <Users size={18} className="text-white" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Contributors</span>
              <div className="h-5 w-px bg-white/30"></div>
              <span className="font-bold text-white">
                {contributorsCount !== null ? contributorsCount : '...'}
              </span>
            </div>
          </a>

          {/* Release Version Badge */}
          <a
            href="https://github.com/HexaGhost-09/wallora-2/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30"
          >
            <Package size={18} className="text-white" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Version</span>
              <div className="h-5 w-px bg-white/30"></div>
              <span className="font-bold text-white">
                {latestRelease?.tag_name ? latestRelease.tag_name.replace('v', '') : '...'}
              </span>
            </div>
          </a>
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mt-6 mb-4 bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Your Screen, Reimagined.
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 mb-8">
          Step into a universe of breathtaking wallpapers. Wallora brings you exclusive, high-quality backgrounds to make your device truly yours.
        </p>
        <a
          href="#download"
          className="bg-white text-black font-semibold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-neutral-200 flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Download Now</span>
        </a>
      </div>
    </section>
  );
};

export default IntroSection;