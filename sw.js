const CACHE_VERSION = 154;
const CACHE_NAME = 'phmurt-v' + CACHE_VERSION;
const PRECACHE_URLS = [
  '/',
  'index.html',
  'style.css',
  'phmurt-auth.js',
  'phmurt-shell.js',
  'phmurt-realtime.js',
  'phmurt-char-sync.js',
  'supabase-config.js',
  'site-config.js',
  'theme.js',
  'builder-data.js',
  'builder-data-35.js',
  'builder-common.js',
  'monster-data.js',
  'campaign-combat-integration.js',
  'campaign-play-loader.js',
  'combat-engine.js',
  'combat-flow-ui.js',
  'visual-effects.js',
  'campaign-world.js',
  'campaign-timeline.js',
  'living-world.js',
  'campaign-economy.js',
  'campaign-seasons.js',
  'campaign-religion.js',
  'campaign-hexcrawl.js',
  'campaign-downtime.js',
  'campaign-homebrew.js',
  'campaign-factionwar.js',
  'campaign-prophecy.js',
  // campaign-plague.js removed from standalone tab — plague events in living-world.js
  'campaign-heist.js',
  'campaign-intrigue.js',
  'campaign-puzzles.js',
  'campaign-scheduler.js',
  'campaign-relationships.js',
  'campaign-quests-view.js',
  'campaign-homebrew-view.js',
  'campaign-scheduler-view.js',
  'campaign-settings-view.js',
  'campaign-play.js',
  'logo.png'
];

// Maximum age for cached assets before forced revalidation (4 hours)
const MAX_CACHE_AGE = 4 * 60 * 60 * 1000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_URLS.map((url) => {
          return cache.add(url).catch(() => {
            // Ignore errors for optional files
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all caches that don't match current version
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from same origin
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.origin !== self.location.origin) return;
  // SECURITY (V-013): Never cache admin page
  if (url.pathname.includes('admin')) {
    return event.respondWith(fetch(event.request));
  }
  // Avoid caching API-like data requests; keep them network-only.
  if ((request.headers.get('accept') || '').includes('application/json')) return;

  // Network-first for HTML pages (always get fresh content)
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            throw new Error('Bad network response');
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            if (response) return response;
            return caches.match('index.html');
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for assets (CSS, JS, images)
  // Serves cached version immediately, fetches fresh copy in background
  const dest = request.destination || '';
  const isStaticAsset = dest === 'style' || dest === 'script' || dest === 'image' || dest === 'font';
  if (!isStaticAsset) return;
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          // Only cache valid same-origin responses
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Network failed, cached version (if any) is already being returned
          return cachedResponse;
        });

        // Return cached version immediately, or wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Listen for messages from the page to force cache refresh
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
    );
  }
});
