const CACHE_NAME = 'compte-rendu-v7';

const URLS_TO_CACHE = [
  '/compte-rendu/',
  '/compte-rendu/index.html',
  '/compte-rendu/logo.png',
  '/compte-rendu/manifest.webmanifest'
];

// Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Activation (nettoyage anciens caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Requêtes (toujours version la plus récente)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((res) => {
          return res || caches.match('/compte-rendu/index.html');
        });
      })
  );
});
