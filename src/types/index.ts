export interface BusinessSettings {
  name: string;
  category: string;
  address: string;
  plusCode: string;
  telephone: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  service: string;
  closingTime: string;
  closingTimeNotice: string;
  instagramUrl: string;
  glovoUrl?: string;
  mapsUrl: string;
  logoUrl?: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  heroHeadline: string;
  heroSubheadline: string;
  isPublished: boolean;
  announcement: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceMAD: number | null; // null if unconfirmed price
  category: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  category: 'All' | 'Food' | 'Coffee' | 'Brunch' | 'Interior' | 'Terrace';
  altText: string;
  order: number;
}

export interface ReviewTheme {
  id: string;
  title: string;
  description: string;
  tag: string;
}
