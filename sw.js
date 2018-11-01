//
importScripts('js/sw-util.js');

const CACHE_STATIC = 'cache_static_v4';
const CACHE_DYNAMIC = 'cache_dynamic_v2';
const CACHE_INMUTABLE = 'cache_inmutable_v1';

const APP_SHELL = [
    //'/', solo  para localhost
    'index.html',
    'css/style.css',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', e => {
    const cacheStatic = caches.open(CACHE_STATIC).then(cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== CACHE_DYNAMIC && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(resp =>
        (resp) ? resp : fetch(e.request.url).then(
            file => actualizaCacheDinamico(CACHE_DYNAMIC, e.request, file)
        )
    )
    e.respondWith(respuesta);
});


// function actualizaCacheDinamico(dynamicCache, req, res) {
//     if (res.ok) {
//         return caches.open(dynamicCache).then(cache => {
//             cache.put(req, res.clone())
//             return res.clone()
//         })
//     } else {
//         return res;
//     }
// }