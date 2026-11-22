// 2729 (Misty 22 Nov 19:56): a book opened from a class card or a student page also gets the student's code, so the reader saves
//   where the class ended and the homework page with that student (coe-hw "where"), for any teacher (subs too).
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`      if(nm && !/^ST-/.test(nm)) window._bkStu2407 = { name: nm, t: Date.now() }; }catch(e){} }, true);`,
   `      let cd29 = ''; try{ if(typeof STU !== 'undefined' && STU && STU.s && ev.target.closest('#sheetBody, #v-student')) cd29 = STU.s.code || ''; if(!cd29){ let el = ev.target; for(let i = 0; i < 8 && el && el !== document.body; i++, el = el.parentElement){ const m = String(el.textContent || '').match(/ST-\\d{4}-\\d{3}/g); if(m && m.length){ if(new Set(m).size === 1) cd29 = m[0].toUpperCase(); break; } } } }catch(e){}
      if(nm && !/^ST-/.test(nm)) window._bkStu2407 = { name: nm, code: cd29, t: Date.now() }; }catch(e){} }, true);`],
  [`    try{ const cx = window._bkStu2407; if(cx && Date.now() - cx.t < 15 * 6e4 && cx.name) q.set('s', cx.name); }catch(e){}   /* 2407 */`,
   `    try{ const cx = window._bkStu2407; if(cx && Date.now() - cx.t < 15 * 6e4 && cx.name){ q.set('s', cx.name); if(cx.code) q.set('code', cx.code); } }catch(e){}   /* 2407 · 2729 */`],
]);
// 2729b · the class note also reads what the reader saved with the student today (any computer, any teacher): "From the book today"
//   and the homework page(s), when this computer has nothing of its own.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`            if(!cur) window.epBook2699(); } } }catch(e){}`,
   `            if(!cur) window.epBook2699(); } } }catch(e){}
      try{ if(!window.__w2729busy && TOKEN && /^ST-\\d{4}-\\d{3}$/.test(code)){ window.__w2729busy = 1; const box0 = $('epBox');
        fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-hw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'whereGet', token: TOKEN, code }) }).then(r => r.json()).then(x => { window.__w2729busy = 0;
          const box = $('epBox'); if(!x || !x.ok || !box || box !== box0) return; const today = D.today, R = (x.rows || []).filter(r => r.day === today);
          const end = k => R.find(r => r.what === 'end' && r.kind === k), hw = k => R.find(r => r.what === 'hw' && r.kind === k);
          if(!box.querySelector('[onclick="epBook2699()"]')){ const sb = end('sb'), wb = end('wb'), R0 = { unit: (sb && sb.unit) != null ? sb.unit : (wb && wb.unit) != null ? wb.unit : null, sb: sb ? sb.page : null, wb: wb ? wb.page : null };
            if(R0.unit != null || R0.sb != null || R0.wb != null){ const lab = [R0.unit != null ? 'Unit ' + R0.unit : '', R0.sb != null ? 'SB p. ' + R0.sb : '', R0.wb != null ? 'WB p. ' + R0.wb : ''].filter(Boolean).join(' · ');
              window.epBook2699 = () => { if(!EP) return; ['unit', 'sb', 'wb'].forEach(k => { if(R0[k] != null) EP[k] = R0[k]; }); compose(); };
              box.insertAdjacentHTML('afterbegin', '<div class="gx-c" style="margin-bottom:6px"><button type="button" onclick="epBook2699()">From the book today · ' + esc(lab) + '</button></div>');
              const e0 = $('nE'); if(e0 && !e0.value.trim()) window.epBook2699(); } }
          const ih = $('nH'), hs = hw('sb'), hwb = hw('wb'); if(ih && !ih.value.trim() && (hs || hwb)){ const pp = r => { const L = (r.pages && r.pages.length ? r.pages : [r.page]).filter(v => v != null); return !L.length ? '' : L.length === 1 ? 'p. ' + L[0] : (L[L.length - 1] - L[0] === L.length - 1 ? 'pp. ' + L[0] + '–' + L[L.length - 1] : 'pp. ' + L.join(', ')); };
            const t = [hwb ? 'Workbook ' + pp(hwb) : '', hs ? 'Student’s Book ' + pp(hs) : ''].filter(s => s && !/ $/.test(s)).join(' · '); if(t){ ih.value = t; ih.dispatchEvent(new Event('input')); } } }).catch(() => { window.__w2729busy = 0; }); } }catch(e){ window.__w2729busy = 0; }`],
]);
