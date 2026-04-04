// Service Worker — Cache-First strategy for static assets
const CACHE_NAME = 'ryo722-portfolio-v1'
const PRECACHE_URLS = [
  '/portfolio/',
  '/portfolio/index.html',
]

// Install: precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: cache-first for same-origin, network-first for others
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET requests
  if (request.method !== 'GET') return

  // Skip cross-origin requests (analytics, fonts CDN, etc.)
  if (!request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached, but update in background (stale-while-revalidate)
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        }).catch(() => cached)

        return cached
      }

      // Not cached — fetch and cache
      return fetch(request).then((response) => {
        if (!response.ok) return response

        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        return response
      })
    })
  )
})
