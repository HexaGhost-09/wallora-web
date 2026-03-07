"use client";

import { Bug, MessageSquare } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const FeedbackSection = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="container mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-4 mb-12"
        >
          <h4 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            HELP US IMPROVE
          </h4>
          <p className="max-w-2xl mx-auto text-xl text-neutral-400 font-medium italic">
            Your feedback helps us make Wallora even better. Have an idea, a feature request, or found a bug?
          </p>
        </motion.div>

        <div className="flex justify-center items-center flex-wrap gap-6">
          {/* Feedback Badge */}
          <motion.a
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://github.com/HexaGhost-09/wallora-2/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 py-3 px-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shadow-lg shadow-black/20"
          >
            <MessageSquare size={20} className="text-cyan-400" />
            <span className="font-bold text-white uppercase tracking-tight">Share a Suggestion</span>
          </motion.a>

          {/* Bug Report Badge */}
          <motion.a
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://github.com/HexaGhost-09/wallora-2/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 py-3 px-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shadow-lg shadow-black/20"
          >
            <Bug size={20} className="text-fuchsia-400" />
            <span className="font-bold text-white uppercase tracking-tight">Report a Bug</span>
          </motion.a>
        </div>
      </div>
      
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default FeedbackSection;