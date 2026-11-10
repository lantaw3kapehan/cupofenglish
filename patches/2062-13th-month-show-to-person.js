// 2062 (10 Nov 16:09, Misty: "so when it's given to her, she will see the breakdown" · "okay great"). 13th month gets a
//   "Show this breakdown to <name>" switch (off by default). When on, the person sees "My 13th month" on Payroll: her own months,
//   days × rate, total ÷ 12, paid on · read only, no penalties/notes/reasons. Edge coe-13th v5 (op "mine"), coe_13th.shared.
//   Readable source: patches/src/2062-13th-month-show.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2061-13th-month-upto.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2062-13th-month-show.client.js"), "utf8");
lib(file, [['<script id="t2060">\n' + OLD + '</script>', '<script id="t2060">\n' + NEW + '</script>']]);
