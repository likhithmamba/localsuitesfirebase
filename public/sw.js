// SmartLocal Suite Service Worker
const CACHE_NAME = 'smartlocal-v1'
const OFFLINE_URL = '/offline.html'

// Assets to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Add other critical assets here
]

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /^\/api\/products/,
  /^\/api\/shop/,
  /^\/api\/analytics/
]

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL)
      })
    )
    return
  }

  // Handle API requests with cache-first strategy for GET requests
  if (event.request.url.includes('/api/')) {
    if (event.request.method === 'GET') {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version and update in background
            fetch(event.request).then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, response.clone())
                })
              }
            }).catch(() => {}) // Ignore network errors in background update
            return cachedResponse
          }

          // No cache, try network
          return fetch(event.request).then((response) => {
            if (response.ok && API_CACHE_PATTERNS.some(pattern => pattern.test(event.request.url))) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone())
              })
            }
            return response
          }).catch(() => {
            // Return a default response for failed API calls
            return new Response(JSON.stringify({
              success: false,
              error: 'Offline - cached data not available',
              offline: true
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
          })
        })
      )
    } else {
      // For non-GET requests (POST, PUT, DELETE), queue them for sync
      event.respondWith(
        fetch(event.request).catch(() => {
          // Queue the request for background sync
          return queueRequest(event.request)
        })
      )
    }
    return
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// Background sync for offline requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(processOfflineQueue())
  }
})

// Queue requests for background sync when offline
async function queueRequest(request) {
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: request.method !== 'GET' ? await request.text() : null,
    timestamp: Date.now()
  }

  // Store in IndexedDB (simplified version)
  const db = await openDB()
  const transaction = db.transaction(['offlineQueue'], 'readwrite')
  const store = transaction.objectStore('offlineQueue')
  await store.add(requestData)

  // Register for background sync
  self.registration.sync.register('background-sync')

  return new Response(JSON.stringify({
    success: true,
    message: 'Request queued for sync when online',
    queued: true
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

// Process queued requests when back online
async function processOfflineQueue() {
  const db = await openDB()
  const transaction = db.transaction(['offlineQueue'], 'readwrite')
  const store = transaction.objectStore('offlineQueue')
  const requests = await store.getAll()

  for (const requestData of requests) {
    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body
      })

      if (response.ok) {
        // Remove from queue on success
        await store.delete(requestData.id)
        
        // Notify client about successful sync
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              url: requestData.url
            })
          })
        })
      }
    } catch (error) {
      console.error('Failed to sync request:', error)
      // Keep in queue for retry
    }
  }
}

// Simple IndexedDB wrapper for offline queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('smartlocal-offline', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('offlineQueue')) {
        const store = db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp')
      }
    }
  })
}