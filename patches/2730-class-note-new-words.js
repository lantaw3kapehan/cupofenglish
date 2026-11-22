// 2730 (Misty 22 Nov 20:13): Translate in class · the words the teacher marked "Add to notes" / "Add to homework" in the Translate card
//   (books, board, writing, check homework, Speaking Activities; kept on this computer as coe.tr.day) come into this class's note:
//   "Plan for next class" gets "Review new words: migrate (迁徙), desert (沙漠)" and "Homework given" gets "New words: migrate, desert".
//   Only words from this class's time (from coe.today.cls; else the last 90 minutes). The teacher can still change both.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`      const h1 = $('nH'); if(h1 && !$('epHw')) h1.insertAdjacentHTML('afterend', '<div class="gx-c" id="epHw"></div>');`,
   `      const h1 = $('nH'); if(h1 && !$('epHw')) h1.insertAdjacentHTML('afterend', '<div class="gx-c" id="epHw"></div>');
      setTimeout(() => { try{ const o = JSON.parse(localStorage.getItem('coe.tr.day') || 'null'); if(!o || !Array.isArray(o.L) || !o.L.length) return;
          const now = Date.now(); let a = now - 90 * 6e4, b = now + 6e4;
          try{ const T = JSON.parse(localStorage.getItem('coe.today.cls') || 'null'), c = ((T && T.cls) || []).filter(x => x[3] === code).sort((p, q) => Math.abs(now - p[0]) - Math.abs(now - q[0]))[0]; if(c){ a = c[0] - 10 * 6e4; b = c[1] + 40 * 6e4; } }catch(e){}
          const L = o.L.filter(x => x.at >= a && x.at <= b), nw = L.filter(x => x.n), hw = L.filter(x => x.h);
          const nN = $('nN'); if(nW2730(nN, nw)){ const t = 'Review new words: ' + nw.map(x => x.w + (x.zh ? ' (' + x.zh.split(/[，,]/)[0] + ')' : '')).join(', '); nN.value = nN.value.trim() ? nN.value.trim() + '\\n' + t : t; nN.dispatchEvent(new Event('input')); }
          const nH = $('nH'), nH0 = $('nNoH'); if(nW2730(nH, hw) && !(nH0 && nH0.checked)){ const t = 'New words: ' + hw.map(x => x.w).join(', '); nH.value = nH.value.trim() ? nH.value.trim() + ' · ' + t : t; nH.dispatchEvent(new Event('input')); }
        }catch(e){} }, 450);`],
  [`function noteSheet(code, eventId, day){`,
   `function nW2730(el, L){ if(!el || !L.length || el.dataset.w2730) return false; el.dataset.w2730 = 1; const v = el.value.toLowerCase(); return !L.every(x => v.includes(x.w.toLowerCase())); }
function noteSheet(code, eventId, day){`],
]);
