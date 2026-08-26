const CACHE_NAME = "ponto-arena-v4";
const arquivos = [
    "./",
    "./index.html",
    "./partida.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./ponto-arena-192.png",
    "./ponto-arena-512.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(arquivos);
            })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(nomesCaches) {
            return Promise.all(
                nomesCaches.map(function(nome) {
                    if (nome !== CACHE_NAME) {
                        return caches.delete(nome);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(resposta) {
                return resposta || fetch(event.request);
            })
    );
});