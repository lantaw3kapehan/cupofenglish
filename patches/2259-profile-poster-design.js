// 2259 (Misty 16 Nov 11:39): new design for the teacher profile card — "the best design while maintaining persuasiveness".
// Portrait for WeChat: big photo, name, tags, qualification badges, strengths, the teaching mix as one coloured bar with a legend,
// the classroom style as a quote, and a "免费试听 25 分钟 · 立即预约" call to action (no QR code). Same saved fields as before.
// Source: patches/src/2259-profile-poster.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2259-profile-poster.client.js"), "utf8");
lib(file, [["</script>\n</body>\n</html>", "</script>\n<script id=\"b2259\">\n" + JS + "</script>\n</body>\n</html>"]]);
