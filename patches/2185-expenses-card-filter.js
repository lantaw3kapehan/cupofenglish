// 2185 (13 Nov · Misty): the Overview "Expenses" card opens Transactions with the Expenses filter on (it kept the last filter, e.g. Sales).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["<button type=\"button\" onclick=\"go(\\'expenses\\')\">Open Transactions</button></div>'\n      + '</div>';",
  "<button type=\"button\" onclick=\"go(\\'expenses\\');fxK(\\'out\\')\">Open expenses</button></div>'\n      + '</div>';"]]);
