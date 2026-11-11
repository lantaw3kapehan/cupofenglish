// 2093 (11 Nov 20:29, Misty: Anna's enrolment: first class Wed 11 Nov in the form, Sun 15 Nov in the calendar; "No student package found" on a first enrolment).
//   The check card shows what is booked and flags a different first class or lesson count, with one tap to fix; Enrolled · paid opens with the
//   first booked class. Server: coe-ops v2. Replaces the 2091 script.  Readable source: patches/src/2093-operations-helper-v2.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2091-operations-helper.client.js"), "utf8");
const NEW = fs.readFileSync(path.join(__dirname, "src/2093-operations-helper-v2.client.js"), "utf8");
lib(file, [['<script id="o2091">\n' + OLD + '</script>', '<script id="o2091">\n' + NEW + '</script>']]);
