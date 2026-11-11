// 2096 (11 Nov 20:39, Misty: trials stuck on "Report being made"). A trial report with its Chinese goes to "To send" at once (the report is made in the app).
//   Readable source: patches/src/2096-trial-ready-at-once.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2096-trial-ready-at-once.client.js"), "utf8");
lib(file, [['<script id="t2060">', '<script id="r2096">\n' + JS + '</script>\n<script id="t2060">']]);
