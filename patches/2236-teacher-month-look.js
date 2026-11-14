// 2236: Teacher Schedule › Calendar › Month. Each day showed "9 classes" and three bare times ("16:00 · 17:00 · 18:30 …").
// · Each day now shows the classes as small coloured rows (time + student, colour = course book), up to 4, then "+5 more";
//   the count line also shows the first and last time ("9 classes · 16:00–21:00"). On a phone: one coloured dot per class.
// · Click a day: the day's full list opens under the month (time, student, book, cancelled crossed out). Click again to close.
// · The colour key no longer says "Colour = course book" twice (the book colours line above already says it).
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = String.raw`
<style id="d2236">
#v-tsched .c01m .d{cursor:pointer}
#v-tsched .c01m .d.sel36{box-shadow:0 0 0 2px #2B2253 inset!important}
#v-tsched .c01m .d .n em{font-style:normal;font-weight:500;color:#6F6B85;font-size:11px;font-variant-numeric:tabular-nums}
#v-tsched .ev36{display:flex;flex-direction:column;gap:2px;margin-top:2px;min-width:0}
#v-tsched .ev36 i{font-style:normal;display:block;font-size:11px;line-height:1.35;padding:1px 6px 1px 6px;border-radius:5px;border-left:3px solid var(--c);background:color-mix(in srgb,var(--c) 12%,#fff);color:#2B2253;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
#v-tsched .ev36 i s{color:#8A86A0}
#v-tsched .ev36 u{text-decoration:none;font-size:11px;color:#00737B;font-weight:650;padding-left:2px}
#v-tsched .dt36{display:none;flex-wrap:wrap;gap:3px;margin-top:3px}
#v-tsched .dt36 i{width:7px;height:7px;border-radius:50%;background:var(--c)}
#v-tsched .dt36 i.x{background:transparent;box-shadow:0 0 0 1.5px var(--c) inset}
#v-tsched .dd36{margin:0 16px 16px;border:1px solid #EEEDF4;border-radius:14px;background:#fff;padding:12px 14px}
#v-tsched .dd36 h4{margin:0 0 8px;font-size:15px;color:#2B2253;display:flex;justify-content:space-between;align-items:center}
#v-tsched .dd36 h4 button{border:0;background:#F4F3F8;border-radius:10px;width:32px;height:32px;cursor:pointer;font-size:16px;color:#2B2253}
#v-tsched .dd36 .r{display:grid;grid-template-columns:96px minmax(0,1fr) auto;gap:10px;align-items:center;padding:7px 0;border-top:1px solid #F1F0F6;font-size:13px}
#v-tsched .dd36 .r:first-of-type{border-top:0}
#v-tsched .dd36 .r .t{font-variant-numeric:tabular-nums;color:#4A4566}
#v-tsched .dd36 .r .s{display:flex;align-items:center;gap:8px;min-width:0}
#v-tsched .dd36 .r .s i{width:10px;height:10px;border-radius:3px;background:var(--c);flex:none}
#v-tsched .dd36 .r .s b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-tsched .dd36 .r .bk{font-size:12px;color:#6F6B85}
#v-tsched .dd36 .r.cx{opacity:.55}#v-tsched .dd36 .r.cx b{text-decoration:line-through}
@media (max-width:640px){#v-tsched .ev36{display:none}#v-tsched .dt36{display:flex}#v-tsched .c01m .d .n em{display:none}#v-tsched .dd36{margin:0 6px 10px;padding:10px}#v-tsched .dd36 .r{grid-template-columns:84px minmax(0,1fr) auto;gap:8px}}
</style>
<script id="x2236">
(function(){
  if(window.__x2236) return; window.__x2236 = 1;
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const col = e => { try{ return svCol(e.book || e.code); }catch(x){ return '#9A98A8'; } };
  let SEL = '';
  function paint(){ const v = document.getElementById('v-tsched'); if(!v) return; const m = v.querySelector('.c01m'); if(!m) return;
    m.querySelectorAll('.d[data-y]').forEach(d => d.classList.toggle('sel36', d.dataset.y === SEL));
    const old = v.querySelector('.dd36'); if(old) old.remove(); if(!SEL) return;
    const L = ((typeof TS !== 'undefined' && TS && TS.events) || []).filter(e => e.day === SEL).sort((a, b) => new Date(a.start) - new Date(b.start)); if(!L.length){ SEL = ''; return; }
    const dt = new Date(SEL + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), n = L.filter(e => !e.cancelled).length;
    m.insertAdjacentHTML('afterend', '<div class="dd36"><h4><span>' + E(dt) + ' <small style="font-weight:500;color:#6F6B85">' + n + ' class' + (n === 1 ? '' : 'es') + '</small></span><button type="button" aria-label="Close" onclick="c36Day(\'\')">×</button></h4>' +
      L.map(e => '<div class="r' + (e.cancelled ? ' cx' : '') + '"><span class="t">' + tm(e.start) + '–' + tm(e.end) + '</span><span class="s" style="--c:' + col(e) + '"><i></i><b>' + E(e.student || e.title || '') + '</b></span><span class="bk">' + (e.cancelled ? 'cancelled' : E(e.book || '')) + '</span></div>').join('') + '</div>'); }
  window.c36Day = y => { SEL = SEL === y ? '' : y; paint(); };
  window.c36Cell = (L, live) => { if(!live.length) return '';
    const last = live[live.length - 1], first = n => String(n || '').trim().split(/\s+/)[0];
    return '<span class="n">' + live.length + ' class' + (live.length === 1 ? '' : 'es') + ' <em>' + tm(live[0].start) + '–' + tm(last.end || last.start) + '</em></span>' +
      '<span class="ev36">' + live.slice(0, 4).map(e => '<i style="--c:' + col(e) + '">' + tm(e.start) + ' ' + E(first(e.student || e.title)) + '</i>').join('') + (live.length > 4 ? '<u>+' + (live.length - 4) + ' more</u>' : '') + '</span>' +
      '<span class="dt36">' + L.map(e => '<i class="' + (e.cancelled ? 'x' : '') + '" style="--c:' + col(e) + '"></i>').join('') + '</span>'; };
  new MutationObserver(() => { const v = document.getElementById('v-tsched'); if(SEL && v && v.querySelector('.c01m') && !v.querySelector('.dd36')) paint(); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
`;
lib(file, [
 ["(!out && live.length ? '<span class=\"n\">' + live.length + ' class' + (live.length === 1 ? '' : 'es') + '</span><span class=\"tm\">' + live.slice(0, 3).map(e => tm(e.start)).join(' · ') + (live.length > 3 ? ' …' : '') + '</span>' : '') +",
  "(!out && live.length ? (window.c36Cell ? c36Cell(L.slice().sort((a, b) => new Date(a.start) - new Date(b.start)), live) : '<span class=\"n\">' + live.length + ' class' + (live.length === 1 ? '' : 'es') + '</span>') : '') +"],
 ["h += '<div class=\"d' + (out ? ' o' : '') + (y === today ? ' td' : y < today ? ' past' : '') + (c && !out ? ' cn-' + c.k : '') + '\"><b>'",
  "h += '<div class=\"d' + (out ? ' o' : '') + (y === today ? ' td' : y < today ? ' past' : '') + (c && !out ? ' cn-' + c.k : '') + '\"' + (!out && L.length ? ' data-y=\"' + y + '\" onclick=\"c36Day(\\'' + y + '\\')\" role=\"button\" tabindex=\"0\"' : '') + '><b>'"],
 ["<span>Colour = course book</span></div>'", "</div>'"],
 ["<span>Colour = book</span></div>'", "</div>'"],
 ["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]
]);
