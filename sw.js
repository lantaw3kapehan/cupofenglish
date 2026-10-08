// CupOfEnglish: keeps the app frame on the phone so it opens instantly and installs as an app.
const V = 'coe-2', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // everything else goes live
  const page = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(u.pathname);
  e.respondWith(caches.open(V).then(c => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(page ? './' : e.request, r.clone()); return r; });
    if (page) return net.catch(() => c.match('./'));                         // the frame: newest first, phone copy when offline
    return c.match(e.request, { ignoreSearch: true }).then(hit => hit || net);   // icons: phone copy first
  }));
});
