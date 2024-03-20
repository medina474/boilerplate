// todo: 'install' event is for old caches deletion. use it?
// todo: split filesToCache in two arrays for easy configuration and merge them
// todo: use typescript. referernces:
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/service_worker_api
// https://jcs.wtf/service-worker-stale-while-revalidate/
// https://maxtsh.medium.com/caching-strategies-for-front-end-developers-using-a-service-worker-6264d249f080

const version = "1.0.11";
const cacheName = `cache-${version}`;

var filesToCache = [

  // infrastructure files
  //'/',
  'index.html',
  'sw.js',
  'manifest.json',
  'images/icon-512.png',
  'images/icons-vector.svg',
  'monk.html',
  'monk2.html'
  //'favicon.png',

  // app files
  //'page2.html',
  //'css/styles.css',
  //'img/header.jpg',
  //'img/offline-img.png',
  //'https://fonts.googleapis.com/css?family=Raleway'
];

/**
 * 'Install' event. Writing files to browser cache
 *
 * @param {string} Event name ('install')
 * @param {function} Callback function with event data
 *
 */
self.addEventListener("install", (event) => {
  console.log("sw is installed");
  const channel = new BroadcastChannel("sw-messages");
  channel.postMessage({ version });
});

// This allows the web app to trigger skipWaiting
self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") self.skipWaiting();
});

/**
 * 'Activate' event. Service worker is activated
 *
 * @param {string} Event name ('activate')
 * @param {function} Callback function with event data
 *
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.open(cacheName).then(cache => cache.addAll(filesToCache)),
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== cacheName).map((nm) => caches.delete(nm))
    ))
  ]))
  console.log(`sw is activated with ${cacheName}`);
})

/*
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== cacheName).map((nm) => caches.delete(nm))
      )),
      caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
      )
    console.log("sw is activated");
})
*/

/**
 * 'Fetch' event. Browser tries to get resources making a request
 *
 * @param {string} Event name ('fetch')
 * @param {function} Callback function with event data
 *
 */
self.addEventListener('fetch', function (event) {

  const { mode } = event.request;
  const selfURL = self.location;
  const url = new URL(event.request.url);
  const isOnline = self.navigator.onLine;
  const isAsset = url.pathname.includes("/assets/");

  const isHTML = event.request.mode === "navigate";
  const isDomJS = url.pathname.includes("dom.js");
  const isJS = isAsset && url.pathname.includes(".js");
  const isImage = ["jpg", "jpeg", "png", "webp"].some((mim) =>
    url.pathname.includes(`.${mim}`),
  );
  const isCSS = isAsset && url.pathname.includes(".css");
  const isJSON = isAsset && url.pathname.includes(".json");

  const isFont =
    isAsset &&
    ["woff", "woff2", "ttf", "otf"].some((mim) =>
      url.pathname.includes(`.${mim}`),
    );
  const isExternal = mode === "cors" || url.hostname !== selfURL.hostname;

  if (isOnline) {
    if (isImage || isJSON || isFont) event.respondWith(cacheFirst(event));

    if (!isDomJS && !isHTML) {
      if (isJS || isCSS) {
        event.respondWith(networkFirst(event));
      }
    }
  } else {
    event.respondWith(cacheOnly(event));
  }

})

function networkOnly(event) {
  console.log(`from network = ${event.request.url}`)
  return fetch(event.request)
}

async function cacheOnly(event) {
  console.log(`from cache = ${event.request.url}`)
  return caches.match(event.request);
}

async function cacheFirst(event) {
  try {
    // Return the cache response if it is not null
    const cacheResponse = await caches.match(event.request);
    if (cacheResponse) {
      console.log(`find in cache = ${event.request.url}`)
      return cacheResponse;
    }

    // If no cache, fetch and cache the result and return result
    const fetchResponse = await fetch(event.request);
    const cache = await caches.open(cacheName);
    await cache.put(event.request, fetchResponse.clone());
    console.log(`fetch from network and store in cache = ${event.request.url}`)
    return fetchResponse;
  } catch (err) {
    console.log("Could not return cache or fetch CF", err);
  }
}

async function networkFirst(event) {
  try {
    const fetchResponse = await fetch(event.request);
    if (fetchResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(event.request, fetchResponse.clone());
      console.log(`fetch from network = ${event.request.url}`)
      return fetchResponse;
    } else {
      console.log(`try from cache = ${event.request.url}`)
      const cacheResponse = await caches.match(event.request);
      return cacheResponse;
    }
  } catch (err) {
    console.log("Could not return cache or fetch NF", err);
  }
}

// Always try cache and network in parallel and revalidate the response
async function staleWhileRevalidate(event) {
  try {
    // Return the cache response
    // Revalidate as well and update cache
    const [cacheResponse, fetchResponse, cache] = await Promise.all([
      caches.match(event.request),
      fetch(event.request),
      caches.open(cacheName),
    ]);

    await cache.put(event.request, fetchResponse.clone());

    return cacheResponse || fetchResponse;
  } catch (err) {
    console.log("Could not return and fetch the asset CF", err);
  }
}

async function FetchDefault(event) {
  try {
    const cacheResponse = await caches.match(event.request);
    return cacheResponse || fetch(event.request);
  }
  catch (err) {
    return caches.match('img/offline-img.png');
  }
}
