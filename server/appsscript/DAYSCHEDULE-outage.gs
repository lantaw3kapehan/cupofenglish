/* DAYSCHEDULE · 13 Nov 2026 · Outage safeguard 2 (Misty said yes 13 Nov, 17:51; channel waiting for her OK).
   Every evening at about 21:00 Manila, tomorrow's classes are emailed OUTSIDE the app:
     · each teacher gets their own classes (time, student, code, book, meeting ID);
     · Operations (Celine) and the President get the whole day, grouped by teacher.
   So if the app or the database is down in the morning, everyone already has the day in their inbox.
   Data: the database function coe_day_schedule(day) (cancelled classes left out). Sent from this Google account with MailApp.
   SETUP (once, after Misty approves):
     1) Paste this file into the Apps Script project (next to Code.gs, which has sbReq_).
     2) Run sendDayScheduleTest() once: it sends ONLY to OPS so you can see it. Approve the Gmail permission it asks for.
     3) Run installDayScheduleTrigger() once: from then on it runs every evening at about 21:00. */
const DS_OPS = 'operations@cupofenglishatph.com';
const DS_MGMT = ['operations@cupofenglishatph.com'];   // add the President's address here if she wants the full day too

function dsData_(day) { return sbReq_('post', 'rpc/coe_day_schedule', day ? { p_day: day } : {}); }
function dsLabel_(day) { return Utilities.formatDate(new Date(day + 'T12:00:00+08:00'), 'Asia/Manila', 'EEEE d MMMM yyyy'); }
function dsRows_(L) {
  return L.map(c => '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee"><b>' + c.start + '</b>–' + c.end + '</td><td style="padding:6px 10px;border-bottom:1px solid #eee">' +
    dsEsc_(c.student) + (c.type ? ' (' + dsEsc_(c.type) + ')' : '') + '<br><span style="color:#777">' + dsEsc_([c.code, c.book].filter(String).join(' · ')) + '</span></td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + dsEsc_(c.meet || '') + '</td></tr>').join('');
}
function dsEsc_(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function dsTable_(L) { return '<table style="border-collapse:collapse;font:14px Arial,sans-serif"><tr style="background:#f3f2f8"><th align="left" style="padding:6px 10px">Time (Manila)</th><th align="left" style="padding:6px 10px">Student</th><th align="left" style="padding:6px 10px">Meeting ID</th></tr>' + dsRows_(L) + '</table>'; }
const DS_FOOT = '<p style="color:#777;font:12px Arial,sans-serif">This is your backup copy of tomorrow\'s schedule, sent outside the app. The app is still the main record: changes made after this email (cancellations, new classes) show only in the app. If the app is down, send your time-in screenshot to the teachers\' WeChat group and Operations will enter it later.</p>';

function sendDaySchedule(test) {
  const d = dsData_(); if (!d || !d.day) throw new Error('The database gave no schedule');
  const label = dsLabel_(d.day), T = d.teachers || [];
  if (!test) T.forEach(t => { if (!t.email || !t.classes || !t.classes.length) return;
    MailApp.sendEmail({ to: t.email, name: 'CupOfEnglish', subject: 'Your classes tomorrow, ' + label + ' (' + t.classes.length + ')',
      htmlBody: '<p style="font:14px Arial,sans-serif">Hi Teacher ' + dsEsc_(t.teacher) + ', here are your classes for <b>' + label + '</b>.</p>' + dsTable_(t.classes) + DS_FOOT }); });
  const all = T.map(t => '<h3 style="font:600 15px Arial,sans-serif;margin:18px 0 6px">Teacher ' + dsEsc_(t.teacher) + ' · ' + t.classes.length + '</h3>' + dsTable_(t.classes)).join('');
  (test ? [DS_OPS] : DS_MGMT).forEach(to => MailApp.sendEmail({ to: to, name: 'CupOfEnglish', subject: 'All classes tomorrow, ' + label + ' (' + d.total + ')' + (test ? ' · TEST' : ''),
    htmlBody: '<p style="font:14px Arial,sans-serif"><b>' + label + '</b> · ' + d.total + ' classes · ' + T.length + ' teachers.</p>' + all + DS_FOOT }));
  return d.total;
}
function sendDayScheduleTest() { return sendDaySchedule(true); }
function sendDayScheduleNightly() { return sendDaySchedule(false); }   // the trigger calls this (a trigger passes an event object, which must not count as 'test')
function installDayScheduleTrigger() {
  ScriptApp.getProjectTriggers().filter(t => /^sendDaySchedule/.test(t.getHandlerFunction())).forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendDayScheduleNightly').timeBased().atHour(21).nearMinute(0).everyDays(1).inTimezone('Asia/Manila').create();
}
