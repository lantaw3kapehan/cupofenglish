// 2255 (Misty 16 Nov 10:49): "make any photo proof draggable for everyone's convenience".
// Every picture box in the app (any file box that takes pictures: late time-in proof, leave proof, payment proof, chat, etc.)
// now also takes a picture dragged from the desktop/Finder, or pasted (Cmd/Ctrl+V, e.g. a screenshot copied to the clipboard).
// How: one handler for the whole page. A drop finds the nearest box with exactly one picture file box in it (up to the open card)
// and hands the file to that box as if it was chosen, so each screen's own checks and upload run unchanged.
// Places that already handle drops themselves (class video, chat, agreement, invoice boxes) keep their own handling.
// Runs in the capture phase, before the class-video handler (780) that takes every drop on the page.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "</script>\n</body>\n</html>",
 `</script>
<script>
/* 2255 · drop or paste a picture into any picture box */
(function(){
  if(window.__dz2255) return; window.__dz2255 = 1;
  try{ const st = document.createElement('style'); st.textContent = '.dz2255{outline:2.5px dashed #2E6E78 !important;outline-offset:3px;background-color:rgba(46,110,120,.06) !important;border-radius:12px}'; document.head.appendChild(st); }catch(e){}
  const picIn = i => i && i.type === 'file' && !i.disabled && /image/i.test(i.accept || '');
  const ok = (i, f) => { const a = String(i.accept || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean); if(!a.length) return true;
    const t = String(f.type || '').toLowerCase(), n = String(f.name || '').toLowerCase();
    return a.some(x => x.endsWith('/*') ? t.startsWith(x.slice(0, -1)) : x.startsWith('.') ? n.endsWith(x) : t === x); };
  const hasFiles = e => { const d = e.dataTransfer; return !!(d && [...(d.types || [])].includes('Files')); };
  function zoneOf(t){
    let el = t && t.nodeType === 1 ? t : t && t.parentElement;
    for(let k = 0; el && el !== document.body && k < 12; k++, el = el.parentElement){
      if(el.tagName === 'INPUT') { if(picIn(el)) return { z: el, i: el }; continue; }
      const L = [...el.querySelectorAll('input[type=file]')].filter(picIn);
      const top = el.id === 'sheet' || el.id === 'sheetBody' || /^v-/.test(el.id || '');
      if(L.length === 1) return { z: top ? (L[0].closest('label') || L[0].parentElement) : el, i: L[0] };
      if(L.length > 1 || top) return null;   // two picture boxes here (the drop must land on one), or the top of a card/screen
    }
    return null;
  }
  let lit = null; const light = z => { if(lit === z) return; if(lit) lit.classList.remove('dz2255'); lit = z; if(z) z.classList.add('dz2255'); };
  function give(i, files){
    const F = [...files].filter(f => ok(i, f)); if(!F.length){ try{ toast('That file is not a picture this box takes (JPG, PNG…)'); }catch(e){} return false; }
    try{ const dt = new DataTransfer(); (i.multiple ? F : F.slice(0, 1)).forEach(f => dt.items.add(f)); i.files = dt.files; }catch(e){ try{ toast('This browser cannot drop files here · tap the box to choose'); }catch(x){} return false; }
    i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); return true;
  }
  /* capture phase: runs before the class-video handler (780), which takes every drop on the page */
  const own = t => t && t.closest && t.closest('.vdz1828, .hw, .ch-main, [ondrop], #agDrop, #fDrop, #dz');
  window.addEventListener('dragover', e => { if(!hasFiles(e) || own(e.target)){ light(null); return; }
    const z = zoneOf(e.target); if(!z){ light(null); return; } e.preventDefault(); e.stopPropagation(); try{ e.dataTransfer.dropEffect = 'copy'; }catch(x){} light(z.z); }, true);
  window.addEventListener('dragleave', e => { if(lit && (!e.relatedTarget || !lit.contains(e.relatedTarget))) light(null); }, true);
  window.addEventListener('drop', e => { const was = lit; light(null); if(!hasFiles(e) || own(e.target)) return;
    const z = zoneOf(e.target) || (was && zoneOf(was)); if(!z) return; e.preventDefault(); e.stopPropagation(); give(z.i, e.dataTransfer.files); }, true);
  window.addEventListener('dragend', () => light(null));
  /* paste a copied screenshot: goes to the picture box of the open card (or the one being typed in), when there is exactly one */
  document.addEventListener('paste', e => { if(e.defaultPrevented) return; const d = e.clipboardData; if(!d) return;
    const files = [...(d.files || [])].filter(f => /^image\\//.test(f.type || '')); if(!files.length) return;
    const ae = document.activeElement; if(ae && /^(TEXTAREA|INPUT)$/.test(ae.tagName) && ae.type !== 'file' && String(d.getData('text/plain') || '').trim()) return;   // text paste stays text
    const sh = document.getElementById('sheet'), on = sh && sh.classList.contains('on');
    const z = zoneOf(document.activeElement && document.activeElement !== document.body ? document.activeElement : null);
    let i = z && z.i; if(!i && on){ const L = [...document.querySelectorAll('#sheetBody input[type=file]')].filter(picIn); if(L.length === 1) i = L[0]; }
    if(!i) return; e.preventDefault(); if(give(i, files)) try{ toast('Picture added ✓'); }catch(x){} });
})();
</script>
</body>
</html>`
]]);
