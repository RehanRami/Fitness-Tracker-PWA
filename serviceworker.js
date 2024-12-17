const CACHE_NAME = 'fitness-tracker-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/images/192logo.png',
    '/images/512logo.png',
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting cache: ${name}`);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve assets from cache or fetch from the network
self.addEventListener('fetch', (event) => {
    console.log(`[Service Worker] Fetching: ${event.request.url}`);
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached resource if available, else fetch from the network
            return response || fetch(event.request);
        })
    );
});
