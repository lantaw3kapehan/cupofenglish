// 1730: (Misty 4 Nov 11:19, Andy & Joy shared summary) Shared Lesson Summary took the free (incentive) lessons from the owner's row only
//   (Andy, 0), so Joy's 2 referral lessons on her own ACTIVE row were missing from the total (38 shown, 14 left = 40 − 26).
//   Now: each child's incentive (highest across that child's rows) added together.
const file = process.argv[2];
require('../tools/lib.js')(file, [[
  "inc = C.incentive != null ? +o[C.incentive] || 0 : 0, tot = n1(enrolled + carry + trf + inc)",
  "inc = C.incentive != null ? (m => Object.values(m).reduce((a, v) => a + v, 0))([o].concat(G.members).reduce((m, x) => { const k = up(x[C.code]); m[k] = Math.max(m[k] || 0, +x[C.incentive] || 0); return m; }, {})) : 0, /* 1730: every child's free lessons */ tot = n1(enrolled + carry + trf + inc)"
]]);
