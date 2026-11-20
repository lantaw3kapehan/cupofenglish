// 2544 (Misty 19:59 "these are all correct but no option to choose correct"): First month to check · every row gets "It's right":
//   the count is already correct, so the student leaves the list for all management (coe-ops v22, ref fm:<code>|<yyyy-mm>).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["+ '<button class=\"btn ghost sm\" onclick=\"openStudent(\\'' + E(x.code) + '\\')\">Open</button></div></div>'; }).join('')",
   "+ '<button class=\"btn ghost sm\" title=\"The count is already correct: take it off this list\" onclick=\"fm2544Ok(\\'' + E(k) + '\\')\">It\\'s right</button><button class=\"btn ghost sm\" onclick=\"openStudent(\\'' + E(x.code) + '\\')\">Open</button></div></div>'; }).join('')"],
  ["window.fm2484All = function(){ open = 1; paint(); };",
   "window.fm2484All = function(){ open = 1; paint(); };\n  window.fm2544Ok = function(k){ var x = (R || []).find(function(y){ return y.code + '|' + y.ym === k; }); if(!x) return;\n    done[k] = 1; paint();\n    fetch(OPS, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'ok', ref: 'fm:' + k }) }).then(function(r){ return r.json(); })\n      .then(function(r){ if(r && r.ok){ try{ toast('Marked right · ' + x.name + ' ' + ml(x.ym)); }catch(e){} } else { delete done[k]; paint(); try{ toast('Not saved. Try again.'); }catch(e){} } })\n      .catch(function(){ delete done[k]; paint(); try{ toast('Not saved. Try again.'); }catch(e){} }); };"]
]);
