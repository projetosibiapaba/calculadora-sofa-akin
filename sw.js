const CACHE_NAME = 'sofa-akin-calculator-v3'; // Nova versão para forçar a atualização
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './images/icon-192x192.png',
    './images/icon-512x512.png'
];

// Evento de Instalação: guarda os ficheiros principais da aplicação
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CORE_ASSETS))
    );
});

// Evento de Ativação: limpa caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name.startsWith('sofa-akin-calculator-') && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Evento Fetch: serve a aplicação com uma estratégia "network falling back to cache"
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(networkResponse => {
            // Se a resposta da rede for bem-sucedida, guarda no cache e retorna
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        }).catch(() => {
            // Se a rede falhar (offline), tenta buscar no cache
            return caches.match(event.request);
        })
    );
});
