// 19 Oct · Back off after a failed or slow request: the Teacher Excellence card and the panels added this week (setup check, trials, first 90 days,
// phone alerts, who has reminders) waited their 2–10 minutes after a success but retried AT ONCE after a failure, piling load on the database when it was slow.
const fs = require('fs'), s = fs.readFileSync(process.argv[2], 'utf8'), edits = [];
edits.push(["  function load(force){ if(Kbusy || !isT() || (!force && Date.now() - Kat < 10 * 6e4)) return; Kbusy = true;\n    post('tKpi')",
  "  function load(force){ if(Kbusy || !isT() || (!force && Date.now() - Kat < 10 * 6e4)) return; Kbusy = true; Kat = Date.now();   /* 337: back off even when it fails */\n    post('tKpi')"]);
const re = /\.catch\(\(\) => \{ ([A-Za-z0-9]+at) = 0; \}\)/g; let m;
while((m = re.exec(s))){ const find = s.slice(m.index - 70, m.index + m[0].length); edits.push([find, find.slice(0, 70) + '.catch(() => { /* 337: wait before retrying */ })']); }
require('../tools/lib.js')(process.argv[2], edits);
