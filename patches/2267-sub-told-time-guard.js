// 2267 (Misty 16 Nov 17:29, Julia OAR-2026-163): adding a sub class after the fact, "When did the teacher tell us?" had the class date
// filled in, and the class time was entered as the time told → "0 h before class" → Teacher Absence · Unexcused −₱500, although the
// class had been cancelled the evening before. Now: the date is not filled in for you, and if the time told is the class time itself
// (or after it), the preview says so plainly before anything is saved.
// Database (same day): coe_actions_mirror now copies the app's edits, so a waived case no longer shows "Tagged −₱…" to the teacher.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["const ad = $('cAbD'); if(ad && !ad.value) ad.value = ($('cD') || {}).value || '';", "const ad = $('cAbD');   /* 2267: not filled in with the class date */"],
 ["  const ht = hrs < 0 ? 'after the class started'",
  "  if(hrs <= 0.02){ t = '<b style=\"color:#9A3B22\">Check the time told</b> <span class=\"mute\">· this is the class time itself' + (hrs < 0 ? ' or later' : '') + '. Enter when the teacher <b>told us</b> (e.g. the evening before, when the class was cancelled). Saving this makes an Unexcused case.</span>'; if(t) t += '<div class=\"mute\" style=\"margin-top:3px\">The regular class at this time is cancelled (no make-up) and the sub class is added.</div>'; el.innerHTML = t; return; }   /* 2267 */\n  const ht = hrs < 0 ? 'after the class started'"],
 ["<label>When did the teacher tell us?</label>", "<label>When did the teacher tell us? <span class=\"mute small\">· the time they told us, not the class time</span></label>"],
]);
