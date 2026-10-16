/**
 * Image processing and upload helper for Yours Brunch and Cafe.
 * Supports:
 * 1. Cloudinary upload when configured with VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET
 * 2. Instant client-side canvas optimization & compression (WebP/JPEG) for fast local persistence
 *    so photos uploaded from phones/cameras (5MB-15MB) are automatically resized to optimal dimensions
 *    and compressed to ~80-160KB for lightning-fast loading and storage.
 */

import { uploadToCloudinary, isCloudinaryConfigured } from './cloudinary';

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Resizes and compresses an image File using HTML5 canvas.
 * Returns a high-quality, lightweight Data URL.
 */
export async function compressImageToDataUrl(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
    format = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill background white in case of transparent png converting to jpeg
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } catch {
          // Fallback to jpeg if webp not supported
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export interface UploadResult {
  url: string;
  source: 'cloudinary' | 'local_optimized';
  publicId?: string;
}

/**
 * Uploads an image: tries Cloudinary first if configured,
 * otherwise compresses client-side into an optimized data URL.
 */
export async function uploadAndProcessPhoto(
  file: File,
  options: ProcessImageOptions = {}
): Promise<UploadResult> {
  // 1. If Cloudinary is configured, attempt upload to Cloudinary
  if (isCloudinaryConfigured()) {
    try {
      const res = await uploadToCloudinary(file);
      if ('url' in res) {
        return {
          url: res.url,
          source: 'cloudinary',
          publicId: res.publicId,
        };
      }
      console.warn('Cloudinary upload had error, falling back to local optimization:', res.error);
    } catch (e) {
      console.warn('Cloudinary upload network failure, falling back to local optimization:', e);
    }
  }

  // 2. High-speed, high-quality client-side compression
  const optimizedUrl = await compressImageToDataUrl(file, options);
  return {
    url: optimizedUrl,
    source: 'local_optimized',
  };
}
