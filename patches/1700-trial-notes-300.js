// 1700: the report reads each line back through coe-trials, which keeps 300 characters per line, so the box allows 300 (≈ 50 words,
//   2 sentences; was 220 before 1698) — every character typed reaches the report. Counter turns orange from 260.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["rows=\"2\" maxlength=\"400\"", "rows=\"2\" maxlength=\"300\""],
  ["String(TRS.notes[k] || '').length + ' / 400</div>", "String(TRS.notes[k] || '').length + ' / 300</div>"],
  ["n.textContent = L + ' / 400'; n.classList.toggle('near', L >= 340);", "n.textContent = L + ' / 300'; n.classList.toggle('near', L >= 260);"]
]);
