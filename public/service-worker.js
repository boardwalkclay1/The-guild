// ===============================
// GUILD SERVICE WORKER — v10 (FIXED)
// Cloudflare Pages Safe • Static-Only Caching
// ===============================

const CACHE_NAME = "guild-cache-v10";

// STATIC ASSETS ONLY — NEVER HTML ROUTES THAT CHANGE
const ASSETS = [
  "/guild/index.html",
  "/the-guild.png",
  "/favicon.ico",
  "/manifest.json",

  "/guild/assets/css/guild-style.css",
  "/guild/assets/js/guild-engine.js",

  // Core Guild pages
  "/guild/pages/guild.html",
  "/guild/pages/guild-entry.html",
  "/guild/pages/why-join.html",
  "/guild/pages/having-second-thoughts.html",
  "/guild/pages/golden-rules.html",
  "/guild/pages/guild-discipline.html",
  "/guild/pages/inside-the-guild.html",
  "/guild/pages/guild-family.html",
  "/guild/pages/training-hall.html",
  "/guild/pages/gf-paywall.html",
  "/guild/pages/guild-goldenformula.html",
  "/guild/pages/arena-secrets.html",

  // Training modules
  "/guild/pages/chart-patterns.html",
  "/guild/pages/training/patterns/pattern-level1.html",
  "/guild/pages/training/patterns/pattern-level2.html",
  "/guild/pages/training/patterns/pattern-level3.html",
  "/guild/pages/training/patterns/pattern-level4.html",

  "/guild/pages/training/accessing-options.html",
  "/guild/pages/training/accessing-options/banks.html",
  "/guild/pages/training/accessing-options/brokers.html",
  "/guild/pages/training/accessing-options/simulator.html",

  // Training JS
  "/guild/assets/js/patterns-level1.js",
  "/guild/assets/js/patterns-level2.js",
  "/guild/assets/js/patterns-level3.js",
  "/guild/assets/js/patterns-level4.js",
  "/guild/assets/js/accessing-options.js",

  // Icons
  "/guild/assets/icons/icon-door.svg",
  "/guild/assets/icons/icon-dragon.svg",
  "/guild/assets/icons/icon-arena.svg",
  "/guild/assets/icons/icon-forge.svg",
  "/guild/assets/icons/icon-purse.svg",

  // Backgrounds
  "/guild/assets/image/Arcadium.jpg",
  "/guild/assets/image/Armory.jpg",
  "/guild/assets/image/Aurum-Veritas.jpg",
  "/guild/assets/image/Porta-Imperii.jpg",
  "/guild/assets/image/Tributum.jpg",
  "/guild/assets/image/Vestry.jpg",
  "/guild/assets/image/apotheosis-chamber.jpg",
  "/guild/assets/image/gladiator-forum.jpg",
  "/guild/assets/image/strategy-chamber.jpg",
  "/guild/assets/image/guild-background-gold.png"
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

  // Never touch API routes
  if (url.pathname.startsWith("/api/")) return;

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
