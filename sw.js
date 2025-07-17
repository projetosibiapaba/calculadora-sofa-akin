const CACHE_NAME = 'sofa-akin-calculator-v4'; // Nova versão para forçar a atualização
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './images/icon-192x192.png',
    './images/icon-512x512.png'
];

// Evento de Instalação: guarda os ficheiros essenciais da aplicação
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

// Evento Fetch: serve a aplicação a partir do cache primeiro
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna a resposta do cache se existir, senão busca na rede
                return response || fetch(event.request);
            })
    );
});
