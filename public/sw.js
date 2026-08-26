const CACHE="bugunaltin-cache-reset-v3";
const ASSETS=["/styles.css","/app.js","/favicon.svg","/manifest.webmanifest"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;

  const url=new URL(event.request.url);

  // API responses must always be live.
  if(url.pathname.startsWith("/api/")){
    event.respondWith(fetch(event.request,{cache:"no-store"}));
    return;
  }

  // HTML/navigation: always prefer network so old pages don't remain stuck.
  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .catch(()=>caches.match("/"))
    );
    return;
  }

  // Static assets: network-first, cache only as fallback.
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
