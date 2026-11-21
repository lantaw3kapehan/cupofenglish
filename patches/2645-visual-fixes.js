// 2645 (Misty 21 Nov 18:53 "check problematic visual, design, and layout and fix it") · management screens only (class hours)
//  1. For your decision on phone: titles broke one word per line and the detail was cut to one word. Buttons now go under the text
//     on phones; the detail line shows up to 2 lines (laptop) / 3 lines (phone) instead of one cut line.
//  2. Its title said "nothing new" while two followed-up items were listed → "For your decision · 2 followed up".
//  3. QA team average on the laptop showed "▲ 0 vs August 2026" → "No change vs August 2026" (the phone already said this).
//  4. Lates card: the clock icon touched the word "Lates".
//  5. Overview footer: a raw technical line (file names, "only in Google") under App check → only the "App check ›" link stays.
//  6. Monitor tabs: the last tab ("Messages") was cut at the right edge on a laptop → slightly narrower tab padding so all fit.
//  7. Guard: a card that ends up twice in the same screen (same id) keeps only the first copy (Overview, To do).
const file = process.argv[2];
const CSS = `<style id="s2645">
.fy2630 .fyt small{white-space:normal!important;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
@media(max-width:760px){.fy2630 .fyr{flex-wrap:wrap;align-items:flex-start}.fy2630 .fyt{flex:1 1 calc(100% - 44px)}.fy2630 .fyt small{-webkit-line-clamp:3}
  .fy2630 .fyb{display:flex;flex-wrap:wrap;gap:6px;width:100%;justify-content:flex-end}.fy2630 .fyn{min-width:20px}}
#lqmBox .u-ic{margin-right:6px;vertical-align:-3px}
.c-foot > span{display:none}
@media(min-width:761px){#v-monitor .mo-tabs > *{padding-left:10px;padding-right:10px}}
</style>
</head>`;
const JS = `<script id="b2645">
(function(){ if(window.__2645) return; window.__2645 = 1;
  function dedupe(v){ try{ var seen = {}; [].slice.call(v.querySelectorAll('[id]')).forEach(function(e){ if(!e.id || /^(pd2341i)$/.test(e.id)) return; if(seen[e.id] && !e.contains(seen[e.id]) && !seen[e.id].contains(e)){ try{ console.info('coe.dup2645', e.id); }catch(x){} e.remove(); } else if(!seen[e.id]) seen[e.id] = e; }); }catch(e){} }
  var T = 0; function soon(){ clearTimeout(T); T = setTimeout(function(){ ['v-home', 'v-mtoday'].forEach(function(id){ var v = document.getElementById(id); if(v) dedupe(v); }); }, 150); }
  function arm(){ ['v-home', 'v-mtoday'].forEach(function(id){ var v = document.getElementById(id); if(v && !v.__2645){ v.__2645 = 1; new MutationObserver(soon).observe(v, { childList: true, subtree: true }); } }); soon(); }
  setInterval(arm, 2000); arm();
})();
</script>
</body>`;
const fs = require('fs');
require('../tools/lib.js')(file, [
  ["(act.length ? ' · ' + N : ' · nothing new')", "(act.length ? ' · ' + N : fol.length ? ' · ' + fol.length + ' followed up' : ' · nothing new')"],
]);
let h = fs.readFileSync(file, 'utf8');
const Q = "${tm0.avg >= tm1.avg ? '▲' : '▼'} ${Math.abs(Math.round((tm0.avg - tm1.avg) * 10) / 10)} vs ${esc(tm1.period)}";
if (h.split(Q).length !== 3) throw new Error('QA line count');
h = h.split(Q).join("${tm0.avg === tm1.avg ? 'No change' : (tm0.avg > tm1.avg ? '▲ ' : '▼ ') + Math.abs(Math.round((tm0.avg - tm1.avg) * 10) / 10)} vs ${esc(tm1.period)}");
if (h.includes('id="s2645"')) throw new Error('already');
let i = h.indexOf('</head>'); h = h.slice(0, i) + CSS + h.slice(i + 7);
i = h.lastIndexOf('</body>'); h = h.slice(0, i) + JS + h.slice(i + 7);
fs.writeFileSync(file, h);
