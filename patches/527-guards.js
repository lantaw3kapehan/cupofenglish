// 21 Oct · QA guards: Trials no longer shows "Updated undefinedH" when the update time is missing; Students / Packages no longer
// stop with an error when the students list comes back in the wrong shape (they wait for the next good answer).
require('../tools/lib.js')(process.argv[2], [
["$('tpAt').textContent = T ? 'Updated ' + T.at + 'H · last 45 days here · older trials appear when you search' : ''; };",
 "$('tpAt').textContent = T ? (T.at ? 'Updated ' + T.at + 'H · ' : '') + 'last 45 days here · older trials appear when you search' : ''; };"],
["window.renderAStudents = function(){ const el = $('v-astudents'); if(!el) return; if(!MS){ return; }",
 "window.renderAStudents = function(){ const el = $('v-astudents'); if(!el) return; if(!Array.isArray(MS)){ return; }   /* 527 */"]
]);
