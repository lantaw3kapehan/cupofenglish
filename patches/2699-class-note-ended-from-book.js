// 2699 (Misty 22 Nov 15:42): the class note's "Where did you end?" fills itself from the book tabs used in class:
// the unit and the page numbers printed on the last Student's Book and Workbook pages open (the reader keeps them for a few hours).
// Filled only while the line is still empty; otherwise one tap on "From the book today" uses them.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`      paint();
      if(!L){ api('tStudent', TOKEN, code)`,
   `      paint();
      try{ const now = Date.now(), want = books.map(b => String(b).toUpperCase()); let best = null;
        for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(!/^coe\\.rd\\.end\\./.test(k)) continue; const o = JSON.parse(localStorage.getItem(k) || 'null'), bk = k.slice(11);
          if(!o || now - (o.at || 0) > 4 * 3600e3) continue; const sc = (want.includes(bk) ? 1e13 : 0) + o.at; if(!best || sc > best.sc) best = { sc, bk, o }; }
        if(best && (want.length === 0 || want.includes(best.bk) || now - best.o.at < 90 * 6e4)){ const o = best.o, sb = o.sb || {}, wb = o.wb || {}, fresh = x => x && x.at && now - x.at < 4 * 3600e3;
          const R0 = { unit: fresh(sb) && sb.u != null ? sb.u : fresh(wb) && wb.u != null ? wb.u : null, sb: fresh(sb) ? sb.p : null, wb: fresh(wb) ? wb.p : null };
          if(R0.unit != null || R0.sb != null || R0.wb != null){
            const lab = [R0.unit != null ? 'Unit ' + R0.unit : '', R0.sb != null ? 'SB p. ' + R0.sb : '', R0.wb != null ? 'WB p. ' + R0.wb : ''].filter(Boolean).join(' · ');
            window.epBook2699 = () => { if(!EP) return; ['unit', 'sb', 'wb'].forEach(k => { if(R0[k] != null) EP[k] = R0[k]; }); compose(); };
            $('epBox').insertAdjacentHTML('afterbegin', '<div class="gx-c" style="margin-bottom:6px"><button type="button" onclick="epBook2699()">From the book today · ' + esc(lab) + '</button></div>');
            if(!cur) window.epBook2699(); } } }catch(e){}
      if(!L){ api('tStudent', TOKEN, code)`],
]);
