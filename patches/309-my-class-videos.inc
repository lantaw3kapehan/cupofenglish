/* 19 Oct · 309 · Teacher Today: "My class videos" — each finished class of yesterday and today: ✓ found (file, uploaded at) or ✗ not found yet,
   with the time the app last looked (the video check log, coe_vid_mine). So a teacher sees at once whether her upload reached the folder,
   before 23:59, and management has the same record. Shown only when there is something to show. */
(function(){
  let V = null, at = 0, busy = false;
  const hm = s => { try{ return new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  const dd = s => { try{ return new Date(String(s).slice(0, 10) + 'T12:00:00+08:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }catch(e){ return s; } };
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  function load(){ if(busy || !TOKEN || !(typeof D !== 'undefined' && D && !D.mgr) || Date.now() - at < 3 * 6e4) return; busy = true;
    fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: 'tVidMine', args: [], token: TOKEN }) })
      .then(x => x.json()).then(r => { if(r && r.ok && Array.isArray(r.data)){ V = r.data; at = Date.now(); paint(); } }).catch(() => {}).finally(() => { busy = false; }); }
  function paint(){ const root = document.getElementById('v-today'); if(!root || !V || typeof VIEW === 'undefined' || VIEW !== 'today') return; const old = document.getElementById('vidMine'); if(old) old.remove(); if(!V.length) return;
    const miss = V.filter(x => !x.found), t = today();
    const row = x => '<div class="row" style="gap:8px;align-items:center;padding:5px 0;border-top:1px dashed var(--line)"><span style="width:18px;text-align:center;font-weight:700;color:' + (x.found ? '#1E7A55' : '#C0392B') + '">' + (x.found ? '✓' : '✗') + '</span>'
      + '<div class="grow small"><b>' + esc(x.student || x.code) + '</b> · ' + esc(dd(x.day)) + ' ' + esc(hm(x.start)) + '<div class="mute">' + (x.found ? 'Video found' + (x.uploaded ? ' · uploaded ' + esc(hm(x.uploaded)) : '') + (x.name ? ' · ' + esc(x.name) : '') : 'No video in the folder yet · last checked ' + esc(hm(x.lastCheck)) + (x.day === t ? ' · upload by 23:59' : ' · it was due by 23:59')) + '</div></div>'
      + (x.found && x.url ? '<a class="btn ghost sm" href="' + esc(x.url) + '" target="_blank">Open</a>' : '') + '</div>';
    const h = '<section class="card" id="vidMine" style="padding:10px 14px;margin:10px 0 4px"><div class="row" style="align-items:center"><b class="grow">🎬 My class videos</b><span class="small ' + (miss.length ? '' : 'mute') + '" style="' + (miss.length ? 'color:#C0392B;font-weight:600' : '') + '">' + (miss.length ? miss.length + ' not found yet' : 'all found ✓') + '</span></div>'
      + '<div class="small mute" style="margin:2px 0 4px">Yesterday and today · the app checks your class folders in Drive · a video shows here within about 10 minutes of upload</div>'
      + V.map(row).join('') + '</section>';
    const after = document.getElementById('mustBox') || document.getElementById('ftBox') || root.querySelector('.lead'); if(after) after.insertAdjacentHTML('afterend', h); else root.insertAdjacentHTML('afterbegin', h); }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ setTimeout(paint, 450); load(); }catch(e){} return r; };
  setTimeout(load, 3000);
})();
