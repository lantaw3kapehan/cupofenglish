// 2576 (audit QA-11, verified 21 Nov): Learner filter showed All 226 but 5 + 144 + 55 + 21 = 225. James (ST-2022-004) has no learner
// type (no birthday / type on record). A "Not set" button now lists such students, so the groups add up to All. Shown only when > 0.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const K = 'coe.ltF', OPT = [['', 'All'], ['early', 'Early Years'], ['young', 'Young Learners'], ['teen', 'Teens'], ['adult', 'Adults']];",
   "const K = 'coe.ltF', OPT = [['', 'All'], ['early', 'Early Years'], ['young', 'Young Learners'], ['teen', 'Teens'], ['adult', 'Adults'], ['unk', 'Not set']];   /* 2576 */"],
  ["const n = { '': rows.length, early: 0, young: 0, teen: 0, adult: 0 }; rows.forEach(r => { const c = r.querySelector('.lt1588'); if(!c) return; ['early', 'young', 'teen', 'adult'].forEach(k => { if(c.classList.contains(k)) n[k]++; }); });\n    const html = '<span>Learner</span>' + OPT.map(",
   "const n = { '': rows.length, early: 0, young: 0, teen: 0, adult: 0, unk: 0 }; rows.forEach(r => { const c = r.querySelector('.lt1588'); let hit = 0; if(c) ['early', 'young', 'teen', 'adult'].forEach(k => { if(c.classList.contains(k)){ n[k]++; hit = 1; } }); if(!hit) n.unk++; });\n    const html = '<span>Learner</span>' + OPT.filter(o => o[0] !== 'unk' || n.unk || cur === 'unk').map("],
  ["#v-astudents[data-ltf=\"adult\"] .li.sa:not([data-lb=\"adult\"]){display:none!important}",
   "#v-astudents[data-ltf=\"adult\"] .li.sa:not([data-lb=\"adult\"]),#v-astudents[data-ltf=\"unk\"] .li.sa[data-lb=\"early\"],#v-astudents[data-ltf=\"unk\"] .li.sa[data-lb=\"young\"],#v-astudents[data-ltf=\"unk\"] .li.sa[data-lb=\"teen\"],#v-astudents[data-ltf=\"unk\"] .li.sa[data-lb=\"adult\"]{display:none!important}"],
]);
