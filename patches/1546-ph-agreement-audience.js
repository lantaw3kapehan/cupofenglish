// 1546 · PH English agreement by audience (29 Oct 2026, Misty 03:19).
// Adult English 1:1 / IELTS 1:1: the learner signs — table "Learner", no "Parent" row, "Learner signature" (a parent / guardian signs only if
//   the learner is under 18), class rule "50 minutes" (the "25 minutes for younger learners" line is for children). Place of signing: Online.
// Young Learners 1:1 / Teens 1:1: Learner / Parent / Guardian table with the Parent row, "Parent / Guardian signature", the original
//   "50 minutes, or 25 minutes for younger learners" rule, and the message to the parent.
// All PH: the 4-hour notice for learner and provider cancellations (cancel_hours, from 1538). China: unchanged.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var L = (document.querySelector('#login img') || {}).src || '', d = new Date(), pk = +a.pkg || 0, k = pk >= 60 ? 60 : pk >= 30 ? 30 : pk ? 15 : 0, P = progOf(a)",
   "var L = (document.querySelector('#login img') || {}).src || '', d = new Date(), pk = +a.pkg || 0, k = pk >= 60 ? 60 : pk >= 30 ? 30 : pk ? 15 : 0, P = progOf(a), KID = !!(P && (P.audience === 'kids' || P.audience === 'teens'))"],
  ["Learner / Parent / Guardian</td></tr>' + row(a.members", "' + (KID ? 'Learner / Parent / Guardian' : 'Learner') + '</td></tr>' + row(a.members"],
  ["row('Parent', '<span style=\"color:#9A97AE\">(sign below)</span>')", "(KID ? row('Parent', '<span style=\"color:#9A97AE\">(sign below)</span>') : '')"],
  ["All classes are one-on-one (50 minutes, or 25 minutes for younger learners); lateness does not extend class time, student-side technical issues count as completed lessons, teacher changes or learning pace are not refund grounds, official communication is via Messenger", "All classes are one-on-one (' + (KID ? '50 minutes, or 25 minutes for younger learners' : '50 minutes') + '); lateness does not extend class time, student-side technical issues count as completed lessons, teacher changes or learning pace are not refund grounds, official communication is via Messenger"],
  ["<b>Learner / Parent / Guardian signature</b>", "' + (KID ? '<b>Parent / Guardian signature</b>' : '<b>Learner signature</b> <span style=\"font-weight:400;color:#6F6B85\">(parent / guardian if the learner is under 18)</span>') + '"],
  ["return 'Hi ' + n + '! Before your classes begin", "var P = progOf(a); if(P && (P.audience === 'kids' || P.audience === 'teens')) return 'Dear parent, before ' + n + '’s classes begin, please read our Learner Service Agreement (picture above). To sign, long-press the picture › Edit, write your signature, name and date in the box and send it back here, or simply reply “I have read and agree”. Thank you!\\nCupOfEnglish';\n    return 'Hi ' + n + '! Before your classes begin"]
]);
console.log('1546 PH agreement by audience');
