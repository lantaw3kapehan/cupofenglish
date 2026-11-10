// 2050 (10 Nov 10:45, Misty: "let us do all now"): Overview, Renewals and a teacher's card come from the database. When the
//   database did not answer once (a slow network moment), the app went straight to Google, whose sheet copies are no longer
//   kept up to date, so the screen could show older numbers. Now it asks the database a second time after 1.5 s; Google only
//   if both tries fail. (The plan flags, schedule pickers, money lists and sheet links now come from the database too: server coe v50.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["return ovDb().then(r => { try{ window.LATE_OFF1943 = 0; }catch(e){} return r; }, async () => { const g = await base(fn, ...args);",
  "return ovDb().catch(() => new Promise(z => setTimeout(z, 1500)).then(() => ovDb())).then(r => { try{ window.LATE_OFF1943 = 0; }catch(e){} return r; }, async () => { const g = await base(fn, ...args);   /* 2050: the database twice before Google */"],
 ["return renDb().catch(() => base(fn, ...args));",
  "return renDb().catch(() => new Promise(z => setTimeout(z, 1500)).then(() => renDb())).catch(() => base(fn, ...args));   /* 2050 */"],
 ["return cardDb(nm).catch(() => base(fn, ...args)); }",
  "return cardDb(nm).catch(() => new Promise(z => setTimeout(z, 1500)).then(() => cardDb(nm))).catch(() => base(fn, ...args)); }   /* 2050 */"]
]);
