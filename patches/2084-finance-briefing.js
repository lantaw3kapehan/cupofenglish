// 2084 (11 Nov, Misty: Finance for the President, "like an account manager communicates with the president"; President only).
//   Finance › Briefing: the first Finance tab for the President (the sidebar's Finance opens it). Not shown to Operations or teachers;
//   the approvals and notes are served only to a President session (coe-finbrief).
//   Readable source: patches/src/2084-finance-briefing.client.js · server: server/coe-finbrief.ts · table coe_fin_brief (migration 2084).
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2084-finance-briefing.client.js"), "utf8");
lib(file, [
  ["['finov', 'Overview'], ['payroll', 'Payroll']", "['finbrief', 'Briefing'], ['finov', 'Overview'], ['payroll', 'Payroll']"],
  ["(v === 'forecast' && typeof isPres === 'function' && isPres()) ||",
   "(v === 'forecast' && typeof isPres === 'function' && isPres()) || (v === 'finbrief' && typeof isPres === 'function' && isPres()) ||"],
  ["window.fc980 = { build: build, defaults: defaults, parseMoney: parseMoney, parsePL: parsePL, q: q };",
   "window.fc980 = { build: build, defaults: defaults, parseMoney: parseMoney, parsePL: parsePL, q: q, inputs: inputs, load: load, st: function(){ return ST; } };   /* 2084: the Briefing reads the same numbers */"],
  ['<script id="t2060">', '<script id="f2084">\n' + CODE + '</script>\n<script id="t2060">']
]);
