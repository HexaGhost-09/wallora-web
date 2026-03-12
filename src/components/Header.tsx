"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#why-wallora' },
    { name: 'Community', href: '/#contributors' },
    { name: 'Archive', href: '/releases' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="container mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
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
          
          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-20"
          >
            <nav className="flex flex-col items-center gap-8 px-6 w-full">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`text-3xl font-black tracking-tighter transition-all duration-300 uppercase ${
                      pathname === link.href ? 'text-cyan-400' : 'text-neutral-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                className="mt-4 w-full px-6"
              >
                <Link
                  href="/#download"
                  onClick={closeMenu}
                  className="block w-full text-center py-5 rounded-2xl bg-white text-black text-xl font-black uppercase tracking-tighter hover:bg-neutral-200 transition-colors shadow-xl shadow-white/5"
                >
                  Download Now
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
