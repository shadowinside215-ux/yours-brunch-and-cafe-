import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquareQuote, ExternalLink, Coffee, Heart, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ReviewsSection: React.FC = () => {
  const { businessSettings } = useApp();

  const themes = [
    { label: 'Cozy Atmosphere', icon: Coffee },
    { label: 'Kind Staff', icon: Heart },
    { label: 'Outdoor Terrace', icon: Star },
    { label: 'Pleasant Decoration', icon: Star },
    { label: 'Breakfast & Brunch Plates', icon: Coffee },
    { label: 'Generous Portions & Fair Value', icon: CheckCircle },
  ];

  const rating = businessSettings.rating || 3.7;
  const reviewCount = businessSettings.reviewCount || 122;

  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;

  const mapsUrl =
    businessSettings.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe';

  return (
    <section id="reviews" className="py-20 bg-white border-y border-[#E8D5C4]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8D5C4] text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B6D] mb-3 shadow-xs">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Community Feedback</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1E16] tracking-tight">
            Guest Experiences & Rating
          </h2>
          <p className="text-base sm:text-lg text-stone-600 mt-3 font-normal leading-relaxed">
            Transparent feedback from our visitors in Salé El Jadida, shared on Google Maps.
          </p>
        </motion.div>

        {/* Rating Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#E8D5C4] shadow-xs max-w-4xl mx-auto mb-8 hover:shadow-lg transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            
            {/* Big Score */}
            <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-[#E8D5C4] pb-6 md:pb-0 md:pr-8">
              <span className="font-serif text-6xl sm:text-7xl font-bold text-[#2B1E16] block tracking-tight">
                {rating.toFixed(1)}
              </span>
              
              {/* Star graphics */}
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-6 h-6 ${
                      s <= fullStars
                        ? 'fill-amber-400 text-amber-500'
                        : s === fullStars + 1 && remainder >= 0.5
                        ? 'fill-amber-400/60 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm font-semibold text-[#2B1E16]">
                Overall Google Rating
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Based on {reviewCount} customer reviews on Google Maps
              </p>
            </div>

            {/* Reported Themes & Quotations */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2B1E16]">
                Frequently Mentioned by Guests
              </h3>
              
              {/* Themes grid */}
              <div className="flex flex-wrap gap-2">
                {themes.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-semibold text-[#4A3326] border border-[#E8D5C4] shadow-xs"
                  >
                    <t.icon className="w-3.5 h-3.5 text-[#C59B6D]" />
                    {t.label}
                  </span>
                ))}
              </div>

              {/* Verified Reviewer Quotation Excerpt */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8D5C4]/80 text-stone-700 text-xs sm:text-sm italic leading-relaxed mt-4">
                <span className="text-[#C59B6D] font-serif text-xl not-italic font-bold mr-1">“</span>
                Generous portions and reasonable prices, accompanied by a cozy atmosphere and kind staff.
                <span className="text-[#C59B6D] font-serif text-xl not-italic font-bold ml-1">”</span>
                <p className="not-italic text-[11px] text-stone-400 mt-1 font-medium">
                  — Verified Google Review Excerpt
                </p>
              </div>

              {/* Google Reviews Link */}
              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2B1E16] hover:text-[#C59B6D] transition-colors group cursor-pointer"
                >
                  <span className="group-hover:underline">Read all {reviewCount} reviews for Yours Brunch and Cafe on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C59B6D]" />
                </a>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Public Note */}
        <p className="text-center text-xs text-stone-400 max-w-xl mx-auto">
          All ratings reflect verified public Google reviews from guests visiting Yours Brunch and Cafe in Salé El Jadida.
        </p>

      </div>
    </section>
  );
};
