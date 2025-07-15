import { Star, Eye, Zap, Palette } from 'lucide-react';
import React from 'react';

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, children, gradient }: {
  icon: React.ReactNode,
  title: string,
  children: React.ReactNode,
  gradient: string
}) => (
  <div className="relative p-8 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
    <div className="absolute top-0 left-0 -z-10 w-full h-full opacity-20">
      <div className={`absolute w-48 h-48 rounded-full -top-12 -left-12 ${gradient} blur-3xl`}></div>
    </div>
    <div className="flex flex-col items-center text-center">
      <div className={`mb-6 w-16 h-16 rounded-full flex items-center justify-center ${gradient} shadow-lg`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-neutral-400 leading-relaxed">{children}</p>
    </div>
  </div>
);

const WhyWalloraSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto text-center">
        <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Why Wallora?</h3>
        <p className="max-w-2xl mx-auto text-neutral-400 mb-12">
          Packed with features to make your wallpaper experience seamless and enjoyable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<Star size={30} />} title="Exclusive Collections" gradient="bg-gradient-to-br from-fuchsia-500 to-purple-600">
            {"Hand-picked and AI-generated wallpapers you won't find anywhere else."}
          </FeatureCard>
          <FeatureCard icon={<Eye size={30} />} title="4K & HD Quality" gradient="bg-gradient-to-br from-cyan-500 to-blue-600">
            Crystal clear, high-resolution wallpapers that look stunning on any screen.
          </FeatureCard>
          <FeatureCard icon={<Zap size={30} />} title="Blazing Fast" gradient="bg-gradient-to-br from-lime-500 to-green-600">
            A lightweight and optimized app for a smooth, lag-free experience.
          </FeatureCard>
          <FeatureCard icon={<Palette size={30} />} title="Daily Updates" gradient="bg-gradient-to-br from-orange-500 to-red-600">
            Discover fresh wallpapers every day to keep your home screen exciting.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default WhyWalloraSection;