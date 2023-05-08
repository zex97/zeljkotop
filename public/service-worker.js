const CACHE_NAME = 'audio-cache-v1';
const CACHE_FILES = [
    // important files can be added here, but all files are going to be added to
    // the cache anyway through separate fetches
];

// Install the Service Worker
this.addEventListener('install', event => {
    // console.log('[Service Worker] Installing');

    // Cache the required files
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // console.log('[Service Worker] Caching files');
                return cache.addAll(CACHE_FILES);
            })
    );
});

// Activate the Service Worker
this.addEventListener('activate', event => {
    // console.log('[Service Worker] Activating');

    // Delete any old caches
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(cacheName => {
                        return cacheName.startsWith('audio-cache-') && cacheName !== CACHE_NAME;
                    }).map(cacheName => {
                        // console.log('[Service Worker] Deleting old cache');
                        return caches.delete(cacheName);
                    })
                );
            })
    );
});

// Intercept network requests
this.addEventListener('fetch', event => {
    // console.log('[Service Worker] Fetching');

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the resource is in the cache, return it
                if (response) {
                    // console.log('[Service Worker] Returning cached file ' + response.url);
                    return response;
                }

                // If the resource is not in the cache, fetch it from the network and add it to the cache
                // console.log('[Service Worker] Fetching file from network');
                return fetch(event.request)
                    .then(response => {
                        // If the response is partial with a 206 status code, return it directly without caching
                        if (response.status === 206) {
                            // console.log('[Service Worker] Partial content, returning response without caching');
                        } else {
                            // Clone the response to add it to the cache and return it to the browser
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    // console.log('[Service Worker] Adding file to cache');
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('[Service Worker] Fetching failed:', error);
                    });
            })
    );
});
