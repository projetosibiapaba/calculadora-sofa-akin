const CACHE_NAME = 'sofa-akin-calculator-v2'; // Versão atualizada para forçar a atualização
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './images/icon-192x192.png',
    './images/icon-512x512.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Evento de Instalação: guarda os ficheiros essenciais
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error("Falha ao adicionar ficheiros ao cache: ", err);
            })
    );
});

// Evento de Ativação: limpa caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cache => {
                    return cache.startsWith('sofa-akin-calculator-') && cache !== CACHE_NAME;
                }).map(cache => {
                    return caches.delete(cache);
                })
            );
        })
    );
});

// Evento Fetch: serve a aplicação a partir do cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se o recurso estiver no cache, retorna-o
                if (response) {
                    return response;
                }
                // Senão, busca na rede
                return fetch(event.request);
            })
    );
});
