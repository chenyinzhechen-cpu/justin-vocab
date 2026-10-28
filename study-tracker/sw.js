'use strict';
const CACHE='study-tracker-workspace-v3.1-20261028';
const PREFIX='study-tracker-';
const ROOT=new URL('./',self.location.href);
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 // This worker serves only the Study Workspace directory. Vocabulary is outside its scope.
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname)||event.request.mode!=='navigate')return;
 event.respondWith(fetch(event.request,{cache:'no-cache'}).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)))}return response}).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(event.request)||await cache.match(new URL('index.html',ROOT).href)||Response.error()}));
});
