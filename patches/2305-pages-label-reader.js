// 2305 (Misty 17 Nov 12:06): the unit row said "Pages · open in Drive", but a page link opens in the CupOfEnglish book reader (2277).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["<div class=\"b3-lbl\">Pages · open in Drive</div>", "<div class=\"b3-lbl\">Pages · open in the book reader</div>"],
]);
