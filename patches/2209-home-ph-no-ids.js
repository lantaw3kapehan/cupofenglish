// 2209: 2207's saved copies carried the cards' own ids, so the Christmas card's code found and removed the copy before its fresh card
// was ready (one small jump). The copies now have no ids.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["const el = t.firstElementChild; if(!el) return; el.dataset.ph07 = k;",
 "const el = t.firstElementChild; if(!el) return; el.removeAttribute('id'); el.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); el.dataset.ph07 = k;"]]);
