/**
 * API Client with Offline Support
 * Handles absolute URLs for Capacitor and localStorage caching
 */

// CONFIGURATION : Remplacez par votre URL Vercel réelle ou votre IP locale
const BASE_URL = 'https://kami-extension-v3.vercel.app';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Déterminer l'URL complète
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  // Clé de cache pour le localStorage
  const cacheKey = `cache_${endpoint.replace(/\//g, '_')}`;

  try {
    // Tenter l'appel réseau
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Sauvegarder dans le cache pour usage offline (seulement pour les GET)
      if (!options.method || options.method === 'GET') {
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }

      return data;
    }

    throw new Error(`API Error: ${response.status}`);
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);

    // Si on est offline ou erreur réseau, tenter de charger du cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log(`Using cached data for ${endpoint}`);
      return JSON.parse(cached).data;
    }

    throw error;
  }
}
