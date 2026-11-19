// 2466 (Misty 18:51 "lesson history gives the old one, then shows the new corrected one · the new update should always be there") ·
//   the months on the lesson summary are refreshed from the class records (1196, coe-mon) after the server applied the correction, which
//   put the old March back for a moment. The correction is now applied again right after that refresh, so the summary always shows it.
const file = process.argv[2];
const JS = String.raw`<script id="b2466">
window.lf2466 = function(v){ try{ var F = v && v.fixes; if(!F || !F.length || !Array.isArray(v.cols)) return; var C = {}; v.cols.forEach(function(c, i){ C[c] = i; }); if(C.months == null) return;
  var Y = (v.months || []).map(function(l){ return window.coeMonYm ? window.coeMonYm(l) : ''; }), r1 = function(x){ return Math.round(x * 10) / 10; };
  F.forEach(function(f){ var j = Y.indexOf(f.ym); if(j < 0 || typeof f.v !== 'number') return; var R = v.rows.filter(function(r){ return String(r[C.code] || '').toUpperCase() === f.code; }); if(!R.length) return;
    var val = function(r){ return +((r[C.months] || [])[j]) || 0; }, tot = r1(R.reduce(function(a, r){ return a + val(r); }, 0)), d = r1(f.v - tot); if(!d) return;
    var by = R.slice().sort(function(a, b){ return val(b) - val(a); });
    var set = function(r, dv){ var M = (r[C.months] || []).slice(); M[j] = r1((+M[j] || 0) + dv); r[C.months] = M; };
    if(d < 0){ by.forEach(function(r){ if(d >= 0) return; var t = Math.max(d, -val(r)); if(t){ set(r, t); d = r1(d - t); } }); } else set(by[0], d); }); }catch(e){ console.warn('2466', e); } };
</script>
`;
require('../tools/lib.js')(file, [
  ["v.__mon1196 = AT0; }catch(e){ console.warn('1196', e); } return v; }", "try{ if(window.lf2466) window.lf2466(v); }catch(x){} v.__mon1196 = AT0; }catch(e){ console.warn('1196', e); } return v; }"],
  ['<script id="b2278">', JS + '<script id="b2278">']
]);
