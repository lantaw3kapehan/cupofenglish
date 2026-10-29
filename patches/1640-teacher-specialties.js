// 1640: (Misty 29 Oct 10:05–10:09) Teacher specialties, edited in ONE place — the teacher's page in Team & access — saved in the database
// (staff.specialties) through coe-partner-spec. Confirmed ones show on the partner portal (Who's free / Teachers / copied pictures);
// a read-only "Suggested · confirm" from the teacher's active students is shown only here. Readable source: patches/src/1640-teacher-specialties.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/1640-teacher-specialties.client.js"), "utf8");
lib(file, [["</body>\n</html>", CODE + "</body>\n</html>"]]);
