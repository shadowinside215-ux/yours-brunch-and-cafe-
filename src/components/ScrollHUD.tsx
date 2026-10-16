import React, { useState, useEffect } from 'react';
import { ArrowUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SectionInfo {
  id: string;
  label: string;
  number: string;
}

const SECTIONS: SectionInfo[] = [
  { id: 'home', label: 'Welcome', number: '01' },
  { id: 'menu', label: 'Menu', number: '02' },
  { id: 'signature', label: 'Highlights', number: '03' },
  { id: 'about', label: 'Our Story', number: '04' },
  { id: 'gallery', label: 'Atmosphere', number: '05' },
  { id: 'reviews', label: 'Reviews', number: '06' },
  { id: 'contact', label: 'Location', number: '07' },
];

export const ScrollHUD: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentY = window.scrollY;

          if (totalHeight > 0) {
            const pct = Math.min(100, Math.max(0, Math.round((currentY / totalHeight) * 100)));
            setScrollPercent(pct);
          }

          setIsVisible(currentY > 120);

          // Find current section
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const el = document.getElementById(SECTIONS[i].id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.4) {
                setCurrentSectionIndex(i);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToNextSection = () => {
    const nextIdx = (currentSectionIndex + 1) % SECTIONS.length;
    const target = document.getElementById(SECTIONS[nextIdx].id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const currentSection = SECTIONS[currentSectionIndex] || SECTIONS[0];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          aria-label="Navigation Controller"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 select-none"
        >
          {/* Sleek Floating Technical Pill */}
          <div className="bg-[#2B1E16]/95 backdrop-blur-md text-[#FAF7F2] pl-3.5 pr-2 py-1.5 rounded-full border border-[#C59B6D]/50 shadow-2xl flex items-center gap-3 transition-all duration-300 hover:border-[#C59B6D]">
            
            {/* Section Index Badge */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#C59B6D] tracking-widest font-bold">
                {currentSection.number}
              </span>
              <span className="text-[11px] font-semibold text-stone-200 tracking-wide uppercase">
                {currentSection.label}
              </span>
            </div>

            {/* Vertical divider */}
            <div className="w-[1px] h-3.5 bg-stone-700" />

            {/* Percentage Indicator */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#C59B6D]">
              <span>{scrollPercent}%</span>
            </div>

            {/* Jump Next Section Button */}
            <button
              onClick={scrollToNextSection}
              className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={`Jump to next: ${SECTIONS[(currentSectionIndex + 1) % SECTIONS.length]?.label}`}
              aria-label="Next section"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Smooth Top Button */}
            <button
              onClick={scrollToTop}
              className="w-7 h-7 rounded-full bg-[#C59B6D] hover:bg-[#D4A373] text-[#2B1E16] flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer"
              title="Smooth Scroll to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
