// 16 Oct · CEFR journey picture: (1) an "(Unmatched)" month line in S-MONTHLY is counted only when that month has no line
// with the teacher (the same rule as the lesson summary and "lessons a week") — Lucian showed 16 instead of 15;
// (2) the name comes from the student record when the student is not on the Students list (0 lessons left) — it showed the code.
require('../tools/lib.js')(process.argv[2], [
["const MO = (r.monthly || []).filter(x => x && x.m), U = x =>", "const MO = (r.monthly || []).filter(x => x && x.m).filter((x, i, A) => !/unmatched/i.test(String(x.t || '')) || !A.some(y => y.m === x.m && !/unmatched/i.test(String(y.t || '')))), U = x =>"],
["who: { student: (S.s && S.s.name) || '', cn: (S.s && S.s.cn) || '', code: S.code }", "who: { student: (S.s && S.s.name) || (r.profile && r.profile.row && String(r.profile.row[2] || '').trim()) || '', cn: (S.s && S.s.cn) || (r.profile && r.profile.row && String(r.profile.row[1] || '').trim()) || '', code: S.code }"],
]);
