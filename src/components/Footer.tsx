import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Coffee, ArrowUp, Instagram, ShoppingBag, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { businessSettings, setCurrentView } = useApp();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const plusCode = businessSettings.plusCode || 'X7X8+FF, Salé El Jadida, Morocco';
  const mapsUrl =
    businessSettings.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe';

  const instagramUrl =
    businessSettings.instagramUrl || 'https://www.instagram.com/yoursbrunchcafe/?hl=en';

  return (
    <footer className="bg-[#2B1E16] text-[#FAF7F2] border-t border-[#4A3326] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#4A3326]/60 text-left">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2B1E16] overflow-hidden p-0.5 shrink-0 shadow-sm border border-[#4A3326]">
                <img
                  src={businessSettings.logoUrl || '/yours-logo.png'}
                  alt={businessSettings.name || 'Yours Brunch and Cafe'}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/yours-logo.png';
                  }}
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  {businessSettings.name || 'Yours Brunch and Cafe'}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C59B6D] font-semibold">
                  Salé El Jadida, Morocco
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-300 max-w-sm leading-relaxed">
              Slow mornings, handcrafted coffee, sweet moments, and savory brunch dishes. Relax, dine in, and savor comforting plates in Salé El Jadida.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4A3326] hover:bg-[#C59B6D] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram @yoursbrunchcafe"
                title="@yoursbrunchcafe"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C59B6D] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-stone-300 font-medium">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">Our Menu</a>
              </li>
              <li>
                <a href="#signature" className="hover:text-white transition-colors">Signature Experience</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Yours Brunch</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">Photo Gallery</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">Guest Reviews (3.7★)</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C59B6D] font-semibold">
              Visit Us in Salé El Jadida
            </h4>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59B6D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Plus Code: {plusCode}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#C59B6D] hover:underline block mt-0.5"
                  >
                    Open Yours Brunch in Google Maps →
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59B6D] shrink-0" />
                <a
                  href={`tel:${businessSettings.telephone || '+212537536666'}`}
                  className="hover:text-white transition-colors font-medium"
                >
                  {businessSettings.telephone || '+212 537-536666'}
                </a>
              </div>

              <div className="text-xs text-stone-400 pt-1">
                <p>Reported Daily Closing: 11:00 PM</p>
                <p className="mt-0.5">Dine-in Service • Price range MAD 50–100</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {currentYear} Yours Brunch and Cafe. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
