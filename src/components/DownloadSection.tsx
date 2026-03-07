"use client";

import { Download, Loader2, List } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

// Define TypeScript interfaces
interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}

interface DownloadSectionProps {
  latestRelease: GitHubRelease | null;
  loading: boolean;
  error: boolean;
}

const DownloadSection = ({ latestRelease, loading, error }: DownloadSectionProps) => {
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
    <section id="download" className="py-32 px-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto p-12 md:p-20 rounded-[40px] bg-white/5 backdrop-blur-3xl border border-white/10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              READY TO ELEVATE YOUR SCREEN?
            </h3>
            <p className="max-w-2xl mx-auto text-xl text-neutral-400 font-medium italic">
              Download Wallora today and join thousands of users enjoying a more beautiful device.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            {loading ? (
              <div className="bg-neutral-800 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 animate-pulse">
                <Loader2 size={24} className="animate-spin" />
                <span>Fetching latest release...</span>
              </div>
            ) : error ? (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/HexaGhost-09/wallora-2/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600/20 hover:bg-red-600/30 text-red-100 font-bold py-4 px-10 rounded-2xl transition-all duration-300 flex items-center gap-3 border border-red-500/30"
              >
                <span>Check GitHub Releases</span>
              </motion.a>
            ) : (
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                href={getApkDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black font-black py-5 px-12 rounded-2xl transition-all duration-300 flex items-center gap-3 text-xl group"
              >
                <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                <span>Get Wallora {latestRelease?.tag_name ? `(${latestRelease.tag_name})` : ''}</span>
              </motion.a>
            )}

            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.95 }}
              href="/releases"
              className="inline-flex items-center gap-3 py-5 px-12 rounded-2xl transition-all duration-300 text-white font-bold border border-white/10 hover:border-white/20 backdrop-blur-md text-xl"
            >
              <List size={24} />
              <span>Full Archive</span>
            </motion.a>
          </motion.div>
        </div>
        
        {/* Subtle decorative shapes */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-fuchsia-600/10 blur-[80px] -z-0" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-600/10 blur-[80px] -z-0" />
      </motion.div>
    </section>
  );
};

export default DownloadSection;