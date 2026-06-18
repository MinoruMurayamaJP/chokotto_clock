var CACHE_NAME = 'chokotto-clock-v260619-0005';
var ASSETS = ['./index.html?v=2606190005', './manifest.json?v=2606190005', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(k) {
      if (k === CACHE_NAME) return null;
      return caches.delete(k);
    }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(function(resp) {
    var copy = resp.clone();
    caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
    return resp;
  }).catch(function() {
    return caches.match(event.request).then(function(cached) {
      return cached || caches.match('./index.html?v=2606190005');
    });
  }));
});
