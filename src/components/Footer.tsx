import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 py-8 px-6">
      <div className="container mx-auto text-center text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Wallora. All rights reserved.</p>
        <p className="text-sm mt-2">Designed by <a href="https://github.com/HexaGhost-09" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">HexaGhost</a> to make your screen shine.</p>
      </div>
    </footer>
  );
}