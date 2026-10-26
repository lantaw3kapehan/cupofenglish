// 1161: (Misty, 26 Oct 18:53) "Dezza's feedback, and teacher's feedback, since they will be sent separately" · "have it filled
//      in from the student's book code with that teacher".
// · Each parent report charts and compares ONLY that report teacher's own feedback, cycle by cycle. A cycle where another
//   teacher wrote the feedback is left out (that one is sent separately); with fewer than two cycles the chart and the
//   ▲/▼ comparison are not shown.
// · From the database at once (new edge function coe-fbt → SQL coe_fb_teacher): that teacher's feedback per cycle (latest save
//   wins, the app's own save or Google's copy) and the course from the calendar book; the app's class list is the fallback.
// · Course on the picture, the report window and the app PDF = the book the student takes WITH THAT TEACHER (latest class of
//   that student with that teacher in the calendar: OD1 → Oxford Discover 1, ShortVowels → Oxford Phonics · Short Vowels …).
//   Only when no class is found, the teacher's typed course is used (cleaned as in 1160).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b, n) => { const k = s.split(a).length - 1; if(k !== n) throw new Error('1161: expected ' + n + ' of ' + a + ', found ' + k); s = s.split(a).join(b); };
// 1160's per-cycle pick: keep only the report teacher's entries when the report teacher is known
rep("    var out = [];\n    Object.keys(by).sort().forEach(function(k){ var L = by[k], pick = null;",
    "    var out = [];\n    Object.keys(by).sort().forEach(function(k){ var L = by[k], pick = null;\n      if(who && !L.some(function(e){ return String(e.teacher || '').toLowerCase() === who; })) return;   /* 1161: another teacher's cycle is sent separately */", 1);
rep("    var by = {};\n    r.hist.forEach(function(e){ if(!e || !e.month) return; e.course = coeCourse(e.course);",
    "    if(who && window.__db1162 && __db1162[code + '|' + who]) r.hist = JSON.parse(JSON.stringify(__db1162[code + '|' + who]));   /* 1161: the database's own per-teacher history (coe-fbt) */\n    var by = {};\n    r.hist.forEach(function(e){ if(!e || !e.month) return; e.course = coeCourse(e.course);", 1);
rep("    r.hist = out; return r; };", "    if(who && window.__crs1161 && __crs1161[code + '|' + who]) out.forEach(function(e){ e.course = __crs1161[code + '|' + who]; });\n    r.hist = out; return r; };", 1);
// fbGet cache per code + report teacher (the cleaned history depends on the teacher)
rep("function fbGet(code){ var c = FB[code]; if(c && Date.now() - c.t < 60000) return c.p;",
    "function fbGet(code){ var fk = code + '|' + ((typeof RPD !== 'undefined' && RPD && RPD.report && RPD.report.teacher) || ''), c = FB[fk]; if(c && Date.now() - c.t < 60000) return c.p;", 1);
rep("    FB[code] = { t: Date.now(), p: p }; return p; }", "    FB[fk] = { t: Date.now(), p: p }; return p; }", 1);
// course from the book with that teacher (set before the history is cleaned)
rep("    try{ if(R && R.report && R.fb){ var x = R.report, k = x.code + '|' + x.month, r = await fbGet(x.code);",
    "    try{ if(R && R.report && R.fb){ var x = R.report, k = x.code + '|' + x.month; try{ if(window.bookFor1161) await bookFor1161(x.code, x.teacher); }catch(e1){} var r = await fbGet(x.code);", 1);
rep("      R.fb.course = coeCourse(R.fb.course || (e && e.course) || '');",
    "      var bc = window.__crs1161 && __crs1161[x.code + '|' + String(x.teacher || '').toLowerCase()]; R.fb.course = bc || coeCourse(R.fb.course || (e && e.course) || '');", 1);
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1161 · book with that teacher → course title */
(function(){
  if(window.__1161) return; window.__1161 = 1;
  window.__crs1161 = window.__crs1161 || {};
  var MAP = { OD1: 'Oxford Discover 1', OD2: 'Oxford Discover 2', OD3: 'Oxford Discover 3', OD4: 'Oxford Discover 4', OD5: 'Oxford Discover 5', OD6: 'Oxford Discover 6',
    ODF1: 'Oxford Discover Futures 1', ODF2: 'Oxford Discover Futures 2', REF: 'Reading Explorer Foundation', RE1: 'Reading Explorer 1', RE2: 'Reading Explorer 2', RE3: 'Reading Explorer 3', RE4: 'Reading Explorer 4', RE5: 'Reading Explorer 5',
    THEALPHABET: 'Oxford Phonics · The Alphabet', SHORTVOWELS: 'Oxford Phonics · Short Vowels', SHORVOWELS: 'Oxford Phonics · Short Vowels', LONGVOWELS: 'Oxford Phonics · Long Vowels',
    CONSONANTBLENDS: 'Oxford Phonics · Consonant Blends', LETTERBLENDS: 'Oxford Phonics · Letter Blends', LETTERCOMBINATIONS: 'Oxford Phonics · Letter Combinations',
    PATHWAYS1: 'Pathways 1', PATHWAYS2: 'Pathways 2', PATHWAYS3: 'Pathways 3', PATHWAYS4: 'Pathways 4',
    WONDERSGK: 'Wonders Kindergarten', WONDERSK: 'Wonders Kindergarten', WONDERSG1: 'Wonders Grade 1', WONDERS1: 'Wonders Grade 1', WONDERSG2: 'Wonders Grade 2', WONDERS2: 'Wonders Grade 2', WONDERSG3: 'Wonders Grade 3',
    DKENGLISH: 'DK English', DKENGLISHLEVEL2: 'DK English Level 2', ROALDDAHL: 'Roald Dahl', ACADEMICWRITING: 'Academic Writing', IELTSWRITING: 'IELTS Writing', IELTSSPEAKING: 'IELTS Speaking',
    IELTSUKVIGT: 'IELTS UKVI General Training', DEBATE: 'Debate', FREETALK: 'Free Talk', BUSINESSENGLISH: 'Business English' };
  window.bookTitle = function(code){ var parts = String(code || '').split(/\s*,\s*/).filter(function(p){ return p && !/^(pre[\s-]?)?[abc][12]\+?$/i.test(p); });
    var c = (parts[parts.length - 1] || '').replace(/\s+/g, ''); if(!c) return '';
    var raz = c.match(/^raz\s*([a-z]{1,2})$/i); if(raz) return 'Raz-Kids · Level ' + raz[1].charAt(0).toUpperCase() + raz[1].slice(1).toLowerCase();
    return MAP[c.toUpperCase()] || ''; };
  var ST = {};
  window.bookFor1161 = async function(code, teacher){
    var who = String(teacher || '').trim().toLowerCase(), k = code + '|' + who; if(!code || !who || (k in __crs1161)) return __crs1161[k];
    try{ var d = await fetch(FAST_URL + '-fbt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: code, teacher: teacher }) }).then(function(y){ return y.json(); });
      if(d && d.ok){ window.__db1162 = window.__db1162 || {}; if(Array.isArray(d.hist) && d.hist.length) __db1162[k] = d.hist; if(d.course){ __crs1161[k] = d.course; return d.course; } } }catch(e){}
    var p = ST[code] || (ST[code] = fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'stuClasses', token: TOKEN, code: code }) }).then(function(y){ return y.json(); }).catch(function(){ return null; }));
    var r = await p, L = (r && r.ok && Array.isArray(r.data)) ? r.data : null; if(!L) return '';
    var now = Date.now(), mine = L.filter(function(c){ return !c.cancelled && String(c.teacher || '').trim().toLowerCase() === who && c.book; }).sort(function(a, b){ return String(a.start).localeCompare(String(b.start)); });
    var past = mine.filter(function(c){ return Date.parse(c.start) <= now; }), pick = past.length ? past[past.length - 1] : mine[0];
    var t = pick ? bookTitle(pick.book) : ''; __crs1161[k] = t; return t; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
