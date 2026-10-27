/* 1354 · 27 Oct 2026 · shared by the Student portal (student/) and the Partner portal (partner/): never keep an old version open.
   The page says which version it is (<meta name="portal-version">) and calls PortalUpdate.init({...}). Its folder's version.txt is
   fetched with cache:'no-store' when the page opens, every 5 minutes while it is open, and when it becomes visible again (WeChat keeps
   pages alive in the background). If version.txt differs, the page reloads at a safe moment (no text field focused, no picture being
   made, no sheet open); otherwise a small bar "有新版本 · 点此更新 Update" appears and reloads on tap, or by itself once idle.
   The same timer refreshes the page's data quietly (opts.refresh; every opts.dataEvery ms if set — the Student portal uses 60 s), never while the person is typing or a picture is being made.
   Release step: bump <folder>/version.txt and the page's portal-version (tools/portal-bump.sh <folder> <version>). */
(function () {
  'use strict';
  if (window.PortalUpdate) return;
  var O = { url: 'version.txt', every: 5 * 60e3, dataEvery: 0, busy: null, refresh: null }, CUR = '', NEW = '', last = 0, lastData = Date.now(), checking = false, bar = null, idleT = 0;
  function meta() { var m = document.querySelector('meta[name="portal-version"]'); return m ? String(m.content || '').trim() : ''; }
  function typing() { var a = document.activeElement; return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable)); }
  function busy() { try { return typing() || (typeof O.busy === 'function' && !!O.busy()); } catch (e) { return true; } }
  function go() { try { if (sessionStorage.getItem('pu.tried') === NEW) return; sessionStorage.setItem('pu.tried', NEW); } catch (e) {}   /* never a reload loop if version.txt and the page disagree */
    try { var u = location.pathname + '?v=' + encodeURIComponent(NEW || String(Date.now())) + location.hash; location.replace(u); } catch (e) { location.reload(); } }
  function showBar() {
    if (bar) return;
    bar = document.createElement('button'); bar.type = 'button'; bar.id = 'puBar';
    bar.setAttribute('aria-live', 'polite');
    bar.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:calc(10px + env(safe-area-inset-top));z-index:50;display:flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border:0;border-radius:999px;background:#00707A;color:#fff;font:700 14px/1.2 Inter,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 6px 20px rgba(43,36,80,.25);cursor:pointer';
    bar.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>有新版本 · 点此更新 Update';
    bar.onclick = go; document.body.appendChild(bar);
  }
  function whenSafe() { try { if (sessionStorage.getItem('pu.tried') === NEW) return; } catch (e) {} if (!busy()) return go(); showBar(); clearTimeout(idleT); idleT = setTimeout(function () { if (!busy()) go(); else whenSafe(); }, 60e3); }
  function check() {
    if (checking || !CUR) return; checking = true; last = Date.now();
    fetch(O.url + (O.url.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (t) { t = String(t || '').trim(); if (t && t !== CUR && /^[\w.-]{1,40}$/.test(t)) { NEW = t; whenSafe(); } })
      .catch(function () {}).then(function () { checking = false; });
  }
  function data(force) { if (typeof O.refresh !== 'function' || busy() || document.hidden) return; if (!force && Date.now() - lastData < (O.dataEvery || O.every) - 5e3) return; lastData = Date.now(); try { O.refresh(); } catch (e) {} }
  /* presence (27 Oct): while a signed-in page is on screen, say "I'm here" about once a minute so management can see who opened the portal.
     Sends only: the session token (to know who), device family, current tab, page version. No IP or location is stored. */
  var lastPing = 0, PING = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-portal-ping';
  function devName() { var u = navigator.userAgent || '', ipad = /iPad/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1);
    var t = ipad || /Tablet/.test(u) ? 'tablet' : /Mobi|iPhone|Android/.test(u) ? 'phone' : 'laptop';
    var os = /iPhone|iPad|iPod/.test(u) || ipad ? 'iOS' : /Android/.test(u) ? 'Android' : /Mac/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows' : /Linux|CrOS/.test(u) ? 'Linux' : '';
    var br = /MicroMessenger/.test(u) ? 'WeChat' : /Edg\//.test(u) ? 'Edge' : /Firefox|FxiOS/.test(u) ? 'Firefox' : /Chrome|CriOS/.test(u) ? 'Chrome' : /Safari/.test(u) ? 'Safari' : '';
    return [t, os, br].filter(Boolean).join('·'); }
  function ping(force) { var P = O.presence; if (!P || document.hidden) return; if (!force && Date.now() - lastPing < 55e3) return;
    var tok = ''; try { tok = P.token() || ''; } catch (e) {} if (!tok) return; lastPing = Date.now();
    var view = ''; try { view = String(P.view ? P.view() || '' : ''); } catch (e) {}
    try { fetch(PING, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tok, kind: P.kind, dev: devName(), view: view, v: CUR }), keepalive: true }).catch(function () {}); } catch (e) {} }
  function tick() { if (document.hidden) return; if (Date.now() - last >= O.every - 5e3) check(); data(false); ping(false); }
  window.PortalUpdate = {
    init: function (opts) { for (var k in opts) O[k] = opts[k]; CUR = meta(); check(); setInterval(tick, 30e3); setTimeout(function () { ping(true); }, 1500);
      document.addEventListener('visibilitychange', function () { if (!document.hidden) { check(); data(true); ping(false); } });
      window.addEventListener('pageshow', function (e) { if (e.persisted) { check(); data(true); ping(true); } });
      window.addEventListener('focus', function () { if (Date.now() - last > 60e3) check(); }); },
    check: check, version: function () { return CUR; }, ping: function () { ping(true); }
  };
})();
