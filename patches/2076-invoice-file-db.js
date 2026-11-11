// 2076 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). Add sale with an invoice file → the database (file to storage), not Google.
//   Readable source: patches/src/2076-invoice-file-db.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2076-invoice-file-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2076">\n' + CODE + '</script>\n<script id="t2060">']
]);
