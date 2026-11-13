// 2191: when government is part of her deductions, "Other deductions" shows only what is left after government (no ₱2,410 twice).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["${cur.deduct ? '. Other deductions: ' + peso(cur.deduct) : ''}. Tap a month below",
  "${(o => o > 0 ? '. Other deductions: ' + peso(o) : '')(Math.round(((+cur.deduct || 0) - (p.govEmployer ? +cur.gov || 0 : 0)) * 100) / 100)}. Tap a month below"]]);
