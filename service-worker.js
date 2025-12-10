self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./main.js",
        "./main.css",
        "./assets/logo192.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
