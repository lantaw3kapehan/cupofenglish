// 1006: correction to 993. The database's ACTIVE already follows the sheet's TOTAL FINISHED / TOTAL AVAILABLE (it learns a
// per-package adjustment from each copy of the sheet), so Owen's new SUB CLASS (0.5, pasted 19:37) was already in his 13
// lessons left. 993 then added the database's own sub count on top → the app showed 12.5 (counted twice). 993 now only
// checks (window.SUB993 lists rows where the sheet and the database count differ); it no longer changes any numbers.
// The numbers are the sheet's: once the corrected SUB CLASS formula is filled down the whole column, every package is right.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["if(!d) return; row[C.sub] = x.sub_db;", "return;   /* 1006: check only, never change the numbers */ row[C.sub] = x.sub_db;"]]);
