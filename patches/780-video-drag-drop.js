// 780: (Misty) "make the video drag here instead of uploading" — on a laptop the teacher can drag the class video file onto the class's
// "Upload the class video" box (or its Upload video button). Same checks, naming and upload as the button; the box lights up while dragging.
// Dropping a file anywhere else no longer opens it in the browser (it says where to drop it).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 780 · drag the class video onto its class */
(function(){
  if(window.__780 || typeof window.vidUp !== 'function') return; window.__780 = 1;
  const st = document.createElement('style'); st.textContent = '.hw.vdrop{outline:3px dashed #00A3AD;outline-offset:2px;background:#E8F7F7!important}.hw .vdh{font-size:12px;color:#00737B;font-weight:700;margin-left:6px}';
  document.head.appendChild(st);
  const hasFiles = e => e.dataTransfer && [...(e.dataTransfer.types || [])].indexOf('Files') > -1;
  const zoneOf = el => { const z = el && el.closest && el.closest('.hw'); if(!z) return null; const b = z.querySelector('button[onclick*="vidUp("]'); if(!b) return null; const m = b.getAttribute('onclick').match(/vidUp\('([^']+)'/); return m ? { z, id: m[1] } : null; };
  let on = null; const clear = () => { if(on){ on.classList.remove('vdrop'); on = null; } };
  document.addEventListener('dragover', e => { if(!hasFiles(e)) return; e.preventDefault(); const k = zoneOf(e.target); if(k){ e.dataTransfer.dropEffect = 'copy'; if(on !== k.z){ clear(); on = k.z; on.classList.add('vdrop'); } } else { e.dataTransfer.dropEffect = 'none'; clear(); } });
  document.addEventListener('dragleave', e => { if(on && !on.contains(e.relatedTarget)) clear(); });
  document.addEventListener('drop', e => { if(!hasFiles(e)) return; e.preventDefault(); const k = zoneOf(e.target); clear();
    if(!k) return toast('Drop the video on the class’s “Upload the class video” box');
    const f = e.dataTransfer.files && e.dataTransfer.files[0]; if(!f) return;
    if(e.dataTransfer.files.length > 1) toast('One video per class · using ' + f.name);
    window.__vidDrop = { f, id: k.id, t: Date.now() }; window.vidUp(k.id); });
  /* a small hint on the box (laptops only) */
  const tag = () => { if(matchMedia('(pointer:coarse)').matches) return; document.querySelectorAll('.hw button[onclick*="vidUp("]').forEach(b => { const z = b.closest('.hw'), t = z && z.querySelector('.grow b'); if(t && !z.querySelector('.vdh')) t.insertAdjacentHTML('afterend', '<span class="vdh">· or drag the file here</span>'); }); };
  new MutationObserver(() => { clearTimeout(tag.t); tag.t = setTimeout(tag, 150); }).observe(document.body, { childList: true, subtree: true }); tag();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["    if(BUSY) return toast(BUSY === id ? 'This video is still uploading' : 'Another class video is still uploading · wait for it to finish');\n    const inp = document.createElement('input'); inp.type = 'file';",
   "    if(BUSY) return toast(BUSY === id ? 'This video is still uploading' : 'Another class video is still uploading · wait for it to finish');\n    { const dp = window.__vidDrop; window.__vidDrop = null; if(dp && dp.id === id && Date.now() - dp.t < 3 * 6e4) return go(id, dp.f); }   /* 780: dragged onto the class */\n    const inp = document.createElement('input'); inp.type = 'file';"]
]);
