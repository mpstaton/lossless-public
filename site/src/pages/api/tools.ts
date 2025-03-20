// In your API route (e.g., /api/image-proxy)
export async function get({ query }) {
    const imageUrl = query.get('url');
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    return new Response(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type'),
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  }
  