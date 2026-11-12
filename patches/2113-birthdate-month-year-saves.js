// 2113 (12 Nov 13:16, Misty: Anna "I selected month and year October 2019 … it should count her age, though it won't give when the birthday is").
// The "Only month and year" tick (1771) gave a month box ("2019-10"), but the Edit student save (960) only sent a full date (yyyy-mm-dd):
// a month and year was treated as "nothing typed" and the old empty birthdate was kept. The 960 form also turned the month box back into a
// date box. Now: month and year is sent as "2019-10" (the database counts the age from it and shows no birthday day), the month box stays a
// month box while the tick is on, and the typed value is remembered by 2112 too.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["  const ISO = /^\\d{4}-\\d{2}-\\d{2}$/;\n",
   "  const ISO = /^\\d{4}-\\d{2}-\\d{2}$/;\n  const ISOM = /^\\d{4}-\\d{2}(-\\d{2})?$/;   /* 2113: a full date, or month and year only */\n"],
  ["if(m === 'input' || m === 'edit'){ if(el.type !== 'date') el.type = 'date'; el.hidden = false; }",
   "if(m === 'input' || m === 'edit'){ const mo = !!(b.querySelector('input[type=checkbox][onchange*=\"sBirth\"]') || {}).checked, ty = mo ? 'month' : 'date'; if(el.type !== ty) el.type = ty; el.hidden = false; }   /* 2113: the month box stays while the tick is on */"],
  ["else if((M === 'input' || M === 'edit') && ISO.test(x) && x !== O) d = { birth: x };",
   "else if((M === 'input' || M === 'edit') && ISOM.test(x) && x !== O) d = { birth: x };   /* 2113: month and year is sent too */"],
  ["else if(!ISO.test(String(f.birth == null ? '' : f.birth).trim()) && !f.birthClear)",
   "else if(!ISOM.test(String(f.birth == null ? '' : f.birth).trim()) && !f.birthClear)"],
  ["/^\\d{4}-\\d{2}-\\d{2}$/.test(v)) T[code.toUpperCase()]",
   "/^\\d{4}-\\d{2}(-\\d{2})?$/.test(v)) T[code.toUpperCase()]"],
  ["Pick the full date of birth. Leave it empty to keep the birthdate as it is.",
   "Pick the date of birth, or tick Only month and year. Leave it empty to keep the birthdate as it is."],
]);
