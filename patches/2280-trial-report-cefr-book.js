// 2280 (Misty 16 Nov 19:36, Lehan): the trial report showed A1 and Oxford Discover 1 although Management had set Pre-A1, and the trial
// was booked with Short Vowels. Server (coe-mgmt v44): the report now finds the newest trial rows (Management's CEFR change is used) and
// returns the trial class's book. Here: when the report's level starts with phonics (Pre-A1) and the trial was booked with an Oxford
// Phonics level, the starting point and the roadmap name that exact book ("Oxford Phonics World 2 · Short Vowels").
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["return { student: t.student, cn: t.cn", "return { book: String(r.book || ''), student: t.student, cn: t.cn"],
 ["const lv = F.cefr, p = path(lv, F.group) || [], nx = LV[LV.indexOf(lv) + 1];", "const lv = F.cefr, p = bookPath(path(lv, F.group) || [], F), nx = LV[LV.indexOf(lv) + 1];"],
 ["  function can(k, lv){ const r = (TB.cefr || []).find(x => x[0] === k + '|' + lv); return r ? [r[3], r[4]] : ['', '']; }\n  function pages(F){", `  function can(k, lv){ const r = (TB.cefr || []).find(x => x[0] === k + '|' + lv); return r ? [r[3], r[4]] : ['', '']; }
  /* 2280: the trial's own phonics book named in the starting point and the roadmap */
  const OPW = { thealphabet: [1, 'The Alphabet', '字母'], shortvowels: [2, 'Short Vowels', '短元音'], shorvowels: [2, 'Short Vowels', '短元音'], longvowels: [3, 'Long Vowels', '长元音'],
    consonantblends: [4, 'Consonant Blends', '辅音组合'], letterblends: [5, 'Letter Combinations', '字母组合'], lettercombination: [5, 'Letter Combinations', '字母组合'], lettercombinations: [5, 'Letter Combinations', '字母组合'] };
  function bookPath(p, F){ try{ const k = String(F.book || '').toLowerCase().replace(/[^a-z0-9]/g, ''), b = OPW[k]; if(!b || !p.length || !/phonics/i.test(String(p[5] || ''))) return p;
      const q = p.slice(), en = 'Oxford Phonics World ' + b[0] + ' · ' + b[1], zh = '《牛津自然拼读》' + b[0] + '级 · ' + b[2];
      q[5] = en + ' — ' + (String(p[5]).split(' — ')[1] || 'sound-by-sound phonics, so your child can read new words independently');
      q[6] = zh + '——' + (String(p[6] || '').split('——')[1] || '系统掌握字母与发音规律，让孩子见词能读、独立阅读');
      q[7] = String(p[7] || '').replace(/Phonics\\s*\\(OPW 1–3\\)/, 'Phonics (from OPW ' + b[0] + ' · ' + b[1] + ')');
      q[8] = String(p[8] || '').replace(/（OPW 1–3级）/, '（从' + b[0] + '级 · ' + b[2] + '开始）');
      return q; }catch(e){ return p; } }
  function pages(F){`],
]);
