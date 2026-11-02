// 1699: (follow-up to 1698, checked on Nature's report) 9 lines of ~350 characters already make the skill page 1,416 px tall, so it is
//   shrunk to fit the A4 sheet (~80 %); 9 lines of 600 would shrink it to ~60 % and the report becomes hard to read. The limit is
//   400 characters (≈ 65 words, 2–3 sentences) per line; the counter turns orange from 340.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["rows=\"2\" maxlength=\"600\"", "rows=\"2\" maxlength=\"400\""],
  ["String(TRS.notes[k] || '').length + ' / 600</div>", "String(TRS.notes[k] || '').length + ' / 400</div>"],
  ["n.textContent = L + ' / 600'; n.classList.toggle('near', L >= 540);", "n.textContent = L + ' / 400'; n.classList.toggle('near', L >= 340);"]
]);
