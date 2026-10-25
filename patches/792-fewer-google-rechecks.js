// 792: screens the database already serves were still re-checked on Google very often (mgmtSchedule ~73/h, tStudent ~50/h, mgmtTeacher ~33/h …),
// which kept Google busy and slowed everything that still needs Google. Now a database copy younger than these limits is used as it is:
// in the background (no one waiting) and when a screen opens. Saves, ↻ Refresh and the change check (pulse) still refresh at once.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 792 · fewer Google re-checks of database screens */
(function(){ const M = 6e4;
  try{ Object.assign(SB_BGAGE, { mgmtSchedule: 10 * M, mgmtTeacher: 15 * M, tStudent: 60 * M, mgmtStudent: 60 * M, tMyVisits: 30 * M, tMyComments: 30 * M, mgmtLeave: 15 * M, tLeave: 15 * M,
      mgmtMonDay: 15 * M, mgmtAvailAll: 30 * M, tReminders: 10 * M, tFbStatus: 15 * M, mgmtActions: 15 * M, mgmtTeacherWeek: 15 * M, tSchedule: 15 * M, tGoals: 30 * M, tHwHist: 30 * M });
    Object.assign(SB_OKAGE, { mgmtSchedule: 5 * M, mgmtTeacher: 10 * M, tStudent: 20 * M, mgmtStudent: 20 * M, mgmtLeave: 10 * M, tLeave: 10 * M, mgmtMonDay: 10 * M, tReminders: 5 * M, mgmtActions: 10 * M,
      mgmtTeacherWeek: 10 * M, tSchedule: 10 * M, tMyVisits: 15 * M, tGoals: 15 * M, tHwHist: 15 * M }); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < 90 * 6e4) || age(d) < 180000)) return d.data;",
   "if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < 90 * 6e4) || age(d) < Math.max(180000, SB_OKAGE[fn] || 0))) return d.data;   /* 792 */"]
]);
