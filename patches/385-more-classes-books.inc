/* 20 Oct · 385 · (1) 30 + 3 lessons at 25 min = 66 classes (was cut at 60): up to 140 classes in one go; the app books them in parts of
   60 at most (one booking per time and per 60 classes), so Google gets the same size as before.
   (2) Books easy to choose: chips under Book / course · this student's books first, then the most used ones, "All books" for the rest. */
(function(){
  /* (2) books */
  const css = document.createElement('style');
  css.textContent = '#cBk{margin-top:8px}#cBk .bk{display:flex;flex-wrap:wrap;gap:6px}#cBk .bk button{border:1px solid #E3E1EC;background:#fff;color:#2B2253;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer;line-height:1.2}#cBk .bk button.mine{border-color:#BFE6E3;background:#F1FAF9}#cBk .bk button.on{background:#2B2253;color:#fff;border-color:#2B2253}#cBk .bk button.more{border-style:dashed;color:#00737B}#cBk .bkh{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin:8px 2px 6px}#cBk .all{max-height:220px;overflow:auto;padding:2px 0}';
  document.head.appendChild(css);
  const norm = b => { try{ return bookOnly(b).replace(/\s+/g, ''); }catch(e){ return String(b || '').trim(); } };
  const K = b => String(b || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  function lists(){ const cnt = {}, name = {}; const add = (b, w) => { b = norm(b); const k = K(b); if(!k) return; name[k] = name[k] || b; cnt[k] = (cnt[k] || 0) + (w || 1); };
    ((typeof SC !== 'undefined' && SC && SC.events) || []).forEach(e => add(e.book, 1)); ((SL && SL.students) || []).forEach(s => add(s.book, 2)); ((SL && SL.books) || []).forEach(b => add(b, 0));
    const s = (typeof classStu === 'function') ? classStu() : null, mine = [];
    if(s){ const c = String(s.code || '').toUpperCase(), L = ((typeof CLSM !== 'undefined' && CLSM) || {})[c] || [];
      [s.book].concat((Array.isArray(L) ? L : []).slice().reverse().map(e => e.book)).forEach(b => { b = norm(b); const k = K(b); if(k && mine.indexOf(k) < 0){ mine.push(k); name[k] = name[k] || b; } }); }
    const top = Object.keys(cnt).filter(k => mine.indexOf(k) < 0 && cnt[k] > 0).sort((a, b) => cnt[b] - cnt[a]).slice(0, Math.max(0, 10 - mine.length));
    const all = Object.keys(name).sort((a, b) => name[a].localeCompare(name[b]));
    return { mine: mine.slice(0, 4), top, all, name }; }
  window.classBookPick = function(b){ const el = $('cB'); if(!el) return; el.value = b; el.dataset.was = ''; try{ classPrev(); }catch(e){} paintBk(true); };
  window.classBookAll = function(){ const a = $('cBkAll'); if(a) a.classList.toggle('hide'); };
  let LASTK = '';
  function paintBk(force){ const cb = $('cB'); if(!cb) return; let box = $('cBk');
    if(!box){ const row = cb.closest('.row'); if(!row) return; row.insertAdjacentHTML('afterend', '<div id="cBk"></div>'); box = $('cBk'); force = true; }
    const s = (typeof classStu === 'function') ? classStu() : null, k = (s ? s.code : '') + '|' + cb.value + '|' + ((SL && SL.students) || []).length;
    if(!force && k === LASTK) return; LASTK = k;
    const B = lists(), cur = K(cb.value), allOpen = $('cBkAll') && !$('cBkAll').classList.contains('hide');
    const chip = (k, cls) => '<button type="button" class="' + cls + (k === cur ? ' on' : '') + '" onclick="classBookPick(\'' + esc(B.name[k]).replace(/'/g, '') + '\')">' + esc(B.name[k]) + '</button>';
    box.innerHTML = '<div class="bk">' + B.mine.map(k => chip(k, 'mine')).join('') + B.top.map(k => chip(k, '')).join('') + (B.all.length > B.mine.length + B.top.length ? '<button type="button" class="more" onclick="classBookAll()">All books ›</button>' : '') + '</div>' +
      '<div id="cBkAll" class="' + (allOpen ? '' : 'hide') + '"><div class="bkh">All books</div><div class="bk all">' + B.all.map(k => chip(k, B.mine.indexOf(k) > -1 ? 'mine' : '')).join('') + '</div></div>'; }
  const basePrev = window.classPrev;
  window.classPrev = function(){ const r = basePrev.apply(this, arguments); try{ paintBk(); }catch(e){} return r; };

  /* (1) more than 60 classes */
  window.classFill = function(u){ const m = +(($('cM') || {}).value) || 50, n = $('cN'); const v = Math.round(u * 50 / m); if(n) n.value = Math.min(140, v); if(v > 140) toast('More than 140 classes · add the rest in a second batch'); classPrev(); };
  const fixN = () => { const n = $('cN'); if(n && n.max !== '140') n.max = '140'; };
  const bp = window.classPrev; window.classPrev = function(){ fixN(); return bp.apply(this, arguments); };
})();
