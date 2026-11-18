// 2338 (Misty 18 Nov): no "Added when the family pays" — enrolment means paid. Bonus tile shows the students only; the Perfect Attendance note says "as soon as the student enrols".
const file = process.argv[2];
require('../tools/lib.js')(file, [
["esc(parts.join(' · ')) + '<br>Added when the family pays</span>'", "esc(parts.join(' · ')) + '</span>'"],
['of next month; enrolment bonuses are added as soon as the family pays.', 'of next month; enrolment bonuses are added as soon as the student enrols.'],
['qualified teacher; enrolment bonuses are added as soon as the family pays.', 'qualified teacher; enrolment bonuses are added as soon as the student enrols.']
]);
