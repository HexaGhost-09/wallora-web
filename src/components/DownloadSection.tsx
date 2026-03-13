"use client";

import { Download, Loader2, List, Smartphone, Monitor, Laptop, Terminal, Apple } from 'lucide-react';
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

const PLATFORMS = [
  { id: 'android', name: 'Android', ext: '.apk', icon: Smartphone, label: 'APK' },
  { id: 'windows', name: 'Windows', ext: '.exe', icon: Monitor, label: 'EXE' },
  { id: 'macos', name: 'macOS', ext: '.dmg', icon: Laptop, label: 'DMG' },
  { id: 'ios', name: 'iOS', ext: '.ipa', icon: Smartphone, label: 'IPA' },
  { id: 'linux', name: 'Linux', ext: '.tar.gz', icon: Terminal, label: 'TAR.GZ' },
];


const DownloadSection = ({ latestRelease, loading, error }: DownloadSectionProps) => {
  const getDownloadUrl = (ext: string) => {
    if (!latestRelease || !latestRelease.assets) return null;
    
    // Find asset that ends with the extension
    const asset = latestRelease.assets.find(a => a.name.toLowerCase().endsWith(ext.toLowerCase()));
    if (asset) {
      return `/api/track/download?url=${encodeURIComponent(asset.browser_download_url)}`;
    }
    return null;
  };


  return (
    <section id="download" className="py-20 md:py-32 px-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto p-8 sm:p-12 md:p-20 rounded-[32px] md:rounded-[40px] bg-white/5 backdrop-blur-3xl border border-white/10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative z-10 space-y-8 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent uppercase">
              READY TO ELEVATE YOUR SCREEN?
            </h3>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 font-medium italic">
              Download Wallora today and join thousands of users enjoying a more beautiful device.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {loading ? (
              <div className="col-span-full bg-neutral-800 text-white font-bold py-12 px-10 rounded-3xl flex flex-col items-center justify-center gap-4 animate-pulse border border-white/5">
                <Loader2 size={32} className="animate-spin text-cyan-400" />
                <span className="text-neutral-400">Syncing with GitHub...</span>
              </div>
            ) : error ? (
              <div className="col-span-full">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://github.com/HexaGhost-09/wallora-2/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-200 font-bold py-8 px-10 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-4 border border-red-500/20"
                >
                  <Download size={32} />
                  <span>Manual Download from GitHub Releases</span>
                </motion.a>
              </div>
            ) : (
              <>
                {PLATFORMS.map((platform, idx) => {
                  const url = getDownloadUrl(platform.ext);
                  return (
                    <motion.div
                      key={platform.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * idx }}
                      className="group relative"
                    >
                      <motion.a
                        whileHover={url ? { y: -8, boxShadow: '0 20px 40px -20px rgba(34, 211, 238, 0.4)' } : {}}
                        whileTap={url ? { scale: 0.95 } : {}}
                        href={url || `https://github.com/HexaGhost-09/wallora-2/releases`}
                        target={url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`h-full flex flex-col items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                          url 
                            ? 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5' 
                            : 'bg-neutral-900/50 border-white/5 opacity-50 cursor-not-allowed pointer-events-none'
                        }`}
                      >
                        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-cyan-500/10 transition-colors mb-4">
                          <platform.icon size={28} className={url ? 'text-white group-hover:text-cyan-400' : 'text-neutral-600'} />
                        </div>
                        <div className="space-y-1 text-center">
                          <h4 className="font-bold text-white text-lg">{platform.name}</h4>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                            {url ? platform.label : 'Coming Soon'}
                          </p>
                        </div>
                        <div className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                          url 
                            ? 'bg-white text-black group-hover:bg-cyan-400' 
                            : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          <Download size={14} />
                          <span>{url ? 'DOWNLOAD' : 'UNAVAILABLE'}</span>
                        </div>
                      </motion.a>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="pt-4"
          >
            <motion.a
              whileHover={{ scale: 1.05, color: '#fff' }}
              whileTap={{ scale: 0.95 }}
              href="/releases"
              className="inline-flex items-center gap-3 py-3 px-8 rounded-full transition-all duration-300 text-neutral-500 font-bold border border-white/5 hover:border-white/10 backdrop-blur-md text-sm uppercase tracking-widest"
            >
              <List size={18} />
              <span>Full Archive & Source Code</span>
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