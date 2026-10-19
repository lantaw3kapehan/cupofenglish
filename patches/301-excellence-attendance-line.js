// 19 Oct · 301 · Teacher Excellence · Reliability tile shows attendance & schedule (Misty): absences, late to class, cancellations, incomplete classes,
// schedule changes and leave (in advance / short notice, only when classes were affected). "Perfect attendance" when none.
const A = "        if(f.timeIns) L.push('Time-ins on time · ' + B(f.onTime) + ' of ' + f.timeIns);";
require('../tools/lib.js')(process.argv[2], [[A, A + `
        const at = [[f.absences, 'absence', 'absences'], [f.lateToClass, 'late to class', 'late to class'], [f.cancellations, 'cancellation', 'cancellations'], [f.incomplete, 'incomplete class', 'incomplete classes'], [f.scheduleChanges, 'schedule change', 'schedule changes'], [f.leaveShortNotice, 'short-notice leave', 'short-notice leaves'], [f.leaveDays, 'leave day', 'leave days']]
          .filter(x => +x[0] > 0).map(x => B(+x[0]) + ' ' + (+x[0] === 1 ? x[1] : x[2]));
        L.push('Attendance · ' + (at.length ? at.join(' · ') : B('perfect') + ' (no absence, late, cancellation or schedule change)'));`],
  ["['reliability', 'Reliability', 'time-ins, demerits, hours taught and opened']", "['reliability', 'Reliability', 'attendance, time-ins, hours taught and opened, demerits']"],
  ["    L.push(['Demerits', ", "    L.push(['Attendance', [[f.absences, 'absence'], [f.lateToClass, 'late to class'], [f.cancellations, 'cancellation'], [f.incomplete, 'incomplete'], [f.scheduleChanges, 'schedule change'], [f.leaveShortNotice, 'short-notice leave'], [f.leaveDays, 'leave days']].filter(x => +x[0] > 0).map(x => x[0] + ' ' + x[1]).join(' · ') + (p.attendance != null ? ' → ' + p.attendance : '') || 'perfect → 100']);\n    L.push(['Demerits', "]]);
