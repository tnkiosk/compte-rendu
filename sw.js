const CACHE_NAME = 'compte-rendu-v1';

const URLS_TO_CACHE = [
  '/compte-rendu/',
  '/compte-rendu/index.html',
  '/compte-rendu/logo.png',
  '/compte-rendu/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});