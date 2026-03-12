import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 py-16 px-6 bg-neutral-900/30">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="md:col-span-2">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Wallora</h1>
          </Link>
          <p className="text-neutral-500 max-w-sm mx-auto md:mx-0">
            Exclusive, high-quality backgrounds designed to make your device truly yours. Join the community.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Navigation</h4>
          <ul className="space-y-2 text-neutral-500 text-sm">
            <li><Link href="/#why-wallora" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/#contributors" className="hover:text-white transition-colors">Contributors</Link></li>
            <li><Link href="/releases" className="hover:text-white transition-colors">Releases</Link></li>
            <li><Link href="/#download" className="hover:text-white transition-colors font-bold text-white">Download</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Connect</h4>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://github.com/HexaGhost-09/wallora-web" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="mailto:contact@wallora.com" className="text-neutral-500 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-white/5 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Wallora. All rights reserved.</p>
        <p className="mt-2 font-medium">Designed with ❤️ for your device.</p>
      </div>
    </footer>
  );
}