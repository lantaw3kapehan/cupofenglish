/* CupOfEnglish · "New version ready" bar for the homework pages (Misty 18 Nov 20:31).
   A page left open keeps running the version it opened with, so a fix made later (e.g. names kept in the Chinese) did not reach it.
   Every 3 minutes, and when the page comes back into view, this asks for the page and the shared header again; if either changed,
   a bar at the top says so with a Refresh button. It never reloads by itself, so nothing on screen is lost.
   Used by homework/give.html, homework/writing.html, homework/index.html and reader/index.html. */
(function(){
  if(window.__fresh) return; window.__fresh = 1;
  const me = document.currentScript && document.currentScript.src ? new URL(document.currentScript.src) : null;
  const files = [location.pathname, me ? new URL('hdr.js', me).pathname : '/homework/hdr.js'];
  const hash = t => { let h = 5381; for(let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return h; };
  const read = () => Promise.all(files.map(f => fetch(f + '?fresh=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.text() : '').catch(() => ''))).then(L => L.map(hash).join('.'));
  let first = null, shown = false, busy = false;
  function bar(){ if(shown) return; shown = true;
    const b = document.createElement('div'); b.setAttribute('role', 'status');
    b.style.cssText = 'position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:9999;display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:center;' +
      'background:#fff;border:1px solid #BFE8EC;box-shadow:0 8px 24px rgba(43,34,83,.14);border-radius:14px;padding:10px 12px 10px 16px;font:500 15px Inter,"Noto Sans SC",system-ui,sans-serif;color:#2B2253;max-width:calc(100% - 24px)';
    b.innerHTML = '<span>A newer version of this page is ready. Copy or save what you are working on, then refresh.</span>';
    const r = document.createElement('button'); r.type = 'button'; r.textContent = 'Refresh';
    r.style.cssText = 'min-height:40px;padding:0 16px;border:0;border-radius:10px;background:#00ACB8;color:#fff;font:600 15px Inter,system-ui,sans-serif;cursor:pointer';
    r.onclick = () => location.reload();
    const x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Hide'); x.textContent = '✕';
    x.style.cssText = 'min-height:40px;min-width:40px;border:0;background:none;color:#6B6880;font-size:16px;cursor:pointer';
    x.onclick = () => { b.remove(); shown = false; first = null; check(); };   /* hidden until the next change */
    b.appendChild(r); b.appendChild(x); document.body.appendChild(b); }
  async function check(){ if(busy || document.hidden) return; busy = true;
    try{ const h = await read(); if(!h.split('.').every(Boolean) || h.split('.').some(x => x === String(hash('')))) return;
      if(first === null) first = h; else if(h !== first) bar(); }catch(e){} finally{ busy = false; } }
  setTimeout(check, 1500); setInterval(check, 3 * 60000);
  document.addEventListener('visibilitychange', () => { if(!document.hidden) check(); });
})();
