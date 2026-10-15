(function(){
  // 15 Oct · Teachers and Cases, improved (Misty: "improve the screen of these").
  //  Teachers · cards instead of a plain list: rank as a colour label, this month's units with a bar (vs the top),
  //             students, class completion as a coloured bar (green ≥ 80 % · amber 60–79 · coral < 60), late count;
  //             sort by units (default), completion or name.
  //  Cases    · a line for this month (cases · bonuses · deductions · open), tabs with counts, a teacher filter,
  //             cases grouped by month, each with a colour edge (green bonus · coral deduction · grey other),
  //             the full date (was cut to "15-Oct-202"), amount on the right.
  const css = `
#v-teachers .tc2-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}
#v-teachers .tc2-bar span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0}
#v-teachers .tc2-bar button{all:unset;cursor:pointer;font-size:13px;padding:6px 12px;border-radius:999px;background:#fff;border:1px solid #EEF0F4;color:#4C4868}
#v-teachers .tc2-bar button.on{background:#2B2253;border-color:#2B2253;color:#fff}
#v-teachers .tc2-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:12px}
#v-teachers .tc2{background:#fff;border:1px solid #EEF0F4;border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:box-shadow .15s,transform .15s}
#v-teachers .tc2:hover{box-shadow:0 10px 24px rgba(43,34,83,.08);transform:translateY(-1px)}
#v-teachers .tc2-top{display:flex;align-items:center;gap:12px}
#v-teachers .tc2-av{width:42px;height:42px;border-radius:21px;flex:none;display:flex;align-items:center;justify-content:center;font-family:var(--brand);font-size:16px;color:#fff;background:var(--rc)}
#v-teachers .tc2-nm{min-width:0;flex:1}
#v-teachers .tc2-nm b{display:block;font-size:16px;color:#2B2253;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-teachers .tc2-rk{display:inline-block;margin-top:3px;font-size:11.5px;padding:2px 9px;border-radius:999px;background:var(--rb);color:var(--rt)}
#v-teachers .tc2-u{text-align:right;flex:none}
#v-teachers .tc2-u b{display:block;font-family:var(--brand);font-weight:400;font-size:26px;line-height:1;color:#2B2253}
#v-teachers .tc2-u span{font-size:11.5px;color:#8A87A0}
#v-teachers .tc2-line{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#6F6B85}
#v-teachers .tc2-line .pg{flex:1;height:7px;border-radius:4px;background:#EEF1F4;overflow:hidden}
#v-teachers .tc2-line .pg i{display:block;height:100%;border-radius:4px}
#v-teachers .tc2-f{display:flex;flex-wrap:wrap;gap:6px;font-size:12px}
#v-teachers .tc2-f span{padding:2px 9px;border-radius:999px;background:#F3F4F8;color:#4C4868}
#v-teachers .tc2-f .late{background:#FBEAE5;color:#A1452F}
#v-teachers .tc2-f .off{background:#FFF4DE;color:#8A5A00}
#v-actions .ac2-sum{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin-top:12px;padding:10px 16px;border-radius:14px;background:#fff;border:1px solid #EEF0F4;font-size:14px;color:#4C4868}
#v-actions .ac2-sum b{font-family:var(--brand);font-weight:400;font-size:20px;color:#2B2253;margin-right:4px}
#v-actions .ac2-sum .plus b{color:#1C6B4C}#v-actions .ac2-sum .minus b{color:#A1452F}
#v-actions .ac2-m{display:flex;align-items:baseline;gap:10px;margin:18px 2px 6px}
#v-actions .ac2-m b{font-family:var(--brand);font-weight:400;font-size:18px;color:#2B2253}
#v-actions .ac2-m span{font-size:13px;color:#8A87A0}
#v-actions .ac2{display:flex;align-items:center;gap:14px;padding:12px 14px 12px 16px;margin-top:6px;background:#fff;border:1px solid #EEF0F4;border-left:4px solid #C9CCD8;border-radius:14px;cursor:pointer;transition:box-shadow .15s}
#v-actions .ac2:hover{box-shadow:0 8px 20px rgba(43,34,83,.07)}
#v-actions .ac2.bon{border-left-color:#2E9E6F}#v-actions .ac2.pen{border-left-color:#D4705A}
#v-actions .ac2 .grow{min-width:0}
#v-actions .ac2 .t{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#v-actions .ac2 .t b{font-size:15px;color:#2B2253}
#v-actions .ac2 .s{font-size:12.5px;color:#8A87A0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-actions .ac2 .amt{text-align:right;flex:none;font-family:var(--brand);font-size:18px}
#v-actions .ac2 .amt .p{color:#1C6B4C}#v-actions .ac2 .amt .n{color:#A1452F}
#v-actions .ac2 .amt small{display:block;font-family:inherit;font-size:11.5px;color:#8A87A0}
#v-actions .ac2-tf{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center}
#v-actions .ac2-tf span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0;margin-right:2px}
#v-actions .ac2-tf button{all:unset;cursor:pointer;font-size:13px;padding:5px 11px;border-radius:999px;background:#fff;border:1px solid #EEF0F4;color:#4C4868}
#v-actions .ac2-tf button.on{background:#2B2253;border-color:#2B2253;color:#fff}`;
  const st = document.createElement('style'); st.id = 'tc2css'; st.textContent = css; document.head.appendChild(st);

  // ── Teachers
  const RK = [[/master/i, '#3F347E', '#EEEBFA', '#6C5FC7'], [/senior/i, '#00666D', '#E1F4F5', '#00A3AD'], [/junior/i, '#1F5E87', '#E5F0F8', '#3B82B5'],
    [/newly qualified/i, '#1C6B4C', '#E3F4EC', '#2E9E6F'], [/starting/i, '#8A5A00', '#FFF4DE', '#D9962B'], [/./, '#4C4868', '#F1F2F6', '#9A98A8']];
  let TS = (() => { try{ return localStorage.getItem('coe.tSort') || 'units'; }catch(e){ return 'units'; } })();
  window.tcSort = function(k){ TS = k; try{ localStorage.setItem('coe.tSort', k); }catch(e){} renderTeachers(); };
  const _rt = window.renderTeachers;
  window.renderTeachers = function(){ const r = _rt.apply(this, arguments);
    try{ const v = $('v-teachers'), T = ((typeof MO !== 'undefined' && MO && MO.teachers) || []).slice(); if(!v || !T.length) return r;
      const first = v.querySelector('.li[onclick^="openTeacher"]'); if(!first) return r; const box = first.parentElement;
      const cp = x => x.sch ? Math.round(x.done / x.sch * 100) : null, mx = Math.max(1, ...T.map(x => +x.units || 0));
      T.sort((a, b) => TS === 'name' ? String(a.name).localeCompare(String(b.name)) : TS === 'comp' ? ((cp(b) == null ? -1 : cp(b)) - (cp(a) == null ? -1 : cp(a))) : ((+b.units || 0) - (+a.units || 0)));
      const card = x => { const k = RK.find(z => z[0].test(String(x.rank || ''))), c = cp(x), col = c == null ? '#C9CCD8' : c >= 80 ? '#2E9E6F' : c >= 60 ? '#D9962B' : '#D4705A';
        return `<div class="tc2" style="--rt:${k[1]};--rb:${k[2]};--rc:${k[3]}" onclick="openTeacher('${esc(x.name)}')"><div class="tc2-top"><div class="tc2-av">${esc(String(x.name || '?').slice(0, 2).toUpperCase())}</div>
<div class="tc2-nm"><b>${esc(tName(x.name))}</b><span class="tc2-rk">${esc(x.rank || 'No rank')} · ${peso(x.rate)}</span></div><div class="tc2-u"><b>${esc(String(x.units))}</b><span>units this month</span></div></div>
<div class="tc2-line"><span style="width:62px">Units</span><span class="pg"><i style="width:${Math.round((+x.units || 0) / mx * 100)}%;background:var(--rc)"></i></span></div>
<div class="tc2-line"><span style="width:62px">Completion</span><span class="pg"><i style="width:${c || 0}%;background:${col}"></i></span><b style="color:${col};min-width:38px;text-align:right">${c == null ? '—' : c + '%'}</b></div>
<div class="tc2-f"><span>${x.students} students</span>${x.late ? `<span class="late">${x.late} late</span>` : ''}${x.app ? '' : '<span class="off">Not on the app</span>'}</div></div>`; };
      box.outerHTML = `<div class="tc2-bar"><span>Sort</span>${[['units', 'Units this month'], ['comp', 'Completion'], ['name', 'Name']].map(([k, l]) => `<button class="${TS === k ? 'on' : ''}" onclick="tcSort('${k}')">${l}</button>`).join('')}</div><div class="tc2-g">${T.map(card).join('')}</div>`;
    }catch(e){ console.warn('teachers cards', e); }
    return r; };

  // ── Cases
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dOf = w => { w = String(w || '').trim(); let m = w.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = w.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})/); if(m){ const mi = MON.indexOf(m[2].slice(0, 1).toUpperCase() + m[2].slice(1, 3).toLowerCase()); let y = +m[3]; if(y < 100) y += 2000; if(y < 1000) y = 2000 + (y % 100); if(mi > -1) return new Date(y, mi, +m[1]); }
    const d = new Date(w); return isNaN(d) ? null : d; };
  const num = s => { const n = parseFloat(String(s || '').replace(/[^\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  const peso2 = n => '₱' + Math.round(n).toLocaleString('en-US');
  let ACT = '';
  window.acT = function(t){ ACT = ACT === t ? '' : t; renderActions(); };
  window.renderActions = function(){
    if(typeof AC === 'undefined' || !AC) return;
    const q = ($('acq') && $('acq').value || '').toLowerCase(), all = AC.rows || [];
    const isPen = x => num(x.amount) > 0, isBon = x => num(x.incentive) > 0;
    const F = { all: all, open: all.filter(x => !x.done), pen: all.filter(isPen), bon: all.filter(isBon) };
    let L = F[AC_F] || all; if(ACT) L = L.filter(x => String(x.employee || '').trim().toLowerCase() === ACT.toLowerCase());
    if(q) L = L.filter(x => [x.id, x.subject, x.employee, x.student, x.type, x.action].join(' ').toLowerCase().includes(q));
    const now = new Date(), thisM = all.filter(x => { const d = dOf(x.when); return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    const T = [...new Set(all.map(x => String(x.employee || '').trim()).filter(Boolean))].sort();
    let h = `<div class="lead row"><div class="grow"><h1>Cases</h1><div class="mute small">Live from ACTIONS · newest first${sheetLink('ACTIONS')}</div></div><button class="btn sm teal" onclick="caseSheet()">+ New case</button></div>
<div class="ac2-sum"><span>${MON[now.getMonth()]} so far</span><span><b>${thisM.length}</b>cases</span><span class="plus"><b>+${peso2(thisM.reduce((a, x) => a + num(x.incentive), 0))}</b>bonuses</span><span class="minus"><b>−${peso2(thisM.reduce((a, x) => a + num(x.amount), 0))}</b>deductions</span><span><b>${F.open.length}</b>not completed</span></div>
<div style="margin-top:12px"><input id="acq" class="search" placeholder="Search case, teacher, student" value="${esc(q)}" oninput="renderActions()"></div>
<div class="seg">${[['all', 'All'], ['open', 'Not completed'], ['pen', 'Deductions'], ['bon', 'Bonuses']].map(([k, l]) => `<button class="${AC_F === k ? 'on' : ''}" onclick="AC_F='${k}';renderActions()">${l} · ${F[k].length}</button>`).join('')}</div>
<div class="ac2-tf"><span>Teacher</span><button class="${!ACT ? 'on' : ''}" onclick="acT('')">All</button>${T.map(t => `<button class="${ACT.toLowerCase() === t.toLowerCase() ? 'on' : ''}" onclick="acT('${esc(t).replace(/'/g, '')}')">${esc(t)}</button>`).join('')}</div>`;
    const by = {}, order = []; L.slice(0, 200).forEach(x => { const d = dOf(x.when), k = d ? d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') : 'zzzz'; if(!by[k]){ by[k] = []; order.push(k); } by[k].push(x); });
    h += order.map(k => { const g = by[k], lab = k === 'zzzz' ? 'No date' : MON[+k.slice(5) - 1] + ' ' + k.slice(0, 4), b = g.reduce((a, x) => a + num(x.incentive), 0), p = g.reduce((a, x) => a + num(x.amount), 0);
      return `<div class="ac2-m"><b>${lab}</b><span>${g.length} case${g.length === 1 ? '' : 's'}${b ? ' · +' + peso2(b) : ''}${p ? ' · −' + peso2(p) : ''}</span></div>` + g.map(x => { const d = dOf(x.when), pen = isPen(x), bon = isBon(x);
        return `<div class="ac2 ${bon ? 'bon' : pen ? 'pen' : ''}" onclick="caseView('${esc(x.id)}')"><div class="grow"><div class="t"><b>${esc(x.subject || '—')}</b>${x.done ? '' : '<span class="chip coral">Open</span>'}${x.type && x.type !== x.subject ? `<span class="chip">${esc(x.type)}</span>` : ''}</div>
<div class="s">${esc(tName(x.employee || ''))}${x.student ? ' · ' + esc(String(x.student).replace(/\n/g, ' · ')) : ''} · ${d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : esc(x.when || '')} · ${esc(x.id)}</div></div>
<div class="amt">${bon ? `<span class="p">+${peso2(num(x.incentive))}</span>` : ''}${pen ? `<span class="n">−${peso2(num(x.amount))}</span>` : ''}${!bon && !pen ? '<span style="color:#8A87A0">—</span>' : ''}${x.demerit ? `<small>${esc(x.demerit)} pts</small>` : ''}</div></div>`; }).join(''); }).join('') || '<div class="empty">No cases here.</div>';
    if(L.length > 200) h += '<div class="empty small">Showing 200 of ' + L.length + ' · search to narrow</div>';
    const f = document.activeElement && document.activeElement.id === 'acq';
    $('v-actions').innerHTML = h; if(f){ const i = $('acq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } };
  try{ if(VIEW === 'teachers') renderTeachers(); if(VIEW === 'actions') renderActions(); }catch(e){}
})();
