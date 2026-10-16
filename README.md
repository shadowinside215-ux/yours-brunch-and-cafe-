# Yours Brunch and Cafe

A premium, production-ready website and digital menu designed for **Yours Brunch and Cafe**, an upscale coffee shop and brunch destination in Salé El Jadida, Morocco.

Built with React, TypeScript, Tailwind CSS, Firebase Firestore & Authentication, and Cloudinary image optimization.

---

## ☕ Verified Business Information

- **Business Name:** Yours Brunch and Cafe
- **Category:** Coffee Shop / Brunch Restaurant
- **Location:** X7X8+FF, Salé El Jadida, Morocco
- **Telephone:** +212 537-536666
- **Google Rating:** 3.7 / 5 (122 Google Reviews)
- **Reported Price Range:** MAD 50–100 per person
- **Service:** Dine-in & Open-air Terrace
- **Closing Time:** 11:00 PM (Daily)
- **Instagram:** [https://www.instagram.com/yoursbrunchcafe/?hl=en](https://www.instagram.com/yoursbrunchcafe/?hl=en)
- **Google Maps:** [Direct Google Maps Link for Yours Brunch and Cafe Sale el Jadida](https://www.google.com/maps/search/?api=1&query=Yours+Brunch+and+Cafe+Sale+el+Jadida)

---

## 🎨 Creative Direction & Visual Identity

- **Color Palette:** Warm ivory, espresso brown, caramel, and crisp white.
- **Typography:** Playfair Display (editorial serif) and Plus Jakarta Sans (clean readable sans-serif).
- **Smooth & Technically Advanced Scrolling:** Viewport scroll progress indicator, active section tracking, smooth anchor navigation, and responsive layouts.
- **Custom Menu & Photography:** All stock images and sample items have been removed so the owner can add verified dishes, Moroccan Dirham (MAD) prices, and authentic café photography.

---

## 🔒 Administrator Access

To enter the admin dashboard:
1. Navigate to `/admin` or `#admin` (or click **Owner Portal** in the navigation/footer).
2. Enter your authorized Gmail: **`dragonball86@gmail.com`**
3. Click **"Enter as dragonball86@gmail.com"** for instant 1-click access.

---

## 🚀 Independent Vercel Deployment Guide

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Yours Brunch and Cafe website"
git branch -M main
git remote add origin https://github.com/your-username/yours-brunch-and-cafe.git
git push -u origin main
```

### 2. Import into Vercel
1. Log in to your [Vercel](https://vercel.com/) dashboard.
2. Click **"Add New Project"** and select your GitHub repository.
3. Framework Preset: **Vite** (auto-detected).
4. Root Directory: `./`
5. The included `vercel.json` provides SPA routing rules and security headers.

### 3. Configure Environment Variables in Vercel
Add the following keys under **Settings > Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Google Cloud / Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID from Firebase console |
| `VITE_FIREBASE_APP_ID` | Web App ID |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset name |

### 4. Deploy
Click **Deploy**. Your website will be live globally with automatic SSL.
