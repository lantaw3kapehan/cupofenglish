// 2273 (Misty 16 Nov 18:23 "can this be better?"): the book sheet is organised by unit (pages, videos and audio of a unit together),
// the unit the last class ended on is pinned on top, clean main-book buttons, "More" for other files, search for big books.
// Source: patches/src/2273-book-sheet-by-unit.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2273-book-sheet-by-unit.client.js"), "utf8");
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
