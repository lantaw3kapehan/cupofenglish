// 14 Oct night · Step 3: management saves through the database (instant), written into the sheet within a minute at the
// time they were tapped: "report sent", trial follow-ups (except "Enrolling", which still waits for Google because it
// starts the referral message), "case done" and "messages seen". If the database can't take it, the normal save runs.
// A save the sheet refuses later shows as a message ("Not saved · …") the next time the app checks (every 10 min).
require('../tools/lib.js')(process.argv[2], [
["function fastOn(){",
 "const FAST_M = { mgmtReportSent: 1, mgmtTrialFu: 1, setCaseDone: 1, mgmtMsgSeen: 1 };   /* 14 Oct night: management saves */\n" +
 "function fastOnM(fn, args){ try{ if(localStorage.getItem('coe.fast') === '0') return false; }catch(e){} return !!(D && D.mgr && TOKEN && FAST_M[fn] && !(fn === 'mgmtTrialFu' && args[2] === 'Enrolling')); }\n" +
 "function fastOn(){"],
["  if(fn === 'tMsgAck') return { ok: true, queued: true, note: 'Saved' };",
 "  if(fn === 'tMsgAck') return { ok: true, queued: true, note: 'Saved' };\n" +
 "  const who = String((D && D.me && D.me.name) || ''), now = new Date(), p2 = n => ('0' + n).slice(-2);\n" +
 "  if(fn === 'mgmtReportSent') return { ok: true, queued: true, at: now.getDate() + ' ' + now.toLocaleString('en-US', { month: 'short' }) + ' ' + p2(now.getHours()) + ':' + p2(now.getMinutes()), by: who, ticked: false, student: '' };\n" +
 "  if(fn === 'mgmtTrialFu'){ const key = String(args[1] || '').trim().toLowerCase(), st = String(args[2] || ''), note = String(args[3] || '').replace(/\\s+/g, ' ').trim().slice(0, 120);\n" +
 "    return { ok: true, queued: true, fu: st ? { st: st, note: note, by: who, at: now.getFullYear() + '-' + p2(now.getMonth() + 1) + '-' + p2(now.getDate()) + ' ' + p2(now.getHours()) + ':' + p2(now.getMinutes()) } : null, student: String(args[4] || key.slice(11)), ref: '' }; }"],
["if(FAST_W[fn] && fastOn()) return fastWrite(fn, args);",
 "if(FAST_W[fn] && fastOn()) return fastWrite(fn, args);\nif(fastOnM(fn, args)) return fastWrite(fn, args);   /* 14 Oct night: management saves through the database */"],
["async function fastFails(){ if(!TOKEN || !D || D.mgr) return;",
 "async function fastFails(){ if(!TOKEN || !D) return;"],
["function ffPaint(){ try{ const el = $('v-today');",
 "function ffPaint(){ try{ if(D && D.mgr){ const x = FF[0]; if(x){ toast('Not saved · ' + FF_L[x.fn] + (ffWho(x) ? ' · ' + ffWho(x) : '') + ' · ' + String(x.error || 'refused') + ' · please do it again'); ffOk(x.id); } return; }\n  const el = $('v-today');"],
["const FF_L = { tFbSubmit: 'Monthly feedback',",
 "const FF_L = { mgmtReportSent: 'Report sent', mgmtTrialFu: 'Trial follow-up', setCaseDone: 'Case done', mgmtMsgSeen: 'Messages seen', tFbSubmit: 'Monthly feedback',"],
]);
