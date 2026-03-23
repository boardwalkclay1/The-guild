// ===============================
// GUILD SERVICE WORKER — v9
// Cloudflare Pages Safe • Static-Only Caching
// ===============================

const CACHE_NAME = "guild-cache-v9";

// Only cache STATIC assets.
// Never cache API, HTML that changes, or dynamic content.
const ASSETS = [
  "/index.html",
  "/the-guild.png",
  "/favicon.ico",
  "/manifest.json",

  "/guild/guild-style.css",
  "/guild/guild-engine.js",

  // Core Guild pages
  "/guild/guild.html",
  "/guild/guild-entry.html",
  "/guild/why-join.html",
  "/guild/having-second-thoughts.html",
  "/guild/golden-rules.html",
  "/guild/guild-discipline.html",
  "/guild/inside-the-guild.html",
  "/guild/guild-family.html",
  "/guild/training-hall.html",
  "/guild/gf-paywall.html",
  "/guild/guild-goldenformula.html",
  "/guild/arena-secrets.html",

  // Training modules
  "/guild/chart-patterns.html",
  "/guild/training/patterns/pattern-level1.html",
  "/guild/training/patterns/pattern-level2.html",
  "/guild/training/patterns/pattern-level3.html",
  "/guild/training/patterns/pattern-level4.html",

  "/guild/training/accessing-options.html",
  "/guild/training/accessing-options/banks.html",
  "/guild/training/accessing-options/brokers.html",
  "/guild/training/accessing-options/simulator.html",

  // Training JS
  "/guild/training/js/patterns-level1.js",
  "/guild/training/js/patterns-level2.js",
  "/guild/training/js/patterns-level3.js",
  "/guild/training/js/patterns-level4.js",
  "/guild/training/js/accessing-options.js",

  // Icons
  "/guild/icons/icon-door.svg",
  "/guild/icons/icon-dragon.svg",
  "/guild/icons/icon-arena.svg",
  "/guild/icons/icon-forge.svg",
  "/guild/icons/icon-purse.svg",

  // Backgrounds
  "/guild/image/Arcadium.jpg",
  "/guild/image/Armory.jpeg",
  "/guild/image/Aurum-Veritas.jpg",
  "/guild/image/Porta-Imperii.jpg",
  "/guild/image/Tributum.jpg",
  "/guild/image/Vestry.jpg",
  "/guild/image/apotheosis-chamber.jpg",
  "/guild/image/gladiator-forum.jpg",
  "/guild/image/strategy-chamber.jpg",
  "/guild/guild-background-gold.png"
];

// INSTALL — cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE — remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH — Cloudflare Pages Safe Strategy
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // NEVER touch API routes — Pages Functions must handle them
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Cache-first for static assets
  if (ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
