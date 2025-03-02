const openGraphKey = await import.meta.env.PUBLIC_OPEN_GRAPH_API_KEY;

interface OpenGraphProperties {
  image?: string;
  site_name?: string;
  title?: string;
  url?: string;
  favicon?: string;
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

        console.log('Fetched OpenGraph properties:', ogProperties);
        return ogProperties;
    } catch (error) {
        console.error('Error fetching OpenGraph properties:', error);
        return null;
    }
}