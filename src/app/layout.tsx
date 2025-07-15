"use client"; // This is required for using client-side components like Databuddy

import React from 'react';
import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "./globals.css";
import { Databuddy } from '@databuddy/sdk'; // Import the Databuddy component

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Note: Metadata should be defined in a separate file or a Server Component.
// Moving the metadata object to its own file is a best practice.
// For now, we'll keep it here, but be aware that using "use client" can affect server-side features.
export const metadata: Metadata = {
  title: "Wallora - Your Screen, Reimagined",
  description: "Download Wallora for breathtaking, high-quality wallpapers for your mobile device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        {/* Animated Gradient Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
          <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vh] bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vh] bg-cyan-600/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        <Header />
        <main>
            {children}
        </main>
        <Footer />

        {/* Add the Databuddy component just before the closing body tag */}
        <Databuddy
          clientId="qfFIcKvJLpTYUnvl6Ry7e"
          trackHashChanges={true}
          trackAttributes={true}
          trackOutgoingLinks={true}
          trackInteractions={true}
          trackEngagement={true}
          trackScrollDepth={true}
          trackExitIntent={true}
          trackBounceRate={true}
          trackWebVitals={true}
          trackErrors={true}
          enableBatching={true}
        />
      </body>
    </html>
  );
}