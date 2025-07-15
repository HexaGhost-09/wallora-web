"use client";

import { useState } from 'react';
import React from 'react';

const wallpapers = [
  { id: 1, src: 'https://images.unsplash.com/photo-1620766165236-42495b731a87?q=80&w=1887&auto=format&fit=crop', alt: 'Abstract 3D render' },
  { id: 2, src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop', alt: 'Colorful gradient' },
  { id: 3, src: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=1748&auto=format&fit=crop', alt: 'Liquid marble texture' },
  { id: 4, src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop', alt: 'Blue and pink abstract shapes' },
];

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = `https://placehold.co/300x650/0a0a0a/ffffff?text=Wallora`;
  e.currentTarget.onerror = null;
};

const MobileShowcaseSection = () => {
  const [activeImage, setActiveImage] = useState(wallpapers[0].src);

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Phone Mockup with Glassmorphism */}
          <div className="relative w-[300px] h-[650px] p-2 rounded-[48px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="relative w-full h-full bg-black rounded-[40px] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
              <img
                src={activeImage}
                alt="Wallpaper preview"
                className="w-full h-full object-cover transition-opacity duration-500"
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Showcase Content */}
          <div className="lg:w-1/3 text-center lg:text-left">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Experience the Beauty</h3>
            <p className="text-neutral-400 text-lg mb-8">
              Browse our curated collections and find the perfect wallpaper that matches your style. New additions every week!
            </p>
            <div className="grid grid-cols-2 gap-4">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => setActiveImage(wallpaper.src)}
                  className={`rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${activeImage === wallpaper.src ? 'border-cyan-500' : 'border-transparent'}`}
                >
                  <img src={wallpaper.src} alt={wallpaper.alt} className="w-full h-32 object-cover" onError={handleImageError} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcaseSection;