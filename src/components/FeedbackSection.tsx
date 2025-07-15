import { Bug, MessageSquare } from 'lucide-react';
import React from 'react';

const FeedbackSection = () => {
  return (
    <div className="py-12 px-6">
      <div className="container mx-auto text-center">
        <h4 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">We&apos;d Love to Hear From You</h4>
        <p className="max-w-2xl mx-auto text-neutral-400 mb-8">Your feedback helps us make Wallora even better. Have an idea, a feature request, or found a bug?</p>
        <div className="flex justify-center items-center flex-wrap gap-4">
          {/* Feedback Badge */}
          <a
            href="https://github.com/HexaGhost-09/wallora-2/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30"
          >
            <MessageSquare size={18} className="text-white" />
            <span className="font-semibold text-white">Share a Suggestion</span>
          </a>

          {/* Bug Report Badge */}
          <a
            href="https://github.com/HexaGhost-09/wallora-2/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30"
          >
            <Bug size={18} className="text-white" />
            <span className="font-semibold text-white">Report a Bug</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;