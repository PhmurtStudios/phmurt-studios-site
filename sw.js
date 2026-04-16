const CACHE_VERSION = 192;
const CACHE_NAME = 'phmurt-v' + CACHE_VERSION;
const PRECACHE_URLS = [
  '/',
  'index.html',
  'style.css',
  'phmurt-auth.js',
  'phmurt-utils.js',
  'phmurt-shell.js',
  'phmurt-realtime.js',
  'phmurt-char-sync.js',
  'supabase-config.js',
  'stripe-config.js',
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
  'campaign-plague.js',
  'campaign-heist.js',
  'campaign-kingdom.js',
  'campaign-map-engine.js',
  'campaign-map-bridge.js',
  'campaign-crafting.js',
  'campaign-invites.js',
  'override_functions.js',
  'campaign-intrigue.js',
  'campaign-puzzles.js',
  'campaign-scheduler.js',
  'campaign-relationships.js',
  'campaign-quests-view.js',
  'campaign-homebrew-view.js',
  'campaign-scheduler-view.js',
  'campaign-settings-view.js',
  'campaign-play.js',
  'logo.png',
  'about.html',
  'gallery.html',
  'learn.html',
  'learn-dm.html',
  'grimoire.html',
  'compendium.html',
  'privacy.html',
  'terms.html',
  'ogl.html',
  'campaigns.html',
  'character-builder.html',
  'character-builder-35.html',
  'character-sheets.html',
  'getting-started.html',
  'shared.html',
  'char-sheet-export.js',
  'my-characters.html',
  'characters.html',
  'sheet-dnd5e.html',
  'soup-savant.html',
  'legendary.html',
  'fantasy_map.html',
  'map_view.html',
  '404.html'
  // admin.html excluded: SECURITY (V-013) — never cache admin page
  // generators.html excluded: too large for precache (807KB)
  // reset-password.html excluded: auth flow page
  // supabase-setup-admin.html excluded: admin setup page
];

// NOTE: MAX_CACHE_AGE was previously defined but is no longer used.
// Cache invalidation is now handled via CACHE_VERSION updates.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_URLS.map((url) => {
          // SECURITY: Validate URL before caching to prevent malicious URIs
          if (typeof url !== 'string' || url.length === 0 || url.length > 1024) {
            console.warn('[SW] Skipping invalid precache URL:', url);
            return Promise.resolve();
          }
          return cache.add(url).catch((err) => {
            // Log errors for critical files only (don't fail install, but log for debugging)
            if (['index.html', 'phmurt-auth.js', 'phmurt-shell.js'].includes(url)) {
              console.warn('[SW] Failed to precache critical asset:', url, err);
            }
          });
        })
      );
    }).catch((err) => {
      console.error('[SW] Cache open failed during install:', err);
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
            return caches.delete(cacheName).catch((err) => {
              console.error('[SW] Failed to delete cache during activation:', cacheName, err);
            });
          }
        })
      );
    }).catch((err) => {
      console.error('[SW] Cache cleanup failed during activation:', err);
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  try {
    const url = new URL(request.url);

    // Only handle GET requests from same origin
    if (request.method !== 'GET') return;
    // SECURITY: Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (url.origin !== self.location.origin) return;
  } catch (e) {
    // SECURITY: Invalid URL parsing - don't cache
    return;
  }
  // SECURITY (V-013): Never cache admin pages or sensitive auth pages
  if (url.pathname === '/admin.html' || url.pathname.startsWith('/admin') ||
      url.pathname === '/reset-password.html' || url.pathname === '/supabase-setup-admin.html') {
    return event.respondWith(fetch(event.request).catch(() => {
      return new Response('Offline - page not available', { status: 503 });
    }));
  }
  // Avoid caching API-like data requests; keep them network-only.
  const acceptHeader = request.headers ? (request.headers.get('accept') || '') : '';
  if (typeof acceptHeader === 'string' && acceptHeader.includes('application/json')) {
    return event.respondWith(fetch(request).catch(() => {
      return new Response('API request not available offline', { status: 503 });
    }));
  }

  // Network-first for HTML pages (always get fresh content)
  const acceptHTML = request.headers ? (request.headers.get('accept') || '') : '';
  if (request.mode === 'navigate' || (typeof acceptHTML === 'string' && acceptHTML.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || !response.ok || response.type !== 'basic') {
            throw new Error('Bad network response');
          }
          const responseToCache = response.clone();
          // Cache update happens independently, don't block response on cache write
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.error('[SW] Failed to cache HTML response:', err);
            });
          }).catch((err) => {
            console.error('[SW] Failed to open cache for HTML:', err);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            if (response) return response;
            // Return cached index.html, or 404 fallback if that fails too
            return caches.match('index.html').then((indexResponse) => {
              return indexResponse || new Response('Offline - page not available', { status: 503 });
            }).catch(() => {
              return new Response('Offline - page not available', { status: 503 });
            });
          });
        })
    );
    return;
  }

  // Network-first for JS/CSS assets (always get fresh code, fall back to cache offline)
  const dest = String(request.destination || '');
  const isCodeAsset = dest === 'style' || dest === 'script';
  if (isCodeAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const responseToCache = response.clone();
            // Cache update happens independently, don't block response on cache write
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch((err) => {
                console.error('[SW] Failed to cache asset:', (request && request.url) || 'unknown', err);
              });
            }).catch((err) => {
              console.error('[SW] Failed to open cache for asset:', err);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).catch(() => {
            return new Response('Asset not available offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for images/fonts (less critical to be fresh)
  const isMediaAsset = dest === 'image' || dest === 'font';
  if (!isMediaAsset) return;
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        // SECURITY: Always return cached response if available, revalidate in background
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            cache.put(request, networkResponse.clone()).catch(() => {
              /* cache.put failed - log and continue */
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network failed - return cached version if available
          return cachedResponse || new Response('Media not available offline', { status: 503 });
        });
        // Return cached if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      }).catch(() => {
        return new Response('Media not available offline', { status: 503 });
      });
    }).catch((err) => {
      console.error('[SW] Cache open failed for media:', err);
      return new Response('Media not available offline', { status: 503 });
    })
  );
});

// Listen for messages from the page to force cache refresh
// Messages should come from window.postMessage (same origin by browser enforcement)
self.addEventListener('message', (event) => {
  // Validate message data type
  if (!event || !event.data || typeof event.data !== 'object') return;

  try {
    // SECURITY: Validate message type before processing
    const msgType = event.data.type && typeof event.data.type === 'string' ? String(event.data.type).slice(0, 50) : '';
    if (msgType === 'SKIP_WAITING') {
      self.skipWaiting();
    } else if (msgType === 'CLEAR_CACHE') {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          if (!Array.isArray(cacheNames)) {
            console.error('[SW] cacheNames is not an array');
            return Promise.resolve();
          }
          return Promise.all(cacheNames.map((name) => {
            if (typeof name !== 'string') {
              console.warn('[SW] Invalid cache name type:', typeof name);
              return Promise.resolve();
            }
            return caches.delete(name).catch((err) => {
              console.error('[SW] Failed to delete cache:', name, err);
            });
          }));
        }).catch((err) => {
          console.error('[SW] Failed to clear caches:', err);
        })
      );
    }
  } catch (err) {
    console.error('[SW] Error processing message:', err);
  }
});
