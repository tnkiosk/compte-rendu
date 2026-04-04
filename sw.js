const CACHE_NAME = 'compte-rendu-v3';

const URLS_TO_CACHE = [
  '/compte-rendu/',
  '/compte-rendu/index.html',
  '/compte-rendu/logo.png',
  '/compte-rendu/manifest.webmanifest'
];

// Installation
self.addEventListener('install', (event) => {
  self.skipWaiting(); // force la mise à jour
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activation (supprime anciens caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // prend le contrôle direct
});

// Requête
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
