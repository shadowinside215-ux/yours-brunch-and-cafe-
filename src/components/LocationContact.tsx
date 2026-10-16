import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Clock, ExternalLink, Navigation, Instagram, ShoppingBag } from 'lucide-react';

export const LocationContact: React.FC = () => {
  const { businessSettings } = useApp();

  const phone = businessSettings.telephone || '+212 537-536666';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const plusCode = businessSettings.plusCode || 'X7X8+FF, Salé El Jadida, Morocco';
  
  // Directly link to exact name Yours Brunch and Cafe on Google Maps
  const mapsUrl =
    businessSettings.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe';

  const instagramUrl =
    businessSettings.instagramUrl || 'https://www.instagram.com/yoursbrunchcafe/?hl=en';

  return (
    <section id="contact" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B6D] block mb-2">
            Visit & Contact
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1E16] tracking-tight">
            Find Us in Salé El Jadida
          </h2>
          <p className="text-base sm:text-lg text-stone-600 mt-3 font-normal leading-relaxed">
            Join us for your morning espresso, a slow brunch with friends, or an evening treat.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Contact Cards & Delivery Options */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            
            {/* Main Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-6">
              
              {/* Business Name */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
                  {businessSettings.name || 'Yours Brunch and Cafe'}
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#C59B6D] font-semibold mt-1">
                  {businessSettings.category || 'Coffee Shop / Brunch Restaurant'}
                </p>
              </div>

              {/* Location Detail */}
              <div className="flex items-start gap-3.5 pt-2 border-t border-[#E8D5C4]/60">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C59B6D] flex items-center justify-center shrink-0 border border-[#E8D5C4]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Location / Address</p>
                  <p className="text-sm font-bold text-[#2B1E16] mt-0.5">{plusCode}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#C59B6D] hover:underline font-semibold mt-1.5"
                  >
                    <span>Direct Google Maps: Yours Brunch and Cafe</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone Detail */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#E8D5C4]/60">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C59B6D] flex items-center justify-center shrink-0 border border-[#E8D5C4]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Telephone & Inquiries</p>
                  <p className="text-base font-bold text-[#2B1E16] mt-0.5">{phone}</p>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] rounded-full text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span>Call Café Now</span>
                  </a>
                </div>
              </div>

              {/* Hours Detail */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#E8D5C4]/60">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C59B6D] flex items-center justify-center shrink-0 border border-[#E8D5C4]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Opening Hours</p>
                  <p className="text-sm font-bold text-[#2B1E16] mt-0.5">
                    Open Daily • Reported closing at 11:00 PM
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {businessSettings.closingTimeNotice || 'Subject to owner schedule verification. Please call ahead for holidays.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Social & Google Maps Quick Actions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#2B1E16]">
                Connect & Directions
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Official Instagram Button */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-2xl font-bold text-xs transition-opacity hover:opacity-95 shadow-xs"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@yoursbrunchcafe</span>
                </a>

                {/* Direct Google Maps Button */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2B1E16] hover:bg-[#4A3326] text-[#FAF7F2] rounded-2xl font-bold text-xs transition-colors shadow-xs"
                >
                  <Navigation className="w-4 h-4 text-[#C59B6D]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                Follow our daily freshly-baked specials on Instagram @yoursbrunchcafe or tap above for direct turn-by-turn directions.
              </p>
            </div>

          </div>

          {/* Right Column: Embedded Map View */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#E8D5C4] shadow-xs flex flex-col">
            <div className="p-4 sm:p-5 bg-white border-b border-[#E8D5C4] flex items-center justify-between text-left">
              <div>
                <span className="text-xs font-bold text-[#2B1E16] block">Interactive Map: Yours Brunch and Cafe</span>
                <span className="text-[11px] text-stone-500">Salé El Jadida, Morocco (X7X8+FF)</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2B1E16] text-[#FAF7F2] text-xs font-semibold rounded-full hover:bg-[#4A3326] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            {/* Map Frame */}
            <div className="relative flex-1 min-h-[380px] bg-stone-200">
              <iframe
                title="Yours Brunch and Cafe Salé El Jadida Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-6.8350%2C34.0200%2C-6.7950%2C34.0450&amp;layer=mapnik&amp;marker=34.0333%2C-6.8166"
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
              />
              
              {/* Map Floating Card */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8D5C4] shadow-lg max-w-[260px] text-left">
                <p className="text-xs font-bold text-[#2B1E16]">Yours Brunch and Cafe</p>
                <p className="text-[11px] text-stone-600 mt-0.5">Plus Code: X7X8+FF</p>
                <p className="text-[10px] text-[#C59B6D] font-bold mt-1">Salé El Jadida, Morocco</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
