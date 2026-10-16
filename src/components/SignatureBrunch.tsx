import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Coffee, UtensilsCrossed, Wheat, Heart, MapPin, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export const SignatureBrunch: React.FC = () => {
  const { menuItems, setSelectedDishModal } = useApp();

  const featuredDishes = menuItems.filter((i) => i.isFeatured);

  const categoriesOverview = [
    {
      title: 'Sweet Brunch',
      desc: 'Pancake stacks, waffles, sweet pastries, and signature dessert plates.',
      icon: Sparkles,
    },
    {
      title: 'Savory Brunch',
      desc: 'Hearty warm dishes, traditional brunch comforts, and savory morning plates.',
      icon: UtensilsCrossed,
    },
    {
      title: 'Breakfast & Bowls',
      desc: 'Fresh fruit creations, morning grains, and lighter wholesome offerings.',
      icon: Wheat,
    },
    {
      title: 'Specialty Coffee',
      desc: 'Artisanal espresso, creamy lattes, iced coffees, and hot chocolates.',
      icon: Coffee,
    },
  ];

  return (
    <section id="signature" className="py-20 bg-white border-y border-[#E8D5C4]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B6D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yours Brunch Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1E16] tracking-tight">
              Signature Brunch Experience
            </h2>
            <p className="text-base sm:text-lg text-[#4A3326]/80 mt-3 font-normal leading-relaxed">
              Thoughtfully prepared brunch creations designed for slow mornings and shared tables in Salé El Jadida.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.querySelector('#menu');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2B1E16] hover:text-[#C59B6D] transition-colors pb-1 border-b-2 border-[#2B1E16] hover:border-[#C59B6D] cursor-pointer"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Featured Dishes Grid with Smooth Viewport Stagger */}
        {featuredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredDishes.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                onClick={() => setSelectedDishModal(item)}
                className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-[#E8D5C4] hover:border-[#C59B6D] shadow-xs hover:shadow-xl transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C59B6D] uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-[#E8D5C4]">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                    <span className="text-lg font-bold text-[#2B1E16]">
                      {item.priceMAD !== null ? `${item.priceMAD} DH` : 'Price at café'}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1E16] mt-4 group-hover:text-[#C59B6D] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#E8D5C4]/70 flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Prepared Fresh Daily
                  </span>
                  <span className="text-[#2B1E16] group-hover:text-[#C59B6D] font-bold flex items-center gap-1 transition-colors">
                    <span>View Recipe Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Sleek Typographic Category Pillars */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesOverview.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-[#E8D5C4] hover:shadow-md transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center mb-4 group-hover:bg-[#2B1E16] group-hover:text-[#FAF7F2] transition-colors shadow-xs">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2B1E16]">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E8D5C4]/60 flex items-center justify-between text-xs text-stone-400">
                  <span>Yours Brunch and Cafe</span>
                  <span className="text-[#C59B6D] font-semibold">Salé El Jadida</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Customer Welcome Hospitality Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-6 sm:p-8 bg-[#FAF7F2] rounded-3xl border border-[#E8D5C4] flex flex-col sm:flex-row items-center justify-between gap-6 text-left"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C59B6D]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Dine-In & Terrace Seating</span>
            </div>
            <h4 className="font-serif font-bold text-lg sm:text-xl text-[#2B1E16]">
              Taste Our Signature Brunch Plates in Salé El Jadida
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
              Every dish is freshly crafted to order with premium ingredients, artisanal sourdough, and specialty coffee. Open daily until 11 PM.
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.querySelector('#contact');
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <MapPin className="w-4 h-4 text-[#C59B6D]" />
            <span>Find Our Location</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};
