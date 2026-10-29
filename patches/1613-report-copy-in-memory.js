// 1613 · 1602 refined: Health was still asked from Google on every return to the app (coe_speed 10:39–10:53, every 1–2 min).
//   Google's Health answer carries "ok": false on a day that needs a look, and answers with ok: false are never copied to
//   the database, so the database copy stayed hours old. Now each Google answer for these reports is also kept in memory for
//   this page, and used (no Google) while younger than the same age (Health 30 min, Trials 15 min, …). Only answers that are
//   real data are kept (an error answer is not).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["        return Promise.race([(typeof sbDocV === 'function' ? sbDocV(key, fn) : sbDoc(key)), new Promise(z => setTimeout(() => z(null), 4500))]).then(d => (d && d.data != null && !(d.data && d.data.ok === false) && Date.now() - Date.parse(d.at) < m * 6e4) ? d.data : base.apply(self, [fn].concat(args)), () => base.apply(self, [fn].concat(args))); }",
   "        const mc = MEM1613[key]; if(mc && Date.now() - mc.t < m * 6e4) return Promise.resolve(mc.data);   /* 1613: this page's last Google answer */\n" +
   "        const g1613 = () => { const p = Promise.resolve(base.apply(self, [fn].concat(args))); p.then(x => { if(x != null && !(x && x.error) && !(fn !== 'mgmtHealth' && x && x.ok === false)) MEM1613[key] = { t: Date.now(), data: x }; }, () => {}); return p; };\n" +
   "        return Promise.race([(typeof sbDocV === 'function' ? sbDocV(key, fn) : sbDoc(key)), new Promise(z => setTimeout(() => z(null), 4500))]).then(d => (d && d.data != null && !(d.data && d.data.ok === false && fn !== 'mgmtHealth') && Date.now() - Date.parse(d.at) < m * 6e4) ? d.data : g1613(), () => g1613()); }"],
  ["  let CFG = null, cfgAt = 0, rf = 0, LSF = '', LSA = 0;", "  let CFG = null, cfgAt = 0, rf = 0, LSF = '', LSA = 0; const MEM1613 = {};"],
]);
