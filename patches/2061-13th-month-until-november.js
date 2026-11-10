// 2061 (10 Nov 15:57, Misty: "dont include december count anymore, only until november"). Payroll › 13th month counts
//   January to November by default (÷ 12) and has a "Count the months up to" choice (saved per person, coe_13th.upto);
//   later months show as "not counted". Edge coe-13th v4. Readable source: patches/src/2061-13th-month-upto.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2060-13th-month.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2061-13th-month-upto.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">\n' + OLD + '</script>', '<script id="t2060">\n' + NEW.replace("if(window.__t2060) return;", "if(window.__t2060) return;") + '</script>']
]);
