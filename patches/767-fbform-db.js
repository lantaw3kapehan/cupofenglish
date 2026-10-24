// 767: (Misty) monthly feedback opens 25 Oct · the form now comes from the database (coe-train "fbform", ≈0.5 s instead of 6 s on Google):
// the same form layout every student has, this month's dates, sent / returned, last month's feedback and the last 45 days of class notes.
// Sending still fills the student's own Google Form. A student with no form yet, or anything the database cannot answer → Google as before.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + `<script>
/* 767 · monthly feedback form from the database */
(function(){
  const base = window.api; if(!base || base.__767) return;
  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this;
    if(fn === 'tFbForm' && typeof D !== 'undefined' && D && !D.mgr && a[1]){
      const go = () => base.apply(self, [fn].concat(a));
      return fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'fbform', code: a[1] }) })
        .then(x => x.json()).then(r => r && r.ok ? r : (r && r.msg && !r.fallback) ? { ok: false, msg: r.msg } : go(), go); }
    return base.apply(this, arguments); };
  w.__767 = 1; window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
