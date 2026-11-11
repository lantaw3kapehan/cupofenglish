// 2075 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). Memo number, names and sending from the database, not Google.
//   Readable source: patches/src/2075-memo-db.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2075-memo-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2075">\n' + CODE + '</script>\n<script id="t2060">']
]);
