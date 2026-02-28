const CACHE_NAME = 'hijaiz-cache-v2'; // Tukar v2, v3, v4 bila ada update besar
const urlsToCache = [
  './',
  './index.html',
  './background music.mp3',
  './pop sound effect.mp3'
];

// Pasang dan simpan cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Bersihkan memori (cache) lama jika ada versi baharu
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Membuang cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Strategi: Network First (Cari internet dulu, kalau tiada internet baru guna cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika ada internet, simpan versi terbaharu ke dalam cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Jika tiada internet, guna yang ada dalam cache
        return caches.match(event.request);
      })
  );
});