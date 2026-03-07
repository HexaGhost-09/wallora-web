"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#why-wallora' },
    { name: 'Contributors', href: '/#contributors' },
    { name: 'Releases', href: '/releases' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            W
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Wallora
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-neutral-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#download"
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors"
          >
            Download
          </Link>
        </nav>

        {/* Mobile menu button could be added here later */}
      </div>
    </header>
  );
}