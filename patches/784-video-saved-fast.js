// 784: (Misty) "also saving takes time?" — after the last piece reaches Drive, the class shows "Video ✓" at once and the card says
// "✓ Uploaded · finishing the details"; Google's part (file check, DAILY link, late / review checks) runs after it.
// If the app is closed before Google answers, the next time the app opens it finishes that step by itself (up to 5 h later).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 784 · finish a class video that reached Drive but was not confirmed (app closed while saving) */
(function(){
  if(window.__784) return; window.__784 = 1;
  const LS = 'coe.vup';
  const run = async () => { if(typeof TOKEN === 'undefined' || !TOKEN || typeof apiNow !== 'function') return setTimeout(run, 5000);
    let o; try{ o = JSON.parse(localStorage.getItem(LS) || '{}') || {}; }catch(e){ return; }
    for(const id of Object.keys(o)){ const s = o[id]; if(!s || !s.fid || s.done || !s.key || Date.now() - (s.t || 0) > 5 * 36e5) continue;
      if(typeof window._vupBusy !== 'undefined' && window._vupBusy) continue;
      try{ const d = await apiNow('tVidDone', TOKEN, s.key, s.fid); if(d && d.ok !== false){ s.done = d.url || ('https://drive.google.com/file/d/' + s.fid + '/view'); s.t = Date.now();
          try{ const o2 = JSON.parse(localStorage.getItem(LS) || '{}') || {}; o2[id] = s; localStorage.setItem(LS, JSON.stringify(o2)); }catch(e){}
          if(typeof toast === 'function') toast('Class video saved · ' + (d.name || s.name || '')); } }catch(e){} } };
  setTimeout(run, 8000);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["      show('<b>Saving…</b><div class=\"small\" style=\"opacity:.8\">' + who + ' · linking it in DAILY</div>', 'wait');",
   "      s.fid = fileId; s.t = Date.now(); o = get(); o[id] = s; put(o);   /* 784: remembered, so it can be finished later if the app is closed */\n      D.vids = D.vids || {}; if(!(D.vids[id] && D.vids[id].url)){ D.vids[id] = { url: 'https://drive.google.com/file/d/' + fileId + '/view', at: hm() }; try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){} }\n      show('<b>✓ Uploaded · finishing the details…</b><div class=\"small\" style=\"opacity:.8\">' + who + ' · the video is in the school Drive · linking it in DAILY</div>', 'wait');"]
]);
