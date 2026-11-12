// 2119 (12 Nov audit): Students › Source and Learner counts and the Learner filter now see all active students (they saw the first 60 only).
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2119-students-counts.client.js"), "utf8");
lib(file, [['<script id="t2060">', '<script id="b2119">\n' + JS + '</script>\n<script id="t2060">']]);
