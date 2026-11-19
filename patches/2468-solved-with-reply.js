// 2468 (Misty 18:58 "yes, do what is best-fitting") · President's Solved on a problem Celine found opens a small reply line first:
//   "What was done? (optional · Celine sees it)" with Send · Solved / Cancel. Her Ops Desk shows the reply under "Solved by Management".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.psol2453 = function(id, el){ if(el){ el.disabled = true; el.textContent = 'Saving…'; }   /* 2453 */",
   "window.psol2453 = function(id, el){ var row = el && el.closest('.pr');   /* 2468: ask for a short reply first */\n" +
   "    if(row && !el.__go){ if(row.querySelector('.rp2468')) return; var w = document.createElement('div'); w.className = 'rp2468'; w.style.cssText = 'grid-column:2/-1;display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px';\n" +
   "      w.innerHTML = '<input type=\"text\" maxlength=\"300\" placeholder=\"What was done? (optional · Celine sees it)\" style=\"flex:1;min-width:220px;min-height:36px;border-radius:10px;border:1px solid #DDD9E8;padding:0 10px;font:inherit\"><button class=\"btn teal sm\" type=\"button\">Send · Solved</button><button class=\"btn ghost sm\" type=\"button\">Cancel</button>';\n" +
   "      row.appendChild(w); el.style.display = 'none'; var inp = w.querySelector('input'), b = w.querySelectorAll('button'); inp.focus();\n" +
   "      var go = function(){ el.__go = 1; el.__note = inp.value.trim(); b[0].disabled = true; b[0].textContent = 'Saving…'; window.psol2453(id, el); };\n" +
   "      b[0].onclick = go; inp.onkeydown = function(e){ if(e.key === 'Enter') go(); if(e.key === 'Escape') b[1].onclick(); }; b[1].onclick = function(){ w.remove(); el.style.display = ''; }; return; }\n" +
   "    if(el){ el.disabled = true; el.textContent = 'Saving…'; }   /* 2453 */"],
  ["call({ op: 'resolve', lid: id, who: (PD && PD.who) || '' })", "call({ op: 'resolve', lid: id, who: (PD && PD.who) || '', note: (el && el.__note) || '' })"],
  ["if(!r || !r.ok){ if(el){ el.disabled = false; el.textContent = 'Solved'; }", "if(!r || !r.ok){ if(el){ el.__go = 0; el.disabled = false; el.textContent = 'Solved'; el.style.display = ''; var w0 = el.closest('.pr') && el.closest('.pr').querySelector('.rp2468'); if(w0) w0.remove(); }"],
  ["pload(true); }).catch(function(){ if(el){ el.disabled = false; el.textContent = 'Solved'; } say('Not saved. Try again.'); }); };", "pload(true); }).catch(function(){ if(el){ el.__go = 0; el.disabled = false; el.textContent = 'Solved'; el.style.display = ''; var w1 = el.closest('.pr') && el.closest('.pr').querySelector('.rp2468'); if(w1) w1.remove(); } say('Not saved. Try again.'); }); };"],
  ["function ppaint(){ if(!pres()) return; var v = document.getElementById('v-home'); if(!v) return; var H = phtml();", "function ppaint(){ if(!pres()) return; var v = document.getElementById('v-home'); if(!v) return; if(document.querySelector('#pd2360 .rp2468')) return;   /* 2468: never redraw while a reply is being written */ var H = phtml();"],
  [".p2452 .pr{grid-template-columns:48px 1fr auto!important;align-items:start}", ".p2452 .pr{grid-template-columns:48px 1fr auto!important;align-items:start}.p2452 .pr .rp2468 input:focus{outline:2px solid #9AD3D6;outline-offset:1px}"]
]);
