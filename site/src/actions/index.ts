const openGraphKey = await import.meta.env.PUBLIC_OPEN_GRAPH_API_KEY;

interface OpenGraphProperties {
  image?: string;
  site_name?: string;
  title?: string;
  url?: string;
  favicon?: string;
  og_screenshot_url?: string;
}

// Function to fetch screenshot URL from OpenGraph.io in the background
function fetchScreenshotUrlInBackground(url: string): void {
  console.log(`Starting background screenshot fetch for ${url}`);
  
  // Don't await this promise - let it run in the background
  (async () => {
    try {
      const screenshotProxyUrl = `https://opengraph.io/api/1.1/screenshot/site/${encodeURIComponent(url)}?accept_lang=en&use_proxy=true&app_id=${openGraphKey}`;
      const response = await fetch(screenshotProxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.screenshotUrl) {
        console.log(`✅ Received screenshot URL for ${url} in background process: ${data.screenshotUrl}`);
        // In the browser context, we can't directly update files
        // You might want to store this in localStorage or send to a server endpoint
      } else {
        console.log(`⚠️ No screenshot URL found for ${url} in background process`);
      }
    } catch (error) {
      console.error(`Error in background screenshot fetch for ${url}:`, error);
    }
  })();
}

export async function getFromOpenGraphIo(url: string) {
    try {
        const proxyUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?accept_lang=auto&use_proxy=true&app_id=${openGraphKey}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Raw data from OpenGraph.io:', data); // Debugging step

        const ogProperties: OpenGraphProperties = {};

        if (data.hybridGraph) {
            ogProperties.image = data.hybridGraph.image;
            ogProperties.site_name = data.hybridGraph.site_name;
            ogProperties.title = data.hybridGraph.title;
            ogProperties.url = data.hybridGraph.url;
            ogProperties.favicon = data.hybridGraph.favicon;
        }

        // Start the screenshot fetch in the background
        // This will not block the main thread
        fetchScreenshotUrlInBackground(url);

        console.log('Fetched OpenGraph properties:', ogProperties);
        return ogProperties;
    } catch (error) {
        console.error('Error fetching OpenGraph properties:', error);
        return null;
    }
}