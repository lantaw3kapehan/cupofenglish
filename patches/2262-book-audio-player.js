// 2262 (Misty 16 Nov 15:24 "for the audio ensure they could be opened easily"): book audio plays inside the app.
// - Audio lists (DK English for Everyone Levels 1–4) are shown by exercise as printed in the book: "1.4  ▶ Example ▶ 1 ▶ 2 …"
//   instead of file names like b1_c_1_4_1_us; units read "Unit 1 · 36 audio".
// - One tap plays it in a player at the bottom of the sheet (Google Drive's own player; the files are view-by-link, so no sign-in, no new tab).
// - Previous / Next track, Open in Drive, Copy link for student. Closing the sheet stops the sound.
// Source: patches/src/2262-book-audio-player.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2262-book-audio-player.client.js"), "utf8");
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
