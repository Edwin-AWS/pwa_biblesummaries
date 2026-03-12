// Bible Summaries PWA — Service Worker
const CACHE_NAME = 'bible-summaries-v3';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './summaries/Genesis.md',
  './summaries/Exodus.md',
  './summaries/Leviticus.md',
  './summaries/Numbers.md',
  './summaries/Deuteronomy.md',
  './summaries/Joshua.md',
  './summaries/Judges.md',
  './summaries/Ruth.md',
  './summaries/1Samuel.md',
  './summaries/2Samuel.md',
  './summaries/1Kings.md',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js',
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: clear ALL old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: NETWORK-FIRST — always try to get fresh content,
// fall back to cache only when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache a copy of every successful response
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
