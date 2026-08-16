const CACHE_NAME = 'kami-offline-v2';
const OFFLINE_URL = '/offline.html';
const APP_SHELL = ['/', '/offline.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

const isApiRequest = (url) => {
  try {
    return new URL(url).pathname.startsWith('/api/');
  } catch {
    return false;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  // Navigations : réseau d'abord avec repli sur le cache (offline).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match(OFFLINE_URL) || new Response('<h1>Connectez-vous pour voir le contenu</h1>', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        })
    );
    return;
  }

  // Requêtes API : réseau en priorité, jamais mises en cache.
  // Sans cela, les réponses (permissions, stats, etc.) resteraient bloquées
  // sur des valeurs obsolètes dans le cache du service worker.
  if (isApiRequest(request.url)) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Autres ressources statiques : cache d'abord, réseau ensuite.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(OFFLINE_URL)))
  );
});
