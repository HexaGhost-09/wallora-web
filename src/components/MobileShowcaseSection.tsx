"use client";

import { useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <section className="py-32 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
          
          {/* Advanced Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] -z-10 rounded-full scale-75" />
            
            <div className="relative w-[320px] h-[660px] p-[10px] rounded-[54px] bg-neutral-900 border-[6px] border-neutral-800 shadow-2xl">
              {/* Screen Content */}
              <div className="relative w-full h-full bg-black rounded-[42px] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-neutral-800 ml-auto mr-4" />
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt="Wallpaper preview"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </AnimatePresence>

                {/* Glass Reflection */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent z-10" />
              </div>
            </div>
          </motion.div>

          {/* Showcase Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h3 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                EXPERIENCE THE BEAUTY
              </h3>
              <p className="text-neutral-400 text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Browse our curated collections and find the perfect wallpaper that matches your style. High-resolution art for every screen.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4"
            >
              {wallpapers.map((wallpaper, idx) => (
                <motion.button
                  key={wallpaper.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  onClick={() => setActiveImage(wallpaper.src)}
                  className={`relative p-1 rounded-2xl overflow-hidden group transition-all duration-500 ${
                    activeImage === wallpaper.src 
                    ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-600' 
                    : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="relative w-full h-40 rounded-[14px] overflow-hidden">
                    <img 
                      src={wallpaper.src} 
                      alt={wallpaper.alt} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={handleImageError} 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcaseSection;