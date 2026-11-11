// 2080 (11 Nov, Misty: "YES MOVE WEEK SUMMARY TO THE DATABASE"). Last week's summary comes only from the database's copy; Google is not asked.
//   Readable source: patches/src/2080-week-summary-db.client.js · database: server/sql/2080-week-summary-db.sql
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2080-week-summary-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2080">\n' + CODE + '</script>\n<script id="t2060">']
]);
