// 2138 (12 Nov, Misty: "yes make them match since same person"): the Partner list says "Jinan - Dr. Spring", "IELTS - Dr. Spring",
// "Adults - Dr. Spring" and "Jinan - Dr. Rose", the same as DATABASE › SOURCE. The saved sales, the partner page labels, the Finance
// lists and the pricing were renamed in the database the same day (prices unchanged: 55 / 120 / 60 per lesson). This is only the
// app's built-in fallback list, used when the saved list has not loaded.
const lib = require("../tools/lib.js"), file = process.argv[2];
const L = "['CupOfEnglish', 'Jinan - Ms. Spring', 'Jinan - Ms. Rose', 'Inner Mongolia - Ms. Jane', 'Inner Mongolia - Ms. Jane Adult', 'Chengdu - Mr. Clark', 'Panpacific University', 'IELTS', 'TOEFL', 'Adult English', 'Adult English - Ph', 'IELTS - Ms. Spring', 'Adults - Ms. Spring', 'Reading Program']";
const N = L.replace(/ - Ms\. (Spring|Rose)'/g, " - Dr. $1'");
lib(file, [["const BASE = " + L, "const BASE = " + N], ["const P1714 = " + L, "const P1714 = " + N]]);
