import { Download, Loader2, List } from 'lucide-react';
import React from 'react';

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
    <section id="download" className="py-20 px-6 text-center">
      <div className="container mx-auto p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Ready to Elevate Your Screen?</h3>
        <p className="max-w-xl mx-auto text-neutral-400 mb-8">
          Download Wallora today and join thousands of users enjoying a more beautiful device.
        </p>
        <div className="flex flex-col justify-center items-center gap-4">
          {loading ? (
            <div className="bg-neutral-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-3">
              <Loader2 size={20} className="animate-spin" />
              <span>Fetching latest release...</span>
            </div>
          ) : error ? (
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
          {/* Change this to a regular link to the new page */}
          <a
            href="/releases"
            className="inline-flex items-center gap-3 py-2 px-6 rounded-lg transition-all duration-300 hover:bg-white/10 transform hover:scale-105 border border-white/20"
          >
            <List size={20} />
            <span>View All Releases</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;