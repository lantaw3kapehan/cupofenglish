// 1682: (Misty, 1 Nov 10:22) "For Yoyo, when I enrolled her the +3 is not showing. It should be in sync with all, especially the
//   payment confirmation." Payment Confirmation 1753 (Yoyo, 30 lessons + 3 bonus) was made from Finance › Add sale. The confirmation
//   adds the package's free lessons by itself, but the Add sale form's Free lessons box stayed empty, so SALES got 30 + 0 and the
//   package (ACTIVE = SALES C + D) showed 30.
//   Now, when a confirmation is issued, the form it came from takes the same numbers: lessons = the main line's quantity, free =
//   the Bonus line's quantity (0 if none). Add sale: Package / Free lessons boxes. Enrolled · paid and Renewed · paid: the package
//   choice (a matching button, or Other with the two numbers). A toast says what was set.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  S.blob = blob; const att = attach(S.ctx, inv, blob);",
   "  S.blob = blob; const att = attach(S.ctx, inv, blob); try{ syncNums1682(S.ctx, inv); }catch(x){ console.warn('1682', x); }"],
  ["function attach(c, inv, blob){",
   "/* 1682 · the form the confirmation came from takes its lessons + free lessons */\n" +
   "function syncNums1682(c, inv){ const L = (inv && inv.items) || []; if(!L.length || !c) return;\n" +
   "  const bonus = L.filter(x => x.pcode === 'BONUS').reduce((a, x) => a + (+x.qty || 0), 0), main = L.find(x => x.pcode !== 'BONUS' && +x.rate > 0) || L.find(x => x.pcode !== 'BONUS'); if(!main) return;\n" +
   "  const pkg = +main.qty || 0, q = id => document.getElementById(id), set = (id, v) => { const el = q(id); if(el){ el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } };\n" +
   "  if(c.kind === 'sale'){ if(q('fP')) set('fP', pkg); if(q('fF')) set('fF', bonus); }\n" +
   "  else if(c.kind === 'en' && typeof ENS !== 'undefined' && ENS && window.enPk){ const b = [...document.querySelectorAll('.enk')].find(x => +x.dataset.p === pkg && +x.dataset.f === bonus);\n" +
   "    if(b) enPk(pkg, bonus); else { enPk(-1, -1); if(q('enOp')) set('enOp', pkg); if(q('enOf')) set('enOf', bonus); } }\n" +
   "  else if(c.kind === 'rp' && typeof RPS !== 'undefined' && RPS && typeof rpPick === 'function'){ RPS.touched = true;\n" +
   "    if(typeof RP_PK !== 'undefined' && RP_PK.some(x => x[0] === pkg && x[1] === bonus)) rpPick(pkg, bonus); else if(typeof rpOther === 'function'){ rpOther(); const I = document.querySelectorAll('#rpO input'); if(I[0]){ I[0].value = pkg; I[0].dispatchEvent(new Event('input', { bubbles: true })); } if(I[1]){ I[1].value = bonus; I[1].dispatchEvent(new Event('input', { bubbles: true })); } RPS.pkg = pkg; RPS.free = bonus; } }\n" +
   "  else return;\n" +
   "  try{ tst('Form set to the confirmation · ' + pkg + (bonus ? ' + ' + bonus + ' free' : '') + ' lessons'); }catch(x){} }\n" +
   "function attach(c, inv, blob){"]
]);
