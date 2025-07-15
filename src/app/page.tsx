"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { Star, Eye, Zap, Palette, Github, Loader2, Download } from 'lucide-react';

// Import the new components
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define TypeScript interfaces for GitHub Release data
interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
  // Add other properties if needed, e.g., 'name', 'body', 'published_at'
}

// --- Reusable Feature Card Component ---
const FeatureCard = ({ icon, title, children, gradient }: {
  icon: React.ReactNode,
  title: string,
  children: React.ReactNode,
  gradient: string
}) => (
  <div className="relative p-8 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
    <div className="absolute top-0 left-0 -z-10 w-full h-full opacity-20">
      <div className={`absolute w-48 h-48 rounded-full -top-12 -left-12 ${gradient} blur-3xl`}></div>
    </div>
    <div className="flex flex-col items-center text-center">
      <div className={`mb-6 w-16 h-16 rounded-full flex items-center justify-center ${gradient} shadow-lg`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-neutral-400 leading-relaxed">{children}</p>
    </div>
  </div>
);

// --- GitHub Star Badge Component ---
const GitHubBadge = ({ repo }: { repo: string }) => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch(e => console.error("Failed to fetch stars", e));
  }, [repo]);

  const formatStars = (num: number | null) => {
    if (num === null) return '...';
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <a
      href={`https://github.com/${repo}`}
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
  );
};


// --- Main Page Component ---
export default function WalloraLandingPageV2() {
  const [activeImage, setActiveImage] = useState('https://images.unsplash.com/photo-1620766165236-42495b731a87?q=80&w=1887&auto=format&fit=crop');
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
  const [loadingRelease, setLoadingRelease] = useState(true);
  const [releaseError, setReleaseError] = useState(false);

  const wallpapers = [
    { id: 1, src: 'https://images.unsplash.com/photo-1620766165236-42495b731a87?q=80&w=1887&auto=format&fit=crop', alt: 'Abstract 3D render' },
    { id: 2, src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop', alt: 'Colorful gradient' },
    { id: 3, src: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=1748&auto=format&fit=crop', alt: 'Liquid marble texture' },
    { id: 4, src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop', alt: 'Blue and pink abstract shapes' },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://placehold.co/300x650/0a0a0a/ffffff?text=Wallora`;
    e.currentTarget.onerror = null;
  };

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/HexaGhost-09/wallora-2/releases/latest');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GitHubRelease = await response.json();
        setLatestRelease(data);
      } catch (error) {
        console.error("Failed to fetch latest release from GitHub:", error);
        setReleaseError(true);
      } finally {
        setLoadingRelease(false);
      }
    };

    fetchLatestRelease();
  }, []);

  const getApkDownloadUrl = () => {
    if (latestRelease && latestRelease.assets) {
      const generalApk = latestRelease.assets.find(asset => asset.name.includes('app-release.apk'));
      if (generalApk) return generalApk.browser_download_url;

      const anyApk = latestRelease.assets.find(asset => asset.name.includes('.apk'));
      if (anyApk) return anyApk.browser_download_url;
    }
    return 'https://github.com/HexaGhost-09/wallora-2/releases';
  };

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
        {/* --- Hero Section --- */}
        <section className="relative text-center py-28 md:py-40 px-6">
          <div className="relative z-10 container mx-auto flex flex-col items-center">
            <GitHubBadge repo="HexaGhost-09/wallora-2" />
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mt-6 mb-4 bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Your Screen, Reimagined.
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 mb-8">
              Step into a universe of breathtaking wallpapers. Wallora brings you exclusive, high-quality backgrounds to make your device truly yours.
            </p>
            {/* Download button moved here */}
            <div className="flex justify-center items-center flex-wrap gap-4">
              {loadingRelease ? (
                <div className="bg-neutral-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Fetching latest release...</span>
                </div>
              ) : releaseError ? (
                <a
                  href="https://github.com/HexaGhost-09/wallora-2/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-800 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 border border-white/20"
                >
                  <span>Error fetching release. Click here for GitHub Releases.</span>
                </a>
              ) : (
                <a
                  href={getApkDownloadUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-fuchsia-500/30 flex items-center gap-3"
                >
                  <Download size={20} />
                  <span>Download APK {latestRelease?.tag_name ? `(${latestRelease.tag_name})` : ''}</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* --- App Showcase Section --- */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
              {/* Phone Mockup with Glassmorphism */}
              <div className="relative w-[300px] h-[650px] p-2 rounded-[48px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="relative w-full h-full bg-black rounded-[40px] overflow-hidden">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                   <img
                     src={activeImage}
                     alt="Wallpaper preview"
                     className="w-full h-full object-cover transition-opacity duration-500"
                     onError={handleImageError}
                   />
                </div>
              </div>

              {/* Showcase Content */}
              <div className="lg:w-1/3 text-center lg:text-left">
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Experience the Beauty</h3>
                <p className="text-neutral-400 text-lg mb-8">
                  Browse our curated collections and find the perfect wallpaper that matches your style. New additions every week!
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {wallpapers.map((wallpaper) => (
                    <button
                      key={wallpaper.id}
                      onClick={() => setActiveImage(wallpaper.src)}
                      className={`rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${activeImage === wallpaper.src ? 'border-cyan-500' : 'border-transparent'}`}
                    >
                      <img src={wallpaper.src} alt={wallpaper.alt} className="w-full h-32 object-cover" onError={handleImageError} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Why Wallora?</h3>
            <p className="max-w-2xl mx-auto text-neutral-400 mb-12">
              Packed with features to make your wallpaper experience seamless and enjoyable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<Star size={30} />} title="Exclusive Collections" gradient="bg-gradient-to-br from-fuchsia-500 to-purple-600">
                {"Hand-picked and AI-generated wallpapers you won't find anywhere else."}
              </FeatureCard>
              <FeatureCard icon={<Eye size={30} />} title="4K & HD Quality" gradient="bg-gradient-to-br from-cyan-500 to-blue-600">
                Crystal clear, high-resolution wallpapers that look stunning on any screen.
              </FeatureCard>
              <FeatureCard icon={<Zap size={30} />} title="Blazing Fast" gradient="bg-gradient-to-br from-lime-500 to-green-600">
                A lightweight and optimized app for a smooth, lag-free experience.
              </FeatureCard>
              <FeatureCard icon={<Palette size={30} />} title="Daily Updates" gradient="bg-gradient-to-br from-orange-500 to-red-600">
                Discover fresh wallpapers every day to keep your home screen exciting.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* --- Download CTA Section (kept for consistency with the original structure, but the primary download button is now in Hero) --- */}
        <section id="download" className="py-20 px-6 text-center">
          <div className="container mx-auto p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Ready to Elevate Your Screen?</h3>
            <p className="max-w-xl mx-auto text-neutral-400 mb-8">
              Download Wallora today and join thousands of users enjoying a more beautiful device.
            </p>
            {/* This section now serves as a secondary download prompt, or can be removed if desired */}
            <div className="flex justify-center items-center flex-wrap gap-4">
              {loadingRelease ? (
                <div className="bg-neutral-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Fetching latest release...</span>
                </div>
              ) : releaseError ? (
                <a
                  href="https://github.com/HexaGhost-09/wallora-2/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-800 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 border border-white/20"
                >
                  <span>Error fetching release. Click here for GitHub Releases.</span>
                </a>
              ) : (
                <a
                  href={getApkDownloadUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 border border-white/20"
                >
                  <Download size={20} />
                  <span>Download APK {latestRelease?.tag_name ? `(${latestRelease.tag_name})` : ''}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}