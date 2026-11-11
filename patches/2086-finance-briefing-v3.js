// 2086 (11 Nov, Misty: "a highly productive account manager … help the business thrive and get more students, teachers … make numbers
//   positive" · "release it now"). Finance › Briefing v3: "Growing the business" (coe_fin_growth via coe-finbrief v3) and the safety cushion.
//   Replaces the 2085 script. Readable source: patches/src/2086-finance-briefing-v3.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2085-finance-briefing-v2.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2086-finance-briefing-v3.client.js"), "utf8");
lib(file, [
  ['<script id="f2084">\n' + OLD + '</script>', '<script id="f2084">\n' + NEW + '</script>']
]);
