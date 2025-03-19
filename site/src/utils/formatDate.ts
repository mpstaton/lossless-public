/**
 * formatDate.ts
 * Utility function for consistent date formatting across the application
 * 
 * CALLED BY:
 * - site/src/components/changelog/ChangelogEntry.astro
 * - [Add other components that use this as they are created]
 * 
 * @param {Date | string} date - Date to format, accepts both Date object and ISO string
 * @returns {string} Formatted date string in the format "MMMM D, YYYY"
 * 
 * @example
 * ```typescript
 * import { formatDate } from '../utils/formatDate';
 * 
 * // Using with Date object
 * const date = new Date();
 * const formatted = formatDate(date); // "March 18, 2025"
 * 
 * // Using with ISO string
 * const isoDate = "2025-03-18T22:00:00Z";
 * const formatted = formatDate(isoDate); // "March 18, 2025"
 * ```
 */

export function formatDate(date: Date | string): string {
  // Convert string to Date if necessary
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Format options for consistent date display
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  // Use browser's Intl API for localized date formatting
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Additional date formatting utilities can be added here as needed.
 * Follow the same pattern of comprehensive documentation and type safety.
 */
