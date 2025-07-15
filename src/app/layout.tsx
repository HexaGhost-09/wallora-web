import React from 'react';
import type { Metadata } from "next";
import { Inter } from 'next/font/google'; // Import the Inter font
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "./globals.css";

// Configure the Inter font with subsets
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Optional: use as a CSS variable
});

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
      {/* Apply the Inter font class to the body */}
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
      </body>
    </html>
  );
}