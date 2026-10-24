// 761: (Misty) migrate step 3 · background refreshes of screens the database already builds (Schedule, teacher and student pages,
// Students, Cases, Payroll, Database, Availability, Leave…) still went to Google every few minutes (≈9,000 Google calls a day, 6–30 s each),
// because the database copy was judged "too old" for a background refresh. When you open a screen it already came from the database;
// now the quiet refreshes do too (a copy Google made is refreshed from Google at most every 30 min). Google is still used right after one of your own saves (2 min) and whenever the database cannot answer.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + `<script>
/* 761 · background refreshes from the database */
(function(){
  const BG = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll|Actions|Payroll|Leave|Database)|t(Student|Schedule|HwHist|Goals|Leave)|dbLists|dbRecord)$/;
  const base = window.api; if(!base || base.__761) return;
  const w = function(fn){ const args = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(args));
    try{
      const ui = Date.now() - (window._ui || 0) < 1500, saved = typeof SB_LASTW !== 'undefined' && Date.now() - SB_LASTW < 120000;
      if(!ui && !saved && BG.test(fn) && typeof sbOn === 'function' && sbOn() && typeof sbDoc === 'function'){
        return sbDoc(sbKey(fn, args)).then(d => (d && d.data != null && (d.live || Date.now() - Date.parse(d.at) < 30 * 6e4)) ? d.data : go(), go); }
    }catch(e){}
    return go(); };
  w.__761 = 1; window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
