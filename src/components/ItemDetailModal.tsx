import React from 'react';
import { useApp } from '../context/AppContext';
import { getOptimizedImageUrl } from '../services/cloudinary';
import { X, Sparkles, Coffee, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const { selectedDishModal, setSelectedDishModal, categories, businessSettings } = useApp();

  if (!selectedDishModal) return null;

  const categoryName =
    categories.find((c) => c.id === selectedDishModal.category)?.name || selectedDishModal.category;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={() => setSelectedDishModal(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl border border-[#E8D5C4] z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDishModal(null)}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md text-[#2B1E16] hover:bg-white p-2.5 rounded-full shadow-md transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image or Header */}
        {selectedDishModal.imageUrl ? (
          <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden shrink-0">
            <img
              src={selectedDishModal.imageUrl}
              alt={selectedDishModal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-[#2B1E16]/80 backdrop-blur-md rounded-full border border-white/20">
                {categoryName}
              </span>
              {selectedDishModal.isFeatured && (
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#C59B6D] text-[#2B1E16] rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#FAF7F2] border-b border-[#E8D5C4] flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white rounded-full border border-[#E8D5C4] text-stone-600">
              {categoryName}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-left space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E16]">
                {selectedDishModal.name}
              </h3>
              <p className="text-xs text-[#C59B6D] font-semibold uppercase tracking-wider mt-1">
                Yours Brunch and Cafe • Salé El Jadida
              </p>
            </div>

            <div className="text-right shrink-0">
              {selectedDishModal.priceMAD ? (
                <span className="text-2xl font-bold text-[#2B1E16]">
                  {selectedDishModal.priceMAD} <span className="text-sm font-semibold text-stone-500">DH</span>
                </span>
              ) : (
                <span className="text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg">
                  Price at café
                </span>
              )}
            </div>
          </div>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {selectedDishModal.description}
          </p>

          {/* Availability Status */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {selectedDishModal.isAvailable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="font-semibold text-[#2B1E16]">
                {selectedDishModal.isAvailable ? 'Available for Dine-in Today' : 'Temporarily Unavailable'}
              </span>
            </div>
            <span className="text-stone-500">Freshly prepared on order</span>
          </div>

          {/* Table Ordering Note */}
          <div className="pt-2 text-xs text-stone-500 border-t border-[#E8D5C4]/60 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-[#2B1E16]">
              <Coffee className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span>How to order:</span>
            </p>
            <p>
              Please let your barista or server know your dish choice when seated. You can also call us at{' '}
              <a href={`tel:${businessSettings.telephone || '+212537536666'}`} className="font-bold text-[#2B1E16] underline">
                {businessSettings.telephone || '+212 537-536666'}
              </a>{' '}
              for daily special inquiries.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-[#E8D5C4] flex items-center justify-end">
          <button
            onClick={() => setSelectedDishModal(null)}
            className="px-6 py-2.5 rounded-full bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] text-xs sm:text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
