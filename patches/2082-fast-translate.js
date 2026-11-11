// 2082 (11 Nov, Misty: "CANCELLING A LESSON DOES NOT FEEL INSTANT"). The parent-notice translations (trEn / trZh) are asked directly from the
//   browser (about 0.6 s) instead of through the Google Apps Script (4–5 s); the Apps Script stays as the fallback.
//   Readable source: patches/src/2082-fast-translate.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2082-fast-translate.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2082">\n' + CODE + '</script>\n<script id="t2060">']
]);
