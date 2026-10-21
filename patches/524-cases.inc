/* 21 Oct · 524 · Cases (management), redesigned in the calm card language (Misty: "Now, let us do CASES SCREEN").
   · One summary card for the month: cases · bonuses · deductions · open, and a 6-month chart (bonuses up in green, deductions
     down in coral) so the trend is visible at a glance.
   · "Who, this month": one bar per person (bonuses green, deductions coral); tap a name to see only their cases. This replaces the
     wall of 21 name buttons; every name is still in the "Person" picker.
   · Each case is one row: + / − / • symbol, subject, kind, Excused / Unexcused, Open; then person · student · date · case ID; amount.
   · This month and last month are open; older months fold into one line each (count · bonuses · deductions) — tap to open.
   Same search, filters, case sheet, waive, completed and New case. Nothing removed. */
(function(){
  const css = document.createElement('style'); css.textContent = `
#v-actions .cs524{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16);padding:14px 16px;margin-top:14px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;align-items:center}
#v-actions .cs524 .k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
#v-actions .cs524 .k>div{border-radius:14px;padding:10px 12px;background:#F7F8FB}
#v-actions .cs524 .k span{display:block;font-size:11.5px;color:#6B6884}
#v-actions .cs524 .k b{display:block;font-size:20px;color:#2B2253;font-variant-numeric:tabular-nums;margin-top:2px}
#v-actions .cs524 .k .p{background:#EEF8F3}#v-actions .cs524 .k .p b{color:#1E7A55}
#v-actions .cs524 .k .m{background:#FDF2EF}#v-actions .cs524 .k .m b{color:#C0533F}
#v-actions .cs524 .k .o b{color:#B5793A}
#v-actions .cs524 .t{font-size:11.5px;color:#8A87A0;margin-bottom:6px;display:flex;justify-content:space-between}
#v-actions .ch524{display:flex;gap:10px;height:96px}
#v-actions .ch524>div{flex:1;display:flex;flex-direction:column;align-items:center;min-width:0}
#v-actions .ch524 .up,#v-actions .ch524 .dn{flex:1;width:100%;display:flex;justify-content:center;position:relative}
#v-actions .ch524 .up{align-items:flex-end;border-bottom:1px solid #E9E7F1}#v-actions .ch524 .dn{align-items:flex-start}
#v-actions .ch524 i{display:block;width:60%;max-width:26px;border-radius:5px 5px 2px 2px;background:#2FA36B}
#v-actions .ch524 .dn i{border-radius:2px 2px 5px 5px;background:#E07A62}
#v-actions .ch524 small{font-size:10.5px;color:#8A87A0;margin-top:3px}
#v-actions .ch524>div.cur small{color:#2B2253;font-weight:700}
#v-actions .wh524{margin-top:12px;background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;padding:12px 16px}
#v-actions .wh524 .hd{display:flex;justify-content:space-between;font-size:12px;color:#8A87A0;margin-bottom:6px}
#v-actions .wh524 .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:4px 18px}
#v-actions .wh524 a{display:grid;grid-template-columns:86px 1fr auto;align-items:center;gap:8px;padding:5px 6px;border-radius:10px;cursor:pointer;text-decoration:none;color:#3B3858;font-size:13px}
#v-actions .wh524 a:hover{background:#F7F8FB}#v-actions .wh524 a.on{background:#EAF6F7;box-shadow:0 0 0 1px #00A3AD inset}
#v-actions .wh524 a b{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-actions .wh524 .br{display:flex;height:8px;border-radius:999px;overflow:hidden;background:#F1F0F5}
#v-actions .wh524 .br i{display:block;height:100%}
#v-actions .wh524 a em{font-style:normal;font-size:12px;font-variant-numeric:tabular-nums;color:#6B6884;white-space:nowrap}
#v-actions .fl524{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px}
#v-actions .fl524 .search{flex:1 1 260px;margin:0}
#v-actions .fl524 select{min-width:170px;border-radius:999px;padding:9px 14px;border:1px solid rgba(43,34,83,.12);background:#fff;font:inherit;font-size:14px;color:#2B2253}
#v-actions .seg{margin-top:10px}
#v-actions .mo524{display:flex;align-items:baseline;gap:10px;margin:18px 2px 6px}
#v-actions .mo524 b{font-size:17px;color:#2B2253}#v-actions .mo524 span{font-size:12.5px;color:#8A87A0}
#v-actions .ls524{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -18px rgba(43,34,83,.14);padding:4px 6px}
#v-actions .r524{display:flex;align-items:center;gap:12px;padding:11px 10px;border-radius:12px;cursor:pointer}
#v-actions .r524+.r524{border-top:1px solid #F1F0F5}#v-actions .r524:hover{background:#FAFAFC}
#v-actions .r524 .sg{flex:none;width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-weight:700;font-size:17px;background:#F3F2F7;color:#8A87A0}
#v-actions .r524 .sg.p{background:#E8F5EF;color:#1E7A55}#v-actions .r524 .sg.m{background:#FCEDE8;color:#C0533F}
#v-actions .r524 .bd{flex:1;min-width:0}
#v-actions .r524 .t{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
#v-actions .r524 .t b{font-size:14.5px;color:#2B2253}
#v-actions .r524 .c{padding:1px 8px;border-radius:999px;font-size:11px;font-weight:700;background:#F3F2F7;color:#6B6884}
#v-actions .r524 .c.ex{background:#E8F5EF;color:#1E7A55}#v-actions .r524 .c.un{background:#FCEDE8;color:#B5533F}#v-actions .r524 .c.op{background:#FFF1DE;color:#9A5B12}
#v-actions .r524 .s{font-size:12.5px;color:#8A87A0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-actions .r524 .am{flex:none;text-align:right;font-variant-numeric:tabular-nums;font-size:15.5px;font-weight:700}
#v-actions .r524 .am .p{color:#1E7A55}#v-actions .r524 .am .n{color:#C0533F}#v-actions .r524 .am small{display:block;font-size:11px;color:#8A87A0;font-weight:400}
#v-actions details.od524{margin-top:8px;background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:16px;padding:0 6px}
#v-actions details.od524>summary{list-style:none;cursor:pointer;display:flex;align-items:baseline;gap:10px;padding:12px 10px}
#v-actions details.od524>summary::-webkit-details-marker{display:none}
#v-actions details.od524>summary b{font-size:15px;color:#2B2253}#v-actions details.od524>summary span{font-size:12.5px;color:#8A87A0}
#v-actions details.od524>summary:after{content:'›';margin-left:auto;color:#8A87A0;font-size:18px;transition:transform .15s}#v-actions details.od524[open]>summary:after{transform:rotate(90deg)}
#v-actions details.od524>div{padding-bottom:6px}
@media(max-width:760px){#v-actions .cs524{grid-template-columns:1fr}#v-actions .cs524 .k{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){#v-actions .r524{gap:9px;padding:10px 6px}#v-actions .r524 .sg{width:30px;height:30px}#v-actions .fl524 select{flex:1 1 100%}}`;
  document.head.appendChild(css);
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dOf = w => { w = String(w || '').trim(); let m = w.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = w.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})/); if(m){ const mi = MON.indexOf(m[2].slice(0, 1).toUpperCase() + m[2].slice(1, 3).toLowerCase()); let y = +m[3]; if(y < 100) y += 2000; if(mi > -1) return new Date(y, mi, +m[1]); }
    const d = new Date(w); return isNaN(d) ? null : d; };
  const num = s => { const n = parseFloat(String(s || '').replace(/[^\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  const P = n => '₱' + Math.round(n).toLocaleString('en-US');
  const ym = d => d ? d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') : 'zzzz';
  const OPEN = {}; let PERSON = '';
  window.ac524P = v => { PERSON = PERSON === v ? '' : v; renderActions(); };
  window.ac524O = (k, o) => { OPEN[k] = o; };
  const base = window.renderActions;
  window.renderActions = renderActions = function(){
    if(typeof AC === 'undefined' || !AC) return; const v = $('v-actions'); if(!v) return;
    const q = ($('acq') && $('acq').value || '').toLowerCase(), all = AC.rows || [];
    const isPen = x => num(x.amount) > 0, isBon = x => num(x.incentive) > 0;
    const F = { all: all, open: all.filter(x => !x.done), pen: all.filter(isPen), bon: all.filter(isBon) };
    let L = F[AC_F] || all; if(PERSON) L = L.filter(x => String(x.employee || '').trim().toLowerCase() === PERSON.toLowerCase());
    if(q) L = L.filter(x => [x.id, x.subject, x.employee, x.student, x.type, x.action, x.condition].join(' ').toLowerCase().includes(q));
    const now = new Date(), k0 = ym(now), k1 = ym(new Date(now.getFullYear(), now.getMonth() - 1, 1)), M0 = all.filter(x => ym(dOf(x.when)) === k0);
    const b0 = M0.reduce((a, x) => a + num(x.incentive), 0), p0 = M0.reduce((a, x) => a + num(x.amount), 0), open = all.filter(x => !x.done).length;
    const ks = []; for(let i = 5; i >= 0; i--) ks.push(ym(new Date(now.getFullYear(), now.getMonth() - i, 1)));
    const mv = ks.map(k => { const g = all.filter(x => ym(dOf(x.when)) === k); return { k, b: g.reduce((a, x) => a + num(x.incentive), 0), p: g.reduce((a, x) => a + num(x.amount), 0) }; }), mx = Math.max(1, ...mv.map(o => Math.max(o.b, o.p)));
    const people = [...new Set(all.map(x => String(x.employee || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const W = {}; M0.forEach(x => { const n = String(x.employee || '').trim(); if(!n) return; const w = W[n] = W[n] || { b: 0, p: 0, n: 0 }; w.b += num(x.incentive); w.p += num(x.amount); w.n++; });
    const WL = Object.keys(W).sort((a, b) => (W[b].b + W[b].p) - (W[a].b + W[a].p)), wmx = Math.max(1, ...WL.map(n => W[n].b + W[n].p));
    let h = `<div class="lead row"><div class="grow"><h1>Cases</h1><div class="mute small">Live from ACTIONS · newest first${sheetLink('ACTIONS')}</div></div><button class="btn sm teal" onclick="caseSheet()">+ New case</button></div>
<section class="cs524"><div><div class="t"><span>${MON[now.getMonth()]} so far</span></div><div class="k"><div><span>Cases</span><b>${M0.length}</b></div><div class="p"><span>Bonuses</span><b>+${P(b0)}</b></div><div class="m"><span>Deductions</span><b>${p0 ? '−' : ''}${P(p0)}</b></div><div class="o"><span>Not completed</span><b>${open}</b></div></div></div>
<div><div class="t"><span>Last 6 months</span><span>bonuses ▲ · deductions ▼</span></div><div class="ch524">${mv.map(o => `<div class="${o.k === k0 ? 'cur' : ''}" title="${MON[+o.k.slice(5) - 1]} · +${P(o.b)} · −${P(o.p)}"><div class="up">${o.b ? `<i style="height:${Math.max(4, o.b / mx * 100)}%"></i>` : ''}</div><div class="dn">${o.p ? `<i style="height:${Math.max(4, o.p / mx * 100)}%"></i>` : ''}</div><small>${MON[+o.k.slice(5) - 1]}</small></div>`).join('')}</div></div></section>`;
    if(WL.length) h += `<section class="wh524"><div class="hd"><span>Who, ${MON[now.getMonth()]} · tap a name to see only theirs</span><span>bonuses · deductions</span></div><div class="g">${WL.map(n => { const w = W[n];
      return `<a class="${PERSON.toLowerCase() === n.toLowerCase() ? 'on' : ''}" onclick="ac524P('${esc(n).replace(/'/g, '')}')"><b>${esc(n)}</b><span class="br" style="width:${Math.max(8, (w.b + w.p) / wmx * 100)}%">${w.b ? `<i style="flex:${w.b};background:#2FA36B"></i>` : ''}${w.p ? `<i style="flex:${w.p};background:#E07A62"></i>` : ''}</span><em>${w.b ? '+' + P(w.b) : ''}${w.b && w.p ? ' ' : ''}${w.p ? '−' + P(w.p) : ''}</em></a>`; }).join('')}</div></section>`;
    h += `<div class="fl524"><input id="acq" class="search" placeholder="Search case, person, student, Excused…" value="${esc(q)}" oninput="renderActions()"><select onchange="ac524P(this.value || PERSON_CLEAR)"><option value="">Everyone</option>${people.map(n => `<option value="${esc(n)}" ${PERSON.toLowerCase() === n.toLowerCase() ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div>
<div class="seg">${[['all', 'All'], ['open', 'Not completed'], ['pen', 'Deductions'], ['bon', 'Bonuses']].map(([k, l]) => `<button class="${AC_F === k ? 'on' : ''}" onclick="AC_F='${k}';renderActions()">${l} · ${F[k].length}</button>`).join('')}</div>`;
    const row = x => { const d = dOf(x.when), pen = isPen(x), bon = isBon(x), cnd = String(x.condition || '').trim();
      return `<div class="r524" onclick="caseView('${esc(x.id)}')"><span class="sg ${bon ? 'p' : pen ? 'm' : ''}">${bon ? '+' : pen ? '−' : '•'}</span><div class="bd"><div class="t"><b>${esc(x.subject || '—')}</b>${x.type && x.type !== x.subject ? `<span class="c">${esc(x.type)}</span>` : ''}${cnd ? `<span class="c ${/^excused/i.test(cnd) ? 'ex' : /^unexcused/i.test(cnd) ? 'un' : ''}">${esc(cnd)}</span>` : ''}${x.done ? '' : '<span class="c op">Open</span>'}</div>
<div class="s">${esc(tName(x.employee || ''))}${x.student ? ' · ' + esc(String(x.student).replace(/\n/g, ' · ')) : ''} · ${d ? esc(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) : esc(x.when || '')} · ${esc(x.id)}</div></div>
<div class="am">${bon ? `<span class="p">+${P(num(x.incentive))}</span>` : ''}${pen ? `<span class="n">−${P(num(x.amount))}</span>` : ''}${!bon && !pen ? '<span style="color:#B9B6CC">—</span>' : ''}${x.demerit ? `<small>${esc(x.demerit)} pts</small>` : ''}</div></div>`; };
    const by = {}, order = []; L.forEach(x => { const k = ym(dOf(x.when)); if(!by[k]){ by[k] = []; order.push(k); } by[k].push(x); });
    order.sort((a, b) => b.localeCompare(a));
    const busy = !!(q || PERSON || AC_F !== 'all');
    h += order.map(k => { const g = by[k], lab = k === 'zzzz' ? 'No date' : MON[+k.slice(5) - 1] + ' ' + k.slice(0, 4), b = g.reduce((a, x) => a + num(x.incentive), 0), p = g.reduce((a, x) => a + num(x.amount), 0);
      const sum = `${g.length} case${g.length === 1 ? '' : 's'}${b ? ' · +' + P(b) : ''}${p ? ' · −' + P(p) : ''}`, rows = `<div class="ls524">${g.map(row).join('')}</div>`;
      const openNow = OPEN[k] != null ? OPEN[k] : (k === k0 || k === k1 || busy);
      return (k === k0 || k === k1) && OPEN[k] == null ? `<div class="mo524"><b>${lab}</b><span>${sum}</span></div>${rows}`
        : `<details class="od524" ${openNow ? 'open' : ''} ontoggle="ac524O('${k}', this.open)"><summary><b>${lab}</b><span>${sum}</span></summary><div>${g.map(row).join('')}</div></details>`; }).join('') || '<div class="empty">No cases here.</div>';
    const f = document.activeElement && document.activeElement.id === 'acq';
    if(v._h524 !== h){ v.innerHTML = h; v._h524 = h; }
    if(f){ const i = $('acq'); if(i && document.activeElement !== i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); } } };
  window.PERSON_CLEAR = '';
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'actions') renderActions(); }catch(e){}
})();
