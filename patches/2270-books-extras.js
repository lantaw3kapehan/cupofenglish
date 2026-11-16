// 2270 (Misty 16 Nov 17:50 "let us do all"): Books extras · unit audio/video one tap, listening homework, book progress,
// missing materials and who-opened-what for management; one-time drop of old book lists on devices (Oxford Phonics videos, 17:51).
// Source: patches/src/2270-books-extras.client.js · server: Supabase function coe-books (server/coe-books.ts)
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2270-books-extras.client.js"), "utf8");
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
