// 2137 (12 Nov, teacher audit on Teacher Pam's screen): Pay › Punctuality listed "Late to class · 2 min · Mon 19 Oct · 20:31" twice
// ("I'm in" tapped twice, 4 seconds apart, before the double-tap guard). The same late (same kind, same minute, same class) shows once.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["  function ltHtml(full){ const R = (LT && LT.rows) || []; if(!R.length) return '';",
  "  function ltHtml(full){ const R0 = (LT && LT.rows) || [], R = R0.filter((r, i) => R0.findIndex(x => x.kind === r.kind && String(x.at).slice(0, 16) === String(r.at).slice(0, 16) && String(x.start || x.cls || '') === String(r.start || r.cls || '')) === i); if(!R.length) return '';   /* 2137: once */"]]);
