"use client";

import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';

const wallpapers = [
  { id: 1, src: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=600&auto=format&fit=crop', alt: 'Pure Dark Abstract' },
  { id: 2, src: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=600&auto=format&fit=crop', alt: 'Neon Wave' },
  { id: 3, src: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=600&auto=format&fit=crop', alt: 'Glass Morphism' },
  { id: 4, src: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop', alt: 'Deep Gradient' },
];

const MobileShowcaseSection = () => {
  const [activeId, setActiveId] = useState(wallpapers[0].id);

  return (
    <section className="py-32 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex-shrink-0 w-full flex justify-center lg:w-auto"
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] -z-10 rounded-full scale-75" />

            {/* Phone Frame */}
            <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[300/620] h-auto rounded-[40px] sm:rounded-[50px] bg-neutral-900 border-[6px] border-neutral-800 shadow-2xl overflow-hidden">
              {/* Dynamic Island — pill shape only, no camera dot */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30" />

              {/*
               * Stacked images with CSS opacity crossfade.
               * This is intentionally NOT using next/image or motion.img because
               * AnimatePresence + scale transforms inside overflow:hidden caused a
               * black-screen rendering bug. Plain <img> with opacity transition is
               * the most reliable crossfade approach here.
               */}
              <div className="absolute inset-0">
                {wallpapers.map((wp) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={wp.id}
                    src={wp.src}
                    alt=""
                    role="presentation"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    style={{ opacity: activeId === wp.id ? 1 : 0 }}
                    loading="eager"
                  />
                ))}
              </div>

              {/* Glass Reflection */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent z-20" />
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
              className="grid grid-cols-2 gap-4"
            >
              {wallpapers.map((wallpaper, idx) => (
                <motion.button
                  key={wallpaper.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * idx }}
                  onClick={() => setActiveId(wallpaper.id)}
                  className={`relative overflow-hidden rounded-2xl group transition-all duration-300 ${
                    activeId === wallpaper.id
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-full h-36 overflow-hidden rounded-[14px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={wallpaper.src}
                      alt=""
                      role="presentation"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
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