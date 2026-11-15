// 2248 (Misty 15 Nov, after the draw): teachers only spin. The "I can't come anymore" button and its line are gone from the teacher screen.
// If someone really can't come, management removes them (President: "remove" in the management list), which passes the match on as before.
// The server also refuses a teacher removing themselves (coe_xmas_drop).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["function spinBox(){ const m = X.me, cant = '<button", "function spinBox(){ const m = X.me, cant = (typeof D !== 'undefined' && D && D.mgr) ? '' : '', cant0 = '<button"]]);
