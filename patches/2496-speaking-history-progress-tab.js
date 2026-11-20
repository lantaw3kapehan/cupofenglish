// 2496: the Speaking history card belongs to the student's Progress tab (next to Teacher feedback) and follows the tabs.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function place(code){ const box = document.getElementById('stuSpk'), R = C[code]; if(!box) return; if(!R || !R.length){ box.remove(); return; } box.innerHTML = html(R); }",
   "function sync(){ const box = document.getElementById('stuSpk'); if(!box) return; const fb = [...document.querySelectorAll('section.sec h2')].find(h => /^Teacher feedback/.test(h.textContent || '')), s = fb && fb.closest('section'); box.dataset.stab = (s && s.dataset.stab) || 'pr'; if(s) box.classList.toggle('stu-hide', s.classList.contains('stu-hide')); }\n  function place(code){ const box = document.getElementById('stuSpk'), R = C[code]; if(!box) return; if(!R || !R.length){ box.remove(); return; } box.innerHTML = html(R); sync(); }"],
  ["anchor.insertAdjacentHTML('afterend', '<section class=\"sec sp2495\" id=\"stuSpk\"></section>');",
   "anchor.insertAdjacentHTML('afterend', '<section class=\"sec sp2495\" id=\"stuSpk\" data-stab=\"pr\"></section>');"],
  ["  const pl0 = place; place = function(code){ const b = document.getElementById('stuSpk'); if(b) b.style.display = ''; pl0(code); };",
   "  const pl0 = place; place = function(code){ const b = document.getElementById('stuSpk'); if(b) b.style.display = ''; pl0(code); };\n  const tb = window.stuTab; if(typeof tb === 'function') window.stuTab = function(){ const r = tb.apply(this, arguments); try{ sync(); }catch(x){} return r; };"]
]);
