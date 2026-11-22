// CupOfEnglish: keeps the app frame on the phone so it opens instantly and installs as an app.
const V = 'coe-4', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V && x !== BOOKS).map(x => caches.delete(x))))); self.clients.claim(); });   // 2554: the saved books stay
// 2554 (Misty 23:19): class audio and video saved on this computer before class (app 2552) play from here, with no buffering.
// Only audio/video requests for our book files; anything not saved goes to the internet exactly as before.
const BOOKS = 'coe-books-pre', MEDIA = 'https://rlxkiahqjsabopmuhern.supabase.co/storage/v1/object/public/book-media/';
let SAVED = null;   // the saved media addresses, so a file that is not saved is never touched here (it goes to the internet untouched)
function loadSaved() { return caches.open(BOOKS).then(c => c.keys()).then(k => { SAVED = new Set(k.map(r => r.url).filter(x => x.startsWith(MEDIA) && x.indexOf('?') < 0)); }).catch(() => { SAVED = new Set(); }); }
self.addEventListener('message', e => { if (e.data === 'coe-books-saved') loadSaved(); });
function fromSaved(req) {
  return caches.open(BOOKS).then(c => c.match(req.url)).then(hit => {
    if (!hit) return fetch(req);
    return hit.blob().then(b => {
      const rg = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('Range') || '');
      const type = hit.headers.get('Content-Type') || b.type || 'application/octet-stream';
      if (!rg) return new Response(b, { status: 200, headers: { 'Content-Type': type, 'Content-Length': String(b.size), 'Accept-Ranges': 'bytes' } });
      let s = rg[1] === '' ? Math.max(0, b.size - (+rg[2] || 0)) : +rg[1], en = rg[1] !== '' && rg[2] !== '' ? Math.min(+rg[2], b.size - 1) : b.size - 1;
      if (s >= b.size || s > en) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + b.size } });
      return new Response(b.slice(s, en + 1), { status: 206, headers: { 'Content-Type': type, 'Content-Range': 'bytes ' + s + '-' + en + '/' + b.size, 'Content-Length': String(en - s + 1), 'Accept-Ranges': 'bytes' } });
    });
  }).catch(() => fetch(req));
}
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method === 'GET' && (e.request.destination === 'audio' || e.request.destination === 'video') && e.request.url.startsWith(MEDIA) && !u.search) {
    if (SAVED === null) loadSaved(); else if (SAVED.has(e.request.url)) e.respondWith(fromSaved(e.request));
    return; }
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // everything else goes live
  if (/\/app\.html$/.test(u.pathname)) return;                              // the screens: always fetched fresh (the frame keeps its own copy)
  if (/\/verify\//.test(u.pathname)) return;   // 21 Oct · the public verify page is never cached as the app frame
  if (/\/(partner|student|assess)\//.test(u.pathname)) return;  // 27 Oct · partner and parent pages are separate, never cached as the app frame (5 Nov: + assess)
  if (/\/portal-update\.js$/.test(u.pathname)) return;
  if (/\/paused\.html$/.test(u.pathname)) return;   // 2022 · the 'open in another window' page is never kept as the app frame
  if (/\/version\.txt$/.test(u.pathname)) return;   // 1970 · the version check is always live (the app frame opens its saved copy when it is the newest)  // 1354 · the portals' shared updater is always fetched live
  const page = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(u.pathname);
  e.respondWith(caches.open(V).then(c => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(page ? './' : e.request, r.clone()); return r; });
    if (page) return net.catch(() => c.match('./'));                         // the frame: newest first, phone copy when offline
    return c.match(e.request, { ignoreSearch: !/[?&]v=/.test(u.search) }).then(hit => hit || net);   // icons: phone copy first · 2684: a file asked for with ?v= (a new version) is never answered with an older saved copy
  }));
});
// 19 Oct · phone notifications sent by the database (coe-push), even when the app is closed
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'CupOfEnglish', body: e.data ? e.data.text() : '' }; }
  const at = /^chat-at/.test(d.tag || '');   // 1402: Team Chat mention / needs reply / direct message: stays until clicked, stronger vibration
  const ch = /^chat/.test(d.tag || '');      // 1419 (Misty 10:11): every Team Chat alert says it is from our Team Chat; sender and group go in the text
  if (ch) { d.body = (d.title ? d.title + ': ' : '') + (d.body || ''); d.title = 'CupOfEnglish Team Chat'; }
  // 2032 (9 Nov 21:05, Misty: "I'm hearing an extra sound but not on Team Chat"): while the app is open on screen it already plays the
  // marimba, so the phone / computer notification comes silently (no second system sound). App closed → the usual notification sound.
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => l.some(c => c.visibilityState === 'visible' && c.url.startsWith(self.registration.scope))).catch(() => false).then(open =>
    self.registration.showNotification(d.title || 'CupOfEnglish', { body: d.body || '', tag: d.tag || 'coe', renotify: !open, requireInteraction: at && !open, silent: open, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: open ? [] : at ? [300, 120, 300, 120, 500] : [200, 100, 200], data: { url: d.url || './' } })));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => { for (const c of l) if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus(); return self.clients.openWindow(url); }));
});
