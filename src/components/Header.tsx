import React from 'react';
import { Download } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Wallora</h1>
        <a
          href="#download"
          className="bg-white text-black font-semibold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-neutral-200 flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Download</span>
        </a>
      </div>
    </header>
  );
}