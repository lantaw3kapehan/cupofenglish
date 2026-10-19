/* 19 Oct · 322 · QA form: empty boxes, last month beside them (Misty: "clear the boxes to fill the new one and make it convenient to type the new feedback while comparing previous month feedback")
   · Nothing is copied into the form any more. Each written answer shows her last QA's answer beside the box (laptop) or just above it (phone).
   · An old draft whose text is still word-for-word last month's copy has that text cleared (it stays visible beside the box).
   · The QA form no longer closes from a click on the dark background or Esc (use ×); the writing is kept either way. */
(function(){
  const css = document.createElement('style'); css.textContent = `.qh-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
.qh-prev{background:#f6f7f9;border:1px dashed var(--line);border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.5;color:#3d4250;max-height:420px;overflow:auto;white-space:pre-wrap}
.qh-prev b.qh-pl{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:4px}
.qh-prev .qh-use{font-size:12px;margin-top:6px;display:inline-block}
.qh-prevline{font-size:12px;color:var(--mute);margin-top:4px}
@media (max-width:860px){.qh-pair{grid-template-columns:1fr}.qh-pair .qh-prev{order:-1;max-height:160px}}`;
  document.head.appendChild(css);
  const norm = s => String(s || '').toUpperCase().replace(/\*/g, '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  const SKIP = /^(TIMESTAMP|EVALUATION PERIOD|TEACHER|DATE OF EVALUATION|CLASS OBSERVATION DATE|STUDENT\(S\)|EVALUATOR$)/;
  function colMap(head){ const byKey = {}, seen = {}, out = {};
    (head || []).forEach((h, i) => { const k = norm(h); seen[k] = (seen[k] || 0) + 1; byKey[k + '#' + seen[k]] = i; });
    const its = (QF && QF.form && QF.form.items || []).filter(x => x.type !== 'SECTION_HEADER' && x.type !== 'PAGE_BREAK'), s2 = {};
    its.forEach(x => { const k = norm(x.title); s2[k] = (s2[k] || 0) + 1; const i = byKey[k + '#' + s2[k]]; if(i != null) out[String(x.id)] = i; });
    if(Object.keys(out).length < 10 && head && its.length === head.length - 1){ const o2 = {}; its.forEach((x, i) => o2[String(x.id)] = i + 1); return o2; }
    return out; }
  window.qhUse = function(id){ const q = document.querySelector(`#sheetBody .qa-q[data-id="${id}"]`), v = q && q.querySelector('textarea.qa-v'), p = q && q.querySelector('.qh-prev .qh-txt'); if(!v || !p) return;
    if(v.value.trim() && !confirm('Replace what you wrote with last month\'s text?')) return; v.value = p.textContent; qaGrow(v); qaSave(); v.focus(); };
  window.qaCompare = function(d){ if(!d || !d.last || !QF) return; const cmap = colMap(d.last.head), row = d.last.data || [], per = String(d.last.period || 'last month'), mon = per.split(' ')[0];
    let cleared = 0;
    document.querySelectorAll('#sheetBody .qa-q').forEach(q => { const c = cmap[q.dataset.id]; if(c == null || c < 7 || SKIP.test(norm((d.last.head || [])[c]))) return;
      const val = String(row[c] == null ? '' : row[c]).trim(); q.querySelectorAll('.qh-prev,.qh-prevline').forEach(x => x.remove());
      const ta = q.querySelector('textarea.qa-v');
      if(ta){ if(val && ta.value.trim() === val){ ta.value = ''; qaGrow(ta); cleared++; }   // an untouched copy from the old form
        let pair = ta.parentNode.classList.contains('qh-pair') ? ta.parentNode : null;
        if(!pair){ pair = document.createElement('div'); pair.className = 'qh-pair'; ta.before(pair); pair.appendChild(ta); }
        const p = document.createElement('div'); p.className = 'qh-prev';
        p.innerHTML = val ? `<b class="qh-pl">${esc(per)} · what you wrote</b><span class="qh-txt">${esc(val)}</span>` : `<b class="qh-pl">${esc(per)}</b><span class="mute">Nothing written last time.</span>`;
        if(val){ const a = document.createElement('a'); a.className = 'link qh-use'; a.textContent = 'Start from ' + mon + '’s text'; a.onclick = () => qhUse(q.dataset.id); p.appendChild(document.createElement('br')); p.appendChild(a); }
        pair.appendChild(p); return; }
      if(q.querySelector('.qa-sc')) return;   // scores: the "Her scores" line and the marker already show last month
      if(val){ const l = document.createElement('div'); l.className = 'qh-prevline'; l.innerHTML = `<b>${esc(mon)}:</b> ${esc(val.length > 160 ? val.slice(0, 160) + '…' : val)}`; const ch = q.querySelector('.qa-ch,.qa-v'); if(ch) ch.after(l); else q.appendChild(l); } });
    if(cleared){ qaSave(); toast(cleared + ' answer' + (cleared > 1 ? 's' : '') + ' still copied from ' + mon + ' cleared · ' + mon + '’s text is beside each box'); } };
  // the dark background and Esc no longer close the QA form (× still does; the writing is kept)
  const _cs = window.closeSheet; window.closeSheet = function(){ try{ const ev = window.event;
      if($('qaGo') && $('sheet').classList.contains('on') && ev && ((ev.type === 'click' && ev.target && ev.target.id === 'scrim') || ev.type === 'keydown')){ toast('The QA form stays open · tap × to close · your writing is kept'); return; } }catch(e){}
    return _cs.apply(this, arguments); };
})();
