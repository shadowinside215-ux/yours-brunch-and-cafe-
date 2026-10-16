import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { getAuth, Auth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  BusinessSettings,
  WebsiteSettings,
  MenuCategory,
  MenuItem,
  GalleryImage,
} from '../types';
import {
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_GALLERY_IMAGES,
} from '../data/initialData';

// Firestore Error Handling matching skill requirements
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Check for Firebase environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)';

export const isFirebaseConfigured = Boolean(apiKey && projectId && authDomain);

let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = databaseId && databaseId !== '(default)' ? getFirestore(app, databaseId) : getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization error, using local fallback store:', err);
  }
}

export { db, auth };

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuthUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuthUser?.uid || null,
      email: currentAuthUser?.email || null,
      emailVerified: currentAuthUser?.emailVerified || null,
      isAnonymous: currentAuthUser?.isAnonymous || null,
      tenantId: currentAuthUser?.tenantId || null,
      providerInfo: currentAuthUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local Storage Keys for Persistence when Firebase is unconfigured or offline
const STORAGE_KEYS = {
  BUSINESS: 'yours_brunch_business_settings_v4',
  WEBSITE: 'yours_brunch_website_settings_v4',
  CATEGORIES: 'yours_brunch_categories_v4',
  ITEMS: 'yours_brunch_menu_items_v4',
  GALLERY: 'yours_brunch_gallery_v4',
  DEMO_AUTH: 'yours_brunch_demo_auth_v4',
};

// Data Layer APIs with Seamless Firebase Sync + Offline Demo Storage

export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  if (db) {
    const docPath = 'settings/business';
    try {
      const snap = await getDoc(doc(db, 'settings', 'business'));
      if (snap.exists()) {
        const data = snap.data() as BusinessSettings;
        if (!data.logoUrl) {
          data.logoUrl = INITIAL_BUSINESS_SETTINGS.logoUrl;
        }
        return data;
      }
    } catch (err) {
      console.warn('Could not load settings from Firestore, using local data', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.BUSINESS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.logoUrl) {
        parsed.logoUrl = INITIAL_BUSINESS_SETTINGS.logoUrl;
      }
      return parsed;
    } catch {
      // fallback to initial
    }
  }
  return INITIAL_BUSINESS_SETTINGS;
}

export async function saveBusinessSettings(settings: BusinessSettings): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(settings));

  if (db) {
    const docPath = 'settings/business';
    try {
      await setDoc(doc(db, 'settings', 'business'), {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  }
}

export async function fetchWebsiteSettings(): Promise<WebsiteSettings> {
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'website'));
      if (snap.exists()) {
        return snap.data() as WebsiteSettings;
      }
    } catch (err) {
      console.warn('Could not load website settings from Firestore, using local data', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.WEBSITE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return INITIAL_WEBSITE_SETTINGS;
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.WEBSITE, JSON.stringify(settings));

  if (db) {
    const docPath = 'settings/website';
    try {
      await setDoc(doc(db, 'settings', 'website'), {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  }
}

export async function fetchCategories(): Promise<MenuCategory[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'menuCategories'));
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as MenuCategory);
        items.sort((a, b) => a.order - b.order);
        return items;
      }
    } catch (err) {
      console.warn('Could not load categories from Firestore, using local data', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return INITIAL_CATEGORIES;
}

export async function saveCategories(categories: MenuCategory[]): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

  if (db) {
    try {
      for (const cat of categories) {
        await setDoc(doc(db, 'menuCategories', cat.id), cat);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'menuCategories');
    }
  }
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'menuItems'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as MenuItem);
      }
    } catch (err) {
      console.warn('Could not load menu items from Firestore, using local data', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  return INITIAL_MENU_ITEMS;
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  const current = await fetchMenuItems();
  const index = current.findIndex((i) => i.id === item.id);
  const updated = index >= 0 ? [...current.slice(0, index), item, ...current.slice(index + 1)] : [...current, item];

  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));

  if (db) {
    const docPath = `menuItems/${item.id}`;
    try {
      await setDoc(doc(db, 'menuItems', item.id), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  }
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  const current = await fetchMenuItems();
  const updated = current.filter((i) => i.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));

  if (db) {
    const docPath = `menuItems/${itemId}`;
    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  }
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as GalleryImage);
        items.sort((a, b) => a.order - b.order);
        return items;
      }
    } catch (err) {
      console.warn('Could not load gallery from Firestore, using local data', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return INITIAL_GALLERY_IMAGES;
}

export async function saveGalleryImage(img: GalleryImage): Promise<void> {
  const current = await fetchGalleryImages();
  const index = current.findIndex((i) => i.id === img.id);
  const updated = index >= 0 ? [...current.slice(0, index), img, ...current.slice(index + 1)] : [...current, img];

  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));

  if (db) {
    const docPath = `gallery/${img.id}`;
    try {
      await setDoc(doc(db, 'gallery', img.id), img);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  }
}

export async function deleteGalleryImage(imageId: string): Promise<void> {
  const current = await fetchGalleryImages();
  const updated = current.filter((i) => i.id !== imageId);
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));

  if (db) {
    const docPath = `gallery/${imageId}`;
    try {
      await deleteDoc(doc(db, 'gallery', imageId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  }
}
