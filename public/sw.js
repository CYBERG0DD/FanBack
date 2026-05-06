const CACHE_NAME = 'fanback-v1';

// Files to cache on install — keep this minimal
const STATIC_ASSETS = [
    '/',
    '/index.html',
];

// Install: cache the shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch: network first, fall back to cache
// This strategy is safest for a dynamic app like FanBack
// where data must always be fresh
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and browser extension requests
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    // Skip Supabase API calls entirely — always hit the network for these
    if (event.request.url.includes('supabase.co')) return;

    // Skip YouTube API calls
    if (event.request.url.includes('googleapis.com')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If network succeeds, cache a copy and return the response
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Network failed — try the cache
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    // If nothing in cache either, return the app shell
                    return caches.match('/index.html');
                });
            })
    );
});