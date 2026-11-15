// 2251 (Misty, April "Feedback · 17"): Payroll's "to finish" chips showed Google's raw list (17 feedbacks for April, all already sent).
// The database's copy is corrected against the real records (sent reports, shared-student turns, submitted peer reviews), but the
// screen used Google's answer directly. Now: Google is still asked (it keeps the copy current), then the screen shows the database's
// corrected copy (mgmt:mgmtPayReady). If that copy can't be read, it falls back to the old answer.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "async function loadReady(){ try{ await swr('ready', () => api('mgmtPayReady', TOKEN), v => RDY = v",
 "async function rdy2251(){ const g = await api('mgmtPayReady', TOKEN).catch(() => null); try{ const k = 'mgmt:mgmtPayReady|[]', r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: [k] }) }).then(x => x.json()); const d = r && r.ok && r.docs && r.docs[k] && r.docs[k].data; if(d && d.t && (!g || !g.month || d.month === g.month)) return d; }catch(e){} return g; }\nasync function loadReady(){ try{ await swr('ready', () => rdy2251(), v => RDY = v"
]]);
