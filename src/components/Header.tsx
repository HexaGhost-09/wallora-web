"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#why-wallora' },
    { name: 'Community', href: '/#contributors' },
    { name: 'Archive', href: '/releases' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5"
    >
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20"
          >
            W
          </motion.div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent group-hover:via-white transition-all duration-500">
            WALLORA
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-bold tracking-tight transition-all duration-300 hover:text-white uppercase ${
                pathname === link.href ? 'text-white' : 'text-neutral-500'
              }`}
            >
              <motion.span whileHover={{ y: -2 }} className="inline-block">
                {link.name}
              </motion.span>
            </Link>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/#download"
              className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-black uppercase tracking-tighter hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
            >
              Download
            </Link>
          </motion.div>
        </nav>

        {/* Mobile menu button logic could be added here */}
      </div>
    </motion.header>
  );
}
