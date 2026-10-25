// 807: (Misty) "okay do it" — the standard CEFR lines on the skill breakdown must not read as the teacher's own observation.
// · A report without the teacher's lines per skill (sent before 805): column "TYPICAL AT A2 (CEFR) · A2 常见表现", and each row
//   starts "Typical at A2 · A2常见：" — honest reference lines, not claims about the student.
// · A report with the teacher's lines: column "WHAT THE TEACHER SAW · 试听课表现"; the CEFR line stays underneath in small grey.
// · Reports kept on the device (806) are made again with the new wording.
// · Database copy of TR-CEFR S2·A2, S3·A2, S5·A2 reworded without the non-CEFR examples (sounds, he/she, "asks questions back").
require('../tools/lib.js')(process.argv[2], [
  ["+ (extra || '') + '|v3';", "+ (extra || '') + '|v4';"],
  ["<th>WHAT THE TEACHER SAW (CEFR) · 试听课表现</th>",
   "<th>${(F.notes || []).some(Boolean) ? 'WHAT THE TEACHER SAW · 试听课表现' : 'TYPICAL AT ' + e(lv) + ' (CEFR) · ' + e(lv) + '常见表现'}</th>"],
  [": e(cd[0]) + '<br><i>' + e(cd[1]) + '</i>'}</td>",
   ": '<span class=\"tr-lvl\" style=\"display:inline;font-size:inherit\">Typical at ' + e(cd[0].match(/^(Pre-A1|A1|A2|B1|B2|C1|C2) · /) ? cd[0].split(' · ')[0] : lv) + ' · </span>' + e(cd[0].replace(/^(Pre-A1|A1|A2|B1|B2|C1|C2) · /, '')) + '<br><i>' + e((cd[0].match(/^(Pre-A1|A1|A2|B1|B2|C1|C2) · /) ? cd[0].split(' · ')[0] : lv) + '常见：' + cd[1].replace(/^(Pre-A1|A1|A2|B1|B2|C1|C2) · /, '')) + '</i>'}</td>"]
]);
