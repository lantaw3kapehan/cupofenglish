// 2136 (12 Nov, tested on Teacher Pam's screen with a pretend Wi-Fi, nothing saved): the warning said "Teacher ," (the name is in D.me.name)
// and showed the 2025 wording to a teacher who signed the Addendum when the flag had not come back yet. coe-wifi "mine" now always returns
// the teacher's contract, and the warning uses it.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["return String((D && (D.name || D.teacher)) || (typeof NAME !== 'undefined' ? NAME : '') || '')", "return String((D && ((D.me && D.me.name) || D.name || D.teacher)) || '')"],
  ["let C = { at: 0, flag: null }, sentB = 0, shown = '';", "let C = { at: 0, flag: null }, sentB = 0, shown = '', CT = '';   /* CT: the teacher's contract (addendum | 2025), kept from the last check */"],
  ["if(r && r.ok) C = { at: Date.now(), flag: r.flag || null }; return C.flag; }", "if(r && r.ok){ C = { at: Date.now(), flag: r.flag || null }; if(r.contract) CT = r.contract; } return C.flag; }"],
  ["function text(f){ const nm = me(), add = f.contract === 'addendum',", "function text(f){ const nm = me(), add = (f.contract || CT) === 'addendum',"],
]);
