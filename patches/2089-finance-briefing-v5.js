// 2089 (11 Nov 19:29, Misty: "ON FINANCE, BRIEFING, can you please enhance visual design, layout, and all"). Briefing v5: new look and layout.
//   Replaces the 2088 script. Readable source: patches/src/2089-finance-briefing-v5.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2088-finance-briefing-v4.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2089-finance-briefing-v5.client.js"), "utf8");
lib(file, [['<script id="f2084">\n' + OLD + '</script>', '<script id="f2084">\n' + NEW + '</script>']]);
