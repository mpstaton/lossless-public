/**
 * frontmatterIrregularityFilterReturnsValidFrontmatterOnly.ts
 * Utility to filter content collection entries based on frontmatter validity
 * 
 * CALLED BY:
 * - site/src/pages/workflow/changelog.astro
 * - [Add other files that use this utility as they are created]
 * 
 * @module
 */

import type { CollectionEntry } from 'astro:content';

/**
 * Validates frontmatter for a collection entry
 * Uses our established tag syntax validation pattern
 * 
 * @param entry - Collection entry to validate
 * @returns boolean indicating if frontmatter is valid
 */
export function filterValidFrontmatter(entry: CollectionEntry<any>): boolean {
  // Required fields for all content
  const requiredFields = ['title', 'date'];
  
  // Check required fields exist and are not empty
  const hasRequiredFields = requiredFields.every(field => 
    entry.data[field] !== undefined && entry.data[field] !== ''
  );

  // Validate tags if they exist
  if (entry.data.tags) {
    // Tag validation pattern from our spec
    const tagPattern = /(?:tags:\s*(?:\[.*?\]|.*?,.*?|['"].*?['"])|(?:^|\n)\s*-\s*\w+[^\S\n]+\w+)/;
    
    // Convert tags to string for validation
    const tagsString = Array.isArray(entry.data.tags) 
      ? entry.data.tags.join('\n- ')
      : String(entry.data.tags);

    // Entry is invalid if tags don't match our pattern
    if (!tagPattern.test('tags:\n- ' + tagsString)) {
      return false;
    }
  }

  return hasRequiredFields;
}

/**
 * Type guard to check if an object is a valid collection entry
 * 
 * @param obj - Object to check
 * @returns boolean indicating if object is a valid collection entry
 */
export function isValidCollectionEntry(obj: any): obj is CollectionEntry<any> {
  return obj && 
    typeof obj === 'object' && 
    'data' in obj && 
    typeof obj.data === 'object';
}