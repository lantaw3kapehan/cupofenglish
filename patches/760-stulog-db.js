// 760: (Misty) migrate step 2 · the student / trial History notes (mgmtStuLog, 4–6 s on Google) are read from the database copy of S-LOG
// (coe-train "stulog", ≈0.4 s). Saving a note still goes to Google as before (the note shows at once on screen meanwhile).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + `<script>
/* 760 · History notes from the database */
(function(){
  const base = window.api; if(!base || base.__760) return;
  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this;
    if(fn === 'mgmtStuLog' && typeof D !== 'undefined' && D && D.mgr && !(a[2] && a[2].note)){
      const o = a[2] || {};
      return fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'stulog', code: a[1] || '', key: o.key || '' }) })
        .then(x => x.json()).then(r => (r && r.ok) ? r : base.apply(self, [fn].concat(a)), () => base.apply(self, [fn].concat(a))); }
    return base.apply(this, arguments); };
  w.__760 = 1; window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
