// 1601 · database answers no longer wait for each other, and every Google read is recorded with its reason.
//   · The app asks the database for all copies it needs in one request; the database works some of them out on the spot
//     (a teacher's home, the feedback list, ACTIVE, the Students list…) and answered only when the slowest was done — so a
//     student page (0.2 s on its own) waited 1–6 s behind the teacher's home or ACTIVE (coe_speed 24 h: tStudent 49 waits
//     over 1 s, tHwHist/tGoals 28, mgmtStudent 29). Now each of those heavy screens goes in its own request; the light ones
//     still share one. Same answers, same 4 s limit, same scope checks on the server.
//   · 1525 recorded why a Google read happened only for 14 calls; now for every read (g:<call>:<why> in coe_speed), so the
//     list of Google reads the app still makes is complete (DB-READS-INVENTORY).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const WATCH = /^(tStudent|tGrowth|tFbStatus|mgmtStudent|schedLists|tPayCheck|tPayReady|tMsgs|getBootstrap|mgmtStuClasses|tStuClasses|mgmtActive|tMyVisits|tPeerForm)$/",
   "const WATCH = { test: fn => (typeof API_READ !== 'undefined' && API_READ.test(fn)) || (typeof API_BG !== 'undefined' && API_BG.test(fn)) || (typeof SB_R !== 'undefined' && SB_R.test(fn)) || /^(tDoc|tFbPlus|mgmtPkgCheck|tVidList|tVidFlags|mgmtVidFlags)$/.test(fn) }   /* 1601: every read */"],
  ["</script>\n<script>\n/* 1526 · teacher cards from this device's last copy",
   "</script>\n<script>\n/* 1601 · database copies: heavy screens in their own request */\n(function(){\n" +
   "  if(window.__1601 || typeof window.sbDoc !== 'function') return; window.__1601 = 1;\n" +
   "  const HEAVY = /^[^:]+:(getBootstrap|mgmtActive|mgmtStudents|tFbStatus|mgmtOverview|mgmtSchedule|mgmtTeacherWeek|mgmtAvailAll|mgmtPayroll|mgmtTeacher|mgmtActions|mgmtDatabase|dbLists)\\|/;\n" +
   "  const WANT = {}, TIM = {};\n" +
   "  window.sbDoc = sbDoc = function(key){ return new Promise(res => { const g = HEAVY.test(key) ? key : '_'; const B = WANT[g] || (WANT[g] = {}); (B[key] = B[key] || []).push(res); if(TIM[g]) return;\n" +
   "    TIM[g] = setTimeout(async () => { const W = WANT[g] || {}; delete WANT[g]; TIM[g] = 0;\n" +
   "      let docs = {}; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;\n" +
   "        const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: Object.keys(W) }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid));\n" +
   "        if(r && r.ok) docs = r.docs || {}; }catch(e){}\n" +
   "      Object.keys(W).forEach(k => W[k].forEach(f => f(docs[k] || null))); }, 25); }); };\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1526 · teacher cards from this device's last copy"],
]);
