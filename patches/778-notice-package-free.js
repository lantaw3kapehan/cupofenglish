// 778: (Misty) class notice: "PACKAGE UNITS SHOULD BE 15, 30, 60 · FREE IS +3, +8".
// · Package = 15 / 30 / 60 (quick buttons, or type another number); Free = +3 / +8, filled by itself (30 → +3, 60 → +8, 15 → 0)
//   until you type your own. Carried over stays separate. Total, notice text and validity work as before (package + free + carried).
// · Old rows that only know the total (33, 68) are split into 30 + 3 and 60 + 8.
const file = process.argv[2];
const fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 778 · class notice: package 15 / 30 / 60 + free +3 / +8 */
(function(){
  if(window.__778 || typeof window.cnUse !== 'function') return; window.__778 = 1;
  const FREE = { 15: 0, 30: 3, 60: 8 };
  const n1 = x => Math.round((+x || 0) * 10) / 10;
  window.cnPkg = () => { const x = CN || {}; return n1((+x.units || 0) - (+x.free || 0)); };
  window.cnPkgSet = v => { const x = CN; if(!x) return; v = n1(v); const f = x._fe ? n1(x.free) : (FREE[v] != null ? FREE[v] : n1(x.free)); x.free = f || ''; x.units = v ? n1(v + f) : '';
    const fe = document.getElementById('cnFree'); if(fe) fe.value = f || ''; document.querySelectorAll('.cnpk').forEach(b => b.classList.toggle('on', +b.dataset.p === v)); const pe = document.getElementById('cnPkgIn'); if(pe && n1(pe.value) !== v) pe.value = v || ''; cnPv(); };
  window.cnFreeSet = v => { const x = CN; if(!x) return; const pk = cnPkg(); x._fe = 1; x.free = n1(v) || ''; x.units = pk ? n1(pk + n1(v)) : x.units; cnPv(); };
  const _u = window.cnUse;
  window.cnUse = function(){ const r = _u.apply(this, arguments);
    try{ const x = CN; if(x){ x._fe = 0; const t = n1(x.units); if(!(+x.free) && (t === 33 || t === 68)){ x.free = t === 33 ? 3 : 8; if(typeof cnPaint === 'function') cnPaint(); } } }catch(e){}
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["${inp('units', 'Package units (50 min each · paid + free)', 'number')}</div><div class=\"grow\">${inp('free', 'of which free', 'number')}</div>",
   "<label>Package</label><div class=\"seg\" style=\"margin-bottom:6px\">${[15, 30, 60].map(p => `<button type=\"button\" class=\"cnpk ${cnPkg() === p ? 'on' : ''}\" data-p=\"${p}\" onclick=\"cnPkgSet(${p})\">${p}</button>`).join('')}</div><input id=\"cnPkgIn\" class=\"in-t\" type=\"number\" value=\"${cnPkg() || ''}\" oninput=\"cnPkgSet(this.value)\" placeholder=\"15 · 30 · 60\"></div><div class=\"grow\"><label>Free</label><input id=\"cnFree\" class=\"in-t\" type=\"number\" value=\"${esc(x.free == null ? '' : x.free)}\" oninput=\"cnFreeSet(this.value)\" placeholder=\"+3 · +8\"><div class=\"small mute\" style=\"margin-top:4px\">30 → +3 · 60 → +8</div></div>"]
]);
