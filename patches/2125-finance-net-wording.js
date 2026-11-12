// 2125 (12 Nov audit): Finance said two different things about November: Briefing "about ₱2,800 left over, as long as renewals keep coming
// in", while Sales & costs and Overview › Business showed "Nov · expected net ≈ −₱87k". The −₱87k leaves out every sale still to come
// (it is net so far minus the salaries and dues still to pay). Its label now says that: "Nov · if no more sales come in".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["mon(cur) + (still ? ' · expected net · estimate' : ' · net so far · actual')", "mon(cur) + (still ? ' · if no more sales come in' : ' · net so far · actual')"],
  ["t4.innerHTML = '<span>' + esc(X.m) + ' · expected net</span>", "t4.innerHTML = '<span>' + esc(X.m) + ' · if no more sales</span>"],
]);
