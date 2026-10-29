// 1642: (Misty 29 Oct 10:34–10:35) the teacher-page Specialties editor (1640) uses the four age bands, exact names and ages:
// 幼儿 Early Years 2–6 · 少儿 Young Learners 7–12 · 青少年 Teens 13–17 · 成人 Adults 18+ (same keys as the partner portal: early / young / teens / adults).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["const BANDS = [['yl', 'Young learners 2–8', '幼儿'], ['kids', 'Kids 8–12', '少儿'], ['teens', 'Teens', '青少年'], ['adults', 'Adults · IELTS/TOEFL', '成人']];",
   "const BANDS = [['early', '幼儿 Early Years 2–6', '幼儿'], ['young', '少儿 Young Learners 7–12', '少儿'], ['teens', '青少年 Teens 13–17', '青少年'], ['adults', '成人 Adults 18+', '成人']];   // 1642 · Misty 10:34 · the four bands"],
  ["   age bands (Young learners 2–8 · Kids 8–12 · Teens · Adults/IELTS-TOEFL), Advanced level,", "   age bands (1642: 幼儿 Early Years 2–6 · 少儿 Young Learners 7–12 · 青少年 Teens 13–17 · 成人 Adults 18+), Advanced level,"]]);
