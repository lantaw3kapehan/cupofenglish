// 2070 (11 Nov, Misty: "LET US DO ALL NOW"). App health from the database (docs mgmt:dbHealth, coe_health), not from Google.
//   Readable source: patches/src/2070-health-db.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2070-health-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2070">\n' + CODE + '</script>\n<script id="t2060">']
]);
