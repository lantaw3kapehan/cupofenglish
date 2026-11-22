// 2726 (Misty 22 Nov 19:23): the class note knows the homework · the book page(s) the teacher copied with "Copy for homework" in the
//   reader today (kept on this computer for 3 hours) fill "Homework given" (Workbook p. 12 · Student's Book pp. 8–9); the teacher can still change it.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`    const hw = $('epHw'); if(hw) hw.innerHTML = EP.wb != null ? '<button type="button" onclick="gxIns(\\'nH\\',\\'Workbook p. ' + (EP.wb + 1) + '\\')">Homework: Workbook p. ' + (EP.wb + 1) + '</button>' : ''; }`,
   `    const hw = $('epHw'); if(hw){ const dh = (() => { try{ const now = Date.now(), want = String(EP.book || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); let best = null;
          for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(!/^coe\\.rd\\.hw\\./.test(k)) continue; const o = JSON.parse(localStorage.getItem(k) || 'null'), bk = k.slice(10).replace(/[^A-Z0-9]/g, '');
            if(!o || now - (o.at || 0) > 3 * 3600e3) continue; const sc = (want && bk === want ? 1e13 : 0) + o.at; if(!best || sc > best.sc) best = { sc, o }; }
          if(!best) return ''; const pp = L => !L || !L.length ? '' : L.length === 1 ? 'p. ' + L[0] : (L[L.length - 1] - L[0] === L.length - 1 ? 'pp. ' + L[0] + '–' + L[L.length - 1] : 'pp. ' + L.join(', '));
          return [best.o.wb && best.o.wb.length ? 'Workbook ' + pp(best.o.wb) : '', best.o.sb && best.o.sb.length ? 'Student’s Book ' + pp(best.o.sb) : ''].filter(Boolean).join(' · '); }catch(e){ return ''; } })();
        if(dh){ hw.innerHTML = '<button type="button" onclick="(function(){var e=document.getElementById(\\'nH\\');if(e){e.value=\\'' + dh.replace(/'/g, '’') + '\\';e.dispatchEvent(new Event(\\'input\\'))}})()">Copied for homework today · ' + esc(dh) + '</button>';
          const ih = $('nH'); if(ih && !ih.value.trim() && !ih.dataset.h2726){ ih.dataset.h2726 = 1; ih.value = dh; ih.dispatchEvent(new Event('input')); } }
        else hw.innerHTML = EP.wb != null ? '<button type="button" onclick="gxIns(\\'nH\\',\\'Workbook p. ' + (EP.wb + 1) + '\\')">Homework: Workbook p. ' + (EP.wb + 1) + '</button>' : ''; } }`],
]);
