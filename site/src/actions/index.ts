const openGraphKey = await import.meta.env.PUBLIC_OPEN_GRAPH_API_KEY;

interface OpenGraphProperties {
  image?: string;
  site_name?: string;
  title?: string;
  url?: string;
  favicon?: string;
  og_screenshot_url?: string;
}

// Function to fetch screenshot URL from OpenGraph.io
async function getScreenshotUrl(url: string): Promise<string | null> {
  try {
    const screenshotProxyUrl = `https://opengraph.io/api/1.1/screenshot/site/${encodeURIComponent(url)}?accept_lang=en&use_proxy=true&app_id=${openGraphKey}`;
    const response = await fetch(screenshotProxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.screenshotUrl) {
      return data.screenshotUrl;
    }
    return null;
  } catch (error) {
    console.error('Error fetching screenshot URL for', url, ':', error);
    return null;
  }
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

        // Fetch and add screenshot URL
        const screenshotUrl = await getScreenshotUrl(url);
        if (screenshotUrl) {
            ogProperties.og_screenshot_url = screenshotUrl;
        }

        console.log('Fetched OpenGraph properties:', ogProperties);
        return ogProperties;
    } catch (error) {
        console.error('Error fetching OpenGraph properties:', error);
        return null;
    }
}