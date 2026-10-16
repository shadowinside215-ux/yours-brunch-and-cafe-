/**
 * Cloudinary image optimization and upload service
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'thumb' | 'fit';
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
}

/**
 * Optimizes an image URL using Cloudinary transformations if hosted on Cloudinary,
 * or Unsplash parameters if on Unsplash, with graceful fallback.
 */
export function getOptimizedImageUrl(
  url: string | undefined,
  options: ImageTransformOptions = {}
): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
  }

  const { width = 800, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;

  // Cloudinary URL transformation
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transform = [
        `c_${crop}`,
        `w_${width}`,
        height ? `h_${height}` : null,
        `q_${quality}`,
        `f_${format}`,
      ]
        .filter(Boolean)
        .join(',');

      return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }
    return url;
  }

  // Unsplash URL optimization
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('q', '80');
    return urlObj.toString();
  }

  return url;
}

/**
 * Performs unsigned image upload to Cloudinary.
 * If credentials are not yet configured in environment variables, returns null
 * with an informative status so the admin interface can guide the user.
 */
export async function uploadToCloudinary(
  file: File | Blob
): Promise<{ url: string; publicId: string } | { error: string }> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return {
      error: 'Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET) are not configured. You can use direct image URLs or configure your Cloudinary credentials in .env or Vercel.',
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'ours-brunch-cafe');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        error: errData.error?.message || `Cloudinary upload failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Network error uploading to Cloudinary',
    };
  }
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}
