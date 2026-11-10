// 2060 (10 Nov 15:45, Misty: "Celine's final 13th month … PRESIDENT ACCESS ONLY so I could see and edit · aligned with DOLE ·
//   Celine should not have access of it yet"). Payroll gets a "13th month" button for the President only (edge coe-13th refuses
//   everyone else, Celine included). DOLE PD 851: basic earned Jan–Dec (days × daily rate) ÷ 12; penalties listed, not deducted.
//   Readable source: patches/src/2060-13th-month.client.js · edge coe-13th · tables coe_13th, coe_13th_log.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2060-13th-month.client.js"), "utf8");
lib(file, [
  ['<style id="st2058">', '<script id="t2060">\n' + CODE + '</script>\n<style id="st2058">']
]);
