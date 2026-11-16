// 2268 (Misty 16 Nov 17:37 "for the video, is it possible to make it also open on the app window"): course-book videos play in a player
// over the app, streamed through coe-audio (now serves audio/* and video/* course-book files). Drive's viewer said "Can't load the video".
// Source: patches/src/2268-book-video-player.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2268-book-video-player.client.js"), "utf8");
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
