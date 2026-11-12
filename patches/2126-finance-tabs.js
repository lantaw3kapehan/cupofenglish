// 2126 (12 Nov audit · "minimal, relevant"): Finance › Forecast is a prototype ("Prototype — not released … 7 inputs to check") and
// its numbers disagree with the Briefing, which already gives this month's outlook. The tab is taken out of the Finance tab bar
// (the page is still there at #forecast, nothing deleted).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["['money', 'Sales & costs'], ['forecast', 'Forecast'], ['wallets'", "['money', 'Sales & costs'], ['wallets'"]]);
