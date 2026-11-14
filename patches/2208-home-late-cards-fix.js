// 2208: the Overview redraws itself once right after loading, which removed 2207's copies; they are now put back after a redraw
// until the fresh card has arrived (or 15 seconds have passed).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["      if(r){ if(ph) ph.remove(); return; }\n      if(ph || !S || !S[k] || filled[k]) return; filled[k] = 1;",
  "      if(r){ seen07[k] = 1; if(ph) ph.remove(); return; }\n      if(ph || !S || !S[k] || seen07[k] || Date.now() - T007 > 15000) return;"],
 ["  const filled = {};", "  const seen07 = {}, T007 = Date.now();"]
]);
