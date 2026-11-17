/**
 * sw.js - Service Worker pour Violet Startpage (Mode Hors-Ligne & Cache Instantané PWA)
 */

const CACHE_NAME = 'violet-startpage-v8.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/base.css',
  './css/sidebar.css',
  './css/dashboard.css',
  './css/dashboard-overview.css',
  './css/skeletons.css',
  './css/search.css',
  './css/bookmarks.css',
  './css/calendar.css',
  './css/tasks.css',
  './css/weather.css',
  './css/feeds.css',
  './css/markets.css',
  './css/notes-studio.css',
  './css/deck.css',
  './css/widgets.css',
  './css/modals.css',
  './css/responsive.css',
  './css/themes/kanagawa.css',
  './css/themes/sakura.css',
  './css/themes/cyberdeck.css',
  './css/themes/retrowave.css',
  './css/themes/glass.css',
  './images/glass.svg',
  './js/themes.js',
  './js/appearance.js',
  './js/weather-fx.js',
  './js/weather.js',
  './js/calendar.js',
  './js/tasks.js',
  './js/search.js',
  './js/feeds.js',
  './js/bookmarks.js',
  './js/markets.js',
  './js/notes.js',
  './js/widgets.js',
  './js/custom-hub.js',
  './js/command-palette.js',
  './js/shortcuts.js',
  './js/dashboard.js',
  './js/app.js',
  './images/gif.gif',
  './images/gif2.webp',
  './images/gif3.webp',
  './images/gif4.gif'
];

// Installation : pré-mise en cache des fichiers statiques optimisés
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache partiel lors de l\'installation:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation : nettoyage immédiat des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes : Stale-While-Revalidate pour 0 ms de latence
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;

  // 1. Les routes d'API locales ne doivent pas être mises en cache statique
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Fichiers statiques locaux : Stale-While-Revalidate (Réponse immédiate depuis le cache + MàJ en arrière-plan)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Requêtes externes (météo, APIs boursières) : Network-First avec repli sur cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
