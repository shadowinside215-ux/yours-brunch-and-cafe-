import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Coffee, ArrowRight, Clock, Sparkles, Instagram, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { businessSettings, websiteSettings } = useApp();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const mapsUrl =
    businessSettings.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe';

  return (
    <section id="home" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#FAF7F2]">
      {/* Subtle organic ambient gradients with smooth pulse */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.45, 0.35],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#E8D5C4]/35 rounded-full blur-3xl pointer-events-none -mr-40 -mt-24"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.45, 0.6, 0.45],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#FAF0E6]/50 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-left"
          >
            
            {/* Top Verified Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8D5C4] shadow-xs text-xs sm:text-sm text-[#2B1E16] hover:border-[#C59B6D] transition-colors group cursor-pointer"
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                </div>
                <span className="font-bold text-[#2B1E16]">{businessSettings.rating || '3.7'}/5</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-medium group-hover:text-[#2B1E16]">{businessSettings.reviewCount || 122} Google Reviews</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8D5C4] shadow-xs text-xs text-[#2B1E16] hover:border-[#C59B6D] transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span className="font-semibold text-stone-700">Salé El Jadida, Morocco</span>
              </a>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59B6D] font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yours Brunch and Cafe</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B1E16] tracking-tight leading-[1.12] font-bold"
              >
                {websiteSettings.heroHeadline || 'Your Next Favorite Brunch Spot.'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="text-lg sm:text-xl text-[#4A3326]/85 font-normal leading-relaxed max-w-xl"
              >
                Slow mornings, handcrafted coffee, sweet treats, and savory brunch plates. Discover a warm table designed for relaxed moments in Salé El Jadida.
              </motion.p>
            </div>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => handleScroll('#menu')}
                className="bg-[#2B1E16] hover:bg-[#4A3326] text-[#FAF7F2] px-7 py-3.5 rounded-full text-base font-semibold transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-3 group border border-[#2B1E16] cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4 text-[#C59B6D] transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#F4EFEB] text-[#2B1E16] px-7 py-3.5 rounded-full text-base font-semibold transition-all duration-300 border border-[#D8CCC4] shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <Navigation className="w-4 h-4 text-[#C59B6D]" />
                <span>Directions on Google Maps</span>
              </a>
            </motion.div>

            {/* Business Pillars Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="pt-6 border-t border-[#E8D5C4]/80 grid grid-cols-3 gap-4 text-left"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Service</p>
                <p className="text-sm sm:text-base font-bold text-[#2B1E16] mt-0.5">Dine-in Experience</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Price Range</p>
                <p className="text-sm sm:text-base font-bold text-[#2B1E16] mt-0.5">DH 22–40</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Schedule</p>
                <p className="text-sm sm:text-base font-bold text-[#2B1E16] mt-0.5">Open Daily till 11 PM</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Sleek Architectural Identity Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-white rounded-3xl border border-[#E8D5C4] p-8 sm:p-10 shadow-xl relative overflow-hidden text-left space-y-6">
              
              {/* Subtle watermarked monogram */}
              <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-[#FAF7F2] text-[#E8D5C4] flex items-center justify-center font-serif text-8xl font-bold select-none pointer-events-none opacity-40">
                Y
              </div>

              {/* Badge */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8D5C4] flex items-center justify-center shadow-md overflow-hidden p-1 shrink-0">
                  <img
                    src={businessSettings.logoUrl || '/yours-logo.png'}
                    alt={businessSettings.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/yours-logo.png';
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-stone-500 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E8D5C4]">
                  Coffee & Brunch
                </span>
              </div>

              {/* Identity Presentation */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C59B6D] font-bold">
                  Yours Brunch and Cafe
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E16] leading-tight">
                  Handcrafted Mornings in Salé El Jadida
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  A serene, upscale café space offering specialty coffee, sweet brunch stacks, wholesome morning bowls, and comforting savory selections.
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4]/70">
                  <Clock className="w-4 h-4 text-[#C59B6D] shrink-0" />
                  <span className="text-xs text-stone-700 font-medium">Daily closing time reported at 11:00 PM</span>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4]/70 hover:border-[#C59B6D] transition-colors group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#C59B6D] shrink-0" />
                  <span className="text-xs text-stone-700 font-medium group-hover:text-[#2B1E16]">
                    Salé El Jadida, Morocco (Plus Code: X7X8+FF) →
                  </span>
                </a>

                <a
                  href="https://www.instagram.com/yoursbrunchcafe/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 border border-[#FD1D1D]/20 hover:border-[#FD1D1D]/40 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#FD1D1D]" />
                    <span className="text-xs font-bold text-[#2B1E16]">@yoursbrunchcafe</span>
                  </div>
                  <span className="text-[11px] text-[#FD1D1D] font-semibold group-hover:underline">
                    Follow on Instagram →
                  </span>
                </a>
              </div>

              {/* Verified Atmosphere Note */}
              <div className="pt-2 text-[11px] text-stone-400 border-t border-[#E8D5C4]/60">
                Freshly prepared every day • Sunny terrace seating & cozy indoor dining in Salé El Jadida.
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
