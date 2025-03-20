/**
 * Extracts a site name from a filename by removing the .md extension
 * and formatting the remaining text.
 * 
 * @param filename The filename to extract the site name from
 * @returns A formatted site name
 */
export function getSiteNameFromFilename(filename: string): string {
  if (!filename) return "";
  
  // Use only the last segment of the path
  const baseFilename = filename.split('/').pop() || filename;
  
  // Remove file extension (.md)
  let name = baseFilename.replace(/\.md$/, "");
  
  // Replace hyphens with spaces and capitalize each word
  name = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  return name;
}

/**
 * Safely extracts and formats a domain name from a URL.
 * 
 * @param urlString The URL to extract the domain name from
 * @returns A formatted domain name
 */
export function getHostnameFromUrl(urlString: string): string {
  try {
    if (!urlString) return "";

    // Make sure URL has a protocol
    const urlWithProtocol =
      urlString.startsWith("http://") || urlString.startsWith("https://")
        ? urlString
        : `https://${urlString}`;

    // Get the hostname
    const hostname = new URL(urlWithProtocol).hostname;

    // Extract the domain name without www. and the TLD
    let domainName = hostname;

    // Remove www. if present
    if (domainName.startsWith("www.")) {
      domainName = domainName.substring(4);
    }

    // Remove the TLD (.com, .org, etc.)
    const tldMatch = domainName.match(/\.[a-z]+$/);
    if (tldMatch && tldMatch.index) {
      domainName = domainName.substring(0, tldMatch.index);
    }

    // Handle subdomains by taking the last part
    if (domainName.includes(".")) {
      domainName = domainName.split(".").pop() || domainName;
    }

    // Capitalize the first letter
    if (domainName.length > 0) {
      domainName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
    }

    return domainName;
  } catch (error) {
    console.error(`Invalid URL: ${urlString}`);
    return urlString || "";
  }
}

// Title separator patterns - ADD NEW ONES HERE
const TITLE_SEPARATORS = [
    ' - ',    // space-hyphen-space
    ' – ',    // space-en-dash-space
    ' — ',    // space-em-dash-space
    ' | ',    // space-pipe-space
    ' : ',    // space-colon-space
    ' • ',    // space-bullet-space
    ' · ',    // space-middle-dot-space
    '-',      // hyphen
    '–',      // en-dash
    '—',      // em-dash
    '|',      // pipe
    ':',      // colon
    '•',      // bullet
    '·',      // middle dot
    ' -- ',   // space-double-hyphen-space
    ' * '     // space-asterisk-space
];

// Create the regex pattern - DO NOT MODIFY THIS
const SEPARATOR_PATTERN = TITLE_SEPARATORS
    .map(sep => sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

/**
 * Filters a title by removing the site name and extracting the relevant part.
 * Add new separators to TITLE_SEPARATORS array above.
 * 
 * @param title The full title to filter
 * @param siteName The site name to remove from the title
 * @returns The filtered title
 */
export function filterTitle(title: string, siteName: string): string {
    if (!title || !siteName) return title || '';
    
    const separatorRegex = new RegExp(`\\s*(${SEPARATOR_PATTERN})\\s*`);
    let cleanTitle = title;

    // Split site name into parts and clean each part
    const siteNameParts = siteName.split(separatorRegex).filter(Boolean);
    
    siteNameParts.forEach(part => {
        const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Remove "Part <separator> Rest"
        cleanTitle = cleanTitle.replace(new RegExp(`^${escapedPart}\\s*(${SEPARATOR_PATTERN})\\s*`), '');
        // Remove "Rest <separator> Part"
        cleanTitle = cleanTitle.replace(new RegExp(`\\s*(${SEPARATOR_PATTERN})\\s*${escapedPart}$`), '');
    });
    
    return cleanTitle.trim();
}

/**
 * Determines the effective site name based on available information.
 * 
 * @param site_name The explicitly provided site name
 * @param filename The filename to extract a site name from
 * @param url The URL to extract a site name from
 * @returns The effective site name
 */
export function getEffectiveSiteName(
  site_name?: string,
  filename?: string,
  url?: string
): string {
  if (site_name) return site_name;
  if (filename) return filename.replace(/\.md$/, '');
  if (url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }
  return '';
}

/**
 * Extracts the default category directory from a file path.
 * The function assumes the file path contains 'src/content/tooling/' and returns the directory name immediately following it.
 * For example, for a file path 'src/content/tooling/Databases/orientdb.md', it returns 'Databases'.
 * 
 * @param filePath The full file path of the file
 * @returns The category directory or an empty string if not found
 */
export function defaultCategoryDir(filePath: string): string {
  if (!filePath) return "";
  
  const prefix = 'src/content/tooling/';
  const index = filePath.indexOf(prefix);
  if (index === -1) return "";
  
  // Get the part after the prefix
  const relativePath = filePath.substring(index + prefix.length);
  const segments = relativePath.split('/');
  
  // The first segment should be the category if it exists and there is more than one segment
  if (segments.length > 1 && segments[0].trim() !== "") {
    return segments[0];
  }
  
  return "";
} 