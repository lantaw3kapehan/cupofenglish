// 2072 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). Leave requests finished by the database (migration leave_request_db_only_2072);
//   proof files kept in the app's storage (coe-proof v3); "View proof" opens them with no Google call.
//   Readable source: patches/src/2072-leave-proof-storage.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2072-leave-proof-storage.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2072">\n' + CODE + '</script>\n<script id="t2060">']
]);
