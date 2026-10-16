import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Camera, Instagram, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AtmosphereGallery: React.FC = () => {
  const { gallery, activeLightboxIndex, setActiveLightboxIndex, businessSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Food', 'Coffee', 'Brunch', 'Interior', 'Terrace'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredGallery.length);
    }
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredGallery.length) % filteredGallery.length
      );
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredGallery.length]);

  const mapsUrl =
    businessSettings.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe';

  return (
    <section id="gallery" className="py-20 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8D5C4] text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B6D] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atmosphere & Space</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1E16] tracking-tight">
            Moments at Yours
          </h2>
          <p className="text-base sm:text-lg text-stone-600 mt-3 font-normal leading-relaxed">
            Authentic moments from our terrace and cozy café interior in Salé El Jadida.
          </p>
        </motion.div>

        {/* If gallery has items */}
        {gallery.length > 0 ? (
          <>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2B1E16] text-[#FAF7F2] shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-[#F4EFEB] border border-[#E8D5C4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Image Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredGallery.map((item, index) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => openLightbox(index)}
                    className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 border border-[#E8D5C4] cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.altText}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B1E16]/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                      <span className="text-[11px] font-bold text-[#C59B6D] uppercase tracking-wider mb-1">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                        {item.altText}
                      </p>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          /* Customer Atmosphere Showcase */
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl border border-[#E8D5C4] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center mx-auto shadow-xs">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C59B6D]">
                Visual Journal
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E16]">
                Terrace & Café Ambiance
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto">
                Explore our welcoming space in Salé El Jadida. Check out customer moments, freshly served brunch plates, and our terrace ambiance live on Instagram.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.instagram.com/yoursbrunchcafe/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-semibold rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                <span>See Photos on @yoursbrunchcafe</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] font-semibold rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#C59B6D]" />
                <span>Visit Us in Salé El Jadida</span>
              </a>
            </div>
          </motion.div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredGallery[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredGallery[activeLightboxIndex].imageUrl}
              alt={filteredGallery[activeLightboxIndex].altText}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C59B6D]">
                {filteredGallery[activeLightboxIndex].category} • {activeLightboxIndex + 1} / {filteredGallery.length}
              </span>
              <h3 className="font-serif text-xl font-bold mt-1">
                {filteredGallery[activeLightboxIndex].title}
              </h3>
              <p className="text-sm text-stone-300 max-w-lg mx-auto mt-1">
                {filteredGallery[activeLightboxIndex].altText}
              </p>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
