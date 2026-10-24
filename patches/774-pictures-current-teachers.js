// 774: (Misty) Anna's lesson summary / lesson balance pictures list Teacher Daniela, "she stopped with her".
// · A teacher row of the same student is left out of the pictures when, in this package, that teacher has taught 0 lessons
//   AND has no class with the student from 3 weeks ago to 6 weeks ahead (from the calendar).
// · The package holder row is always kept; counts don't change (only rows with 0 lessons are left out).
// · If the student's classes aren't loaded yet, nothing is left out and they are fetched so the next picture is right.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 774 · pictures show only the student's current teachers */
(function(){
  if(window.__774 || typeof pkgGroup !== 'function') return; window.__774 = 1;
  const up = x => String(x || '').trim().toUpperCase(), tn = x => String(x || '').toLowerCase().replace(/^\s*(teacher|tr\.?)\s+/, '').trim().split(/\s+/)[0];
  const asked = {};
  function cls(code){ let L = CLSM[code]; if(!Array.isArray(L)){ try{ const v = store('get', 'coe.cls.' + code); L = v ? JSON.parse(v) : null; }catch(e){ L = null; } }
    if(!Array.isArray(L) && !asked[code]){ asked[code] = 1; try{ api('mgmtStuClasses', TOKEN, code).then(x => { if(Array.isArray(x)){ CLSM[code] = x; try{ store('set', 'coe.cls.' + code, JSON.stringify(x)); }catch(e){} } }).catch(() => {}); }catch(e){} }
    return Array.isArray(L) ? L : null; }
  function teaching(code, t){ const L = cls(code); if(!L) return true; const a = Date.now() - 21 * 864e5, b = Date.now() + 42 * 864e5, k = tn(t); if(!k) return true;
    return L.some(c => c && !c.cancelled && tn(c.teacher) === k && (x => x >= a && x <= b)(new Date(c.start).getTime())); }
  const _g = window.pkgGroup;
  window.pkgGroup = function(r, C){ const G = _g.apply(this, arguments);
    try{ if(G && Array.isArray(G.members) && G.members.length > 1){ const o = G.owner || r, code = up(o[C.code]);
        const keep = G.members.filter(x => x === o || up(x[C.code]) !== code || (+x[C.finished] || 0) > 0 || (C.today != null && +x[C.today] > 0) || teaching(code, x[C.teacher]));
        if(keep.length && keep.length < G.members.length) G.members = keep; } }catch(e){}
    return G; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
