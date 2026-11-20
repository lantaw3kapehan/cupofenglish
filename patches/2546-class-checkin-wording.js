// 2546 (Misty 20:30–20:36, Ara "I'm late even though I timed in"): the class button says what is missing, no extra space.
//   Day time-in covers the first class only. Later classes, once started without a check-in:
//   · card button "I'm in · late" → "Check-in missed" (shorter than before; the reason is in the hover title, no extra line)
//   · top button "I'm in · late · 19:30 Mia" → "Check-in missed · 19:30 Mia"
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["onclick=\"classIn('${esc(c.id)}')\">I'm in${now > st ? ' · late' : ''}</button>`",
   "${now > st ? 'title=\"Day time-in covers your first class only · tap to check in for this class\"' : ''} onclick=\"classIn('${esc(c.id)}')\">${now > st ? 'Check-in missed' : \"I'm in\"}</button>`"],
  ["b.innerHTML = IC + \"I'm in\" + (late ? ' · late' : '') + ' · ' + hm(due.start)",
   "b.innerHTML = IC + (late ? 'Check-in missed' : \"I'm in\") + ' · ' + hm(due.start)"]
]);
