import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, Info, Eye, Coffee, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MenuSection: React.FC = () => {
  const { categories, menuItems, setSelectedDishModal } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <section id="menu" className="py-20 bg-[#FAF7F2] text-[#2B1E16] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8D5C4] text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B6D] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Menu</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1E16] tracking-tight">
            Yours Brunch and Cafe Menu
          </h2>
          <p className="text-base sm:text-lg text-stone-600 mt-3 font-normal leading-relaxed">
            Discover our brunch favorites, artisanal coffee, and sweet and savory morning selections in Salé El Jadida.
          </p>

          {/* Pricing transparency note */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-stone-600 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-xl border border-[#E8D5C4] shadow-xs">
            <Info className="w-4 h-4 text-[#C59B6D] shrink-0" />
            <span>Authentic Moroccan M9ila Skillets: DH 22–40 per plate. Prepared fresh to order.</span>
          </div>
        </motion.div>

        {/* Filter Bar & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8D5C4]"
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#2B1E16] text-[#FAF7F2] shadow-sm scale-105'
                  : 'bg-white text-stone-700 hover:bg-[#F4EFEB] border border-[#E8D5C4]'
              }`}
            >
              All Categories ({menuItems.length})
            </button>

            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#2B1E16] text-[#FAF7F2] shadow-sm scale-105'
                      : 'bg-white text-stone-700 hover:bg-[#F4EFEB] border border-[#E8D5C4]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search dishes or drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8D5C4] rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-[#2B1E16] placeholder:text-stone-400 focus:outline-none focus:border-[#C59B6D] focus:ring-1 focus:ring-[#C59B6D] transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </motion.div>

        {/* Dishes Grid */}
        {filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => setSelectedDishModal(item)}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E8D5C4] hover:border-[#C59B6D] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer text-left"
                >
                  {/* Image if available, otherwise stylish typographic card */}
                  {item.imageUrl ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#2B1E16]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-[#2B1E16] px-4 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> Details
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-[#FAF7F2] border-b border-[#E8D5C4] flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center shadow-xs">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                        {categories.find((c) => c.id === item.category)?.name || item.category}
                      </span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B1E16] group-hover:text-[#C59B6D] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <div className="text-right shrink-0">
                          {item.priceMAD !== null ? (
                            <span className="text-base sm:text-lg font-bold text-[#2B1E16]">
                              {item.priceMAD} <span className="text-xs font-semibold text-stone-500">DH</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                              Price at café
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E8D5C4]/60 flex items-center justify-between text-xs text-stone-400">
                      <span
                        className={`font-semibold ${
                          item.isAvailable ? 'text-emerald-700' : 'text-stone-500'
                        }`}
                      >
                        {item.isAvailable ? 'Available Today' : 'Unavailable'}
                      </span>
                      <span className="text-[#C59B6D] font-bold group-hover:text-[#2B1E16] transition-colors flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Clean Empty Filter State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-[#E8D5C4] p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
              No dishes found
            </h3>

            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              We couldn't find any dishes matching "{searchQuery}". Try selecting another category or resetting your search.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-2.5 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] font-semibold rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[#C59B6D]" />
                <span>Reset Filters</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
