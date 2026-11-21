// 2557 (Misty 21 Nov 09:32): the agreement message works for parents and adult learners alike ("Hello!" / "您好！" instead of
// "Dear parent" / "家长您好"), and the English and the Chinese are separated by an empty line. Same for the reminder (no emoji).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["return `Dear parent, before ${kid}'s classes begin, please read our Learner Service Agreement (picture above).",
   "return `Hello! Before ${kid}'s classes begin, please read our Learner Service Agreement (picture above)."],
  ["or simply reply 「已阅读并同意」. Thank you!\\n家长您好！${zh}的课程开始前，",
   "or simply reply 「已阅读并同意」. Thank you!\\n\\n您好！${zh}的课程开始前，"],
  ["return `Dear parent, just a gentle reminder 😊 When you have a moment,",
   "return `Hello! Just a gentle reminder: when you have a moment,"],
  ["Thank you so much!\\n家长您好，温馨提醒，", "Thank you so much!\\n\\n您好！温馨提醒，"],
]);
