// 2073 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). Leave saves with files (a teacher's answer, management's proof)
//   go to the database queue (coe-wq v11) with time for the upload; the files are kept in the app's storage (coe-proof v4). Never Google.
//   Readable source: patches/src/2073-leave-files-db.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2073-leave-files-db.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2073">\n' + CODE + '</script>\n<script id="t2060">']
]);
