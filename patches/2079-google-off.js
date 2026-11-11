// 2079 (11 Nov, Misty: "MOVE THEM ALL AND SWITCH OFF"). The package check uses only the database's copy; Google's frozen-sheet check no longer overrides it.
//   Readable source: patches/src/2079-google-off.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/2079-google-off.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="f2079">\n' + CODE + '</script>\n<script id="t2060">']
]);
