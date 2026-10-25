// builds recs-960.json: the audit samples + DATABASE records for the rows the birthdate tests open
const fs = require('fs'), [,, inp, out] = process.argv;
const R = JSON.parse(fs.readFileSync(inp, 'utf8'));
let tpl = null; R.forEach(r => { if(/dbRecord/.test(r.body)){ const j = JSON.parse(r.t); for(const k in j.docs) if(/dbRecord/.test(k)) tpl = j.docs[k]; } });
const mk = (row, code, birth) => ['pres:dbRecord|' + JSON.stringify([row, code]), Object.assign({}, tpl, { data: Object.assign({}, tpl.data, { row, code, birth, en: 'Test' + row }) })];
const docs = Object.fromEntries([mk(18, 'ST-2026-113', '2013-10-01'), mk(73, 'ST-2026-076', '2008-04-07'), mk(94, 'ST-2026-058', '2021-07-10'), mk(47, 'ST-2026-006', 'March//2018'), mk(5, 'ST-2026-124', '')]);
R.push({ url: 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe', body: JSON.stringify({ op: 'docs', token: 'T', keys: Object.keys(docs) }), t: JSON.stringify({ ok: true, docs }) });
fs.writeFileSync(out, JSON.stringify(R));
