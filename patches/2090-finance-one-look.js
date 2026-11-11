// 2090 (11 Nov 19:31, Misty: "The WHOLE FINANCE SCREEN not just BRIEFING so they're in sync and aligned"). One shared look for all Finance tabs.
//   Source: patches/src/2090-finance-one-look.css (style only)
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CSS = fs.readFileSync(path.join(__dirname, "src/2090-finance-one-look.css"), "utf8");
lib(file, [['<script id="t2060">', '<style id="d2090">\n' + CSS + '</style>\n<script id="t2060">']]);
