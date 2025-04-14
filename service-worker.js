
const CACHE_NAME = "bikari-cache-v1";
const urlsToCache = [
  "/bikari/",
  "/bikari/index.html",
  "/bikari/style.css",
  "/bikari/app.js",
  "/bikari/firebase-config.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
