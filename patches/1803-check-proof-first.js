// 1803: (Misty 6 Nov 15:48 "is the excused here been auto-tagged or?" → 15:50 "yes better") A lesson with less than 4 h notice is no
//   longer shown as "Excused" just because a file is attached: it reads "Excused? · check the proof" until management decides
//   (Clause 4.1: excused = a valid reason, judged by the Company). "Under 4 h all excused" and "Under 4 h all unexcused" are always
//   offered when a lesson is under 4 h, so an invalid proof is one tap. Only a notice filed after the lesson started is suggested
//   as Unexcused by itself.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["else if(proof){ k = 'Excused'; why = 'less than 4 h · reason with proof'; }",
   "else if(proof){ k = 'wait'; why = 'less than 4 h · proof attached · check it'; }   /* 1803: never excused before someone checks */"],
  ["p.k === 'wait' ? 'Excused ₱' + rate('Excused') + ' or Unexcused ₱' + rate('Unexcused')",
   "p.k === 'wait' ? (/proof attached/.test(p.why || '') ? 'Excused? ₱' + rate('Excused') + ' · check the proof' : 'Excused ₱' + rate('Excused') + ' or Unexcused ₱' + rate('Unexcused'))"],
  ["proof ? '✓ Proof attached (' + proof + ')'",
   "proof ? 'Proof attached (' + proof + ') · open it below and check the reason before deciding'"],
  ["' under 4 h: excused if the reason is valid, unexcused if not'",
   "' under 4 h: ' + (proof ? 'open the proof · ' : '') + 'excused if the reason is valid, unexcused if not'"],
  ["(waiting ? btn('Excused', 'Under 4 h all excused",
   "(plan.some(p => p.h < 4) ? btn('Excused', 'Under 4 h all excused"],
  ["btn('none', 'No charge', charged.length || waiting ? 'ghost' : 'teal')",
   "btn('none', 'No charge', plan.some(p => p.h < 4) ? 'ghost' : 'teal')"],
]);
