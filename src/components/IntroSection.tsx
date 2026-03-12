"use client";

import { Star, Github, Users, Download, Package } from 'lucide-react';
import React from 'react';
import { motion, Variants } from 'framer-motion';

// ... (interfaces)
interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}

const formatStars = (num: number | null) => {
  if (num === null) return '...';
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
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } },
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6 pt-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto flex flex-col items-center text-center"
      >
        {/* Animated Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-3 mb-10">
          {/* GitHub Star Badge */}
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com/HexaGhost-09/wallora-2"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 py-2 px-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:border-white/20"
          >
            {/* Active Link indicator */}
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span>
            </div>
            <Github size={18} className="text-white" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">Star project</span>
              <div className="h-4 w-px bg-white/20"></div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white tracking-tight">{formatStars(stars)}</span>
              </div>
            </div>
          </motion.a>

          {/* Contributors Badge */}
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com/HexaGhost-09/wallora-2/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 py-2 px-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/20"
          >
            <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </div>
            <Users size={18} className="text-neutral-400 group-hover:text-white transition-colors" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-400 group-hover:text-white transition-colors">Contributors</span>
              <div className="h-4 w-px bg-white/20"></div>
              <span className="font-bold text-white tracking-tight">
                {contributorsCount !== null ? contributorsCount : '...'}
              </span>
            </div>
          </motion.a>

          {/* Version Badge */}
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com/HexaGhost-09/wallora-2/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 py-2 px-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/20"
          >
            <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </div>
            <Package size={18} className="text-cyan-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-400 group-hover:text-white transition-colors">{latestRelease?.tag_name || 'v1.3.6'}</span>
              <div className="h-4 w-px bg-white/20"></div>
              <span className="font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Latest
              </span>
            </div>
          </motion.a>
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mt-4 mb-8 leading-[0.85] uppercase"
        >
          <span className="block opacity-90">YOUR SCREEN</span>
          <span className="block bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
            REIMAGINED.
          </span>
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="max-w-xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral-400 mb-12 font-medium leading-relaxed"
        >
          Exclusive, high-quality backgrounds designed to make your device truly yours.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <motion.a
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            href="#download"
            className="w-full sm:w-auto bg-white text-black font-black py-4 sm:py-5 px-10 sm:px-14 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg sm:text-xl"
          >
            <Download size={22} />
            <span>Download Now</span>
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            href="/releases"
            className="w-full sm:w-auto text-white border border-white/20 font-bold py-4 sm:py-5 px-10 sm:px-14 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg sm:text-xl backdrop-blur-md"
          >
            <span>Read Updates</span>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-white/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
};

export default IntroSection;