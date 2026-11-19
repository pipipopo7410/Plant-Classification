const CACHE_NAME = 'plant-classification-v1.0.4';
const ASSETS = ["./", "./index.html", "./styles.css", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./1-1.png", "./1-2.png", "./2-1.png", "./2-2.png", "./2-3.png", "./3-1.png", "./3-2.png", "./3-3.png", "./4-1.png", "./4-2.png", "./4-3.png", "./5-1.png", "./5-2.png", "./5-3.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('plant-classification-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});
