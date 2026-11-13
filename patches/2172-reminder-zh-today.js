// 2172 (13 Nov · Misty 18:42 "is this accurate and native translation?"): "Winnie19:00和Dezza老师上课" reads run-together; a native
// line says the day: "Winnie今天19:00…". The "class has started" Chinese lines now say 今天 (the "starts soon" text is already the short
// 2171 line).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["'家长您好，{n}{t}{zT}的课已经开始了", "'家长您好，{n}今天{t}{zT}的课已经开始了"],
  ["'您好！{n}{t}{zT}的课已经开始", "'您好！{n}今天{t}{zT}的课已经开始"],
  ["'{z}您好，您{t}{zT}的课已经开始了", "'{z}您好，您今天{t}{zT}的课已经开始了"],
  ["'{z}您好，{t}{zT}的课已经开始", "'{z}您好，您今天{t}{zT}的课已经开始"],
]);
