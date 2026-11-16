<script id="b2276">
/* 16 Nov · 2276 · Books media: instant and always on (Misty 18:34 "must open instantly · no downtime in class") and
   it stays open while the teacher moves around the app (18:36–18:37 "can they be opened in Today, Schedule, Payroll…").
   1. Every audio and video plays from our own copy (Supabase Storage, served from the CDN · copied from Drive by coe-media-sync).
      If a copy is missing it falls back by itself to the Drive stream (coe-audio), then to Drive's own player. No sign-in.
   2. Audio keeps playing when the book is closed: the player moves to a small bar at the bottom-right, on every screen.
   3. Videos have "Minimize": the video becomes a small window at the bottom-right and the app can be used behind it.
   4. The books of today's classes are fetched in the background when the app opens, so the book sheet opens at once.
   Book pages (PDF) open in a new browser tab (Google Drive), so a teacher can keep several open beside the app. */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#mDock{position:fixed;right:14px;bottom:14px;z-index:9998;width:min(380px,calc(100vw - 28px));display:grid;gap:8px}
#mDock #auDock{position:static;margin:0;box-shadow:0 10px 30px rgba(20,30,50,.22)}
#auDock .au-b button[data-nav]{display:none}
#vdOv.mini{inset:auto;right:14px;bottom:14px;width:min(400px,calc(100vw - 28px));padding:8px;border-radius:14px;background:#111;box-shadow:0 12px 34px rgba(0,0,0,.35)}
#vdOv.mini .vd-top{margin-bottom:6px}#vdOv.mini .vd-top b{font-size:13px}#vdOv.mini .vd-top a{display:none}
#vdOv.mini video{max-height:none;border-radius:8px}#vdOv.mini .vd-msg{display:none}
#mDock:has(#auDock) ~ #vdOv.mini, body:has(#mDock #auDock) #vdOv.mini{bottom:150px}
`; document.head.appendChild(st); }catch(e){}
  const ST = id => 'https://rlxkiahqjsabopmuhern.supabase.co/storage/v1/object/public/book-media/' + encodeURIComponent(id);
  const PX = id => 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-audio?id=' + encodeURIComponent(id);
  window.mST = ST;
  /* 1 · own copy first, then Drive stream, then Drive's player */
  window.mErr = function(el, id, kind){ const n = +(el.dataset.s || 1);
    if(n === 1){ el.dataset.s = 2; el.src = PX(id); try{ el.play(); }catch(e){} return; }
    if(kind === 'a' && window.auFallback) return auFallback(encodeURIComponent(id));
    if(kind === 'v'){ const m = document.querySelector('#vdOv .vd-msg'); if(m) m.innerHTML = 'This video could not play here. <a href="https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view" target="_blank" rel="noopener" style="color:#9EE">Open it in Google Drive</a>.'; } };
  /* 2 · audio dock */
  function dock(){ const bar = document.getElementById('auBar'), a = bar && bar.querySelector('audio'); if(!bar || !a || a.ended || (a.paused && a.currentTime < 0.3)) return;
    let d = document.getElementById('mDock'); if(!d){ d = document.createElement('div'); d.id = 'mDock'; document.body.appendChild(d); }
    const old = document.getElementById('auDock'); if(old) old.remove();
    bar.id = 'auDock'; bar.querySelectorAll('.au-b button').forEach(b => { if(/Previous|Next/.test(b.textContent)) b.dataset.nav = 1; });
    const x = bar.querySelector('.au-x'); if(x) x.setAttribute('onclick', "this.closest('#auDock').remove()");
    const h = bar.querySelector('.au-h'); if(h) h.textContent = 'Keeps playing on every screen · ✕ to close';
    d.appendChild(bar); }
  window.mDockAudio = dock;
  if(typeof closeSheet === 'function'){ const c0 = closeSheet; closeSheet = function(){ try{ dock(); }catch(e){} return c0.apply(this, arguments); }; }
  if(window.auPlay){ const p0 = window.auPlay; window.auPlay = function(){ const d = document.getElementById('auDock'); if(d){ const a = d.querySelector('audio'); try{ a && a.pause(); }catch(e){} d.remove(); } return p0.apply(this, arguments); }; }
  /* 3 · video minimise */
  window.vdMini = function(on){ const o = document.getElementById('vdOv'); if(!o) return; o.classList.toggle('mini', on !== false && !o.classList.contains('mini'));
    const b = o.querySelector('[data-mini]'); if(b) b.textContent = o.classList.contains('mini') ? 'Expand' : 'Minimize'; };
  /* 4 · today's books ready before class */
  function warm(){ try{ if(!D || D.mgr || !window.bkGet) return; const today = typeof ymdLocal === 'function' ? ymdLocal(new Date()) : new Date().toISOString().slice(0, 10);
    const ks = new Set(); (D.schedule || []).filter(c => c.day === today && !c.cancelled).forEach(c => { const s = (D.students || []).find(x => x.code === c.code) || {};
      String(c.book || s.book || '').split(/\s*[,;/]\s*/).map(x => x.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean).forEach(k => ks.add(k)); });
    [...ks].slice(0, 12).forEach((k, i) => setTimeout(() => { try{ bkGet(k).catch(() => {}); }catch(e){} }, 1500 + i * 400)); }catch(e){} }
  setTimeout(warm, 4000); setInterval(warm, 30 * 60000);
})();
</script>
