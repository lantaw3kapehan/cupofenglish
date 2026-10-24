// 781: (Misty) "make a notice to drag the video like that for convenience instead of choosing the video to upload".
// · Teachers on a laptop see a notice above their classes: drag the class video file onto the class's
//   "Upload the class video" box — no need to choose the file. It stays until they tap "Got it".
// · The upload box itself now says "Drag the video file here" first; the Upload video button is still there.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 781 · notice: drag the class video */
(function(){
  if(window.__781) return; window.__781 = 1;
  const K = 'coe.vdragtip', seen = () => { try{ return localStorage.getItem(K) === '1'; }catch(e){ return false; } };
  const st = document.createElement('style'); st.textContent = '.vdn{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:0 0 12px;padding:12px 16px;border-radius:16px;background:#E8F7F7;border:1.5px dashed #00A3AD;color:#0B4F55;font-size:14px}.vdn b{color:#00737B}.vdn button{margin-left:auto}';
  document.head.appendChild(st);
  window.vdTipOk = () => { try{ localStorage.setItem(K, '1'); }catch(e){} document.querySelectorAll('.vdn').forEach(x => x.remove()); };
  const run = () => { if(typeof D === 'undefined' || !D || D.mgr || matchMedia('(pointer:coarse)').matches) return;
    const zs = [...document.querySelectorAll('.hw button[onclick*="vidUp("]')].map(b => b.closest('.hw')).filter(Boolean);
    zs.forEach(z => { const t = z.querySelector('.grow b'); if(t && t.textContent === 'Upload the class video') t.textContent = 'Drag the class video file here'; });
    if(seen() || !zs.length || document.querySelector('.vdn')) return; const c = zs[0].closest('.cls'); if(!c) return;
    c.insertAdjacentHTML('beforebegin', '<div class="vdn"><span style="font-size:22px">🎬</span><div class="grow"><b>New · drag and drop your class video</b><br>Drag the video file from your folder onto the class’s box (“Drag the class video file here”). No need to choose the file · the app names and files it.</div><button class="btn sm teal" onclick="vdTipOk()">Got it</button></div>'); };
  new MutationObserver(() => { clearTimeout(run.t); run.t = setTimeout(run, 200); }).observe(document.body, { childList: true, subtree: true }); run();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
