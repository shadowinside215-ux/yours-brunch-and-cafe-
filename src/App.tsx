import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignatureBrunch } from './components/SignatureBrunch';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { AtmosphereGallery } from './components/AtmosphereGallery';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ScrollHUD } from './components/ScrollHUD';
import { useScrollReveal } from './hooks/useScrollReveal';
import { Coffee } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, isLoading } = useApp();
  
  // Activate advanced viewport scroll reveal animations
  useScrollReveal();

  // Hidden keyboard trigger for admin system: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView(currentView === 'admin' ? 'public' : 'admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, setCurrentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-[#2B1E16] text-[#C59B6D] flex items-center justify-center shadow-lg animate-pulse mb-4">
          <Coffee className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2B1E16]">
          Yours Brunch and Cafe
        </h2>
        <p className="text-xs uppercase tracking-widest text-[#C59B6D] font-semibold mt-1">
          Salé El Jadida, Morocco
        </p>
      </div>
    );
  }

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-white text-[#2B1E16] flex flex-col selection:bg-[#2B1E16] selection:text-[#FAF7F2]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SignatureBrunch />
        <MenuSection />
        <AboutSection />
        <AtmosphereGallery />
        <ReviewsSection />
        <LocationContact />
      </main>
      <Footer />
      <ItemDetailModal />
      <ScrollHUD />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
