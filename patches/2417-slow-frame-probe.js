// 2417 (Misty 19 Nov 13:21, Celine's laptop: To do "can't be clicked", the screen froze for ~4 s at a time) · a probe: when the page is
//   busy for more than 1.2 s in one go, the app reports which code did it (speed row "slow:<function>@<position>"), at most 8 a visit,
//   so the cause can be fixed the same day. Reads only timing; sends nothing about students.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<script>window.__audit1626 =",
   "<script>/* 2417 slow-frame probe */(function(){ try{ if(!window.PerformanceObserver || !(PerformanceObserver.supportedEntryTypes || []).includes('long-animation-frame')) return; var sent = 0;\n" +
   "  new PerformanceObserver(function(l){ l.getEntries().forEach(function(e){ if(e.duration < 1200 || sent >= 8) return; var tk = typeof TOKEN !== 'undefined' ? TOKEN : ''; if(!tk) return;\n" +
   "    var S = (e.scripts || []).slice().sort(function(a, b){ return b.duration - a.duration; }).slice(0, 2), rows = S.length ? S.map(function(s){ return { fn: ('slow:' + (s.sourceFunctionName || s.invoker || '?') + '@' + s.sourceCharPosition + ' ' + String(s.invoker || '')).slice(0, 80), ms: Math.round(s.duration) }; }) : [{ fn: 'slow:frame', ms: Math.round(e.duration) }];\n" +
   "    sent++; rows = rows.map(function(r){ return Object.assign(r, { ui: false, view: typeof VIEW !== 'undefined' ? String(VIEW || '') : '', v: typeof COE_V !== 'undefined' ? COE_V : 0, dev: (window.innerWidth || 0) < 900 ? 'phone' : 'laptop', at: new Date().toISOString() }); });\n" +
   "    try{ fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: tk, action: 'speed', rows: rows }), keepalive: true }).catch(function(){}); }catch(x){} }); }).observe({ type: 'long-animation-frame', buffered: true }); }catch(e){} })();</script>\n" +
   "<script>window.__audit1626 ="]
]);
