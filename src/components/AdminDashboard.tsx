import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BusinessSettings,
  WebsiteSettings,
  MenuItem,
  MenuCategory,
  GalleryImage,
} from '../types';
import { uploadAndProcessPhoto } from '../services/imageHelper';
import { isCloudinaryConfigured } from '../services/cloudinary';
import { isFirebaseConfigured } from '../services/firebase';
import {
  Lock,
  LogOut,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle,
  AlertCircle,
  Star,
  Coffee,
  Image as ImageIcon,
  Link as LinkIcon,
  Globe,
  Settings,
  FolderTree,
  Eye,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    businessSettings,
    updateBusiness,
    websiteSettings,
    updateWebsite,
    menuItems,
    saveDish,
    deleteDish,
    categories,
    saveCategoryList,
    gallery,
    saveGalleryItem,
    deleteGalleryItem,
    isAdminLoggedIn,
    adminUserEmail,
    loginAdmin,
    logoutAdmin,
    setCurrentView,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('dragonball86@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'business' | 'menu' | 'categories' | 'gallery' | 'website' | 'setup'>('business');

  // Business Form State
  const [bForm, setBForm] = useState<BusinessSettings>({ ...businessSettings });
  const [wForm, setWForm] = useState<WebsiteSettings>({ ...websiteSettings });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Menu Item Modal State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [dishForm, setDishForm] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    priceMAD: 50,
    category: categories[0]?.id || 'sweet-brunch',
    imageUrl: '',
    isAvailable: true,
    isFeatured: false,
  });
  // Image Upload Loading States
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);

  // Gallery Item Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryImage>>({
    title: '',
    category: 'Brunch',
    imageUrl: '',
    altText: '',
  });

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    const res = await loginAdmin(loginPassword, loginEmail);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed');
    }
  };

  const handleInstantGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    const res = await loginAdmin('', 'dragonball86@gmail.com');
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed');
    }
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusiness(bForm);
    showToast('Business details, logo, rating, and external links saved successfully!');
  };

  const handleSaveWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWebsite(wForm);
    showToast('Website headlines and visibility status saved!');
  };

  // Open Dish Edit
  const openEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishForm({ ...dish });
    setIsDishModalOpen(true);
  };

  const openNewDish = () => {
    setEditingDish(null);
    setDishForm({
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      priceMAD: 50,
      category: categories[0]?.id || 'sweet-brunch',
      imageUrl: '',
      isAvailable: true,
      isFeatured: false,
      updatedAt: new Date().toISOString(),
    });
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name) {
      alert('Dish name is required');
      return;
    }

    const dishToSave: MenuItem = {
      id: editingDish ? editingDish.id : (dishForm.id || `dish-${Date.now()}`),
      name: dishForm.name || '',
      description: dishForm.description || '',
      priceMAD: dishForm.priceMAD !== undefined ? dishForm.priceMAD : null,
      category: dishForm.category || categories[0]?.id || 'sweet-brunch',
      imageUrl: dishForm.imageUrl || '',
      isAvailable: dishForm.isAvailable ?? true,
      isFeatured: dishForm.isFeatured ?? false,
      updatedAt: new Date().toISOString(),
    };

    await saveDish(dishToSave);
    setIsDishModalOpen(false);
    showToast(`Dish "${dishToSave.name}" saved successfully!`);
  };

  const handleDeleteDish = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteDish(id);
      showToast(`Item removed from menu.`);
    }
  };

  // Image upload handler for Menu Dish
  const handleDishFileUpload = async (file: File) => {
    if (!file) return;

    setImageUploadLoading(true);
    try {
      const result = await uploadAndProcessPhoto(file, { maxWidth: 1200, maxHeight: 900, quality: 0.85 });
      setDishForm((prev) => ({
        ...prev,
        imageUrl: result.url,
        cloudinaryPublicId: result.publicId,
      }));
      showToast(result.source === 'cloudinary' ? 'Dish photo uploaded to Cloudinary!' : 'Dish photo attached & optimized!');
    } catch (err) {
      console.error(err);
      showToast('Error processing dish image');
    } finally {
      setImageUploadLoading(false);
    }
  };

  // Upload handler for Logo
  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    setLogoUploadLoading(true);
    try {
      const result = await uploadAndProcessPhoto(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setBForm((prev) => ({ ...prev, logoUrl: result.url }));
      showToast('Logo photo uploaded! Click "Save Business Settings" to apply live.');
    } catch (err) {
      console.error(err);
      showToast('Error processing logo image');
    } finally {
      setLogoUploadLoading(false);
    }
  };

  // Upload handler for Gallery
  const handleGalleryFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setGalleryUploadLoading(true);
    try {
      if (files.length === 1) {
        const file = files[0];
        const result = await uploadAndProcessPhoto(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.85 });
        setGalleryForm((prev) => ({
          ...prev,
          imageUrl: result.url,
          cloudinaryPublicId: result.publicId,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        showToast('Photograph uploaded & ready to save to gallery!');
      } else {
        // Multi-file batch upload
        let added = 0;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const result = await uploadAndProcessPhoto(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.85 });
          const newPhoto: GalleryImage = {
            id: `gal-${Date.now()}-${i}`,
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            category: (galleryForm.category as any) || 'Brunch',
            imageUrl: result.url,
            cloudinaryPublicId: result.publicId,
            altText: `Atmosphere photograph of Yours Brunch and Cafe in Salé El Jadida`,
            order: gallery.length + i + 1,
          };
          await saveGalleryItem(newPhoto);
          added++;
        }
        showToast(`Successfully added ${added} photographs to the gallery!`);
        setIsGalleryModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Error processing photograph(s)');
    } finally {
      setGalleryUploadLoading(false);
    }
  };

  // Add category handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: MenuCategory = {
      id,
      name: newCatName.trim(),
      description: newCatDesc.trim() || `${newCatName.trim()} dishes`,
      order: categories.length + 1,
    };

    const updated = [...categories, newCat];
    await saveCategoryList(updated);
    setNewCatName('');
    setNewCatDesc('');
    setIsCatModalOpen(false);
    showToast(`Category "${newCat.name}" added.`);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (window.confirm('Delete category? Items in this category will need reassigning.')) {
      const updated = categories.filter((c) => c.id !== catId);
      await saveCategoryList(updated);
      showToast('Category removed.');
    }
  };

  // Gallery Save
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) {
      alert('Image URL is required');
      return;
    }

    const newPhoto: GalleryImage = {
      id: `gal-${Date.now()}`,
      title: galleryForm.title || 'Yours Brunch Atmosphere',
      category: (galleryForm.category as any) || 'Brunch',
      imageUrl: galleryForm.imageUrl,
      altText: galleryForm.altText || 'Atmosphere photograph at Yours Brunch and Cafe in Salé El Jadida',
      order: gallery.length + 1,
    };

    await saveGalleryItem(newPhoto);
    setIsGalleryModalOpen(false);
    showToast('Photo added to public gallery!');
  };

  // Unauthenticated View
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8D5C4] shadow-2xl max-w-md w-full text-left space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#2B1E16] text-[#C59B6D] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <button
              onClick={() => setCurrentView('public')}
              className="text-xs text-stone-500 hover:text-[#2B1E16] flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to website</span>
            </button>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2B1E16]">
              Yours Brunch and Cafe Admin
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Sign in with your authorized Gmail to manage dishes, prices, ratings, and gallery.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* 1-Click Entry for dragonball86@gmail.com */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4] text-left space-y-3">
            <p className="text-xs font-bold text-[#2B1E16]">
              Authorized Administrator:
            </p>
            <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E8D5C4]">
              <span className="font-mono text-xs font-semibold text-[#2B1E16]">
                dragonball86@gmail.com
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>

            <button
              type="button"
              onClick={handleInstantGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-[#C59B6D]" />
              <span>{isLoggingIn ? 'Entering...' : 'Enter as dragonball86@gmail.com'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#E8D5C4] w-full" />
            <span className="bg-white px-3 text-[11px] text-stone-400 font-medium">Or enter custom email</span>
            <div className="border-t border-[#E8D5C4] w-full" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                Gmail Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:border-[#C59B6D]"
                placeholder="dragonball86@gmail.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#2B1E16] font-semibold rounded-xl text-xs transition-all cursor-pointer"
            >
              Sign In with this Email
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1E16] pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2B1E16] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium border border-[#C59B6D] animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-[#C59B6D]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-white border-b border-[#E8D5C4] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2B1E16] text-[#C59B6D] flex items-center justify-center font-bold font-serif text-lg">
              Y
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg text-[#2B1E16]">
                  Yours Brunch & Cafe Admin
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFirebaseConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isFirebaseConfigured ? 'Firestore Connected' : 'Ready'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Logged in as: {adminUserEmail || 'dragonball86@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentView('public')}
              className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] text-[#2B1E16] hover:bg-[#E8D5C4] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E8D5C4]"
            >
              <Eye className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2 rounded-full text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2 border-t border-stone-100 no-scrollbar">
          {[
            { id: 'business', label: 'Business & Links', icon: Settings },
            { id: 'menu', label: `Menu Dishes (${menuItems.length})`, icon: Coffee },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
            { id: 'gallery', label: `Photo Gallery (${gallery.length})`, icon: ImageIcon },
            { id: 'website', label: 'Website Headlines', icon: Globe },
            { id: 'setup', label: 'Deployment & Setup Guide', icon: LinkIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2B1E16] text-[#FAF7F2] shadow-xs'
                  : 'text-stone-600 hover:bg-[#FAF7F2]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: Business Details & External Links */}
        {activeTab === 'business' && (
          <form onSubmit={handleSaveBusiness} className="space-y-8 max-w-4xl text-left">
            {/* Brand Logo Upload Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8D5C4]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2B1E16]">
                    Brand Logo Photo & Graphic
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload the official logo for Yours Brunch and Cafe. Appears on the navbar, hero, and footer.
                  </p>
                </div>
                {bForm.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setBForm({ ...bForm, logoUrl: '' })}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                {/* Current Logo Preview */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="w-24 h-24 rounded-2xl bg-[#2B1E16] text-[#C59B6D] flex items-center justify-center border-2 border-dashed border-[#C59B6D]/50 shadow-sm overflow-hidden p-1 relative group"
                    title="Drag and drop a new logo photo here"
                  >
                    {bForm.logoUrl ? (
                      <img
                        src={bForm.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <Coffee className="w-10 h-10 text-[#C59B6D]" />
                    )}
                    {logoUploadLoading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold">
                        Uploading...
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {bForm.logoUrl ? 'Active Logo' : 'Default Monogram'}
                  </span>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#2B1E16] hover:bg-[#4A3326] text-[#FAF7F2] rounded-xl text-xs font-semibold shadow-xs transition-colors">
                      <Upload className="w-4 h-4 text-[#C59B6D]" />
                      <span>{logoUploadLoading ? 'Uploading Logo...' : 'Upload Logo from Device (PNG / SVG / JPG)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-stone-400">or paste image URL:</span>
                  </div>

                  <input
                    type="text"
                    placeholder="https://... (or click button above to upload photo from device)"
                    value={bForm.logoUrl || ''}
                    onChange={(e) => setBForm({ ...bForm, logoUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-xs text-[#2B1E16]"
                  />
                  <p className="text-[11px] text-stone-400">
                    Tip: You can also drag and drop an image file directly onto the logo box on the left.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] pb-2 border-b border-[#E8D5C4]">
                Core Business Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={bForm.name}
                    onChange={(e) => setBForm({ ...bForm, name: e.target.value })}
                    required
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={bForm.category}
                    onChange={(e) => setBForm({ ...bForm, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Telephone (Direct Call)
                  </label>
                  <input
                    type="text"
                    value={bForm.telephone}
                    onChange={(e) => setBForm({ ...bForm, telephone: e.target.value })}
                    required
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Google Maps Plus Code
                  </label>
                  <input
                    type="text"
                    value={bForm.plusCode}
                    onChange={(e) => setBForm({ ...bForm, plusCode: e.target.value })}
                    required
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={bForm.priceRange}
                    onChange={(e) => setBForm({ ...bForm, priceRange: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={bForm.closingTime}
                    onChange={(e) => setBForm({ ...bForm, closingTime: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Schedule Verification Notice
                </label>
                <input
                  type="text"
                  value={bForm.closingTimeNotice}
                  onChange={(e) => setBForm({ ...bForm, closingTimeNotice: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                />
              </div>
            </div>

            {/* Google Reviews Setting */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] pb-2 border-b border-[#E8D5C4] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Google Rating & Review Count</span>
              </h3>
              <p className="text-xs text-stone-500">
                Update the official rating and review count whenever new customer reviews are posted.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Current Rating (e.g. 3.7)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={bForm.rating}
                    onChange={(e) => setBForm({ ...bForm, rating: parseFloat(e.target.value) || 3.7 })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Total Reviews Count (e.g. 122)
                  </label>
                  <input
                    type="number"
                    value={bForm.reviewCount}
                    onChange={(e) => setBForm({ ...bForm, reviewCount: parseInt(e.target.value) || 122 })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>
              </div>
            </div>

            {/* Configurable Platform URLs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] pb-2 border-b border-[#E8D5C4]">
                Configurable External Links
              </h3>
              <p className="text-xs text-stone-500">
                Official links for Instagram and Google Maps directions for Yours Brunch and Cafe.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/yoursbrunchcafe/?hl=en"
                    value={bForm.instagramUrl}
                    onChange={(e) => setBForm({ ...bForm, instagramUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>


                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Google Maps Direct Search / Review URL
                  </label>
                  <input
                    type="url"
                    value={bForm.mapsUrl}
                    onChange={(e) => setBForm({ ...bForm, mapsUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] font-semibold rounded-2xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#C59B6D]" />
              <span>Save Business Settings</span>
            </button>
          </form>
        )}

        {/* TAB 2: Menu Items Management */}
        {activeTab === 'menu' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
                  Menu Management
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Create dishes, configure prices in MAD, set descriptions, and mark availability.
                </p>
              </div>

              <button
                onClick={openNewDish}
                className="px-5 py-2.5 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] font-semibold rounded-2xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C59B6D]" />
                <span>Add New Dish</span>
              </button>
            </div>

            {/* Dishes Table */}
            <div className="bg-white rounded-3xl border border-[#E8D5C4] overflow-hidden shadow-xs">
              {menuItems.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#C59B6D] flex items-center justify-center mx-auto border border-[#E8D5C4]">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#2B1E16]">
                    No Dishes in Menu Yet
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    All previous demo dishes have been removed. Click "Add New Dish" to enter your official dishes, prices, and descriptions.
                  </p>
                  <button
                    onClick={openNewDish}
                    className="mt-2 px-5 py-2 bg-[#2B1E16] text-[#FAF7F2] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span>Create Your First Dish</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8D5C4] text-stone-500 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (MAD)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#E8D5C4] shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8D5C4] flex items-center justify-center text-[#C59B6D] shrink-0">
                                <Coffee className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-[#2B1E16] block">{item.name}</span>
                              <span className="text-xs text-stone-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stone-600 font-medium">
                            {categories.find((c) => c.id === item.category)?.name || item.category}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#2B1E16]">
                            {item.priceMAD !== null ? `${item.priceMAD} MAD` : 'Price at café'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.isAvailable
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {item.isFeatured ? (
                              <span className="text-[#C59B6D] font-bold text-xs flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-[#C59B6D]" /> Yes
                              </span>
                            ) : (
                              <span className="text-stone-400 text-xs">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditDish(item)}
                              className="p-1.5 text-stone-600 hover:text-[#2B1E16] hover:bg-stone-100 rounded-lg cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDish(item.id, item.name)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Categories Management */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-3xl text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
                  Menu Categories
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Organize dishes into intuitive categories for your guests.
                </p>
              </div>

              <button
                onClick={() => setIsCatModalOpen(true)}
                className="px-4 py-2 bg-[#2B1E16] text-[#FAF7F2] font-semibold rounded-2xl text-xs sm:text-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C59B6D]" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8D5C4] divide-y divide-stone-100 shadow-xs">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#FAF7F2] text-[#2B1E16] border border-[#E8D5C4] text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#2B1E16]">
                        {cat.name}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 pl-8">
                      {cat.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Gallery Management */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
                  Atmosphere & Food Photographs
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the image gallery shown on the public website.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <label className="px-4 py-2.5 bg-white border border-[#E8D5C4] hover:bg-[#FAF7F2] text-[#2B1E16] font-semibold rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-4 h-4 text-[#C59B6D]" />
                  <span>{galleryUploadLoading ? 'Uploading Photos...' : 'Upload Photos from Device'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) handleGalleryFileUpload(e.target.files);
                    }}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-5 py-2.5 bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] font-semibold rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#C59B6D]" />
                  <span>Add with Details</span>
                </button>
              </div>
            </div>

            {gallery.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8D5C4] space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#C59B6D] flex items-center justify-center mx-auto border border-[#E8D5C4]">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2B1E16]">
                  No Photographs in Gallery Yet
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  All previous demo photos have been removed. Upload authentic photographs of Yours Brunch and Cafe to display them on the website.
                </p>
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="mt-2 px-5 py-2 bg-[#2B1E16] text-[#FAF7F2] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C59B6D]" />
                  <span>Upload Your First Photo</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E8D5C4] shadow-xs group"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100">
                      <img
                        src={img.imageUrl}
                        alt={img.altText}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#2B1E16]/80 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md">
                        {img.category}
                      </span>
                      <button
                        onClick={() => deleteGalleryItem(img.id)}
                        className="absolute top-3 right-3 bg-red-600/90 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow cursor-pointer"
                        title="Remove from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-bold text-sm text-[#2B1E16]">{img.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{img.altText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Website Headlines & Visibility */}
        {activeTab === 'website' && (
          <form onSubmit={handleSaveWebsite} className="space-y-6 max-w-3xl text-left">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] pb-2 border-b border-[#E8D5C4]">
                Hero & Announcement Content
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={wForm.heroHeadline}
                  onChange={(e) => setWForm({ ...wForm, heroHeadline: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Hero Supporting Subheadline
                </label>
                <textarea
                  rows={3}
                  value={wForm.heroSubheadline}
                  onChange={(e) => setWForm({ ...wForm, heroSubheadline: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Top Announcement Banner
                </label>
                <input
                  type="text"
                  value={wForm.announcement}
                  onChange={(e) => setWForm({ ...wForm, announcement: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={wForm.isPublished}
                  onChange={(e) => setWForm({ ...wForm, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#C59B6D]"
                />
                <label htmlFor="pubCheck" className="text-xs sm:text-sm font-semibold text-[#2B1E16]">
                  Public Website Active & Published
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#2B1E16] text-[#FAF7F2] font-semibold rounded-2xl text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C59B6D]" />
              <span>Save Website Content</span>
            </button>
          </form>
        )}

        {/* TAB 6: Setup & Deployment Guide */}
        {activeTab === 'setup' && (
          <div className="space-y-6 max-w-4xl text-left">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C4] shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C59B6D]">
                  Production Deployment & Cloud Integrations
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2B1E16] mt-1">
                  Connecting Firebase, Cloudinary & Vercel
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  This demo website is already equipped with complete architectures for Firebase Firestore, Firebase Authentication, Cloudinary image hosting, and Vercel hosting.
                </p>
              </div>

              {/* Status Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B1E16]">Cloud Firestore & Auth</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFirebaseConfigured
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isFirebaseConfigured ? 'Active' : 'Offline Seed Active'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    {isFirebaseConfigured
                      ? 'Live database connected.'
                      : 'Running in demo mode. Add your Firebase keys in .env or Vercel environment variables to persist in Google Cloud Firestore.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B1E16]">Cloudinary Uploads</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCloudinaryConfigured()
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCloudinaryConfigured() ? 'Active' : 'Ready to Configure'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    {isCloudinaryConfigured()
                      ? 'Cloudinary transformations active.'
                      : 'Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET for unsigned photo uploads.'}
                  </p>
                </div>
              </div>

              {/* Step 1: Vercel Instructions */}
              <div className="border-t border-[#E8D5C4] pt-6 space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#2B1E16] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2B1E16] text-[#FAF7F2] text-xs flex items-center justify-center">1</span>
                  <span>Deploying to Vercel</span>
                </h4>
                <ol className="list-decimal list-inside text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed pl-2">
                  <li>Push this repository to GitHub or GitLab.</li>
                  <li>Go to <strong>vercel.com</strong> and click <strong>Add New Project</strong>.</li>
                  <li>Import your repository. The included <code>vercel.json</code> will automatically configure SPA routing.</li>
                  <li>Add your environment variables in the Vercel project settings (Environment Variables tab).</li>
                  <li>Click <strong>Deploy</strong>. Your production site is ready in seconds!</li>
                </ol>
              </div>

              {/* Step 2: Environment Variables Reference */}
              <div className="border-t border-[#E8D5C4] pt-6 space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#2B1E16] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2B1E16] text-[#FAF7F2] text-xs flex items-center justify-center">2</span>
                  <span>Environment Variables Template (.env)</span>
                </h4>
                <div className="bg-[#2B1E16] text-[#F5EFEB] p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                  <p className="text-stone-400"># Firebase Config</p>
                  <p>VITE_FIREBASE_API_KEY="AIzaSy..."</p>
                  <p>VITE_FIREBASE_AUTH_DOMAIN="ours-brunch.firebaseapp.com"</p>
                  <p>VITE_FIREBASE_PROJECT_ID="ours-brunch"</p>
                  <p>VITE_FIREBASE_STORAGE_BUCKET="ours-brunch.appspot.com"</p>
                  <p>VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"</p>
                  <p>VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"</p>
                  <p className="text-stone-400 pt-2"># Cloudinary Config</p>
                  <p>VITE_CLOUDINARY_CLOUD_NAME="your_cloud_name"</p>
                  <p>VITE_CLOUDINARY_UPLOAD_PRESET="ours_preset"</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* DISH CREATE / EDIT MODAL */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto text-left space-y-4 border border-[#E8D5C4]">
            <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
              {editingDish ? 'Edit Dish' : 'Add New Menu Dish'}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Dish / Drink Name
                </label>
                <input
                  type="text"
                  required
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  placeholder="e.g. Pancake Kunafa Pistachio"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3 py-2 text-sm text-[#2B1E16]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Price (MAD)
                  </label>
                  <input
                    type="number"
                    value={dishForm.priceMAD || ''}
                    onChange={(e) =>
                      setDishForm({
                        ...dishForm,
                        priceMAD: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                    placeholder="e.g. 55"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Appetizing Description
                </label>
                <textarea
                  rows={3}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  placeholder="Short, authentic description of the plate..."
                />
              </div>

              {/* Dish Photo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Dish Photograph
                </label>
                
                {dishForm.imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#E8D5C4] aspect-[16/9] bg-stone-100 group">
                    <img
                      src={dishForm.imageUrl}
                      alt="Dish preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer px-3.5 py-1.5 bg-white text-[#2B1E16] text-xs font-bold rounded-xl shadow-md hover:bg-stone-100">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleDishFileUpload(f);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setDishForm({ ...dishForm, imageUrl: '' })}
                        className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleDishFileUpload(f);
                    }}
                    className="border-2 border-dashed border-[#C59B6D]/60 rounded-2xl p-6 text-center bg-[#FAF7F2] hover:bg-white transition-colors cursor-pointer"
                  >
                    <label className="cursor-pointer block">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center mx-auto mb-2 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#2B1E16] block">
                        {imageUploadLoading ? 'Processing Photo...' : 'Click or Drag & Drop dish photo here'}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        PNG, JPG, or WEBP from phone or computer
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleDishFileUpload(f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                <div className="pt-1">
                  <input
                    type="text"
                    value={dishForm.imageUrl || ''}
                    onChange={(e) => setDishForm({ ...dishForm, imageUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-1.5 text-xs text-[#2B1E16]"
                    placeholder="Or paste direct image URL (https://...)"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#2B1E16] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.isAvailable}
                    onChange={(e) => setDishForm({ ...dishForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-[#C59B6D]"
                  />
                  <span>Mark as Available Today</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#2B1E16] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.isFeatured}
                    onChange={(e) => setDishForm({ ...dishForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#C59B6D]"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8D5C4]">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2B1E16] text-[#FAF7F2] hover:bg-[#4A3326] text-xs font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-left space-y-4 border border-[#E8D5C4]">
            <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
              Add Menu Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  placeholder="e.g. Fresh Pastries"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category Description
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  placeholder="Warm croissants and morning baked goods"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8D5C4]">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2B1E16] text-[#FAF7F2] text-xs font-bold"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY PHOTO MODAL */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-left space-y-4 border border-[#E8D5C4]">
            <h3 className="font-serif text-2xl font-bold text-[#2B1E16]">
              Add Photo to Gallery
            </h3>
            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  placeholder="e.g. Afternoon Terrace View"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3 py-2 text-sm text-[#2B1E16]"
                >
                  <option value="Food">Food</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Brunch">Brunch</option>
                  <option value="Interior">Interior</option>
                  <option value="Terrace">Terrace</option>
                </select>
              </div>

              {/* Gallery Photograph Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Gallery Photograph
                </label>

                {galleryForm.imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#E8D5C4] aspect-[4/3] bg-stone-100 group">
                    <img
                      src={galleryForm.imageUrl}
                      alt="Gallery preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer px-3.5 py-1.5 bg-white text-[#2B1E16] text-xs font-bold rounded-xl shadow-md hover:bg-stone-100">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) handleGalleryFileUpload(e.target.files);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryForm({ ...galleryForm, imageUrl: '' })}
                        className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files) handleGalleryFileUpload(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-[#C59B6D]/60 rounded-2xl p-6 text-center bg-[#FAF7F2] hover:bg-white transition-colors cursor-pointer"
                  >
                    <label className="cursor-pointer block">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E8D5C4] text-[#C59B6D] flex items-center justify-center mx-auto mb-2 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#2B1E16] block">
                        {galleryUploadLoading ? 'Processing Photo...' : 'Click or Drag & Drop photo here'}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        High-resolution photo of café, food, terrace, or coffee
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) handleGalleryFileUpload(e.target.files);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                <div className="pt-1">
                  <input
                    type="text"
                    value={galleryForm.imageUrl || ''}
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-1.5 text-xs text-[#2B1E16]"
                    placeholder="Or paste direct image URL (https://...)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={galleryForm.altText}
                  onChange={(e) => setGalleryForm({ ...galleryForm, altText: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16]"
                  placeholder="Description of the scene..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8D5C4]">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2B1E16] text-[#FAF7F2] text-xs font-bold"
                >
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
