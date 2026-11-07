// 1861: (Misty 7 Nov "yes add" — topic sets so students do not all get the same topics) KET and PET each have topic sets A, B and C
//   (same Cambridge format and marking). A new assessment gets one by turn; the teacher can switch at the top ("Topic set A B C").
//   Her screen, her writing page and the review follow the set. Picture: "KET / PET Assessment" pill, only the scored writing part.
const fs = require('fs'), path = require('path');
const lib = require('../tools/lib.js'), file = process.argv[2];
const SETS = fs.readFileSync(path.join(__dirname, '1861-sets.inc.js'), 'utf8');
lib(file, [
  ["  const CAMX = () => S.a && S.a.exam && CAM[S.a.exam] ? CAM[S.a.exam] : null;",
   SETS + "  const setOf = a => { const v = String(((a || {}).notes || {}).set || ''); if(/^[0-2]$/.test(v)) return +v; let h = 0; String((a || {}).id || '').split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return h % 3; };\n"
   + "  const CAMX = () => { if(!(S.a && S.a.exam && CAM[S.a.exam])) return null; const X = CAM[S.a.exam], n = setOf(S.a), st = SETS[S.a.exam][n]; return Object.assign({}, X, st || {}, { set: n }); };"],
  [".join('') + '</div>'; };\n  function setExam(x){",
   ".join('') + (CAMX() ? '<span class=\"as-m\" style=\"margin:0 0 0 12px\">Topic set</span>' + [0, 1, 2].map(n => '<button class=\"btn sm ' + (CAMX().set === n ? 'teal' : 'ghost') + '\" onclick=\"as1778.tset(' + n + ')\">' + 'ABC'[n] + '</button>').join('') : '') + '</div>'; };\n"
   + "  function tSet(n){ if(!S.a || !CAMX() || CAMX().set === n) return; if(S.a.essay_started_at && !confirm('She has already started writing on set ' + 'ABC'[CAMX().set] + '. Change the topic set anyway?')) return; put('notes.set', String(n)); flush(); paint(); }\n  function setExam(x){"],
  ["clearTimers(); xm();", "clearTimers(); xm(); try{ if(CAMX() && !/^[0-2]$/.test(String((a.notes || {}).set || ''))) put('notes.set', String(CAMX().set)); }catch(e){}"],
  ["window.as1778 = { exam: setExam,", "window.as1778 = { exam: setExam, tset: tSet,"],
  ["const pill = 'English Assessment';", "const pill = CAMX() ? CAMX().name + ' Assessment' : 'English Assessment';"],
  ["const bars = (title, C, v, top) => { c.fillStyle = NAVY;", "const bars = (title, C, v, top) => { if(CAMX()) C = C.filter(x => v[x[0]] != null).map(x => [x[0], x[1].replace('Communicative Achievement', 'Comm. Achievement')]); c.fillStyle = NAVY;"]]);
