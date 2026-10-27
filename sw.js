// CupOfEnglish: keeps the app frame on the phone so it opens instantly and installs as an app.
const V = 'coe-4', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // everything else goes live
  if (/\/app\.html$/.test(u.pathname)) return;                              // the screens: always fetched fresh (the frame keeps its own copy)
  if (/\/verify\//.test(u.pathname)) return;   // 21 Oct · the public verify page is never cached as the app frame
  if (/\/(partner|student)\//.test(u.pathname)) return;  // 27 Oct · partner and parent pages are separate, never cached as the app frame
  if (/\/portal-update\.js$/.test(u.pathname)) return;  // 1354 · the portals' shared updater is always fetched live
  const page = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(u.pathname);
  e.respondWith(caches.open(V).then(c => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(page ? './' : e.request, r.clone()); return r; });
    if (page) return net.catch(() => c.match('./'));                         // the frame: newest first, phone copy when offline
    return c.match(e.request, { ignoreSearch: true }).then(hit => hit || net);   // icons: phone copy first
  }));
});
// 19 Oct · phone notifications sent by the database (coe-push), even when the app is closed
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'CupOfEnglish', body: e.data ? e.data.text() : '' }; }
  const at = /^chat-at/.test(d.tag || '');   // 1402: Team Chat mention / needs reply / direct message: stays until clicked, stronger vibration
  e.waitUntil(self.registration.showNotification(d.title || 'CupOfEnglish', { body: d.body || '', tag: d.tag || 'coe', renotify: true, requireInteraction: at, silent: false, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: at ? [300, 120, 300, 120, 500] : [200, 100, 200], data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => { for (const c of l) if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus(); return self.clients.openWindow(url); }));
});
