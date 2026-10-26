# Paste (optional tidy-up) · 26 Oct · FEEDBACK DATA course names cleaned on the sheet

**Not needed for the app.** Since release 1161 the app takes the course for parent reports from the database
(SQL `coe_fb_teacher` → edge function `coe-fbt`): the book the student takes **with that teacher** in the calendar
(OD1 → Oxford Discover 1, ShortVowels → Oxford Phonics · Short Vowels …), at once after the teacher submits. This paste only
tidies the Google sheet itself so the typed course column reads the same (e.g. "OXFORD DISCOVERY 1" / "OXFORD SISCOVER 2" /
"READING EXPLORER DOUNDATION" → "Oxford Discover 1" / "Oxford Discover 2" / "Reading Explorer Foundation").

**Where:** ACADEMIC PERFORMANCE & QUALITY MANAGEMENT SYSTEM spreadsheet → Extensions › Apps Script → **StudentReport.gs**
(the file with the earlier month paste) → very bottom.

```javascript
// 26 Oct · FEEDBACK DATA › COURSE: one clean name per course (typos fixed). Preview first; safe to paste once.
function fbCourse26_(s) {
  var t = String(s == null ? '' : s).trim(); if (!t) return t;
  var u = t.toUpperCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').replace(/\bSISCOVER/g, 'DISCOVER').replace(/\bDISCOVERY\b/g, 'DISCOVER').replace(/\bDOUNDATION\b/g, 'FOUNDATION'), m;
  if ((m = u.match(/OXFORD DISCOVER\s*-?\s*(\d)?/))) return 'Oxford Discover' + (m[1] ? ' ' + m[1] : '');
  var ph = /SHORT VOWEL/.test(u) ? 'Short Vowels' : /LONG VOWEL/.test(u) ? 'Long Vowels' : /ALPHABET/.test(u) ? 'The Alphabet' : /CONSONANT/.test(u) ? 'Consonant Blends' : /LETTER COMB/.test(u) ? 'Letter Combinations' : '';
  if (/PHONICS/.test(u) || (ph && /^(THE )?(SHORT VOWELS?|LONG VOWELS?|ALPHABET|CONSONANT BLENDS?|LETTER COMBINATIONS?)$/.test(u))) return 'Oxford Phonics' + (ph ? ' · ' + ph : '');
  if (/READING EXPLORER/.test(u)) { m = u.match(/READING EXPLORER\s*-?\s*(FOUNDATION|\d)?/); return 'Reading Explorer' + (m && m[1] ? ' ' + (m[1] === 'FOUNDATION' ? 'Foundation' : m[1]) : ''); }
  if (/\bRAZ\b/.test(u)) { m = t.match(/LEVEL\s*([A-Za-z]{1,2})\b/i) || t.match(/RAZ\s+(?!KIDS)([A-Za-z]{1,2})\b/i); return 'Raz-Kids' + (m ? ' · Level ' + m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : ''); }
  if (/WONDERS/.test(u)) { if (/\bG?K\b/.test(u.replace(/.*WONDERS/, ''))) return 'Wonders Kindergarten'; m = u.match(/WONDERS\s*G?(\d)/); return 'Wonders' + (m ? ' Grade ' + m[1] : ''); }
  if ((m = u.match(/^PATHWAYS\s*(\d)/))) return 'Pathways ' + m[1];
  if (/ACADEMIC WRITING/.test(u)) return /READING/.test(u) ? 'Academic Writing and Reading' : 'Academic Writing';
  return u.split(' ').map(function (w) { return /^(IELTS|DK|KET|PET|TOEFL)$/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase(); }).join(' ').replace(/\bAnd\b/g, 'and');
}
function fbCourseRun26_(write) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FEEDBACK DATA'); if (!sh) throw new Error('FEEDBACK DATA not found');
  var v = sh.getDataRange().getValues(), hr = -1, col = -1;
  for (var r = 0; r < Math.min(10, v.length) && col < 0; r++) for (var c = 0; c < v[r].length; c++) if (/^\s*COURSE\s*$/i.test(String(v[r][c]))) { hr = r; col = c; break; }
  if (col < 0) throw new Error('No COURSE header found in the first 10 rows — nothing changed.');
  var changes = [];
  for (var i = hr + 1; i < v.length; i++) { var a = String(v[i][col] || ''), b = fbCourse26_(a); if (a && b !== a) { changes.push('row ' + (i + 1) + ': ' + a + ' → ' + b); if (write) sh.getRange(i + 1, col + 1).setValue(b); } }
  return changes;
}
/** Preview only: lists what would change. Writes nothing. */
function zzFbCoursePreview26() { var c = fbCourseRun26_(false); console.log(c.length + ' change(s)\n' + c.join('\n')); }
/** Writes the clean names once. */
function zzFbCourseApply26() { var c = fbCourseRun26_(true); console.log(c.length + ' change(s) written'); }
```

## Steps
1. Paste at the very bottom of StudentReport.gs, save (Cmd+S).
2. Choose **zzFbCoursePreview26** → Run. It only lists "row N: OLD → New". Send the log to Claude if anything looks wrong.
3. If right, run **zzFbCourseApply26** once. No Deploy needed.

Teachers can still type freely in their tabs; the app ignores the typed course whenever the calendar book is known.
**Undo:** delete the block and save (cells already rewritten keep the clean name; the original typos are listed in the preview log).
