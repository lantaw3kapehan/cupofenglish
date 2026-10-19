/* 19 Oct · 316 · QA form, fairer (Misty: "see the previous months I gave … a marker whether I'm giving too high … automate based on what I commented and scored last month")
   1 · On top: her QA averages month by month, the team average for the latest month, this month's class visits (Strong / OK / Needs work).
   2 · Empty questions are filled from her last QA (the five scores, the evidence comments, decision, continue / develop / next action, recommendation, final assessment),
       each marked "from August" until changed. Progress from previous evaluation is left for this month. Nothing already typed is overwritten.
   3 · Each score: "Jun 3 · Jul 3 · Aug 4 · team 3.6", the August button marked, and a live marker: same / up / down / big jump (2+) / 1+ above the team.
   4 · Before sending: says how many comments are still word-for-word from last month. Data: coe-mgmt screen mgmtQaHist (coe_qa_hist). */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const H = {}, FILLS = {}; let FILL = {}, FILLT = '';
  const norm = s => String(s || '').toUpperCase().replace(/\*/g, '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  const mon = p => String(p || '').split(' ')[0].slice(0, 3);
  const SC = [7, 9, 11, 13, 15];
  const SKIP = /^(TIMESTAMP|EVALUATION PERIOD|TEACHER|DATE OF EVALUATION|CLASS OBSERVATION DATE|STUDENT\(S\)|EVALUATOR$|PROGRESS FROM PREVIOUS|PROGRESS EVIDENCE)/;
  const css = document.createElement('style'); css.textContent = `.qh-box{background:#f6f8fa;border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:8px 0}.qh-tag{display:inline-block;font-size:11px;font-weight:600;background:#fff4d6;color:#7a5a00;border-radius:8px;padding:1px 7px;margin-left:6px;vertical-align:middle}.qh-line{font-size:12px;color:var(--mute);margin-top:5px}.qh-mk{font-size:12px;margin-top:4px;font-weight:600}.qh-mk.up{color:#2a7d72}.qh-mk.down{color:#b5532f}.qh-mk.warn{color:#9a6a00;background:#fff4d6;border-radius:8px;padding:4px 8px}.qa-sc button .qh-was{font-size:10px;font-weight:700;color:#7a5a00;background:#fff4d6;border-radius:6px;padding:0 5px;margin-top:2px}`;
  document.head.appendChild(css);
  // each form question → its QA-DATA column (same title; the n-th "EVALUATOR'S EVIDENCE & COMMENT" ↔ the n-th column of that name)
  function colMap(head){ const byKey = {}, seen = {}, out = {};
    (head || []).forEach((h, i) => { const k = norm(h); seen[k] = (seen[k] || 0) + 1; byKey[k + '#' + seen[k]] = i; });
    const s2 = {}; (QF && QF.form && QF.form.items || []).forEach(x => { if(x.type === 'SECTION_HEADER' || x.type === 'PAGE_BREAK') return; const k = norm(x.title); s2[k] = (s2[k] || 0) + 1; const i = byKey[k + '#' + s2[k]]; if(i != null) out[String(x.id)] = i; });
    const its = (QF && QF.form && QF.form.items || []).filter(x => x.type !== 'SECTION_HEADER' && x.type !== 'PAGE_BREAK');
    if(Object.keys(out).length < 10 && head && its.length === head.length - 1){ const o2 = {}; its.forEach((x, i) => o2[String(x.id)] = i + 1); return o2; }   // titles edited since: same order as the sheet
    return out; }
  const qOf = id => document.querySelector(`#sheetBody .qa-q[data-id="${id}"]`);
  const curPer = () => { const it = QF && QF.form.items.find(x => qaRole(x) === 'period'), q = it && qOf(it.id), v = q && q.querySelector('.qa-v'); return v ? v.value : ''; };
  function tag(q, on, per){ const l = q.querySelector('.qa-l'); if(!l) return; let t = l.querySelector('.qh-tag'); if(!on){ if(t) t.remove(); return; } if(!t){ t = document.createElement('span'); t.className = 'qh-tag'; l.appendChild(t); } t.textContent = 'from ' + per + ' · change what is different'; }
  function marker(q){ const d = H[QA_T], i = +q.dataset.qhc; if(!d || !(i >= 0)) return; let m = q.querySelector('.qh-mk'); if(!m){ m = document.createElement('div'); m.className = 'qh-mk'; q.appendChild(m); }
    const on = q.querySelector('.qa-ch button.on'), v = on ? +on.dataset.v : null, last = d.rows.length ? d.rows[d.rows.length - 1] : null, lv = last ? last.scores[i] : null, ta = d.team && d.team.avg ? d.team.avg[i] : null, lp = last ? mon(last.period) : '';
    if(v == null){ m.className = 'qh-mk'; m.textContent = ''; return; }
    const L = [], cls = [];
    if(lv != null){ const dv = v - lv;
      if(dv === 0) L.push(FILL[q.dataset.id] != null && FILL[q.dataset.id] === String(v) ? `Same as ${lp} (copied) · still true this month?` : `Same as ${lp}`);
      else if(Math.abs(dv) >= 2){ L.push(`${dv > 0 ? '↑' : '↓'} Big change (${dv > 0 ? '+' : ''}${dv}) from ${lp} — is the evidence strong enough? Write what changed.`); cls.push('warn'); }
      else { L.push(`${dv > 0 ? '↑ +1' : '↓ −1'} from ${lp} — say in the evidence what changed`); cls.push(dv > 0 ? 'up' : 'down'); } }
    if(ta != null && v - ta >= 1){ L.push(`1+ above the team average (${ta})`); if(cls.indexOf('warn') < 0) cls.splice(0, cls.length, 'warn'); }
    m.className = 'qh-mk ' + cls.join(' '); m.textContent = L.join(' · '); }
  function paint(){ const d = H[QA_T], body = $('sheetBody'); if(!body || !QF || !$('qaLast')) return; let box = $('qaHist');
    if(!d || !QA_T){ if(box) box.remove(); return; }
    if(!box){ box = document.createElement('div'); box.id = 'qaHist'; $('qaLast').after(box); }
    const R = d.rows || [], last = R[R.length - 1], v = d.visits || {}, A = v.areas || {};
    const weak = Object.keys(A).filter(k => A[k].needs).sort((a, b) => A[b].needs - A[a].needs).slice(0, 2);
    const cmap = colMap(d.last && d.last.head);
    // the score history line and the marker on every score question
    document.querySelectorAll('#sheetBody .qa-q').forEach(q => { const c = cmap[q.dataset.id], i = SC.indexOf(c); if(i < 0 || !q.querySelector('.qa-sc')) return; q.dataset.qhc = i;
      q.querySelectorAll('.qh-was').forEach(x => x.remove()); const lv = last ? last.scores[i] : null;
      if(lv != null){ const b = q.querySelector(`.qa-sc button[data-v="${lv}"]`); if(b){ const s = document.createElement('span'); s.className = 'qh-was'; s.textContent = mon(last.period); b.appendChild(s); } }
      let ln = q.querySelector('.qh-line'); if(!ln){ ln = document.createElement('div'); ln.className = 'qh-line'; q.querySelector('.qa-ch').after(ln); }
      ln.textContent = (R.length ? 'Her scores: ' + R.slice(-4).map(r => mon(r.period) + ' ' + (r.scores[i] == null ? '—' : r.scores[i])).join(' · ') : 'No earlier score') + (d.team && d.team.avg ? ` · team ${mon(d.team.period)} ${d.team.avg[i]}` : '');
      marker(q); });
    const nF = Object.keys(FILL).filter(id => { const q = qOf(id); return q && q.querySelector('.qh-tag'); }).length;
    box.innerHTML = `<div class="qh-box small"><b>Her QA months</b> · ${R.length ? R.slice(-6).map(r => `${esc(mon(r.period))} <b>${r.avg}</b>`).join(' · ') : 'none yet'}${d.team ? ` <span class="mute">· team ${esc(mon(d.team.period))} ${d.team.avg.length ? (d.team.avg.reduce((a, b) => a + b, 0) / d.team.avg.length).toFixed(1) : ''} (${d.team.n} teachers)</span>` : ''}
<div style="margin-top:4px"><b>Class visits · ${esc(v.month || '')}</b> · ${v.n ? `${v.n} visit${v.n > 1 ? 's' : ''} · ${v.strong} Strong · ${v.ok} OK · ${v.needs} Needs work${weak.length ? ' <span class="mute">(most "Needs work": ' + weak.map(esc).join(', ') + ')</span>' : ''}` : 'none yet this month'}</div>
${nF ? `<div style="margin-top:6px">✎ <b>${nF} answers copied from ${esc(last ? last.period : '')}</b> (marked) · change what is different this month. <a class="link" onclick="qhUndo()">Clear the copy</a></div>` : ''}
${last && curPer() && norm(curPer()) === norm(last.period) ? `<div style="margin-top:6px;color:var(--coral)"><b>${esc(last.period)} is already evaluated</b> for this teacher · sending again adds a second evaluation.</div>` : ''}
<div class="mute" style="margin-top:4px">Each score shows her earlier scores and a marker when it moves · a big change or 1+ above the team asks for strong evidence.</div></div>`; }
  // fill the empty questions from the last QA
  function fill(){ const d = H[QA_T]; if(!d || !d.last || !QF || !$('qaLast') || FILLT === QA_T) return; FILLT = QA_T; FILL = FILLS[QA_T] = FILLS[QA_T] || {};
    if(curPer() && norm(curPer()) === norm(d.last.period)) return;
    const cmap = colMap(d.last.head), row = d.last.data || [], per = mon(d.last.period);
    Object.keys(cmap).forEach(id => { const c = cmap[id], hd = norm((d.last.head || [])[c]); if(c < 7 || SKIP.test(hd)) return; const val = String(row[c] == null ? '' : row[c]).trim(); if(!val) return;
      const q = qOf(id); if(!q) return; const t = q.dataset.t, ch = q.querySelector('.qa-ch'), v = q.querySelector('.qa-v');
      if(ch){ if(ch.querySelector('button.on')) return; const want = t === 'CHECKBOX' ? val.split(/,\s*/) : [val]; let hit = 0;
        ch.querySelectorAll('button').forEach(b => { if(want.indexOf(b.dataset.v) > -1){ b.classList.add('on'); hit++; } }); if(!hit) return; FILL[id] = t === 'CHECKBOX' ? want.join('|') : val; }
      else if(v){ if(v.value.trim()) return; v.value = val; FILL[id] = val; if(v.tagName === 'TEXTAREA') qaGrow(v); }
      else return;
      tag(q, true, per); });
    retag(); if(Object.keys(FILL).length) qaSave(); }
  function still(id){ const q = qOf(id); if(!q) return false; const t = q.dataset.t, ch = q.querySelector('.qa-ch'), v = q.querySelector('.qa-v');
    if(ch) return [...ch.querySelectorAll('button.on')].map(b => b.dataset.v).join('|') === FILL[id]; return v ? v.value.trim() === FILL[id] : false; }
  function retag(){ const d = H[QA_T]; Object.keys(FILL).forEach(id => { const q = qOf(id); if(q) tag(q, still(id), d && d.last ? mon(d.last.period) : ''); }); }
  window.qhUndo = function(){ Object.keys(FILL).forEach(id => { if(!still(id)) return; const q = qOf(id), ch = q.querySelector('.qa-ch'), v = q.querySelector('.qa-v');
    if(ch) ch.querySelectorAll('button.on').forEach(b => b.classList.remove('on')); else if(v){ v.value = ''; if(v.tagName === 'TEXTAREA') qaGrow(v); } tag(q, false); });
    FILL = FILLS[QA_T] = {}; qaSave(); paint(); };
  function load(){ const t = QA_T; if(!t) return; if(H[t]){ fill(); paint(); return; }
    post('mgmtQaHist', [t]).then(d => { H[t] = d; if(t === QA_T){ fill(); paint(); } }).catch(() => {}); }
  document.addEventListener('input', e => { if(e.target.closest && e.target.closest('#sheetBody .qa-q') && Object.keys(FILL).length){ retag(); } }, true);
  const _pa = window.qaPaint; window.qaPaint = function(){ const x = _pa.apply(this, arguments); FILLT = ''; try{ load(); }catch(e){} return x; };
  const _pk = window.qaPick; window.qaPick = function(b){ const x = _pk.apply(this, arguments); try{ const q = b.closest('.qa-q'); retag(); if(q && q.dataset.qhc != null) marker(q); if(H[QA_T]) paint(); }catch(e){} return x; };
  const _tc = window.qaTeacher; window.qaTeacher = function(name){ const x = _tc.apply(this, arguments); FILL = FILLS[name] || {}; FILLT = ''; document.querySelectorAll('#sheetBody .qh-tag,#sheetBody .qh-was,#sheetBody .qh-line,#sheetBody .qh-mk,#qaHist').forEach(e => e.remove()); try{ load(); }catch(e){} return x; };
  const _ql = window.qaLastHtml; if(_ql) window.qaLastHtml = function(){ const x = _ql.apply(this, arguments); setTimeout(() => { try{ if(H[QA_T]) paint(); }catch(e){} }, 0); return x; };
  const _sd = window.qaSend; window.qaSend = function(){ try{ const d = H[QA_T], ids = Object.keys(FILL).filter(still);
      const txt = ids.filter(id => { const q = qOf(id); return q && !q.querySelector('.qa-ch'); }).length, sc = ids.filter(id => { const q = qOf(id); return q && q.dataset.qhc != null; }).length;
      if((txt || sc) && !confirm(`${txt ? txt + ' comment' + (txt > 1 ? 's are' : ' is') + ' still word-for-word from ' + (d && d.last ? d.last.period : 'last month') : ''}${txt && sc ? ' and ' : ''}${sc ? sc + ' score' + (sc > 1 ? 's are' : ' is') + ' unchanged' : ''}.\n\nSend anyway?`)) return; }catch(e){}
    return _sd.apply(this, arguments); };
})();
