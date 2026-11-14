// 2205 (14 Nov): switching between List, Timeline and Month now always works. The Schedule only redraws what changed,
// so the views are layered on top of the list instead of replacing it: Timeline hides the list and shows the timeline above it,
// Month hides everything under the switch, and choosing List brings the list back. The switch always shows the view you are in.
const fs = require("fs"), lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 [fs.readFileSync(__dirname + "/2205-old.txt", "utf8"), fs.readFileSync(__dirname + "/2205-new.txt", "utf8")],
 ["if(!n.classList.contains('mo04w')) n.style.display = 'none'; n = nx; }", "if(!n.classList.contains('mo04w') && n.style.display !== 'none'){ n.style.display = 'none'; n.dataset.h04 = 1; } n = nx; }"]
]);
