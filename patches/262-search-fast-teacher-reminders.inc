/* 17 Oct · Reminders in the teacher's turn (Ops off): shown apart, tagged when the teacher reminded */
(function(){
  if(typeof scDueBox !== 'function') return;
  const base = scDueBox;
  function scTeachBox(){
    if(!SC || SC_OFF || !remFresh()) return '';
    const L = SC.events.filter(e => scStage(e) && remByTeacher(e)).sort((a, b) => a.start.localeCompare(b.start)); if(!L.length) return '';
    let done = 0;
    const rows = L.map(e => { const st = scStage(e), r = REM.map[scRemKey(e, st)], i = SC.events.indexOf(e), lbl = st === '10m' ? '10-min' : 'early';
      const nm = `<b>${tm(e.start)}</b> ${esc(e.student || e.title || '')}`;
      if(r || scSent(e, st)){ done++; const by = r && r.by ? (/cupofenglish/i.test(r.by) ? 'marked sent' : 'Teacher ' + esc(tName(r.by))) : 'sent'; return `<span class="chip teal" style="margin:4px 6px 0 0">✓ ${nm} · ${lbl} · ${by}${r && r.at ? ' ' + esc(r.at) : ''}</span>`; }
      return `<div class="row" style="gap:8px;margin-top:6px;align-items:center"><div class="grow small">${nm} · <span style="color:#8A5A00">waiting for Teacher ${esc(tName(e.teacher || ''))}</span> <span class="mute">(${lbl})</span></div><button class="btn sm ghost" title="Already reminded in WeChat · clear it" onclick="scRemDone([${i}])">✓ Sent</button></div>`; });
    const chips = rows.filter(x => x.startsWith('<span')), wait = rows.filter(x => !x.startsWith('<span'));
    return `<div class="card" style="margin-top:10px;border:1px dashed #C9B37A;background:#FFFCF3"><b class="small">👩‍🏫 Teacher's turn (Ops off) · ${done}/${L.length} reminded</b>${wait.join('')}${chips.length ? `<div style="display:flex;flex-wrap:wrap;margin-top:4px">${chips.join('')}</div>` : ''}</div>`;
  }
  scDueBox = function(){ return base.apply(this, arguments) + scTeachBox(); };
})();
