import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { source, destination } = await request.json();
    
    // Validate paths
    if (!source || !destination) {
      return new Response(JSON.stringify({ error: 'Missing source or destination' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Ensure destination directory exists
    await fs.promises.mkdir(destination, { recursive: true });

    // Get filename and create destination path
    const filename = path.basename(source);
    const destPath = path.join(destination, filename);

    // Move the file
    await fs.promises.rename(source, destPath);

    return new Response(JSON.stringify({ 
      success: true,
      source,
      destination: destPath
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    console.error('Error moving trademark:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to move file';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};