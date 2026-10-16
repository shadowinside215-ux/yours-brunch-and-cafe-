import React from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, UtensilsCrossed, HeartHandshake, Users, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { businessSettings } = useApp();

  const mapsUrl =
    businessSettings.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe';

  const values = [
    {
      icon: Coffee,
      title: 'Coffee & Cafe Favorites',
      description: 'Velvety cafe lattes, robust espresso, and blended beverages crafted to start your morning right.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Sweet & Savory Brunch',
      description: 'Fluffy pancake stacks, light bowls, and savory brunch choices prepared fresh in Salé El Jadida.',
    },
    {
      icon: HeartHandshake,
      title: 'A Cozy, Welcoming Atmosphere',
      description: 'Pleasant decoration, attentive staff, and comfortable indoor and terrace seating.',
    },
    {
      icon: Users,
      title: 'A Place to Share Moments',
      description: 'The ideal setting to meet friends, enjoy a slow breakfast, or unwind in the afternoon.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-y border-[#E8D5C4]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Brand Philosophy Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative text-left"
          >
            <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-[#E8D5C4] shadow-md relative overflow-hidden space-y-6">
              
              <div className="w-12 h-12 rounded-2xl bg-[#2B1E16] text-[#C59B6D] flex items-center justify-center shadow-xs">
                <Coffee className="w-6 h-6" />
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C59B6D]">
                  Philosophy & Hospitality
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E16] leading-snug">
                  Slow mornings & shared tables.
                </h3>
              </div>

              <blockquote className="border-l-2 border-[#C59B6D] pl-4 italic text-stone-700 text-sm sm:text-base leading-relaxed">
                “Brunch is more than a meal. It's time to slow down, catch up with friends, enjoy a comforting coffee, and discover something delicious. Yours Brunch and Cafe brings together coffee-shop favorites, sweet treats, and savory brunch options for a relaxed café experience in Salé El Jadida.”
              </blockquote>

              <div className="pt-4 border-t border-[#E8D5C4] flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-[#2B1E16]">Yours Brunch and Cafe</span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#C59B6D] hover:underline font-medium"
                >
                  <MapPin className="w-3.5 h-3.5" /> Salé El Jadida
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Values & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#C59B6D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About the Cafe</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1E16] tracking-tight leading-tight">
              A Warm Table for Every Morning in Salé El Jadida.
            </h2>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Yours Brunch and Cafe welcomes you to enjoy peaceful mornings and relaxed afternoons. Whether you stop by for your daily morning espresso, a fresh breakfast bowl, or a leisurely weekend brunch with friends, our terrace and cozy interior offer the ideal setting.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4]/80 hover:border-[#C59B6D] transition-colors shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C59B6D] shrink-0 border border-[#E8D5C4] shadow-xs">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2B1E16] text-sm sm:text-base">
                      {v.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-normal">
                      {v.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
