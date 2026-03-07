"use client";

import React from 'react';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import "./globals.css";
import { DatabuddyScript } from '@/components/DatabuddyScript';
import { motion, AnimatePresence } from 'framer-motion';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/vault');

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Wallora - Your Screen, Reimagined</title>
        <meta name="description" content="Download Wallora for breathtaking, high-quality wallpapers for your mobile device." />
      </head>
      <body className={`${inter.className} antialiased bg-[#020202] text-white selection:bg-cyan-500/30 selection:text-white`}>
        {/* Animated Dynamic Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#020202]"></div>
          
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grain-y.com/images/noise.png')]"></div>

          {/* Dynamic Mesh Blobs */}
          <motion.div 
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vh] bg-fuchsia-600/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{
              x: [0, -150, 0],
              y: [0, 150, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vh] bg-cyan-600/10 rounded-full blur-[140px]" 
          />
          <motion.div 
            animate={{
              x: [0, 200, 0],
              y: [0, 200, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vh] bg-indigo-600/10 rounded-full blur-[160px]" 
          />
        </div>

        {!isAdminRoute && <Header />}
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        {!isAdminRoute && <Footer />}

        <AnalyticsTracker />
        <DatabuddyScript />
      </body>
    </html>
  );
}