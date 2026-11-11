// 2097 (11 Nov 20:50, Misty: Anna's birthday "does not show instantly"). The save was sent with no birthdate (birth "", birthKeep 1, writes 7892):
//   960 keeps the birthdate decision only while sendStu runs its first, synchronous part, but the save is sent later (after the form's awaits),
//   so the decision was already cleared and the "never send a blank" fallback kept the old empty cell. The decision now stays for that
//   student's save for 3 minutes, so a typed birthdate is sent and shows at once.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["        if(f && typeof f === 'object' && row > 0){ const P = PB;",
   "        if(f && typeof f === 'object' && row > 0){ const P2 = PBK[row + '|' + String(f.code || '')], P = (P2 && Date.now() - P2.t < 18e4) ? P2 : PB;   /* 2097 */"],
  ["  let PB = null;   /* the birthdate decision of the save that is being sent right now */",
   "  let PB = null;   /* the birthdate decision of the save that is being sent right now */\n  const PBK = {};   /* 2097: the same decision by row|code, kept 3 minutes (the save is sent after the form's awaits) */"],
  ["      PB = Object.assign({ row: r, code: c }, d);\n      try{ return ss0.apply(this, arguments); } finally { PB = null; } }",
   "      PB = Object.assign({ row: r, code: c }, d); PBK[r + '|' + c] = Object.assign({ t: Date.now() }, PB);   /* 2097 */\n      try{ return ss0.apply(this, arguments); } finally { PB = null; } }"]
]);
