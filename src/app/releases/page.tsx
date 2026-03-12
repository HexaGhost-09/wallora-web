"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { Download, Loader2, Github, ArrowUpRight, Package, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

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
  prerelease: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ReleaseCard = ({ release, index, isLatest }: { release: GitHubRelease; index: number; isLatest: boolean }) => {
  const [expanded, setExpanded] = useState(isLatest);
  const apk = release.assets.find(a => a.name.endsWith('.apk'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
      className={`relative flex gap-4 sm:gap-6 md:gap-10 group`}
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0 w-8 sm:w-10">
        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 mt-1 flex-shrink-0 z-10 transition-colors ${isLatest ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'bg-neutral-800 border-neutral-600 group-hover:border-neutral-400'}`} />
        <div className="w-px flex-1 bg-neutral-800 mt-2" />
      </div>

      {/* Card body */}
      <div className={`flex-1 mb-10 pb-2 rounded-[24px] sm:rounded-3xl border transition-colors duration-300 overflow-hidden ${isLatest ? 'border-cyan-500/30 bg-white/5' : 'border-white/8 bg-white/[0.03] hover:border-white/15'}`}>
        {/* Card Header */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isLatest ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30' : 'bg-white/5 text-neutral-400 border border-white/10'}`}>
                  {isLatest ? '⚡ Latest' : release.prerelease ? 'Pre-release' : 'Stable'}
                </span>
                <time className="text-xs text-neutral-500 font-medium">{formatDate(release.published_at)}</time>
              </div>
              <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${isLatest ? 'text-white' : 'text-neutral-200'}`}>
                {release.name || release.tag_name}
              </h3>
            </div>

            {/* Primary download button */}
            {apk && (
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href={`/api/track/download?url=${encodeURIComponent(apk.browser_download_url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isLatest ? 'bg-white text-black hover:bg-neutral-100 shadow-lg shadow-white/10' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              >
                <Download size={16} />
                <span>APK</span>
                <span className="text-xs font-normal opacity-60">{formatFileSize(apk.size)}</span>
              </motion.a>
            )}
          </div>
        </div>

        {/* Release Notes toggle */}
        {release.body && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between px-6 md:px-8 py-3 border-t border-white/5 text-neutral-500 hover:text-neutral-300 text-sm font-semibold transition-colors group/btn"
            >
              <span className="uppercase tracking-widest text-xs">Release Notes</span>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 py-6 border-t border-white/5">
                    <div className="prose prose-invert prose-sm prose-cyan max-w-none text-neutral-400
                      prose-headings:text-white prose-headings:font-bold
                      prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:my-4
                      prose-strong:text-neutral-200
                      prose-li:text-neutral-400
                      prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {release.body}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Footer with all assets + GitHub link */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 py-4 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {release.assets.filter(a => !a.name.endsWith('.apk')).map(asset => (
              <a
                key={asset.name}
                href={`/api/track/download?url=${encodeURIComponent(asset.browser_download_url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-medium border border-white/5 hover:border-white/15 transition-all"
              >
                <Download size={12} />
                {asset.name}
                <span className="opacity-50">{formatFileSize(asset.size)}</span>
              </a>
            ))}
          </div>
          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors font-medium"
          >
            <Github size={13} />
            <span>GitHub</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ReleasesPage = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repos/HexaGhost-09/wallora-web/releases')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: GitHubRelease[]) => { setReleases(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">
            <Package size={14} /> Release Archive
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-br from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent uppercase">
            CHANGELOG
          </h1>
          <p className="max-w-md mx-auto text-neutral-400 text-base md:text-lg font-medium">
            Every version, every update — fully documented. Download any release directly.
          </p>
          {releases.length > 0 && (
            <p className="text-sm text-neutral-600 font-medium">{releases.length} releases published</p>
          )}
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24 text-neutral-500">
            <Loader2 size={36} className="animate-spin text-cyan-500" />
            <p className="text-lg font-medium">Fetching releases…</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-neutral-400 text-lg">Couldn&apos;t load releases.</p>
            <a
              href="https://github.com/HexaGhost-09/wallora-web/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
            >
              <Github size={18} /> View on GitHub
            </a>
          </div>
        ) : releases.length === 0 ? (
          <p className="text-neutral-500 text-center py-24 text-lg">No releases yet.</p>
        ) : (
          <div>
            {releases.map((release, i) => (
              <ReleaseCard
                key={release.id}
                release={release}
                index={i}
                isLatest={i === 0}
              />
            ))}
            {/* Timeline end dot */}
            <div className="flex gap-6 md:gap-10">
              <div className="flex flex-col items-center w-10">
                <div className="w-3 h-3 rounded-full bg-neutral-800 border border-neutral-700" />
              </div>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">Beginning of changelog</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReleasesPage;