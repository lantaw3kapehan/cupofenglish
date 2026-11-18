// 2332 (Misty 18 Nov): the Perfect Attendance card says which incentive waits for the 1st (enrolment bonuses are added at once).
const file = process.argv[2];
require('../tools/lib.js')(file, [
['Checked by the system every hour; the incentive is added on the 1st.</div>', 'Checked by the system every hour. The Perfect Attendance incentive is added on the 1st of next month; enrolment bonuses are added as soon as the family pays.</div>'],
['Worked out by the system every hour · the incentive case is added on the 1st for every qualified teacher', 'Worked out by the system every hour. The Perfect Attendance incentive is added on the 1st for every qualified teacher; enrolment bonuses are added as soon as the family pays.']
]);
