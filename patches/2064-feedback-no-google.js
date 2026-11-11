// 2064 (11 Nov, Misty: "Fully off Google" · "ensure everything goes directly to the app now and that no google").
//   Monthly feedback and parent reports never ask Google: form (coe-fbform), helper (coe-fbp), teacher list (database docs),
//   Parent reports list / report (coe-lists / coe-taps), no Google PDF, no Google translation in the monthly report maker.
//   Sends are finished by the database (migrations feedback_off_google_refuse_2064, report_sent_db_only_2064).
//   Readable source: patches/src/2064-feedback-no-google.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2064-feedback-no-google.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2064">\n' + CODE + '</script>\n<script id="t2060">'],
  ["if((!F.zh.strengths || !F.zh.areas || !F.zh.next) && (F.strengths || F.areas || F.next)){", "if(false && (!F.zh.strengths || !F.zh.areas || !F.zh.next) && (F.strengths || F.areas || F.next)){   /* 2064: no Google translation; the reviewed Chinese (fbcn) only */"]
]);
