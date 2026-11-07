// 1832: (Misty 7 Nov "no need for a trial report") a trial for a student who already had regular classes (teacher or course change,
//   e.g. Roye ST-2024-038 with Pam on 5 Nov) shows "Teacher change" instead of "Write report" and is not counted as a to-do.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["    if(keep.length !== D.special.length){ D.special = keep; try{ render(); }catch(e){} } }",
   "    let ch = keep.length !== D.special.length;\n    keep.forEach(x => { if(x.type !== 'Trial' || !x.reportMissing || !x.code || !x.date) return; const d = String(x.date).slice(0, 10);\n      if(T.some(c => c.existing && c.code === String(x.code).trim().toUpperCase() && near(c.day, d))){ x.reportMissing = false; x.status = 'Teacher change'; ch = true; } });   /* 1832 */\n    if(ch){ D.special = keep; try{ render(); }catch(e){} } }"]]);
