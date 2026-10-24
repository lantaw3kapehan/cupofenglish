// 771: (Misty) class notice · "can you automate the validity of renewal here as well?"
// · "Valid until" on the class notice (new and renewal) is now worked out automatically, using the contract rule:
//   under 30 lessons → 4 months · 30–59 → 8 months · 60 or more → 12 months, counted from the FIRST CLASS of this package
//   (the first class on or after the purchase date; the purchase date itself if no class is booked yet).
//   Before, a renewal kept the old package's date from ACTIVE (Anna: 17 Jan 2027 = May package + 8 months).
// · It updates as soon as the units or the purchase date change. A small line under the date explains it.
// · Typing a date by hand keeps yours (e.g. an approved holiday extension); "Use the automatic date" brings it back.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 771 · class notice: validity worked out automatically */
(function(){
  if(window.__771 || typeof cnPaint !== 'function') return; window.__771 = 1;
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function auto(){ const x = CN; if(!x) return null; const t = +x.units || 0, dt = String(x.date || ''); if(!t || !/^\d{4}-\d{2}-\d{2}$/.test(dt)) return null;
    const t0 = new Date(dt + 'T00:00:00').getTime();
    const L = (Array.isArray(x.L) ? x.L : []).filter(c => !c.cancelled && new Date(c.start).getTime() >= t0).sort((a, b) => new Date(a.start) - new Date(b.start));
    const f = L.length ? new Date(L[0].start) : null, d = f ? new Date(f.getFullYear(), f.getMonth(), f.getDate(), 12) : new Date(dt + 'T12:00:00'), m = t < 30 ? 4 : t < 60 ? 8 : 12;
    d.setMonth(d.getMonth() + m);
    return { until: ymd(d), why: '⚙︎ Automatic · ' + m + ' months (' + t + ' lessons) from ' + (f ? 'the first class of this package · ' + f.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'the purchase date · no class booked yet') }; }
  function hint(){ const el = document.getElementById('cnVa'); if(!el) return; const a = auto();
    el.innerHTML = CN.untilMan ? (a && a.until !== CN.until ? '✎ Your date · the rule gives ' + esc(a.until) + ' · <a class="link" href="#" onclick="cnAutoV();return false">Use the automatic date</a>' : '✎ Your date') : a ? esc(a.why) : 'Fill in the units and the purchase date'; }
  function apply(){ if(!CN || CN.untilMan) return; const a = auto(); if(!a) return; CN.until = a.until; const f = document.getElementById('cnUntil'); if(f && f.value !== a.until) f.value = a.until; }
  window.cnAutoV = () => { CN.untilMan = 0; apply(); cnPv(); };
  window.cnManV = v => { CN.until = v; CN.untilMan = 1; cnPv(); };
  const _p = window.cnPaint; window.cnPaint = function(){ apply(); const r = _p.apply(this, arguments); try{ hint(); }catch(e){} return r; };
  const _v = window.cnPv; window.cnPv = function(){ try{ apply(); }catch(e){} const r = _v.apply(this, arguments); try{ hint(); }catch(e){} return r; };
  const _u = window.cnUse; if(typeof _u === 'function') window.cnUse = function(){ if(typeof CN === 'object' && CN) CN.untilMan = 0; return _u.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["<div class=\"grow\">${inp('until', 'Valid until', 'date')}</div></div>",
   "<div class=\"grow\"><label>Valid until</label><input id=\"cnUntil\" class=\"in-t\" type=\"date\" value=\"${esc(x.until == null ? '' : x.until)}\" oninput=\"cnManV(this.value)\"><div id=\"cnVa\" class=\"small mute\" style=\"margin-top:4px\"></div></div></div>"]
]);
