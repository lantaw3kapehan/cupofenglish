// 2085 (11 Nov, Misty: "I wanted to enter it here" · "Make it minimal, straightforward, effective, targeted"). Finance › Briefing v2:
//   shorter, one action list; the peso bank balance and the yuan rate are typed in the Briefing and kept in the database (coe-finbrief v2
//   settings, President only), so every device and the Forecast use the same figures. Replaces the 2084 script.
//   Readable source: patches/src/2085-finance-briefing-v2.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2084-finance-briefing.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2085-finance-briefing-v2.client.js"), "utf8");
lib(file, [
  ['<script id="f2084">\n' + OLD + '</script>', '<script id="f2084">\n' + NEW + '</script>']
]);
