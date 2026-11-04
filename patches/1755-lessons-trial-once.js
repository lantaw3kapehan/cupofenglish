// 1755: (Misty 4 Nov 17:29 "Why christian is like this?") Lessons by student listed every trial row of TC&SUB, but payroll pays
//   one trial per student (and one substitute per date, time and student). Christian's Eric had 3 trial rows (11, 18, 19 Oct; the
//   calendar has one trial class) → the list said 2.5 trial units while pay counts 1.5. The list now groups them the same way
//   as payroll: one line per student, the extra rows shown as "also recorded … · counted once", totals = what is paid.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    const reg = +L.reg || 0, tri = +L.trial || 0, sub = +L.sub || 0, tot = Math.round((reg + tri + sub) * 100) / 100;",
   "    const grp = (A, key) => { const g = {}, o = []; (A || []).slice().sort((a, b) => String(a.d).localeCompare(String(b.d))).forEach(x => { const k = key(x); if(!g[k]){ g[k] = Object.assign({}, x, { also: [] }); o.push(g[k]); } else { g[k].also.push(x); if(+x.u > +g[k].u) g[k].u = x.u; } }); return o; };   /* 1755: same as payroll */\n" +
   "    const TG = grp(L.trials, x => String(x.code || x.name)), SG = grp(L.subs, x => String(x.d).slice(0, 10) + '|' + (x.t || '') + '|' + String(x.code || x.name));\n" +
   "    const one2 = (x, kind, why) => one(x, kind).replace('</div></td>', (x.also.length ? ' · also recorded ' + esc(x.also.map(y => mo(y.d) + ' ' + dn(y.d)).join(', ')) + ' · counted once (' + why + ')' : '') + '</div></td>');\n" +
   "    const sm = A => A.reduce((a, x) => a + (+x.u || 0), 0);\n" +
   "    const reg = +L.reg || 0, tri = sm(TG), sub = sm(SG), tot = Math.round((reg + tri + sub) * 100) / 100;"],
  ["      + ((L.trials || []).length ? (L.trials || []).map(x => one(x, 'Trial class')).join('')",
   "      + (TG.length ? TG.map(x => one2(x, 'Trial class', 'one trial per student')).join('')"],
  ["      + ((L.subs || []).length ? (L.subs || []).map(x => one(x, 'Substitute')).join('')",
   "      + (SG.length ? SG.map(x => one2(x, 'Substitute', 'same class')).join('')"],
]);
