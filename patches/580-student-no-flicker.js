// 22 Oct · Misty: "just some flickering and screen looking adjusting sometimes"
// Measured on the student page (open → 4.5 s):
//  1. the card kept the scroll position of the previous card, so a student page opened part-way down and then jumped
//  2. ~3 s later, when fresh data arrived, the whole page was re-drawn: scroll jumped and buttons flashed their old labels
//  3. tabs / button labels / status pill were fixed 40–80 ms after drawing, so one frame showed the raw version
//     (incl. a ~540 px block that appeared and vanished)
//  4. the top-card tidy (578) re-appended its items several times even when nothing had changed
// Fixes: a new card opens at the top; the refresh re-draw keeps the scroll place (and is skipped if the data is the same);
// the tab sorting and labels run in the same frame as the drawing; 578 only moves items when the order is wrong.
require('../tools/lib.js')(process.argv[2], [
["STU = {s, r, code, cls: CLSM[code] || (STU && STU.code === code && STU.cls) || cls0}; stuRender();",
 "if(kept0 && JSON.stringify(kept0) === JSON.stringify(r)) return;   /* 580: same data → no second drawing */\n{ const sh = $('sheet'), y = sh ? sh.scrollTop : 0; STU = {s, r, code, cls: CLSM[code] || (STU && STU.code === code && STU.cls) || cls0}; stuRender(); if(kept0 && sh){ sh.scrollTop = y; requestAnimationFrame(() => { sh.scrollTop = y; }); } }   /* 580: keep the place */"],
["  let t = 0; try{ const sb = $('sheetBody'); if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { try{ if(sb.querySelector('.shero')) apply(); else sb.classList.remove('stu2'); }catch(e){} }, 40); }).observe(sb, { childList: true }); }catch(e){}",
 "  /* 580: same frame (an observer runs before the screen is drawn), no 40 ms raw view */\n  try{ const sb = $('sheetBody'); if(sb) new MutationObserver(() => { try{ if(sb.querySelector('.shero')) apply(); else sb.classList.remove('stu2'); }catch(e){} }).observe(sb, { childList: true }); }catch(e){}"],
["  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); setTimeout(paint, 60); setTimeout(paint, 400); return r; };",
 "  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){} setTimeout(paint, 400); return r; };   /* 580: labels in the same frame */"],
["  try{ const sb = $('sheetBody'); let t = 0; if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(paint, 80); }).observe(sb, { childList: true, subtree: true }); }catch(e){}",
 "  try{ const sb = $('sheetBody'); let t = 0, n = 0, at = 0; if(sb) new MutationObserver(() => { const now = Date.now(); if(now - at > 300){ at = now; n = 0; } if(++n < 12){ try{ paint(); }catch(e){} } else { clearTimeout(t); t = setTimeout(paint, 80); } }).observe(sb, { childList: true, subtree: true }); }catch(e){}   /* 580: same frame; falls back to the old delay if something keeps changing */"],
["        dst.appendChild(el); });",
 "        (dst._w || (dst._w = [])).push(el); });\n      L.forEach(l => { const w = l._w || []; l._w = null; const cur = [...l.children]; if(w.length !== cur.length || w.some((e, i) => e !== cur[i])) w.forEach(e => l.appendChild(e)); });   /* 580: move only when the order is wrong */"],
["</body>", `<script>
/* 22 Oct · 580 · a newly opened card starts at the top (it kept the last card's scroll place, then jumped) */
(function(){
  const o = window.openSheet; if(!o) return;
  window.openSheet = function(html){ const sh = $('sheet'), was = sh && sh.classList.contains('on'), old = was ? ($('sheetBody') || {}).innerHTML || '' : '';
    const r = o.apply(this, arguments);
    try{ if(sh && (!was || String(html || '').slice(0, 160) !== old.slice(0, 160))) sh.scrollTop = 0; }catch(e){}
    return r; };
})();
</script>
</body>`],
]);
