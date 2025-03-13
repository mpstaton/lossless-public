/**
 * Converts an image URL to use Cloudinary's proxy service
 * @param url The original image URL
 * @returns The proxied URL if needed, or the original URL if it's already from our domain
 */
export function getProxiedImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    const imageUrl = new URL(url);
    // If the image is already from our domain, return it as is
    if (imageUrl.hostname === 'localhost' || imageUrl.hostname === 'lossless.com') {
      return url;
    }

    // Default to demo account if cloud name not provided
    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
    
    // Handle SVG files - convert to PNG with specific dimensions
    if (url.toLowerCase().endsWith('.svg')) {
      return `https://res.cloudinary.com/${cloudName}/image/fetch/f_png,w_32,h_32,c_fit/${encodeURIComponent(url)}`;
    }
    
    // Use Cloudinary's fetch mode with auto-optimization
    return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto/${encodeURIComponent(url)}`;
  } catch {
    return url;
  }
}

/**
 * Checks if an image URL is valid
 * @param url The image URL to check
 * @returns Promise<boolean> indicating if the image is valid
 */
export async function isValidImageUrl(url: string): Promise<boolean> {
  if (!url) return false;
  
  // Consider SVGs valid without checking
  if (url.toLowerCase().endsWith('.svg')) {
    return true;
  }

  try {
    // Use Cloudinary's proxy to validate the image
    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
    const proxyUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto/${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}