// 2074 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). New enquiries made by the database (EQ- number), not Google.
//   Readable source: patches/src/2074-enquiry-new-db.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2074-enquiry-new-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2074">\n' + CODE + '</script>\n<script id="t2060">']
]);
