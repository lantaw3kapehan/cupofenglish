// 1820: final QA · Finance › Overview compared November's first 6 days with all of October ("▼ 77% vs Oct"), which reads as a drop.
//   For the month still running it now shows last month's total instead ("Oct total ₱494,835"); finished months keep the % change.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["(pv ? vs(x.sales, pv.sales) : '')", "(pv ? (run ? mL(pv.m, 1) + ' total ' + P0(pv.sales) : vs(x.sales, pv.sales)) : '')   /* 1820 */"]]);
