// 696: (Misty) A profile header for each teacher: name, rank, and badges of what they are cleared to teach (only what is done),
// grouped (Specializations, Phonics, Reading, Oxford Discover, Adults, Trial classes). At the top of the teacher's Trainings screen,
// and at the top of a teacher's path when management taps a name. Same data a future student/parent app can show.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("  const RC = {", `  function profHtml(d, who, rank){ const U = (d.trainings || []).filter(t => t.kind === 'unlock'), ok = t => ['done', 'excused'].includes((latestRec(d.records, who, t.id) || {}).status);
    const ORD = ['Specializations', 'Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Trial classes'], D0 = U.filter(ok).sort((a, b) => ORD.indexOf(BG(a)) - ORD.indexOf(BG(b)) || a.sort - b.sort);
    const lab = t => t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '');
    return '<div class="tx-prof"><div class="tx-av">' + e(String(who || '?').slice(0, 1).toUpperCase()) + '</div><div class="grow"><div class="tx-pn">Teacher ' + e(who) + (rank ? ' <span class="tx-rk" style="background:' + (RC[rank] || '#9A97AE') + '">' + e(rank) + '</span>' : '') + '</div>'
      + (D0.length ? '<div class="tx-bdg">' + D0.map(t => '<span style="--c:' + (BGC[BG(t)] || '#9A97AE') + '" title="' + e(BG(t)) + '">' + (BG(t) === 'Specializations' ? '★ ' : '') + e(lab(t)) + '</span>').join('') + '</div>' : '<div class="small mute">Books and specializations you are cleared to teach appear here as management ticks them.</div>') + '</div></div>'; }
  const RC = {`);
rep("    h += '<div class=\"tx-hero\"><div class=\"tx-ring\"", "    h += profHtml(d, who, R.rank);\n    h += '<div class=\"tx-hero\"><div class=\"tx-ring\"");
rep("openSheet('<div class=\"tr\"><h1>' + e(tName(name)) + '</h1><div class=\"sub\">' + e(x.rank || '') + '</div>' + ladderHtml(", "openSheet('<div class=\"tr tx\">' + profHtml(TV, name, x.rank) + ladderHtml(");
rep(".tr-chips{", `.tx-prof{display:flex;gap:16px;align-items:center;background:var(--card,#fff);border:1px solid var(--line);border-radius:20px;padding:16px 18px;margin:14px 0}
.tx-av{width:54px;height:54px;border-radius:50%;background:#EEF8F7;color:#00737B;display:grid;place-items:center;font-family:"Fredoka One",Fredoka,sans-serif;font-size:24px;flex:none}
.tx-pn{font-family:"Fredoka One",Fredoka,sans-serif;font-size:20px;color:var(--ink);display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tx-pn .tx-rk{font-family:Arvo,serif}
.tx-bdg{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.tx-bdg span{font-size:12px;font-weight:700;color:#2B2253;background:#fff;border:1.5px solid var(--c);border-radius:99px;padding:4px 10px}
.tr-chips{`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
