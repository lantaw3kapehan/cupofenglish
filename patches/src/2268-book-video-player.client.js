<script id="b2268">
/* 16 Nov · 2268 · Course-book videos play inside the app (Misty 17:37: Drive showed "Can't load the video"). Tapping a ▶ video in a book
   (e.g. Reading Explorer 1 · Unit videos) opens a player over the app: the video streams through our server (coe-audio, course-book files
   only), so no Google sign-in and no Drive viewer. Full screen and speed come from the player itself; Esc or ✕ closes it.
   If it can't play, "Open in Google Drive" is offered. */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#vdOv{position:fixed;inset:0;z-index:9999;background:rgba(10,12,20,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px}
#vdOv .vd-top{width:min(1100px,100%);display:flex;align-items:center;gap:10px;color:#fff;margin-bottom:10px}
#vdOv .vd-top b{flex:1;min-width:0;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#vdOv .vd-top a,#vdOv .vd-top button{border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none}
#vdOv video{width:min(1100px,100%);max-height:calc(100vh - 110px);background:#000;border-radius:12px}
#vdOv .vd-msg{color:#fff;margin-top:12px;font-size:14px;text-align:center}
`; document.head.appendChild(st); }catch(e){}
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));
  const SRC = id => 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-audio?id=' + encodeURIComponent(id);
  window.vdClose = function(){ const o = document.getElementById('vdOv'); if(o){ const v = o.querySelector('video'); try{ v && v.pause(); }catch(e){} o.remove(); } };
  window.vdOpen = function(id, title){ vdClose(); try{ window.auStop && auStop(); }catch(e){}
    const view = 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view';
    const o = document.createElement('div'); o.id = 'vdOv';
    o.innerHTML = `<div class="vd-top"><b>▶ ${E(title)}</b><a href="${view}" target="_blank" rel="noopener">Open in Drive</a><button onclick="vdClose()">✕ Close</button></div>
<video controls autoplay playsinline preload="auto" src="${SRC(id)}"></video><div class="vd-msg">Loading the video… a few seconds</div>`;
    document.body.appendChild(o);
    const v = o.querySelector('video'), m = o.querySelector('.vd-msg');
    v.addEventListener('canplay', () => { m.textContent = 'In an online class, share your screen with sound on so the student sees and hears it.'; }, { once: true });
    v.addEventListener('error', () => { m.innerHTML = 'This video could not play here. <a href="' + view + '" target="_blank" rel="noopener" style="color:#9EE">Open it in Google Drive</a>.'; });
    o.addEventListener('click', ev => { if(ev.target === o) vdClose(); }); };
  document.addEventListener('keydown', ev => { if(ev.key === 'Escape' && document.getElementById('vdOv')) vdClose(); });
  document.addEventListener('click', ev => { try{
    if(ev.defaultPrevented) return;   /* the first-time books notice comes first */
    const a = ev.target && ev.target.closest && ev.target.closest('a[href*="drive.google.com/file/d/"]'); if(!a || !a.closest('#bkBody, #stuBk')) return;
    const t = (a.textContent || '').trim(); if(!/^▶/.test(t)) return;
    const id = decodeURIComponent((/\/d\/([^/]+)/.exec(a.getAttribute('href')) || [])[1] || ''); if(!id) return;
    ev.preventDefault(); ev.stopPropagation(); vdOpen(id, t.replace(/^▶\s*/, ''));
  }catch(e){} });
  if(typeof closeSheet === 'function'){ const c0 = closeSheet; closeSheet = function(){ vdClose(); return c0.apply(this, arguments); }; }
})();
</script>
