
const CACHE_NAME = "bikari-cache-v1";
const urlsToCache = [
  "/bikari/",
  "/bikari/index.html",
  "/bikari/style.css",
  "/bikari/app.js",
  "/bikari/firebase-config.js"
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
