// 1589: (Misty 09:33, Abby's card) student card header: minimal and scannable, nothing removed, final on the first paint.
//  1. Line 1: name (Fredoka One) · Chinese name · [YLE] [Active] (PH inside the type chip when Market = Philippines).
//  2. Line 2, one quiet meta line: ST code · age · grade · city · since Sep 2026 (the "With us 1 mo" repeat is dropped; full text on hover)
//     and at its right a compact "WeChat group" chip with a copy icon (the group name on hover, same wxCopy). "Shares a group with…" → More actions.
//  3. Line 3: Teacher X · Pre-A1 · ShortVowels · partner (management only, as before). Same elements and links.
//  4. Stats: the three tiles, less padding, numbers on one baseline. 5. Schedule: day/time pills, "1 lesson unit a week" (2 × 25 min on
//     hover), no second "Teacher X"; Next on the right. 6. 8 px spacing, 14 px Inter for text, muted labels; meta icons removed.
//  7. Phone: stats under the name, meta lines wrap.
// Applied inside the draw (same frame as 1587) and kept by a microtask observer, so nothing moves after the first paint.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["'<span class=\"mt\">' + (() => { const u = Math.round(S.reduce((a, x) => a + (window.coeUnits ? coeUnits({ mins: +x.m }) : 1), 0) * 10) / 10; return esc((S.length > 1 && M.length === 1 ? S.length + ' × ' : '') + M.map(m => m + ' min').join(' / ') + ' = ' + u + ' lesson unit' + (u === 1 ? '' : 's') + ' a week'); })() + (T.length === 1 ? ' · ' + esc(T[0]) : '') + '</span>'",
   "(() => { const u = Math.round(S.reduce((a, x) => a + (window.coeUnits ? coeUnits({ mins: +x.m }) : 1), 0) * 10) / 10; return '<span class=\"mt\" title=\"' + esc((S.length > 1 && M.length === 1 ? S.length + ' × ' : '') + M.map(m => m + ' min').join(' / ') + (T.length === 1 ? ' · ' + T[0] : '')) + '\">' + esc(u + ' lesson unit' + (u === 1 ? '' : 's') + ' a week') + '</span>'; })()"],
  ["</script>\n</body>\n</html>",
   `</script>
<style id="css1589">
#sheetBody .shero.h1589{gap:16px!important;padding:16px!important;align-items:flex-start!important}
#sheetBody .shero.h1589 .av.big{width:40px!important;height:40px!important;font-size:18px!important;flex:none}
#sheetBody .shero.h1589 h1{font-family:"Fredoka One",Inter,sans-serif!important;font-weight:400!important;font-size:28px!important;line-height:1.15!important;margin:0 0 8px!important;gap:8px!important}
#sheetBody .shero.h1589 h1 .cn{font-family:Inter,"Noto Sans SC",sans-serif;font-size:16px;color:#6F6B85;font-weight:400}
#sheetBody .shero.h1589 h1 .stp,#sheetBody .shero.h1589 h1 .lt1588{height:22px;line-height:22px;font:600 12px/22px Inter,system-ui,sans-serif!important;padding:0 10px;border-radius:999px;margin:0!important;transform:none!important}
#sheetBody .shero.h1589 .h-who,#sheetBody .shero.h1589 .h-learn{display:flex!important;flex-wrap:wrap;align-items:center;gap:0!important;margin:0 0 4px!important;font:400 14px/22px Inter,system-ui,sans-serif;color:#6F6B85}
#sheetBody .shero.h1589 .h-who>*,#sheetBody .shero.h1589 .h-learn>*{background:none!important;box-shadow:none!important;border:0!important;padding:0!important;margin:0!important;height:auto!important;font:inherit!important;color:inherit;border-radius:0!important}
#sheetBody .shero.h1589 :is(.h-who,.h-learn)>*:not(:first-child):not(#wxG)::before{content:"·";margin:0 8px;color:#B9B6C6}
#sheetBody .shero.h1589 :is(.h-who,.h-learn) svg,#sheetBody .shero.h1589 :is(.h-who,.h-learn) .i1101{display:none!important}
#sheetBody .shero.h1589 .h-who .h-code{color:#2B2253!important;font-weight:600!important;letter-spacing:.02em}
#sheetBody .shero.h1589 .len-chip[data-since]:not([data-since=""]){font-size:0!important}
#sheetBody .shero.h1589 .len-chip[data-since]:not([data-since=""])::after{content:attr(data-since);font-size:14px}
#sheetBody .shero.h1589 .len-chip[data-since]::before{font-size:14px}
#sheet #sheetBody.stu2 .shero.h1589 .wxlab1589{display:none!important}
#sheetBody .shero.h1589 .h-learn>.chip.teal{color:#00737B!important;font-weight:600!important}
#sheetBody .shero.h1589 .h-learn>.chip.teal::after{content:none}
#sheetBody .shero.h1589 .h-learn>.chip.teal:first-child::before{content:"Teacher ";color:#8A86A0;font-weight:400;white-space:pre}
#sheetBody .shero.h1589>.grow{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;align-items:center}
#sheetBody .shero.h1589>.grow>*{grid-column:1/-1}
#sheetBody .shero.h1589>.grow>.h-who{grid-column:1;grid-row:2}
#sheetBody .shero.h1589>.grow>#wxG{grid-column:2;grid-row:2;justify-self:start}
#sheetBody .shero.h1589 .h-learn .sa-src{color:#5B4A9A!important}
#sheet #sheetBody.stu2 .shero.h1589 #wxG:not(#z1589):not(#y1589){display:inline-flex!important;margin:0!important;padding:0!important;font-size:0!important;gap:0!important}
#sheet #sheetBody.stu2 .shero.h1589 #wxG:not(#z1589):not(#y1589)>b,#sheet #sheetBody.stu2 .shero.h1589 #wxG:not(#z1589):not(#y1589) .wxl{display:none!important}
#sheetBody .shero.h1589 .h-learn>.chip.teal{background:transparent!important}
#sheet #sheetBody.stu2 .shero.h1589 #wxG:not(#z1589):not(#y1589) .btn.wx1589{display:inline-flex!important;align-items:center;gap:6px;height:24px;padding:0 10px!important;border-radius:999px!important;font:500 12px/24px Inter,system-ui,sans-serif!important;color:#00737B!important;background:#F1FAF9!important;border:1px solid #D3EEEB!important;box-shadow:none!important;min-height:0!important;text-decoration:none!important}
#sheet #sheetBody.stu2 .shero.h1589 #wxG:not(#z1589):not(#y1589) .wx1589 svg{display:inline-block!important;width:13px;height:13px}
#sheetBody .shero.h1589 .kpis{padding:4px!important;border-radius:12px!important;align-self:flex-start!important}
#sheetBody .shero.h1589 .kpis>div{padding:6px 14px!important;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:84px}
#sheetBody .shero.h1589 .kpis b{font-size:22px!important;line-height:28px!important;font-variant-numeric:tabular-nums}
#sheetBody .shero.h1589 .kpis span{font-size:12px!important;line-height:16px!important;color:#6F6B85!important}
#sheetBody .shero.h1589 .shwk{margin-top:12px!important;padding-top:12px!important;gap:8px!important}
#sheetBody .shero.h1589 .shwk .mt{font:400 14px/22px Inter,system-ui,sans-serif!important;color:#6F6B85!important;cursor:help}
@media(max-width:620px){
#sheetBody .shero.h1589{flex-wrap:wrap!important;padding:16px 12px!important}
#sheetBody .shero.h1589 .av.big{display:none!important}
#sheetBody .shero.h1589 h1{font-size:24px!important}
#sheetBody .shero.h1589>.grow{flex:1 1 100%!important;min-width:0}
#sheetBody .shero.h1589 .kpis{width:100%!important;order:3}
#sheetBody .shero.h1589 .kpis>div{flex:1;min-width:0}
#sheetBody .shero.h1589 .shwk{order:4}
#sheetBody .shero.h1589>.grow>.h-who{grid-row:2!important}
#sheetBody .shero.h1589>.grow>.h-learn{grid-row:3!important}
#sheetBody .shero.h1589>.grow>#wxG{grid-column:1/-1!important;grid-row:4!important}
#sheet #sheetBody.stu2 .shero.h1589 #wxG:not(#z1589):not(#y1589){margin:4px 0 0!important}
}
</style>
<script>
/* 1589 · calm student header */
(function(){
  if(window.__1589) return; window.__1589 = 1;
  const CP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  function tidy(){ const sb = document.getElementById('sheetBody'), hero = sb && sb.querySelector('.shero'); if(!hero || typeof STU === 'undefined' || !STU) return;
    if(!hero.classList.contains('h1589')) hero.classList.add('h1589');
    const h = hero.querySelector('h1'), lt = h && h.querySelector(':scope > .lt1588'), st = h && h.querySelector(':scope > .stp');
    if(lt && st && st.previousElementSibling !== lt) h.insertBefore(lt, st);
    const who = hero.querySelector('.h-who'), len = who && who.querySelector('.len-chip');
    if(len){ const m = (len.textContent.match(/since\\s+(.+)$/) || [])[1], tx = m ? 'since ' + m.trim() : ''; if(len.dataset.since !== tx) len.dataset.since = tx; }   /* shown by CSS: the chip's own text stays for other code */
    const lrn = hero.querySelector('.h-learn');
    if(lrn){ 
      [].forEach.call(lrn.querySelectorAll(':scope > .chip:not(.teal)'), c => { [].forEach.call(c.childNodes, n => { if(n.nodeType === 3 && /,\\s/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/,\\s*/g, ' · '); }); }); }
    const wx = document.getElementById('wxG');
    if(wx){ [].forEach.call(wx.childNodes, n => { if(n.nodeType === 3 && /WeChat group/i.test(n.nodeValue)){ const s = document.createElement('span'); s.className = 'wxlab1589'; n.parentNode.insertBefore(s, n); s.appendChild(n); } });
      const cp = [].find.call(wx.querySelectorAll('button'), b => /wxCopy/.test(b.getAttribute('onclick') || ''));
      if(cp){ if(!cp.classList.contains('wx1589')) cp.classList.add('wx1589'); if(cp.textContent !== 'WeChat group'){ cp.innerHTML = CP + 'WeChat group'; } const g = (wx.querySelector('b') || {}).textContent || ''; const ti = 'Copy the WeChat group name · ' + g; if(cp.title !== ti){ cp.title = ti; cp.setAttribute('aria-label', ti); } } }
    const mp = sb.querySelector('.stu-bar .m1000-p');
    if(mp && wx && wx.querySelector('.wxl') && !mp.querySelector('[data-w1589]')){ const code = String(STU.code).replace(/'/g, '');
      mp.insertAdjacentHTML('beforeend', '<button type="button" class="btn ghost sm" role="menuitem" data-w1589="1" onclick="wxLink(\\'' + code + '\\')">Shares a WeChat group with…</button>'); } }
  const r0 = window.stuRender; if(typeof r0 === 'function') window.stuRender = function(){ const r = r0.apply(this, arguments); try{ tidy(); }catch(e){} return r; };
  let q = 0; const sb = document.getElementById('sheetBody');
  if(sb) new MutationObserver(() => { if(q) return; q = 1; Promise.resolve().then(() => { q = 0; try{ tidy(); }catch(e){} }); }).observe(sb, { childList: true, subtree: true, characterData: true });
})();
</script>
</body>
</html>`]
]);
