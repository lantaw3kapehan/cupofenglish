// 2095 (11 Nov 20:37, Misty: valid until 15 Mar vs last class 24 Feb · "OK" to a line that explains it). Enrolled · paid shows the last booked class
//   and the days left before the deadline for make-ups (or a warning when classes run past it). Replaces the 2093 script.
//   Readable source: patches/src/2095-operations-helper-v3.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2093-operations-helper-v2.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2095-operations-helper-v3.client.js"), "utf8");
lib(file, [['<script id="o2091">\n' + OLD + '</script>', '<script id="o2091">\n' + NEW + '</script>']]);
