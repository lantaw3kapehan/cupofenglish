// 2480 (found in the audit, 19 Nov 20:40): on opening, management's Overview drew the saved copy of the team data from earlier in the day
//   (On time 0/8, "No time-in yet 8", lates already decided) for 10–20 s. A saved copy older than 10 minutes now keeps its teachers and pay,
//   but not today's time-ins and lates; those show once the live data arrives (usually within a few seconds).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(D.mgr){ try{ MO = JSON.parse(store('get','coe.mo')||'null'); }catch(e){} loadMgmt(); } }",
   "if(D.mgr){ try{ MO = JSON.parse(store('get','coe.mo')||'null'); if(MO && !(MO.built && Date.now() - Date.parse(MO.built) < 10 * 6e4)){ MO.team = []; MO.late = []; MO._stale2480 = 1; } }catch(e){} loadMgmt(); } }"]
]);
