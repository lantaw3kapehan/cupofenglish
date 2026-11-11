// 2102 (11 Nov 21:40, Misty: "where is the shared package with Andy option?"). Enrolled · paid suggests the sibling's shared package.
//   Readable source: patches/src/2102-sibling-suggest.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2102-sibling-suggest.client.js"), "utf8");
lib(file, [['<script id="t2060">', '<script id="s2102">\n' + JS + '</script>\n<script id="t2060">']]);
