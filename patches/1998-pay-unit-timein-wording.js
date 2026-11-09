// 1998: (Misty 9 Nov 15:25 teacher-side follow-up)
//   · Pay wording: the same rate was "₱200/lesson" in the header and Pay, "₱200 per class" on Growth. Pay is per unit (checked on every class
//     since 1 Oct: 1,292 classes of 25 min = 0.5 unit, 197 of 50 min = 1 unit). One term everywhere now: "₱200/unit", and Pay and Growth
//     explain it: 1 unit = a 50-minute class, a 25-minute class = 0.5 unit, pay = units × rate.
//   · Time-in before it opens: the class card said "Time in from 17:20" and a teal "Time in (first class)" button that only showed
//     instructions. Now the card says "Time in opens 17:20" (the same words as the header), and the button says what it does: before the
//     window "How time-in works" (instructions, outlined), once open "Time in now" (records attendance, teal).
//   · A teacher sent to a management screen lands on Today with a short message (1997 sent them there silently).
//   · Overview › Packages: the total of students is shown again beside "students with a package" (1996 lost the number).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["esc([me.rank, me.rate ? peso(me.rate)+'/lesson'", "esc([me.rank, me.rate ? peso(me.rate)+'/unit'"],
  ["D.me.rate ? peso(D.me.rate) + '/lesson'", "D.me.rate ? peso(D.me.rate) + '/unit'"],
  ["Sub ${me.nowSub||0} · ${peso(me.rate)}/lesson<", "Sub ${me.nowSub||0} · ${peso(me.rate)}/unit<"],
  ['<span class="num">${peso(me.rate)}/lesson<', '<span class="num">${peso(me.rate)}/unit<'],
  ["me.rate?peso(me.rate)+'/lesson'", "me.rate?peso(me.rate)+'/unit'"],
  ["m.rate?peso(m.rate)+'/lesson'", "m.rate?peso(m.rate)+'/unit'"],
  ["esc([me.rate ? peso(me.rate) + '/lesson'", "esc([me.rate ? peso(me.rate) + '/unit'"],
  ["${esc(peso(me.rate))}/lesson<", "${esc(peso(me.rate))}/unit<"],
  ["${c.rate?' · '+peso(c.rate)+' per class':''}", "${c.rate?' · '+peso(c.rate)+'/unit':''}"],
  ["pill(inSt, inSt === 'l' && isFirst ? 'Time in from ' + tiOp :", "pill(inSt, inSt === 'l' && isFirst ? 'Time in opens ' + tiOp :"],
  [": `<button class=\"btn teal sm\" style=\"margin:8px 0 0 6px\" onclick=\"timeInSheet()\">Time in (first class)</button>`;",
   ": (Date.now() < new Date(c.start).getTime() - 40 * 6e4 ? `<button class=\"btn ghost sm\" style=\"margin:8px 0 0 6px\" title=\"Time in opens ${tm(new Date(new Date(c.start).getTime() - 40 * 6e4).toISOString())} · this shows how it works\" onclick=\"timeInSheet()\">How time-in works</button>` : `<button class=\"btn teal sm\" style=\"margin:8px 0 0 6px\" title=\"Records your time-in for today\" onclick=\"timeInSheet()\">Time in now</button>`);   /* 1998 */"],
  ["if(typeof D !== 'undefined' && D && !D.mgr && MGMT_ONLY1997.test(String(v || ''))) v = 'today';",
   "if(typeof D !== 'undefined' && D && !D.mgr && MGMT_ONLY1997.test(String(v || ''))){ v = 'today'; try{ setTimeout(() => toast('That screen is for management · here is your Today'), 50); }catch(e){} }"],
  ["if(/^per student · lessons left/.test(t) && box){",
   "if(/^(per student · lessons left|students with a package)/.test(t) && !/^\\d/.test(t)){ const xc = sp.closest('.x-c'); const n1998 = xc ? [...xc.querySelectorAll('.x-lg > span > b')].reduce((a, b) => a + (parseInt((b.textContent || '').replace(/[^\\d]/g, ''), 10) || 0), 0) : 0; if(n1998){ const tx1998 = n1998 + ' students with a package · lessons left'; if(sp.textContent !== tx1998) sp.textContent = tx1998; } }\n      if(false){"],
  ["function plParse1995(t){",
   "/* 1998 · Pay and Growth explain the unit */\n(function(){ function put(){ try{ if(typeof D === 'undefined' || !D || D.mgr || !D.me) return; const rate = D.me.rate ? peso(D.me.rate) : '';\n    const tx = 'Pay is per unit · 1 unit = a 50-minute class · a 25-minute class = 0.5 unit · trial and substitute classes count the same way · pay = units × ' + (rate ? rate + ' (your rate per unit)' : 'your rate per unit') + '.';\n    ['v-pay', 'v-growth'].forEach(id => { const v = document.getElementById(id); if(!v || !v.childElementCount) return; let e = v.querySelector('.unit1998'); if(!e){ e = document.createElement('div'); e.className = 'unit1998 small mute'; e.style.cssText = 'margin:6px 0 10px;line-height:1.45';\n      const h = v.querySelector('h1, .lead, .sec h2'); if(h && h.parentNode) h.parentNode.insertBefore(e, h.nextSibling); else v.insertBefore(e, v.firstChild); } if(e.textContent !== tx) e.textContent = tx; }); }catch(e){} }\n  let q = 0; const later = () => { clearTimeout(q); q = setTimeout(put, 150); };\n  const start = () => { ['v-pay', 'v-growth'].forEach(id => { const v = document.getElementById(id); if(v) new MutationObserver(later).observe(v, { childList: true }); }); later(); };\n  if(document.readyState === 'complete') setTimeout(start, 500); else window.addEventListener('load', () => setTimeout(start, 500));\n})();\nfunction plParse1995(t){"],
]);
