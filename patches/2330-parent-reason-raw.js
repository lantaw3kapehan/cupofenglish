// 2330 (Misty 18 Nov): a parent's own reason written in English is shown exactly as the parent wrote it, with no Chinese translation
// (raw and real, no misrepresentation). A parent's Chinese reason stays as written (2154). Reasons from CupOfEnglish / a teacher are still translated.
const file = process.argv[2];
const inc = `<script id="b2330">
/* 18 Nov · 2330 · the parent's own English reason: no translation */
window.cxRaw2330 = function(P){ try{ const w = String((P && P.why) || ''); if(!w || /[\\u3400-\\u9fff]/.test(w)) return false;
  let k = (typeof cxWho2293 === 'function') ? cxWho2293(w).k : ''; if(!k && P.e && /parent|student/i.test(String(P.e.by || ''))) k = 'parent';
  return k === 'parent'; }catch(e){ return false; } };
</script>
`;
require('../tools/lib.js')(file, [
['<script id="b2278">', inc + '<script id="b2278">'],
["function cxAutoZh(){ const P = CXP; if(!P || !P.why || P.zh || P.zhEdit || P.kind === 'class' || P.kind === 'bal') return;",
 "function cxAutoZh(){ const P = CXP; if(!P || !P.why || P.zh || P.zhEdit || P.kind === 'class' || P.kind === 'bal') return; if(window.cxRaw2330 && cxRaw2330(P)){ const z = $('cxZh'); if(z && !z.value) z.placeholder = 'The parent wrote this in English, so it is shown as written.'; return; }   /* 2330 */"]
]);
