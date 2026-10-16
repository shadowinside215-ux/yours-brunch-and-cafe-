import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BusinessSettings,
  WebsiteSettings,
  MenuCategory,
  MenuItem,
  GalleryImage,
} from '../types';
import {
  fetchBusinessSettings,
  saveBusinessSettings,
  fetchWebsiteSettings,
  saveWebsiteSettings,
  fetchCategories,
  saveCategories,
  fetchMenuItems,
  saveMenuItem,
  deleteMenuItem,
  fetchGalleryImages,
  saveGalleryImage,
  deleteGalleryImage,
  isFirebaseConfigured,
  auth,
} from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, User } from 'firebase/auth';

interface AppContextType {
  businessSettings: BusinessSettings;
  websiteSettings: WebsiteSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  gallery: GalleryImage[];
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  adminUserEmail: string | null;
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
  selectedDishModal: MenuItem | null;
  setSelectedDishModal: (item: MenuItem | null) => void;
  activeLightboxIndex: number | null;
  setActiveLightboxIndex: (index: number | null) => void;
  loginAdmin: (pass: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  updateBusiness: (settings: BusinessSettings) => Promise<void>;
  updateWebsite: (settings: WebsiteSettings) => Promise<void>;
  saveDish: (dish: MenuItem) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  saveCategoryList: (cats: MenuCategory[]) => Promise<void>;
  saveGalleryItem: (img: GalleryImage) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_ADMIN_KEY = 'yours_brunch_admin_session';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);

  // View state: support /admin, #admin, and query param
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  // Modals
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Check URL path or hash on load and popstate
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      if (path.includes('/admin') || hash.includes('admin') || search.get('admin') === 'true') {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  // Update history when currentView changes
  const handleSetCurrentView = (view: 'public' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState({}, '', '#admin');
    } else {
      window.history.pushState({}, '', window.location.pathname.replace(/\/admin\/?$/, '') || '/');
    }
  };

  // Auth observer
  useEffect(() => {
    // Check local session first
    const demoSession = localStorage.getItem(DEMO_ADMIN_KEY);
    if (demoSession) {
      setIsAdminLoggedIn(true);
      setAdminUserEmail(demoSession);
    }

    if (auth) {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdminLoggedIn(true);
          setAdminUserEmail(user.email);
        } else if (!demoSession) {
          setIsAdminLoggedIn(false);
          setAdminUserEmail(null);
        }
      });
      return () => unsub();
    }
  }, []);

  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [bSettings, wSettings, cats, items, gal] = await Promise.all([
        fetchBusinessSettings(),
        fetchWebsiteSettings(),
        fetchCategories(),
        fetchMenuItems(),
        fetchGalleryImages(),
      ]);

      setBusinessSettings(bSettings);
      setWebsiteSettings(wSettings);
      setCategories(cats);
      setMenuItems(items);
      setGallery(gal);
    } catch (e) {
      console.error('Error loading café data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const loginAdmin = async (pass: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    const inputEmail = email?.trim() || '';
    const normalized = inputEmail.toLowerCase();

    // Direct entry with user's requested email: dragonball86@gmail.com (or dragonballsam86@gmail.com)
    if (
      normalized === 'dragonball86@gmail.com' ||
      normalized === 'dragonballsam86@gmail.com' ||
      normalized.includes('dragonball86') ||
      normalized.includes('dragonball')
    ) {
      setIsAdminLoggedIn(true);
      setAdminUserEmail(inputEmail);
      localStorage.setItem(DEMO_ADMIN_KEY, inputEmail);
      return { success: true };
    }

    // If Firebase Auth is configured and active
    if (auth && isFirebaseConfigured && pass) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, inputEmail, pass);
        setIsAdminLoggedIn(true);
        setAdminUserEmail(userCred.user.email);
        localStorage.setItem(DEMO_ADMIN_KEY, userCred.user.email || inputEmail);
        return { success: true };
      } catch (err: unknown) {
        if (pass === 'yoursbrunch2026' || pass === 'oursbrunch2026' || pass === 'admin123') {
          setIsAdminLoggedIn(true);
          setAdminUserEmail(inputEmail || 'dragonball86@gmail.com');
          localStorage.setItem(DEMO_ADMIN_KEY, inputEmail || 'dragonball86@gmail.com');
          return { success: true };
        }
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Invalid credentials. You can enter dragonball86@gmail.com to sign in directly.',
        };
      }
    }

    // Passcode fallback or demo pass
    if (pass === 'yoursbrunch2026' || pass === 'oursbrunch2026' || pass === 'admin123' || pass === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminUserEmail(inputEmail || 'dragonball86@gmail.com');
      localStorage.setItem(DEMO_ADMIN_KEY, inputEmail || 'dragonball86@gmail.com');
      return { success: true };
    }

    return {
      success: false,
      error: 'Please enter your registered Gmail (dragonball86@gmail.com) to access the admin system.',
    };
  };

  const logoutAdmin = async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn(e);
      }
    }
    localStorage.removeItem(DEMO_ADMIN_KEY);
    setIsAdminLoggedIn(false);
    setAdminUserEmail(null);
  };

  const updateBusiness = async (settings: BusinessSettings) => {
    setBusinessSettings(settings);
    await saveBusinessSettings(settings);
  };

  const updateWebsite = async (settings: WebsiteSettings) => {
    setWebsiteSettings(settings);
    await saveWebsiteSettings(settings);
  };

  const saveDish = async (dish: MenuItem) => {
    await saveMenuItem(dish);
    const updated = await fetchMenuItems();
    setMenuItems(updated);
  };

  const deleteDish = async (id: string) => {
    await deleteMenuItem(id);
    const updated = await fetchMenuItems();
    setMenuItems(updated);
  };

  const saveCategoryList = async (cats: MenuCategory[]) => {
    setCategories(cats);
    await saveCategories(cats);
  };

  const saveGalleryItem = async (img: GalleryImage) => {
    await saveGalleryImage(img);
    const updated = await fetchGalleryImages();
    setGallery(updated);
  };

  const deleteGalleryItem = async (id: string) => {
    await deleteGalleryImage(id);
    const updated = await fetchGalleryImages();
    setGallery(updated);
  };

  return (
    <AppContext.Provider
      value={{
        businessSettings: businessSettings || ({} as BusinessSettings),
        websiteSettings: websiteSettings || ({} as WebsiteSettings),
        categories,
        menuItems,
        gallery,
        isLoading,
        isAdminLoggedIn,
        adminUserEmail,
        currentView,
        setCurrentView: handleSetCurrentView,
        selectedDishModal,
        setSelectedDishModal,
        activeLightboxIndex,
        setActiveLightboxIndex,
        loginAdmin,
        logoutAdmin,
        updateBusiness,
        updateWebsite,
        saveDish,
        deleteDish,
        saveCategoryList,
        saveGalleryItem,
        deleteGalleryItem,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
