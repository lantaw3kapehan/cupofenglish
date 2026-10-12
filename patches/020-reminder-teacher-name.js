// Class reminders: tName already says "Teacher Kat", so don't add "Teacher" again.
require('../tools/lib.js')(process.argv[2], [
["'). Teacher ' + tName(e.teacher || '') + ' is waiting", "'). ' + tName(e.teacher || '') + ' is waiting"],
["who = 'Teacher ' + tName(e.teacher || ''), st = scStage(e);", "who = tName(e.teacher || ''), st = scStage(e);"]
]);
