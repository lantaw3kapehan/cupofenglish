(function(){
  // One class visit per teacher per day (Misty): a teacher needs time to act on one point before the next visit checks it.
  const VIS = {}, COVQ = { at: 0, list: null };
  const tOf = e => String(e.teacher || (e.teachers || [])[0] || '').split(/\s*,\s*/)[0].trim();
  const hhmm = s => { const d = new Date(s); return isNaN(d) ? '' : String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  async function visitsOf(t){ const k = t.toLowerCase(), c = VIS[k]; if(c && Date.now() - c.at < 3 * 6e4) return c.v; try{ const r = await api('mgmtTeacherVisits', TOKEN, t); if(r && r.ok){ VIS[k] = { at: Date.now(), v: r.visits || [] }; return VIS[k].v; } }catch(e){} return c ? c.v : null; }
  async function cover(){ if(COVQ.list && Date.now() - COVQ.at < 5 * 6e4) return COVQ.list; try{ const r = await api('mgmtVisitCoverage', TOKEN); if(r && r.ok){ COVQ.list = r.list || []; COVQ.at = Date.now(); } }catch(e){} return COVQ.list || []; }
  async function check(e){ const box = $('monVisit'); if(!box || !$('mvGo')) return; const t = tOf(e); if(!t) return; const day = ymdLocal(new Date(e.start));
    const V = await visitsOf(t); if(!V || !$('mvGo')) return; const same = V.filter(v => v.date === day && v.id && String(v.code || '') + v.time !== String(e.code || '') + hhmm(e.start));
    const old = $('mvOnce'); if(old) old.remove(); if(!same.length) return;
    const L = (await cover()).filter(x => x.teacher.toLowerCase() !== t.toLowerCase() && x.days !== 0).slice(0, 3);
    box.insertAdjacentHTML('afterbegin', '<div id="mvOnce" style="background:#FFF4DE;border:1.5px solid #EBC57A;border-radius:12px;padding:10px 12px;margin-bottom:10px"><b style="color:#8A5A00">' + esc(tName(t)) + ' already had a class visit ' + (day === ymdLocal(new Date()) ? 'today' : 'on this day') + '</b><div class="small" style="color:#6B4A00">' +
      same.map(v => esc(v.student || v.code) + ' · ' + esc(v.time) + ' · by ' + esc(String(v.by || '').split(' ')[0])).join(' · ') + '</div><div class="small" style="margin-top:4px">One visit per teacher per day gives her time to fix the point before the next visit checks it.</div>' +
      (L.length ? '<div class="small" style="margin-top:6px"><b>Visit instead:</b> ' + L.map(x => esc(tName(x.teacher)) + ' (' + (x.days == null ? 'never visited' : x.days + ' day' + (x.days === 1 ? '' : 's') + ' ago') + (x.next ? ' · next ' + esc(hhmm(x.next.start)) + ' ' + esc(x.next.student || '') : '') + ')').join(' · ') + '</div>' : '') + '</div>');
    const go = $('mvGo'); if(go){ go.className = 'btn ghost block'; go.textContent = 'Save anyway · 2nd visit on this day'; } }
  const _mh = window.monHtml; if(_mh) window.monHtml = function(e, info){ const h = _mh.apply(this, arguments); try{ if(e && D && D.mgr) setTimeout(() => check(e), 600); setTimeout(() => { if(!$("mvOnce")) check(e); }, 2600); }catch(x){} return h; };
  // after a visit is saved, the next check for that teacher reads fresh
  const _ap = window.api; window.api = function(fn){ if(fn === 'mgmtMonitor'){ for(const k in VIS) delete VIS[k]; COVQ.at = 0; } return _ap.apply(this, arguments); };
})();
