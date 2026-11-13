// 2173 (13 Nov · Misty 18:42 "and professional since we're in the education industry" · 18:44 "Alright"): the casual endings
// ("See you in class! / 课堂见", "See you then! / 到时见", "See you soon! / 稍后见") become "Thank you! / 谢谢！".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["['Hello! {n}\\'s English class{wT} is today at {t}. See you in class!', '您好！{n}今天{t}{zT}上英语课，课堂见！']",
   "['Hello! {n}\\'s English class{wT} is today at {t}. Thank you!', '您好！{n}今天{t}{zT}上英语课，谢谢！']"],
  ["['Hello! {n}\\'s class{wT} is tomorrow at {t}. See you then!', '您好！{n}明天{t}{zT}上课，到时见！']",
   "['Hello! {n}\\'s class{wT} is tomorrow at {t}. Thank you!', '您好！{n}明天{t}{zT}上课，谢谢！']"],
  ["['Hello {n}, your class{wT} begins in a few minutes ({t}). See you soon!', '{z}您好，您{t}{zT}的课几分钟后开始，稍后见！']",
   "['Hello {n}, your class{wT} begins in a few minutes ({t}). Thank you!', '{z}您好，您的课{t}{zT}即将开始，谢谢！']"],
  ["['Hello {n}! Your class{wT} is today at {t}. See you then!', '{z}您好！您今天{t}{zT}有课，到时见！']",
   "['Hello {n}, your class{wT} is today at {t}. Thank you!', '{z}您好，您今天{t}{zT}有课，谢谢！']"],
  ["['Hello {n}! See you in class{wT} tomorrow at {t}.', '{z}您好！明天{t}{zT}课堂见。']",
   "['Hello {n}, your class{wT} is tomorrow at {t}. Thank you!', '{z}您好，您明天{t}{zT}有课，谢谢！']"],
]);
