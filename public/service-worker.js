// ===============================
// GUILD SERVICE WORKER — v10
// Cloudflare Pages Safe • Static-Only Caching
// ===============================

const CACHE_NAME = "guild-cache-v10";

// STATIC ASSETS ONLY — NEVER HTML ROUTES THAT CHANGE
const ASSETS = [
  "/GUILD/index.html",
  "/GUILD/the-guild.png",
  "/GUILD/favicon.ico",
  "/GUILD/manifest.json",

  "/GUILD/guild-style.css",
  "/GUILD/guild-engine.js",

  // Core Guild pages
  "/GUILD/guild.html",
  "/GUILD/guild-entry.html",
  "/GUILD/why-join.html",
  "/GUILD/having-second-thoughts.html",
  "/GUILD/golden-rules.html",
  "/GUILD/guild-discipline.html",
  "/GUILD/inside-the-guild.html",
  "/GUILD/guild-family.html",
  "/GUILD/training-hall.html",
  "/GUILD/gf-paywall.html",
  "/GUILD/guild-goldenformula.html",
  "/GUILD/arena-secrets.html",

  // Training modules
  "/GUILD/chart-patterns.html",
  "/GUILD/training/patterns/pattern-level1.html",
  "/GUILD/training/patterns/pattern-level2.html",
  "/GUILD/training/patterns/pattern-level3.html",
  "/GUILD/training/patterns/pattern-level4.html",

  "/GUILD/training/accessing-options.html",
  "/GUILD/training/accessing-options/banks.html",
  "/GUILD/training/accessing-options/brokers.html",
  "/GUILD/training/accessing-options/simulator.html",

  // Training JS
  "/GUILD/training/js/patterns-level1.js",
  "/GUILD/training/js/patterns-level2.js",
  "/GUILD/training/js/patterns-level3.js",
  "/GUILD/training/js/patterns-level4.js",
  "/GUILD/training/js/accessing-options.js",

  // Icons
  "/GUILD/icons/icon-door.svg",
  "/GUILD/icons/icon-dragon.svg",
  "/GUILD/icons/icon-arena.svg",
  "/GUILD/icons/icon-forge.svg",
  "/GUILD/icons/icon-purse.svg",

  // Backgrounds (corrected extensions)
  "/GUILD/image/Arcadium.jpg",
  "/GUILD/image/Armory.jpg",
  "/GUILD/image/Aurum-Veritas.jpg",
  "/GUILD/image/Porta-Imperii.jpg",
  "/GUILD/image/Tributum.jpg",
  "/GUILD/image/Vestry.jpg",
  "/GUILD/image/apotheosis-chamber.jpg",
  "/GUILD/image/gladiator-forum.jpg",
  "/GUILD/image/strategy-chamber.jpg",
  "/GUILD/guild-background-gold.png"
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
