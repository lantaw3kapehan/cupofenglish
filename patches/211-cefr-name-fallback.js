// 16 Oct · CEFR picture: a student who is not on the Students list carries the code as the name — use the record's name then.
require('../tools/lib.js')(process.argv[2], [
["who: { student: (S.s && S.s.name) || (r.profile", "who: { student: (S.s && S.s.name && S.s.name !== S.code ? S.s.name : '') || (r.profile"],
]);
