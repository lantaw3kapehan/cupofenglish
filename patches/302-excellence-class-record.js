// 19 Oct · 302 · Teacher Excellence · Reliability uses "My class record" (T-RECORD) — the same numbers the teacher sees on Growth (Misty's screenshot):
// on time to class, videos by 23:59, homework, class notes → compliance %; late to class counted from it too (Julia: 2 late, as on her class record).
require('../tools/lib.js')(process.argv[2], [
  ["        if(f.timeIns) L.push('Time-ins on time · ' + B(f.onTime) + ' of ' + f.timeIns);",
   "        if(f.recClasses) L.push('Class record · ' + B((x.timeIns != null ? x.timeIns : '—') + '%') + ' (on time ' + f.recOnTime + ' of ' + f.recClasses + (f.recVideosNeed ? ' · videos ' + f.recVideos + '/' + f.recVideosNeed : '') + (f.recHomeworkNeed ? ' · homework ' + f.recHomework + '/' + f.recHomeworkNeed : '') + (f.recNotesNeed ? ' · notes ' + f.recNotes + '/' + f.recNotesNeed : '') + ')');\n        else if(f.timeIns) L.push('Time-ins on time · ' + B(f.onTime) + ' of ' + f.timeIns);"],
  ["['reliability', 'Reliability', 'attendance, time-ins, hours taught and opened, demerits']", "['reliability', 'Reliability', 'attendance, class record, hours taught and opened, demerits']"]]);
