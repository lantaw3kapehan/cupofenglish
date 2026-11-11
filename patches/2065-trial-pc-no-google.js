// 2065 (11 Nov, Misty: "LET US DO ALL NOW"). Trial reports and progress checks never ask Google:
//   forms from coe-trform, Chinese from the reviewed copies (docs zh:<hash>), no Google trial PDF,
//   the progress report picture made in the app (not Google's PR-REPORT sheet).
//   Sends are finished by the database (migrations trial_pc_db_only_2065 and after).
//   Readable source: patches/src/2065-trial-pc-no-google.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2065-trial-pc-no-google.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2065">\n' + CODE + '</script>\n<script id="t2060">'],
  ["made from the PR-REPORT template", "made in the app"]
]);
