// 14 Oct pm · More management screens open from the database (Misty: Teacher Julia · open slots kept loading).
// Open slots, class info, teacher week, visits, agreements, reminders, QA forms, leave classes, profiles, week summary,
// DATABASE record, trial search … are copied to Supabase too (server paste SERVER-STUDENTS, part 2) and shown at once.
require('../tools/lib.js')(process.argv[2], [
["|schedLists|moneyLists|dbLists|t(Student|",
 "|schedLists|moneyLists|dbLists|dbRecord|mgmt(Agree|Avail|ClassInfo|FixIgnored|LeaveClasses|MemoInfo|PeerClasses|PlanFlags|Profiles|QaForm|QaLast|Reminders|Report|ShiftTasks|SlipPeople|TrialSearch|WeekSum|TeacherWeek|TeacherVisits)|t(Student|"],
]);
