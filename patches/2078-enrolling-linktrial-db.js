// 2078 (11 Nov, Misty: "MOVE THEM ALL AND SWITCH OFF"). Trial follow-up "Enrolling" and "link this trial" go to the database, not Google.
//   Readable source: patches/src/2078-enrolling-linktrial-db.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2078-enrolling-linktrial-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2078">\n' + CODE + '</script>\n<script id="t2060">']
]);
