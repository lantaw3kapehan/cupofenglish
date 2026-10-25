// 993: (Misty, 25 Oct 19:36–19:37) "the supabase database should be reflecting these too and remain the main database" · "go ahead"
// The DATABASE now works out substitute lessons itself (function coe_pkg_subs, edge function coe-subs): unique TC&SUB rows
// (Sub · Subbed) for the student from the package start up to the next package start (or the end of today), counted once per
// package. When the app loads the packages (ACTIVE, management), each row's SUB CLASS, TOTAL FINISHED and TOTAL AVAILABLE are
// set from the database count: finished + (db − sheet), available − (db − sheet). So the Active list, lessons left and the lesson
// summary follow the database even before (or if) the sheet's SUB CLASS formula catches up. Idempotent (a second pass changes
// nothing). If the database cannot be reached in 4 s, the sheet's numbers are shown as before.
// window.SUB993 = { at, diffs: [...] } lists the rows where the sheet and the database disagree (for checking).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 993 · substitute lessons from the database (coe-subs) applied to the package list */
(function(){
  if(window.__993) return; window.__993 = 1;
  var URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-subs', CACHE = null, AT0 = 0, P = null;
  var n1 = function(x){ return Math.round(x * 10) / 10; };
  function subs(){ if(CACHE && Date.now() - AT0 < 120000) return Promise.resolve(CACHE); if(P) return P;
    P = fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(function(x){ return x.json(); })
      .then(function(r){ P = null; if(r && r.ok && Array.isArray(r.rows)){ CACHE = r; AT0 = Date.now(); return r; } return null; }, function(){ P = null; return null; }); return P; }
  function apply(A, S){ try{ if(!A || !A.cols || !A.rows || !S) return A; var C = {}; A.cols.forEach(function(c, k){ C[c] = k; }); if(C.row == null || C.sub == null || C.finished == null) return A;
      var by = {}; S.rows.forEach(function(x){ by[x.r] = x; }); var diffs = [];
      A.rows.forEach(function(row){ var x = by[+row[C.row]]; if(!x || String(row[C.code] || '').trim().toUpperCase() !== x.code) return;
        var cur = +row[C.sub] || 0, d = n1(x.sub_db - cur); if(x.sub_db !== x.sub_sheet) diffs.push({ row: x.r, code: x.code, teacher: x.teacher, sheet: x.sub_sheet, db: x.sub_db });
        if(!d) return; row[C.sub] = x.sub_db;
        if(row[C.finished] !== '' && row[C.finished] != null) row[C.finished] = n1((+row[C.finished] || 0) + d);
        if(C.available != null && row[C.available] !== '' && row[C.available] != null) row[C.available] = n1((+row[C.available] || 0) - d); });
      window.SUB993 = { at: S.at, diffs: diffs }; }catch(e){} return A; }
  var _api = window.api;
  if(typeof _api === 'function') window.api = function(fn){ var p = _api.apply(this, arguments);
    if(fn !== 'mgmtActive' || typeof D === 'undefined' || !D || !D.mgr) return p;
    var q = Promise.race([subs(), new Promise(function(z){ setTimeout(function(){ z(null); }, 4000); })]);
    return Promise.all([p, q]).then(function(v){ return apply(v[0], v[1]); }); };
  /* a package list already on screen (from the saved copy) gets the database numbers too */
  setTimeout(function w(){ try{ if(typeof D !== 'undefined' && D && D.mgr && typeof AT !== 'undefined' && AT){ subs().then(function(S){ if(S){ apply(AT, S); try{ if(VIEW === 'active') renderActive(); }catch(e){} } }); return; } }catch(e){} setTimeout(w, 3000); }, 4000);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
