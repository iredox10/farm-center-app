import slugify from 'slugify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Format a number as Nigerian Naira (or a given currency).
 * Example: formatPrice(1500) → "₦1,500.00"
 */
export function formatPrice(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a URL-safe slug from text.
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Generate a unique order number.
 * Format: FC-YYYYMMDD-XXXX (e.g. FC-20260703-A3F1)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FC-${y}${m}${d}-${rand}`;
}

/**
 * Build a WhatsApp deep-link with a pre-filled message.
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

/**
 * Canonical product page URL.
 */
export function getProductUrl(slug: string): string {
  return `/products/${slug}`;
}

/**
 * Canonical shop page URL.
 */
export function getShopUrl(slug: string): string {
  return `/shop/${slug}`;
}

/**
 * Truncate a string and append an ellipsis if it exceeds maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Merge Tailwind classes with conflict resolution (via tailwind-merge + clsx).
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}

/**
 * Get an Appwrite file preview URL (resized image thumbnail).
 */
export function getFilePreviewUrl(
  fileId: string,
  bucketId: string,
  width = 400,
  height = 400
): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?width=${width}&height=${height}&project=${projectId}`;
}

/**
 * Get an Appwrite file view URL (full-resolution file).
 */
export function getFileViewUrl(fileId: string, bucketId: string): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

