"use client";

import { Star, Eye, Zap, Palette } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, children, gradient, index }: {
  icon: React.ReactNode,
  title: string,
  children: React.ReactNode,
  gradient: string,
  index: number
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group relative p-1 rounded-3xl overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-all duration-500"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${gradient}`} />
    
    <div className="relative p-8 flex flex-col items-center text-center space-y-4">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${gradient} shadow-lg shadow-black/40 text-white transform group-hover:rotate-6 transition-transform duration-500`}>
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-white tracking-tight">{title}</h4>
      <p className="text-neutral-400 font-medium leading-relaxed">{children}</p>
    </div>
  </motion.div>
);

const WhyWalloraSection = () => {
  return (
    <section id="why-wallora" className="py-32 px-6">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h3 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            WHY WALLORA?
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-neutral-400 font-medium tracking-tight">
            Packed with features to make your wallpaper experience seamless and enjoyable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            index={0}
            icon={<Star size={32} />} 
            title="Exclusive Art" 
            gradient="bg-gradient-to-br from-fuchsia-500 to-purple-700"
          >
            {"Hand-picked wallpapers you won't find anywhere else."}
          </FeatureCard>
          <FeatureCard 
            index={1}
            icon={<Eye size={32} />} 
            title="Pure HD" 
            gradient="bg-gradient-to-br from-cyan-500 to-blue-700"
          >
            Crystal clear, high-resolution art that looks stunning on every screen.
          </FeatureCard>
          <FeatureCard 
            index={2}
            icon={<Zap size={32} />} 
            title="Blazing Fast" 
            gradient="bg-gradient-to-br from-lime-500 to-emerald-700"
          >
            A lightweight and optimized app for a smooth, lag-free experience.
          </FeatureCard>
          <FeatureCard 
            index={3}
            icon={<Palette size={32} />} 
            title="Daily Drops" 
            gradient="bg-gradient-to-br from-orange-500 to-rose-700"
          >
            Discover fresh wallpapers every day to keep your home screen exciting.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default WhyWalloraSection;