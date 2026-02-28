const CACHE_NAME = 'hijaiz-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './background music.mp3',
  './pop sound effect.mp3'
];

// Pasang Service Worker dan simpan fail penting dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Menyimpan fail ke dalam cache...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Guna fail dari cache jika tiada internet (Offline Mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada dalam cache, kembalikan yang itu. Jika tiada, ambil dari internet.
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});