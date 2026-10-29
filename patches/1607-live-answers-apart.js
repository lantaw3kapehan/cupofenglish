// 1607 · 1601 refined (coe_speed 10:00–10:40: Trials, Health, Messages, Students, AvailAll read "nocopy" → Google 5–11 s).
//   Every screen the database works out on the spot (the SB_LIVE list: student pages, class lists, messages, schedule…) now
//   goes in its own request, and waits up to 9 s for the database (a database answer in 5 s still beats Google's 8–20 s). The
//   plain stored copies (reports Google made) keep sharing one quick request (4 s).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const g = HEAVY.test(key) ? key : '_';",
   "const g = (HEAVY.test(key) || (typeof SB_LIVE !== 'undefined' && SB_LIVE.test((key.match(/^[^:]+:(\\w+)\\|/) || [])[1] || ''))) ? key : '_';   /* 1607: every live answer apart */"],
  ["    TIM[g] = setTimeout(async () => { const W = WANT[g] || {}; delete WANT[g]; TIM[g] = 0;\n      let docs = {}; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;",
   "    TIM[g] = setTimeout(async () => { const W = WANT[g] || {}; delete WANT[g]; TIM[g] = 0;\n      let docs = {}; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), g === '_' ? 4000 : 9000) : 0;   /* 1607 */"],
]);
