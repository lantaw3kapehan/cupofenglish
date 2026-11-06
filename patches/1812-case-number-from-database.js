// 1812: cases database-first (coe-wq v9 + coe_dbf_h_case): when the database gives the case number at once, the app shows it
//   straight away ("OAR-2026-147") instead of "New case", so the leave card records the real case numbers and its notices of
//   breach link to the right case.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["        return ans(fn, a); })", "        { const o = ans(fn, a); if(fn === 'addCase' && r.caseId && o && typeof o === 'object') o.caseId = r.caseId; return o; } })   /* 1812 */"]]);
