// 1736: (Misty 4 Nov 13:15, "do the rest as well that needs to be in the supabase database") batch 1 of the management saves that
//   still waited for Google now answer at once through the database queue (coe-wq v3, same as Service agreement / Late decision since
//   27 Oct): add a case, waive a case, task status, trial group, leave decision, active tick, teacher hours, shift handover.
//   The app shows "Saved" straight away; Google does the same work behind (same checks); if Google refuses, the failed-saves notice
//   shows it. A new case's number is shown when Google has made it. Google's minute job finishes any save it did not answer (WQ1104).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  const FNS = { mgmtAgreeSave: 1, mgmtLeaveInformed: 1, tLeaveInformed: 1, mgmtTagClass: 1, decideLate: 1 };",
   "  const FNS = { mgmtAgreeSave: 1, mgmtLeaveInformed: 1, tLeaveInformed: 1, mgmtTagClass: 1, decideLate: 1,\n    addCase: 1, mgmtCaseWaive: 1, mgmtTaskStatus: 1, mgmtTrialGroup: 1, mgmtLeaveSave: 1, setActiveTick: 1, mgmtAvailSave: 1, mgmtShiftClose: 1 };   /* 1736 */"],
  ["mgmtTagClass: 'Class tag', decideLate: 'Late time-in decision' };",
   "mgmtTagClass: 'Class tag', decideLate: 'Late time-in decision', addCase: 'New case', mgmtCaseWaive: 'Waive case', mgmtTaskStatus: 'Task status', mgmtTrialGroup: 'Trial group', mgmtLeaveSave: 'Leave', setActiveTick: 'Active tick', mgmtAvailSave: 'Teacher hours', mgmtShiftClose: 'Shift handover' };"],
  ["    if(fn === 'mgmtTagClass' || fn === 'decideLate'){ const cond",
   "    if(fn === 'addCase') return { ok: true, queued: true, caseId: 'New case', note: 'Saved' };   /* 1736: the case number comes when Google has made it */\n    if(fn === 'mgmtTaskStatus' || fn === 'mgmtLeaveSave' || fn === 'mgmtShiftClose') return { ok: true, queued: true, note: 'Saved' };\n    if(fn === 'mgmtTagClass' || fn === 'decideLate'){ const cond"],
  ["        if((fn === 'decideLate' || fn === 'mgmtTagClass') && g.caseId) try{",
   "        if(fn === 'addCase' && g.caseId) try{ toast('Case ' + g.caseId + ' made' + (g.note ? ' · ' + g.note : '')); if(typeof AC !== 'undefined') AC = null; if(typeof loadActions === 'function') loadActions(); }catch(e){}   /* 1736 */\n        if((fn === 'decideLate' || fn === 'mgmtTagClass') && g.caseId) try{"],
]);
