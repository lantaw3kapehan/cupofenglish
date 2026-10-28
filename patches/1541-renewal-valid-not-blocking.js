// 1541: (Misty, 29 Oct 03:03) Lucy's "Lessons left · to send" still said "Numbers don't agree yet: 2.5 carried + 33 new − 0.5 used ≠ 35.5".
// Cause (database, fixed in migration renewal_rule_1541_sync): the 5-minute ACTIVE sync "kept" the sheet's date-based split as a fix
// (+0.5 used on Dezza's row, +0.5 available), undoing the renewal rule; the guard rightly refused to draw. Now 2.5 + 33 − 0 = 35.5.
// Also: a valid-until that differs between ACTIVE (sheet RENEWAL DATE) and the first-class rule no longer holds the renewal picture —
// the picture uses the first-class rule (Misty's rule, 1423) and App health keeps asking for the sheet's RENEWAL DATE to be corrected.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["      if(row && row.validRule && row.validSheet && row.validRule !== row.validSheet) why.push('Valid until: ACTIVE says ' + row.validSheet + ', the first class after the renewal (' + row.start + ') gives ' + row.validRule); }",
   "      /* 1541: valid-until is the first-class rule (row.validRule, used by the picture); a different ACTIVE date is listed in App health, not a hold */ }"]
]);
