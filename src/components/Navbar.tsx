import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Coffee, MapPin, Phone, Sparkles, ShieldCheck, Instagram } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { businessSettings, websiteSettings, setCurrentView, currentView } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }

      // Track active section for technical smoothness
      const sections = ['home', 'menu', 'signature', 'about', 'gallery', 'reviews', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Our Menu', href: '#menu', id: 'menu' },
    { name: 'Signature', href: '#signature', id: 'signature' },
    { name: 'Our Story', href: '#about', id: 'about' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Reviews', href: '#reviews', id: 'reviews' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (currentView === 'admin') {
      setCurrentView('public');
    }
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#C59B6D] via-[#D4A373] to-[#2B1E16] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Announcement Bar */}
      {websiteSettings.announcement && (
        <div className="bg-[#2B1E16] text-[#F5EFEB] py-2 px-4 text-xs sm:text-sm tracking-wide text-center border-b border-[#4A3326]/30 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B6D]" />
          <span>{websiteSettings.announcement}</span>
          <span className="hidden md:inline text-[#C59B6D]">•</span>
          <span className="hidden md:inline text-stone-300">Salé El Jadida, Morocco</span>
        </div>
      )}

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#E8D5C4]/70'
            : 'bg-[#FAF7F2] py-4 sm:py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Wordmark */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-11 h-11 rounded-full bg-white border border-[#E8D5C4] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 overflow-hidden p-0.5 shrink-0">
                <img
                  src={businessSettings.logoUrl || '/yours-logo.png'}
                  alt={businessSettings.name || 'Yours Brunch and Cafe'}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/yours-logo.png';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2B1E16] leading-none">
                  {businessSettings.name || 'Yours Brunch and Cafe'}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#C59B6D] font-semibold mt-1">
                  Brunch & Coffee • Salé El Jadida
                </span>
              </div>
            </a>

            {/* Desktop Navigation with Active Indicator */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    activeSection === link.id
                      ? 'text-[#2B1E16] font-bold'
                      : 'text-[#4A3326]/80 hover:text-[#C59B6D]'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C59B6D] rounded-full" />
                  )}
                </a>
              ))}
            </nav>

            {/* Actions: Instagram, Explore Menu, Admin */}
            <div className="hidden sm:flex items-center gap-3">
              {businessSettings.instagramUrl && (
                <a
                  href={businessSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-[#2B1E16] hover:bg-stone-200/60 transition-colors"
                  aria-label="Instagram"
                  title="Follow @yoursbrunchcafe"
                >
                  <Instagram className="w-4 h-4 text-[#C59B6D]" />
                </a>
              )}

              <a
                href="#menu"
                onClick={(e) => handleNavClick(e, '#menu')}
                className="bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 border border-[#4A3326]"
              >
                <Coffee className="w-4 h-4 text-[#C59B6D]" />
                <span>Explore Menu</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#2B1E16] hover:bg-stone-200/50 rounded-lg transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8D5C4] px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    activeSection === link.id
                      ? 'bg-[#E8D5C4]/50 text-[#2B1E16] font-bold'
                      : 'text-[#2B1E16] hover:bg-[#F4EFEB]'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-[#E8D5C4]/60 flex flex-col gap-2.5">
                <a
                  href="#menu"
                  onClick={(e) => handleNavClick(e, '#menu')}
                  className="w-full bg-[#2B1E16] text-[#FAF7F2] text-center py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <Coffee className="w-4 h-4 text-[#C59B6D]" />
                  <span>Explore the Menu</span>
                </a>
                <a
                  href={`tel:${businessSettings.telephone}`}
                  className="w-full text-center py-2 text-sm text-[#4A3326] flex items-center justify-center gap-2 font-medium"
                >
                  <Phone className="w-4 h-4 text-[#C59B6D]" />
                  <span>{businessSettings.telephone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
