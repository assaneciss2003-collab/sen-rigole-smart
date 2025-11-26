const CACHE_NAME = 'sen-rigole-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://i.imgur.com/BrPQrgw.jpeg'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes (stratégie Network First)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone la réponse
        const responseClone = response.clone();
        
        // Met à jour le cache
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, utilise le cache
        return caches.match(event.request);
      })
  );
});

// Notifications push (optionnel)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle alerte rigole',
    icon: 'https://i.imgur.com/BrPQrgw.jpeg',
    badge: 'https://i.imgur.com/BrPQrgw.jpeg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('SEN RIGOLE SMART', options)
  );
});
