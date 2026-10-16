import { BusinessSettings, WebsiteSettings, MenuCategory, MenuItem, GalleryImage } from '../types';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  name: 'Yours Brunch and Cafe',
  category: 'Coffee Shop / Brunch Restaurant',
  address: 'Salé El Jadida, Morocco',
  plusCode: 'X7X8+FF, Salé El Jadida, Morocco',
  telephone: '+212 537-536666',
  rating: 3.7,
  reviewCount: 122,
  priceRange: 'DH 22–40 per plate',
  service: 'Dine-in',
  closingTime: '11:00 PM',
  closingTimeNotice: 'Reported closing time is 11 PM. Complete schedule is subject to verification with the owner.',
  instagramUrl: 'https://www.instagram.com/yoursbrunchcafe/?hl=en',
  glovoUrl: '',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe',
  logoUrl: '/yours-logo.png',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_WEBSITE_SETTINGS: WebsiteSettings = {
  heroHeadline: 'Your Next Favorite Brunch Spot.',
  heroSubheadline: 'Authentic Moroccan M9ila skillets, artisanal coffee, and relaxed moments worth sharing. Welcome to Yours Brunch and Cafe in Salé El Jadida.',
  isPublished: true,
  announcement: 'Welcome to Yours Brunch and Cafe in Salé El Jadida • Open Daily until 11 PM',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_CATEGORIES: MenuCategory[] = [
  {
    id: 'm9ila-house',
    name: 'House & Kefta M9ila',
    description: 'Yours house signature skillet and traditional spiced Moroccan kefta skillet',
    order: 1,
  },
  {
    id: 'm9ila-seafood',
    name: 'Seafood M9ila (Fruits de Mer)',
    description: 'Fresh calamari, shrimp, mussels, and royal mixed seafood skillets in sizzling chermoula',
    order: 2,
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'yours-m9ila',
    name: 'Yours M9ila',
    description: 'The house signature skillet of Yours Brunch and Cafe. Sizzling farm eggs prepared in comforting spiced tomato sauce with Moroccan herbs and house seasoning, served piping hot with fresh bread.',
    priceMAD: 22,
    category: 'm9ila-house',
    imageUrl: '',
    isAvailable: true,
    isFeatured: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'm9ila-kefta',
    name: 'M9ila Kefta',
    description: 'Traditional bubbling skillet featuring Moroccan spiced minced beef meatballs (kefta), slow-simmered in rich tomato chermoula, garlic, cumin, and fresh cilantro.',
    priceMAD: 30,
    category: 'm9ila-house',
    imageUrl: '',
    isAvailable: true,
    isFeatured: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'm9ila-calamar',
    name: 'M9ila Calamar',
    description: 'Tender calamari sautéed in a sizzling virgin olive oil skillet with fresh garlic, chopped flat-leaf parsley, lemon, paprika, and savory Moroccan spices.',
    priceMAD: 35,
    category: 'm9ila-seafood',
    imageUrl: '',
    isAvailable: true,
    isFeatured: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'm9ila-crevette',
    name: 'M9ila Crevette',
    description: 'Succulent fresh pink shrimp cooked to perfection in a bubbling skillet with olive oil, garlic, mild chili, tomato chermoula, and fragrant garden herbs.',
    priceMAD: 35,
    category: 'm9ila-seafood',
    imageUrl: '',
    isAvailable: true,
    isFeatured: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'm9ila-bouzroug',
    name: 'M9ila Bouzroug',
    description: 'Authentic coastal Moroccan specialty: fresh mussels (bouzroug) simmered in a robust spiced tomato chermoula sauce with cumin, garlic, coriander, and lemon.',
    priceMAD: 30,
    category: 'm9ila-seafood',
    imageUrl: '',
    isAvailable: true,
    isFeatured: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'm9ila-mix',
    name: 'M9ila Mix',
    description: 'The grand royal skillet combining tender calamari, juicy shrimp, and spiced kefta meatballs in rich aromatic chermoula sauce.',
    priceMAD: 40,
    category: 'm9ila-seafood',
    imageUrl: '',
    isAvailable: true,
    isFeatured: true,
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_GALLERY_IMAGES: GalleryImage[] = [];
