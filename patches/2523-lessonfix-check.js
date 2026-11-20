// 2523 (Sunny ST-2025-011): the summary's agreement check compares with the database's own "lessons now", which does not know management's
//   corrections. A correction marked "never counted" (2522) lowers what is left, so the database figure is lowered by the same amount before comparing.
const file = process.argv[2];
const H = "(window.chk2523 || (x => x))(code, ";
require('../tools/lib.js')(file, [
  ["const sp = k && !k.shared ? R.split(R.fromRows(k.rows), row || (d && d.unk ? d.unk[code] : null)) : null;",
   "const sp = k && !k.shared ? R.split(R.fromRows(k.rows), " + H + "row || (d && d.unk ? d.unk[code] : null))) : null;"],
  ["const G = R.guard({ split: R.split(R.fromRows(k.rows), row || (d && d.unk ? d.unk[up(code)] : null)), doc: d, row });",
   "const G = R.guard({ split: R.split(R.fromRows(k.rows), " + H + "row || (d && d.unk ? d.unk[up(code)] : null))), doc: d, row });"],
  ['<script id="b2278">', `<script id="b2523">
window.chk2523 = function(code, chk){ try{ if(!chk || chk.now == null || typeof AT === 'undefined' || !AT) return chk; var U = String(code || '').trim().toUpperCase();
  var L = [], ls = null; try{ ls = JSON.parse(localStorage.getItem('coe.lf2483') || 'null'); }catch(e){}
  (ls && ls.length ? ls : (AT.fixes || [])).forEach(function(f){ if(f && f.left && String(f.code).toUpperCase() === U && typeof f.v === 'number' && typeof f.was === 'number') L.push(f.v - f.was); });
  if(!L.length) return chk; var d = Math.round(L.reduce(function(a, x){ return a + x; }, 0) * 10) / 10; if(!d) return chk;
  return Object.assign({}, chk, { now: Math.round((+chk.now - d) * 10) / 10 }); }catch(e){ return chk; } };
</script>
<script id="b2278">`]
]);
