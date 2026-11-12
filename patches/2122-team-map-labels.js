// 2122 (12 Nov audit): Teachers › Team map: "NEEDS A TALK" sat right under "ROOM TO TAKE MORE" (top left). It now sits in the bottom-left
// corner of its own shaded area, like "BUSY · CHECK COMPLETION" on the right.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["zone(xa - 8, yg + 18, 'NEEDS A TALK', 'end')", "zone(xa - 8, H - B - 8, 'NEEDS A TALK', 'end')"]]);
