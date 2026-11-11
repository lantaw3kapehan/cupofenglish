// 2088 (11 Nov 19:16, Misty: "can you do it now?"). Finance › Briefing v4: due dates entered once (Coming up, bold within 7 days), "Close last month"
//   in the first 10 days of a month, and a Monday reminder (President only). Replaces the 2086 script.
//   Readable source: patches/src/2088-finance-briefing-v4.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2086-finance-briefing-v3.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2088-finance-briefing-v4.client.js"), "utf8");
lib(file, [['<script id="f2084">\n' + OLD + '</script>', '<script id="f2084">\n' + NEW + '</script>']]);
