// 1734: (Misty 4 Nov 12:52, schedule: "change all future classes" · "ensure no schedule will be affected") The existing
//   "Change teacher / schedule" sheet already stops the old weekly classes from a date and books the new days (time, length, book),
//   with a summary before Save. Made usable for "same teacher, new time / length / book":
//   · the current teacher is chosen already (when the weekly classes are all with one teacher), change it only for a new teacher
//   · the button on the student page reads "Change schedule / teacher"; step 2 reads "Teacher (same or new)"
//   · stopped classes say "Schedule changed" when the teacher stays the same (was "Changed to Teacher <same>")
//   Screen wording and the default choice only; what the sheet saves is unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(!CS.book && S[0]) CS.book = S[0].book; paint(); };",
   "if(!CS.book && S[0]) CS.book = S[0].book; if(!CS.nw && S.length && S.every(x => x.teacher === S[0].teacher)) CS.nw = S[0].teacher;   /* 1734 */ paint(); };"],
  ["reason: 'Changed to Teacher ' + cap(o.nw), forward: true",
   "reason: cap(o.nw) === cap(x.teacher) ? 'Schedule changed' : 'Changed to Teacher ' + cap(o.nw), forward: true"],
  ["onclick=\"ctOpen('${esc(STU.code)}')\">Change teacher</button>", "onclick=\"ctOpen('${esc(STU.code)}')\">Change schedule / teacher</button>"],
  ['<label style="margin-top:16px">2 · New teacher</label>', '<label style="margin-top:16px">2 · Teacher <span class="mute small">(same or new)</span></label>'],
]);
