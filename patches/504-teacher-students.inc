/* 21 Oct · 504 · Teacher Students, same visual language as Today and Schedule (Misty: "Now, let's do STUDENTS' SCREEN").
   · A summary card: students · books · lessons left as one bar (plenty / 5 or fewer / shared), and the month's feedback as
     a done / to-do bar (or "opens 25 Oct" before it opens).
   · Each student is one calm card: initial in the book's colour, name, Chinese name, code; the book as a coloured chip and the level;
     where the last class ended on one line; on the right, lessons left (coral with "!" at 5 or fewer) and one feedback pill
     (✓ done green, ✎ write coral, ⚠ fix red, ○ opens grey, or who writes it). Two columns on a laptop, one on a phone.
   · Same search, the same filters, "No longer with you", "Tell Ops", and Trials & sub classes as tidy rows. Nothing removed. */
(function(){
  const css = document.createElement('style'); css.textContent = `
body:not(.mgr) #v-students .sm504{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16);padding:14px 16px;margin-top:14px}
#v-students .f504{display:flex;flex-wrap:wrap;gap:6px 22px;align-items:center}
#v-students .f504 span{display:inline-flex;align-items:center;gap:7px;font-size:14px;color:#4A4766}
#v-students .f504 b{font-size:20px;color:#2B2253;font-variant-numeric:tabular-nums}
#v-students .f504 svg{width:18px;height:18px;flex:none}
#v-students .f504 .lo b{color:#C0533F}
#v-students .br504{margin-top:12px;display:grid;grid-template-columns:110px 1fr;gap:8px 12px;align-items:center;font-size:12.5px;color:#6B6884}
#v-students .br504 .bar{display:flex;height:10px;border-radius:999px;background:#F1F0F5;overflow:hidden;gap:2px}
#v-students .br504 .bar i{display:block;border-radius:999px}
#v-students .br504 .k{grid-column:2;display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:-2px}
#v-students .br504 .k span{display:inline-flex;align-items:center;gap:5px}
#v-students .br504 .k span:before{content:'';width:8px;height:8px;border-radius:3px;background:var(--c)}
#v-students .br504 .k b{color:#2B2253}
#v-students .br504 .op{color:#8A87A0}
#v-students .gr504{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}
#v-students .c504{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:16px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 8px 22px -16px rgba(43,34,83,.16);cursor:pointer;transition:box-shadow .2s,transform .2s;min-width:0}
@media(hover:hover){#v-students .c504:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(43,34,83,.05),0 14px 30px -18px rgba(43,34,83,.26)}}
#v-students .c504 .av{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:16px;color:var(--bc);background:color-mix(in srgb,var(--bc) 14%,#fff);border:1.5px solid color-mix(in srgb,var(--bc) 40%,#fff);margin:0}
#v-students .c504 .md{flex:1;min-width:0}
#v-students .c504 .nm{display:flex;align-items:baseline;gap:6px;min-width:0}
#v-students .c504 .nm b{font-size:15.5px;color:#2B2253;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-students .c504 .nm span{font-size:13px;color:#8A87A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-students .c504 .tg{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:5px}
#v-students .c504 .bk{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:700;color:color-mix(in srgb,var(--bc) 75%,#2B2253);background:color-mix(in srgb,var(--bc) 12%,#fff)}
#v-students .c504 .bk:before{content:'';width:7px;height:7px;border-radius:50%;background:var(--bc)}
#v-students .c504 .lv{padding:2px 8px;border-radius:999px;font-size:11.5px;font-weight:700;color:#5B4A9E;background:#F0EDFA}
#v-students .c504 .cd{font-size:12px;color:#A3A0B5;font-variant-numeric:tabular-nums}
#v-students .c504 .ln{margin-top:5px;font-size:12.5px;color:#6B6884;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-students .c504 .ln em{font-style:normal;color:#A3A0B5}
#v-students .c504 .rt{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:6px;text-align:right}
#v-students .c504 .lf{line-height:1;font-variant-numeric:tabular-nums}
#v-students .c504 .lf b{font-size:20px;color:#2B2253}#v-students .c504 .lf small{display:block;font-size:11px;color:#8A87A0;margin-top:2px}
#v-students .c504 .lf.lo b{color:#C0533F}#v-students .c504 .lf.lo small{color:#C0533F;font-weight:700}
#v-students .c504 .fp{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;white-space:nowrap}
#v-students .c504 .fp.ok{background:#E8F5EF;color:#1E7A55}#v-students .c504 .fp.do{background:#FCEDE8;color:#B5533F;cursor:pointer}
#v-students .c504 .fp.fx{background:#FBE3DF;color:#A8321F;cursor:pointer}#v-students .c504 .fp.wt{background:#F3F2F7;color:#8A87A0;font-weight:600}
#v-students .c504 .fp.by{background:none;color:#A3A0B5;font-weight:600;padding:0}
#v-students .tr504{margin-top:8px;background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:16px;padding:4px 14px}
#v-students .tr504 .r{display:flex;align-items:center;gap:12px;padding:9px 0}
#v-students .tr504 .r+.r{border-top:1px solid #F1F0F5}
#v-students .tr504 .r .d{width:46px;flex:none;font-size:13px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums}
#v-students .tr504 .r .g{flex:1;min-width:0}
#v-students .tr504 .r .g small{display:block;color:#8A87A0;font-size:12px}
@media(max-width:760px){#v-students .gr504{grid-template-columns:1fr}}
@media(max-width:560px){#v-students .br504{grid-template-columns:1fr}#v-students .br504 .k{grid-column:1}#v-students .c504{padding:11px 12px;gap:10px}#v-students .c504 .av{width:36px;height:36px;font-size:15px}}`;
  document.head.appendChild(css);
  const ic = {
    stu: '<svg viewBox="0 0 24 24" fill="none" stroke="#C2557A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.2 6-5.2s5.4 1.8 6 5.2"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16.5 14.6c2.3.2 4 1.7 4.5 4.4"/></svg>',
    bk: '<svg viewBox="0 0 24 24" fill="none" stroke="#3F51B5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
    lo: '<svg viewBox="0 0 24 24" fill="none" stroke="#C0533F" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>' };
  const LV = /^(pre-?)?[abc][12](\+)?$|^pre-?a1$/i;
  const parts = b => { const P = String(b || '').split(',').map(x => x.trim()).filter(Boolean); return { lv: P.filter(x => LV.test(x)), bk: P.filter(x => !LV.test(x)) }; };
  const draw = () => { if(typeof D === 'undefined' || !D || D.mgr) return false; const el = $('v-students'); if(!el) return false;
    const q = (($('sq') && $('sq').value) || '').toLowerCase(), all = D.students || [];
    const fbS = {}; ((typeof FB !== 'undefined' && FB && FB.students) || []).forEach(x => fbS[x.code] = x);
    const hasFB = typeof FB !== 'undefined' && !!FB, open = hasFB && fbOpen();
    const fbMine = all.filter(s => fbS[s.code]), fbDone = fbMine.filter(s => fbS[s.code].done).length, fbFix = fbMine.filter(s => fbS[s.code].fix).length, fbPend = fbMine.filter(s => !fbS[s.code].done).length;
    const low = all.filter(s => s.left != null && s.left <= 5).length, shared = all.filter(s => s.shared && !(s.left != null && s.left <= 5)).length, plenty = all.length - low - shared;
    const books = new Set(all.map(s => parts(s.book).bk.join(' ')).filter(Boolean)).size;
    let list = all.slice();
    if(STU_FILTER === 'fb') list = list.filter(s => fbS[s.code] && !fbS[s.code].done);
    if(STU_FILTER === 'due') list = list.filter(fbDue);
    if(STU_FILTER === 'low') list = list.filter(s => s.left != null && s.left <= 5);
    if(q) list = list.filter(s => (s.name + ' ' + s.cn + ' ' + s.code + ' ' + (s.book || '')).toLowerCase().includes(q));
    const mv = D.moved || [];
    let h = `<div class="lead"><h1>My students</h1><div class="mute small">${all.length} active${mv.length ? ' · ' + mv.length + ' no longer with you' : ''}</div></div>`;
    h += `<section class="sm504"><div class="f504"><span>${ic.stu}<b>${all.length}</b> student${all.length === 1 ? '' : 's'}</span><span>${ic.bk}<b>${books}</b> book${books === 1 ? '' : 's'}</span>${low ? `<span class="lo">${ic.lo}<b>${low}</b> with 5 or fewer lessons left</span>` : ''}</div>
<div class="br504"><span>Lessons left</span><div class="bar">${plenty ? `<i style="flex:${plenty};background:#5EC4CB"></i>` : ''}${shared ? `<i style="flex:${shared};background:#B9B6CC"></i>` : ''}${low ? `<i style="flex:${low};background:#E07A62"></i>` : ''}</div>
<div class="k"><span style="--c:#5EC4CB">More than 5 <b>${plenty}</b></span>${shared ? `<span style="--c:#B9B6CC">Shared package <b>${shared}</b></span>` : ''}<span style="--c:#E07A62">5 or fewer <b>${low}</b></span></div>`;
    if(hasFB && fbMine.length){ const lbl = esc(fbLbl() || 'This month');
      h += `<span>${lbl.split(' ')[0]} feedback</span>${open || fbDone ? `<div class="bar">${fbDone ? `<i style="flex:${fbDone};background:#2FA36B"></i>` : ''}${fbPend ? `<i style="flex:${fbPend};background:${open ? '#F0B49F' : '#E4E3EC'}"></i>` : ''}</div>
<div class="k"><span style="--c:#2FA36B">Written <b>${fbDone}</b></span><span style="--c:${open ? '#F0B49F' : '#E4E3EC'}">${open ? 'To write' : 'Not open yet'} <b>${fbPend}</b></span>${fbFix ? `<span style="--c:#C0533F">To fix <b>${fbFix}</b></span>` : ''}</div>`
        : `<div class="op">○ Opens ${esc((FB && FB.opensLabel) || '25th')} · ${fbMine.length} student${fbMine.length === 1 ? '' : 's'} to write for</div>`}`; }
    h += `</div></section>`;
    h += `<div style="margin-top:14px"><input id="sq" class="search" placeholder="Search name, code or book" value="${esc(q)}" oninput="renderStudents()"></div>
<div class="seg"><button class="${STU_FILTER === 'all' ? 'on' : ''}" onclick="setFilter('all')">All</button>${hasFB && (open || STU_FILTER === 'fb') ? `<button class="${STU_FILTER === 'fb' ? 'on' : ''}" onclick="setFilter('fb')">${esc(fbLbl().split(' ')[0])} feedback to do · ${fbPend}</button>` : ''}<button class="${STU_FILTER === 'low' ? 'on' : ''}" onclick="setFilter('low')">5 or fewer left · ${low}</button></div>`;
    const fp = s => { const f = fbS[s.code], c = esc(s.code);
      if(f) return f.fix ? `<span class="fp fx" onclick="event.stopPropagation();fbSheet('${c}')">⚠ Fix feedback</span>` : f.done ? '<span class="fp ok">✓ Feedback</span>'
        : !fbCan(s.code) ? `<span class="fp wt">○ Opens ${esc((FB && FB.opensLabel) || '25th')}</span>` : `<span class="fp do" onclick="event.stopPropagation();fbSheet('${c}')">✎ Write feedback</span>`;
      return s.fbBy ? `<span class="fp by">feedback by ${esc(tName(s.fbBy))}</span>` : ''; };
    const card = s => { const P = parts(s.book), bk = P.bk.join(' · '), col = bookCol(s.book), lo = s.left != null && s.left <= 5;
      const ended = s.note && s.note.ended ? String(s.note.ended).split(' · ').slice(0, 3).join(' · ') : '';
      return `<div class="c504" style="--bc:${col}" onpointerdown="stuPre('${esc(s.code)}')" onclick="openStudent('${esc(s.code)}')"><div class="av">${esc((s.name || '?')[0])}</div>
<div class="md"><div class="nm"><b>${esc(s.name)}</b>${s.cn ? `<span>${esc(s.cn)}</span>` : ''}</div>
<div class="tg">${bk ? `<span class="bk">${esc(bk)}</span>` : ''}${P.lv.map(x => `<span class="lv">${esc(x)}</span>`).join('')}<span class="cd">${esc(s.code)}</span></div>
${ended ? `<div class="ln" title="${esc(s.note.ended)}"><em>Last class ·</em> ${esc(ended)}</div>` : '<div class="ln"><em>No class note yet</em></div>'}</div>
<div class="rt"><span class="lf ${lo ? 'lo' : ''}"><b>${s.left == null ? '—' : esc(s.left)}</b><small>${lo ? '! ' : ''}left${s.shared ? ' · shared' : ''}</small></span>${fp(s)}</div></div>`; };
    h += list.length ? `<div class="gr504">${list.map(card).join('')}</div>` : '<div class="empty">No students here.</div>';
    if(mv.length && STU_FILTER === 'all') h += `<details class="fbold" style="margin-top:14px"><summary class="small" style="color:#2F6F77;font-weight:700">No longer with you · ${mv.length} ›</summary>
<div class="small mute" style="margin:6px 0 4px">These students now have their classes with another teacher, so they are not counted for your monthly feedback.</div>
${mv.map(s => `<div class="li" onclick="openStudent('${esc(s.code)}')"><div class="av">${esc((s.name || '?')[0])}</div><div class="grow"><b>${esc(s.name)}</b> <span class="mute small">${esc(s.cn || '')}</span>
<div class="small mute ell">${esc(s.code)} · now with ${esc(tName(s.nowWith || ''))}${s.lastMine ? ' · your last class ' + esc(s.lastMine) : ''}</div></div></div>`).join('')}</details>`;
    h += `<div class="small mute" style="margin-top:14px">A student here you no longer teach? <a class="link" onclick="notMineSheet()">Tell Ops</a></div>`;
    const trials = D.special || [];
    if(trials.length) h += `<h2>Trials &amp; sub classes <span class="c">this month</span></h2><div class="tr504">${trials.map(t => `<div class="r"><span class="d">${esc(String(t.date || '').slice(5))}</span><span class="g"><b>${esc(t.student)}</b><small>${esc([t.book, t.cefr].filter(Boolean).join(' · '))}</small></span>${t.type === 'Trial' ? '<span class="chip coral">Trial</span>' : '<span class="chip">Sub</span>'}
${t.reportMissing ? `<span class="chip red" style="cursor:pointer" onclick="trialSheet(${trQ({ code: t.code, student: t.student, date: t.date, time: t.time })})">Write report</span>` : t.status === 'Enrolled' ? '<span class="chip green">Enrolled</span>' : `<span class="small mute">${esc(t.status || '—')}</span>`}</div>`).join('')}</div>`;
    const hadFocus = document.activeElement && document.activeElement.id === 'sq';
    if(el.dataset.k504 !== h){ el.innerHTML = h; el.dataset.k504 = h; }
    if(hadFocus){ const i = $('sq'); if(i && document.activeElement !== i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
    return true; };
  const _r = window.renderStudents;
  if(_r) window.renderStudents = renderStudents = function(){ try{ if(draw()) return; }catch(e){ console.error('students 504', e); } return _r.apply(this, arguments); };
})();
