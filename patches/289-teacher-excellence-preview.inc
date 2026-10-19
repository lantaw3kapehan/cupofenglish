/* 19 Oct · 289 · Teacher Excellence · preview for the President only (Misty: "build so i can judge it", September first)
   Performance › "Teacher Excellence" opens the month's scores worked out by the database (coe_kpi):
   Quality 40 (QA 60% + Celine's class visits 40%, minus 10 for each Performance Concern) · Progress 20 (progress checks, class notes, +10 for each step up to a new book in 3 months)
   Trust 20 (renewals, trials enrolled, students kept, recognitions) · Reliability 20 (time-ins on time, demerits). A part with no data that month is left out, not counted as 0.
   Ranked: 20 units or more, not the President. Gold 85+ · Silver 70+ · Bronze 55+ · else Developing. Teachers see nothing yet. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(r && r.error || fn); return r.data; });
  const KX = {}; let KM = '';
  const ymOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const months = () => { const L = [], d = new Date(); d.setDate(1); for(let i = 0; i < 6; i++){ L.push(ymOf(d)); d.setMonth(d.getMonth() - 1); } return L; };
  const mLabel = ym => { try{ return new Date(ym + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }catch(e){ return ym; } };
  const LV = { Gold: 'background:#f6d365;color:#5a4300', Silver: 'background:#dfe4ea;color:#3a4250', Bronze: 'background:#e8b98a;color:#5b3412', Developing: 'background:#eef0f2;color:#555' };
  const lvChip = l => l ? `<span class="chip" style="${LV[l] || ''};font-weight:600">${esc(l)}</span>` : '';
  const P = [['quality', 'Quality', 40], ['progress', 'Progress', 20], ['trust', 'Trust', 20], ['reliability', 'Reliability', 20]];
  const bar = v => v == null ? '<span class="mute small">no data</span>' : `<span style="display:inline-block;width:64px;height:7px;border-radius:4px;background:#e9ecef;vertical-align:middle;overflow:hidden"><span style="display:block;height:100%;width:${Math.max(0, Math.min(100, v))}%;background:${v >= 80 ? '#2a9d8f' : v >= 60 ? '#e9c46a' : '#e76f51'}"></span></span> <b class="small">${v}</b>`;
  const n = v => v == null ? '—' : v;
  function facts(t){ const f = t.facts || {}, p = t.parts || {}, L = [];
    L.push(['Lessons', `${n(f.lessonsDone)} taught · ${n(f.units)} units · ${n(f.students)} students`]);
    L.push(['QA', f.qaAvg != null ? `${f.qaAvg} / 5 (${esc(f.qaPeriod || '')}) → ${n(p.qa)}` + (f.concerns ? ` · ${f.concerns} Performance Concern${f.concerns > 1 ? 's' : ''} (−${10 * f.concerns})` : '') : 'no QA yet']);
    L.push(['Class visits', f.visitChecks ? `${f.visitOk} of ${f.visitChecks} checks OK in ${f.visits} visit${f.visits > 1 ? 's' : ''} → ${p.visits}` : 'no visits this month']);
    L.push(['Progress checks', f.progressChecks ? `${f.progressChecks} → ${n(p.checks)}` : 'none this month']);
    L.push(['Class notes', f.notes != null ? `${f.notes} for ${f.lessonsDone} lessons → ${n(p.notes)}` : 'no notes kept this month']);
    L.push(['New books (3 months)', f.bookUps3m ? `${f.bookUps3m} step${f.bookUps3m > 1 ? 's' : ''} up (+${10 * f.bookUps3m}) · ${esc(f.bookUpsWhich || '')}` : 'none']);
    L.push(['Renewals', `${n(f.renewals)} → ${n(p.renewals)}`]);
    L.push(['Trials', f.trials ? `${f.trialsEnrolled} of ${f.trials} enrolled → ${p.trials}` : 'no trials']);
    L.push(['Students kept', f.keptFrom ? `${f.kept} of ${f.keptFrom} from last month → ${p.kept}` : '—']);
    L.push(['Recognitions', `${n(f.recognitions)} → ${n(p.recognition)}`]);
    L.push(['Time-ins', f.timeIns ? `${f.onTime} of ${f.timeIns} on time → ${p.timeIns}` : 'no class time-ins this month']);
    L.push(['Demerits', `${n(f.demerits)} point${f.demerits == 1 ? '' : 's'} → ${n(p.demerits)}` + (f.demeritWhy ? ` · ${esc(f.demeritWhy)}` : '')]);
    return `<table class="small" style="width:100%;border-collapse:collapse;margin:6px 0 2px">${L.map(r => `<tr><td class="mute" style="padding:3px 8px 3px 0;white-space:nowrap;vertical-align:top">${r[0]}</td><td style="padding:3px 0">${r[1]}</td></tr>`).join('')}</table>`; }
  function row(t, i){ const pl = t.pillars || {};
    return `<div class="card" style="padding:10px 12px;margin:8px 0;cursor:pointer" onclick="const x=this.querySelector('.kxf');x.hidden=!x.hidden">
<div class="row" style="gap:10px;align-items:center"><b style="font-size:18px;min-width:28px">${t.rank ? '#' + t.rank : '·'}</b><div class="grow"><b>${esc(tName(t.name))}</b> ${lvChip(t.level)}</div><b style="font-size:20px">${t.total == null ? '—' : t.total}</b></div>
<div class="row small" style="gap:14px;flex-wrap:wrap;margin-top:6px">${P.map(p => `<span><span class="mute">${p[1]}</span> ${bar(pl[p[0]])}</span>`).join('')}</div>
<div class="kxf" hidden>${facts(t)}</div></div>`; }
  function paint(){ const d = KX[KM], el = $('kxBody'); if(!el) return;
    if(!d){ el.innerHTML = '<p class="mute">Working it out…</p>'; return; }
    if(d.err){ el.innerHTML = `<p class="mute">Could not load (${esc(d.err)}). Try again in a minute.</p>`; return; }
    const R = (d.teachers || []).filter(t => t.rank), U = (d.teachers || []).filter(t => !t.rank), top = R.slice(0, 3);
    const gaps = P.filter(p => !R.some(t => (t.pillars || {})[p[0]] != null)).map(p => p[1]);
    el.innerHTML = (top.length ? `<div class="row" style="gap:8px;margin:4px 0 10px">${top.map((t, i) => `<div class="card grow" style="padding:10px;text-align:center"><div style="font-size:22px">${['🥇', '🥈', '🥉'][i]}</div><b>${esc(tName(t.name))}</b><div class="small mute">${t.total} · ${esc(t.level || '')}</div></div>`).join('')}</div>` : '')
      + (gaps.length ? `<p class="small mute">No data yet this month for: ${gaps.join(', ')} — the other parts are weighted up.</p>` : '')
      + R.map(row).join('')
      + (U.length ? `<h3 style="margin:16px 0 4px">Not ranked</h3><p class="small mute">Under ${d.min} units this month, or the President.</p>` + U.map(row).join('') : '')
      + `<p class="small mute" style="margin-top:12px">Quality 40 · Progress 20 · Trust 20 · Reliability 20. Gold 85+ · Silver 70+ · Bronze 55+. Tap a teacher for the facts behind the score. Worked out ${new Date(d.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.</p>`; }
  function load(ym, force){ KM = ym; if(KX[ym] && !KX[ym].err && !force){ paint(); return; } delete KX[ym]; paint();
    post('mgmtKpi', [ym]).then(d => { KX[ym] = d; }).catch(e => { KX[ym] = { err: String(e && e.message || e) }; }).finally(() => { if(KM === ym) paint(); }); }
  window.kxMonth = ym => { const s = $('kxSel'); if(s) s.value = ym; load(ym); };
  window.kpiSheet = function(ym){ if(!isPres()) return; const L = months(), m = ym || L[1];
    openSheet(`<div class="row" style="align-items:center;gap:8px"><div class="grow"><h2 style="margin:0">Teacher Excellence</h2><div class="small mute">Preview · only you can see this · teachers see nothing yet</div></div>
<select id="kxSel" onchange="kxMonth(this.value)">${L.map(x => `<option value="${x}"${x === m ? ' selected' : ''}>${mLabel(x)}</option>`).join('')}</select></div><div id="kxBody" style="margin-top:8px"></div>`);
    load(m); };
  window.kpiReload = () => KM && load(KM, true);
})();
