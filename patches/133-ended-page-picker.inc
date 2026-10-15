(function(){
  const num = (re, s) => { const m = re.exec(String(s || '')); return m ? +m[1] : null; };
  const parse = s => { s = String(s || ''); const wb = num(/(?:WB|work\s*book)\s*(?:p\.?|page)?\s*(\d+)/i, s);
    const sb = num(/(?:SB|student'?s?\s*book)\s*(?:p\.?|page)?\s*(\d+)/i, s) ?? num(/(?:^|[^A-Za-z])(?:p\.?|page)\s*(\d+)/i, s.replace(/(?:WB|work\s*book)\s*(?:p\.?|page)?\s*\d+/ig, ''));
    return { unit: num(/unit\s*(\d+)/i, s), sb, wb, book: (s.split(' · ')[0] || '').trim() }; };
  let EP = null;
  function compose(){ if(!EP) return; const p = [EP.book || 'Book']; if(EP.unit != null) p.push('Unit ' + EP.unit); if(EP.sb != null) p.push('SB p. ' + EP.sb); if(EP.wb != null) p.push('WB p. ' + EP.wb);
    const e = $('nE'); if(e){ e.value = p.join(' · '); e.dispatchEvent(new Event('input', { bubbles: true })); } paint(); }
  function step(k, label){ const v = EP[k];
    return '<div class="ep-s"><span class="small"><b>' + label + '</b></span><div class="ep-r"><button type="button" onclick="epAdd(\'' + k + '\',-1)">−</button><input type="number" inputmode="numeric" min="0" value="' + (v == null ? '' : v) + '" placeholder="—" oninput="epSet(\'' + k + '\',this.value)"><button type="button" onclick="epAdd(\'' + k + '\',1)">+</button></div></div>'; }
  function paint(){ const box = $('epBox'); if(!box || !EP) return;
    box.querySelector('.ep-g').innerHTML = step('unit', 'Unit') + step('sb', 'Book page') + step('wb', 'Workbook page');
    box.querySelectorAll('[data-bk]').forEach(b => b.classList.toggle('on', b.dataset.bk === EP.book));
    const hw = $('epHw'); if(hw) hw.innerHTML = EP.wb != null ? '<button type="button" onclick="gxIns(\'nH\',\'Workbook p. ' + (EP.wb + 1) + '\')">Homework: Workbook p. ' + (EP.wb + 1) + '</button>' : ''; }
  window.epAdd = (k, d) => { if(!EP) return; const v = EP[k] == null ? (EP.last && EP.last[k] != null ? EP.last[k] : 0) : EP[k]; EP[k] = Math.max(0, v + d); compose(); };
  window.epSet = (k, v) => { if(!EP) return; EP[k] = v === '' ? null : Math.max(0, +v || 0); const p = [EP.book || 'Book']; if(EP.unit != null) p.push('Unit ' + EP.unit); if(EP.sb != null) p.push('SB p. ' + EP.sb); if(EP.wb != null) p.push('WB p. ' + EP.wb); const e = $('nE'); if(e){ e.value = p.join(' · '); e.dispatchEvent(new Event('input', { bubbles: true })); } const hw = $('epHw'); if(hw) hw.innerHTML = EP.wb != null ? '<button type="button" onclick="gxIns(\'nH\',\'Workbook p. ' + (EP.wb + 1) + '\')">Homework: Workbook p. ' + (EP.wb + 1) + '</button>' : ''; };
  window.epBook = b => { if(!EP) return; EP.book = b; compose(); };
  window.epLast = () => { if(!EP || !EP.lastText) return; const e = $('nE'); e.value = EP.lastText; Object.assign(EP, parse(EP.lastText)); e.dispatchEvent(new Event('input', { bubbles: true })); paint(); };
  function lastEnded(code){ try{ const s = (D.students || []).concat(D.moved || []).find(x => x.code === code), n0 = s && s.note; if(n0 && n0.ended && n0.date !== D.today) return { t: n0.ended, d: n0.date }; }catch(e){} try{ const k = JSON.parse(store('get', 'coe.stu.' + code) || 'null'); const n = k && k.notes && k.notes.find(x => x.ended); if(n) return { t: n.ended, d: n.date }; }catch(e){} return null; }
  const _ns = window.noteSheet; window.noteSheet = function(code, eventId, day){ const r = _ns.apply(this, arguments);
    try{ const e = $('nE'); if(!e || $('epBox')) return r;
      const st = (D.students || []).find(x => x.code === code) || {}, books = String(st.book || '').split(/\s*,\s*/).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p));
      const cur = e.value.trim(), L = lastEnded(code), base = parse(cur || (L && L.t) || '');
      EP = { book: base.book && !/^book$/i.test(base.book) ? base.book : (books[0] || ''), unit: base.unit, sb: base.sb, wb: base.wb, last: L ? parse(L.t) : null, lastText: L ? L.t : '' };
      const old = e.nextElementSibling && e.nextElementSibling.classList.contains('gx-c') ? e.nextElementSibling : null; if(old) old.remove();
      e.insertAdjacentHTML('afterend', '<div id="epBox" style="margin-top:8px">' +
        (L ? '<div class="gx-c" style="margin-bottom:6px"><button type="button" onclick="epLast()">Same as last time · ' + esc(L.t) + '</button></div>' : '') +
        (books.length ? '<div class="gx-c" style="margin-bottom:6px">' + books.map(b => '<button type="button" data-bk="' + esc(b) + '" onclick="epBook(this.dataset.bk)">' + esc((window.bkName && bkName(b)) || b) + '</button>').join('') + '</div>' : '') +
        '<div class="ep-g"></div><div class="small mute" style="margin-top:4px">Tap + to move on from last time · the line above fills itself · you can still type.</div></div>');
      const h1 = $('nH'); if(h1 && !$('epHw')) h1.insertAdjacentHTML('afterend', '<div class="gx-c" id="epHw"></div>');
      if(!document.getElementById('epCss')) document.head.insertAdjacentHTML('beforeend', '<style id="epCss">#epBox .ep-g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}#epBox .ep-s{border:1px solid var(--line,#E3E8EC);border-radius:12px;padding:8px}#epBox .ep-r{display:flex;align-items:center;gap:4px;margin-top:4px}#epBox .ep-r button{width:34px;height:34px;border-radius:10px;border:1px solid #CFE3E5;background:#F1FAF9;font-size:18px;font-weight:700;color:#00737B;flex:none}#epBox .ep-r input{width:100%;min-width:0;text-align:center;font:inherit;font-weight:700;border:0;background:transparent;padding:4px 0}#epBox .gx-c button.on{background:#00A3AD;color:#fff;border-color:#00A3AD}@media(max-width:480px){#epBox .ep-g{gap:6px}#epBox .ep-s{padding:6px}#epBox .ep-r button{width:28px;height:30px;font-size:16px}#epBox .ep-s .small{font-size:11px}}</style>');
      paint();
      if(!L){ api('tStudent', TOKEN, code).then(x => { try{ const n = x && x.notes && x.notes.find(y => y.ended); if(n && EP && !EP.lastText && $('epBox')){ EP.last = parse(n.ended); EP.lastText = n.ended; if(!EP.book && EP.last.book) EP.book = EP.last.book;
        $('epBox').insertAdjacentHTML('afterbegin', '<div class="gx-c" style="margin-bottom:6px"><button type="button" onclick="epLast()">Same as last time · ' + esc(n.ended) + '</button></div>'); paint(); } }catch(e){} }).catch(() => {}); }
    }catch(err){ console.warn('ended picker', err); } return r; };
})();
