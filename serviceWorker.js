// ServiceWorker for the PWA

const staticSonetelPwa = "sonetel-callback-pwa-v1";
const assets = [
  "/",
  "/index.html",
  "/sonetel.js",
  "/assets/style.css",
  "/images/android-chrome-512x512.png",
  "/images/android-chrome-192x192.png",
  "/images/apple-touch-icon.png",
  "/images/favicon-16x16.png",
  "/images/favicon-32x32.png",
  "/images/logo.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticSonetelPwa).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
