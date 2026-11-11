// 2091 (11 Nov, Misty: Operations "always makes mistakes with details … I want her to be productive" · "go ahead and do all").
//   Check card asks the database (invoice name, partner vs referral, package vs last time) · Add sale check card · To do "Fix these" (coe_ops_check)
//   · Undo 10 seconds after cancel / restore · Operations' week on To do and in the President's Briefing. Server: coe-ops.
//   Readable source: patches/src/2091-operations-helper.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2091-operations-helper.client.js"), "utf8");
lib(file, [['<script id="t2060">', '<script id="o2091">\n' + JS + '</script>\n<script id="t2060">']]);
