// 1827: (Misty 7 Nov "ALWAYS MAKE EMOJIS AND EMOTICONS PROFESSIONAL") Trainings screens: emojis replaced by the same small line icons as
//   "I train teachers in" (🧑‍🏫 Coaching & trainings I give, 🎯 Coaching ×2), 🎉 removed from "Top rank reached" / "Well done!", ⚡ removed from Quick tick.
const lib = require('../tools/lib.js'), file = process.argv[2];
const B = '<span style="color:#00737B"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg></span> ', C = '<span style="color:#00737B"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg></span> ';
lib(file, [
  ["<b>🧑‍🏫 Coaching &amp; trainings I give</b>", "<b>" + B + "Coaching &amp; trainings I give</b>"],
  ["'<section class=\"tx-card\"><div class=\"tx-h\"><b>🎯 Coaching</b><span>'", "'<section class=\"tx-card\"><div class=\"tx-h\"><b>" + C.replace(/'/g, "\\'") + "Coaching</b><span>'"],
  ["'<h2>🎯 Coaching <span", "'<h2>" + C.replace(/'/g, "\\'") + "Coaching <span"],
  ["Top rank reached 🎉</div>", "Top rank reached</div>"],
  ["<div class=\"h5-yay\">🎉 <b>Well done!</b>", "<div class=\"h5-yay\"><b>Well done!</b>"],
  ["'⚡ Quick tick'", "'Quick tick'"],
  ["· ⚡ Quick tick to tap many dots fast", "· Quick tick to tap many dots fast"]]);
